# -*- coding: utf-8 -*-
"""Genera assets/js/hdr-plan-data.js (equipo -> hoja de ruta/contador, exacto, de
'Planes de Mantenimiento.xlsx') y assets/js/hdr-estandar-data.js (comparación de la
gama de tareas de SAP (IA17) contra el estándar del Manual de Mtto en .docx).
Uso: python gen_hdr_plan.py <Planes.xlsx> <HDR.xlsm> <estandar.docx> [ia17.xlsx (lista de impresión con texto largo)]"""
import sys, re, json, unicodedata, collections, os
import openpyxl, docx

PL, HDR, DOCX = sys.argv[1:4]
IA17 = sys.argv[4] if len(sys.argv) > 4 else None
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js')

# ── 1. vínculo exacto equipo → hoja de ruta ──
ws = openpyxl.load_workbook(PL, read_only=True, data_only=True).active
NOAC = {'AAC193', 'AAC250', 'AAC1272', 'AAC2112', 'AAC2721', 'AAC2722', 'AAC2723', 'AAC2724', 'AAC2725', 'AAC2732', 'AVO018', 'AVO876'}  # eliminados del portal
pl = [r for r in ws.iter_rows(min_row=2, values_only=True) if r and r[0] and str(r[2] or '') not in NOAC]
plan_rows = [[str(r[2] or ''), str(r[0]), (r[1] or '').strip(), str(r[4] or ''), str(r[5] or ''),
              str(r[7] or ''), str(r[10] or '')] for r in pl]
with open(os.path.join(OUT, 'hdr-plan-data.js'), 'w', encoding='utf-8') as f:
    f.write('/* ─── HDR_PLAN — vínculo EXACTO posición de plan → hoja de ruta (IA17) ───\n'
            '   Fuente: "Planes de Mantenimiento.xlsx" (Grupo hojas ruta + contador por equipo).\n'
            '   Fila: [equipo, plan, descripción, hoja de ruta, contador, estrategia, puesto].\n'
            '   Tiene prioridad sobre el match por texto de hdr-data.js.\n'
            '   Regenerar: python scratchpad/gen_hdr_plan.py <Planes.xlsx> <HDR.xlsm> <estandar.docx> */\n')
    f.write('const HDR_PLAN = ' + json.dumps(plan_rows, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('HDR_PLAN', len(plan_rows))


# ── 2. tareas de SAP por (ruta, contador) ──
def norm(s):
    s = unicodedata.normalize('NFD', (s or '').replace('\xa0', ' ').lower())
    return re.sub(r'[^a-z0-9 ]', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


STOP = set('de del la el los las y o en con a al por para que se un una su sus e es si no'.split())


def toks(s):
    return {w[:5] for w in norm(s).split() if w not in STOP and len(w) > 2}


FQ = [('Diaria', r'diari'), ('Semanal', r'semanal|\b7d\b'), ('Mensual', r'mensual|\b1m\b'),
      ('Bimestral', r'bimestral|\b2m\b'), ('Trimestral', r'trimestral|\b3m\b'),
      ('Cuatrimestral', r'cuatrimestral|\b4m\b'), ('Semestral', r'semestral|\b6m\b'),
      ('Anual', r'anual|\b1a\b'), ('Bienal', r'bienal|bianual|\b2a\b'),
      ('Trienal', r'trienal|\b3a\b'), ('Quinquenal', r'quinquenal|\b5a\b')]


def freqs_all(t):
    t = norm(t)
    return [n for n, p in FQ if re.search(p, t)]


def freq(t):
    t = norm(t)
    for n, p in FQ:
        if re.search(p, t):
            return n
    return None


hw = openpyxl.load_workbook(HDR, read_only=True, data_only=True)['Hojas de Ruta']
hrows = [r for r in hw.iter_rows(min_row=2, values_only=True) if r and r[0]]

# Operaciones cuyo puesto de trabajo NO es AUX_TER / AUX_MEC / MOEX (para limpiar en SAP).
PUESTOS_OK = {'AUX_TER', 'AUX_MEC', 'MOEX'}
fuera = collections.OrderedDict()
if IA17:
    # la lista de impresión trae también el puesto de cada SUBoperación (el .xlsm solo el de la operación)
    import parse_ia17 as _pi
    for it in _pi.scan_items(IA17):
        if it['p'] and it['p'] not in PUESTOS_OK:
            sub = it['sub'].split(' ', 1)[0] if it['sub'] else ''
            k = (it['k'][0], it['k'][1], it['op'], sub, it['p'])
            if k not in fuera:
                fuera[k] = [it['k'][0], it['k'][1], it['k'][2], it['op'] + ('.' + sub if sub else ''),
                            it['desc'] + (' › ' + it['sub'].split(' ', 1)[1] if it['sub'] and ' ' in it['sub'] else ''),
                            it['p'], it['n'], it['w'], '']
else:
    for r in hrows:
        if r[5] and r[5] not in PUESTOS_OK:
            k = (r[0], str(r[1]), str(r[3]), r[5])
            if k not in fuera:
                fuera[k] = [r[0], str(r[1]), r[2] or '', str(r[3]), r[4] or '', r[5], r[7] or 0, r[8] or 0, r[9] or '']
with open(os.path.join(OUT, 'hdr-plan-data.js'), 'a', encoding='utf-8') as f:
    f.write('\n/* HDR_OPS_FUERA — operaciones de hojas de ruta con puesto distinto de AUX_TER/AUX_MEC/MOEX.\n'
            '   Fila: [hoja de ruta, contador, desc contador, operación, desc operación, puesto, Nº personas, trabajo, unidad]. */\n')
    f.write('const HDR_OPS_FUERA = ' + json.dumps(list(fuera.values()), ensure_ascii=False, separators=(',', ':')) + ';\n')
print('HDR_OPS_FUERA', len(fuera))
ops = collections.defaultdict(collections.OrderedDict)
cdesc = {}
for r in hrows:
    k = (r[0], str(r[1]))
    cdesc.setdefault(k, r[2] or '')
    ops[k].setdefault(r[3], {'d': r[4] or '', 'subs': []})
    if r[13] or r[14] or r[15]:
        ops[k][r[3]]['subs'].append((r[15] or r[14] or '').strip())
LOG = re.compile(r'log[ií]stica', re.I)
sap = collections.defaultdict(list)
detalle = collections.defaultdict(bool)
for k, od in ops.items():
    for o, v in od.items():
        if LOG.search(v['d']):
            continue
        f = freq(v['d'])
        if f is None and len(freqs_all(cdesc[k])) == 1:
            f = freq(cdesc[k])   # contador de una sola frecuencia; si agrupa varias, queda sin frecuencia
        if v['subs']:
            detalle[k] = True
            for s in v['subs']:
                if s:
                    sap[k].append((f, s))
        else:
            sap[k].append((f, v['d']))

# Si hay lista de impresión IA17 (texto largo completo), las tareas salen de ahí.
if IA17:
    import parse_ia17
    SEP = re.compile(r',,|#|_{3,}|\(\*\)')
    ia = parse_ia17.parse(IA17)
    sap = collections.defaultdict(list)
    detalle = collections.defaultdict(bool)
    for k, v in ia.items():
        vistos = set()
        for o in v['ops']:
            for f, txt in o['tareas']:
                partes = [x.strip(' -:.') for x in SEP.split(txt)] if len(txt) > 200 else [txt]
                for x in partes:
                    if len(x) < 6 or (f, x) in vistos:
                        continue
                    vistos.add((f, x))
                    sap[k].append((f, x))
        detalle[k] = len(sap[k]) >= 3
    ops = collections.defaultdict(collections.OrderedDict, {k: ops.get(k, {'x': 1}) for k in ia})
    print('IA17:', len(ia), 'contadores,', sum(len(x) for x in sap.values()), 'tareas')

# ── 3. estándar (docx) ──
d = docx.Document(DOCX)
nz = lambda s: re.sub(r'\s+', ' ', s.replace('\xa0', ' ')).strip()
STD = {}
for i, t in enumerate(d.tables):
    if i == 0:
        continue
    rows = [[nz(c.text) for c in r.cells] for r in t.rows]
    STD[i] = [r for r in rows if r[0] and not r[0].startswith('Mantenimiento en') and len(r) > 2]


def sfreq(s):
    return freq(re.split(r'[\(\[]', s)[0])


# grupo → (tablas del estándar, pares hoja de ruta/contador que realmente usan los planes)
G = [
    ('VRF (unidades exteriores e interiores)', [1, 2], ['AAC19AEP/3', 'AACS6AEP/1', 'AACS7AEP/2']),
    ('Roof Tops', [3, 4, 5, 6], ['AAC01AEP/6', 'AACS1AEP/1', 'AACS5AEP/1']),
    ('Splits de salas técnicas', [7], ['AACS7AEP/1']),
    ('Splits (general)', [8], ['AACS3AEP/1', 'AACS3AEP/2']),
    ('Autocontenidos de salas técnicas', [9], ['AACS2AEP/1', 'AACS2AEP/2']),
    ('Chillers condensados por aire', [10, 11, 12], ['AAC17AEP/1', 'AAC17AEP/3', 'AAC17AEP/5']),
    ('UTAs', [13], ['AACS4AEP/1']),
    ('Cortinas de aire', [14], ['ACOS1AEP/1']),
    ('Extractores / ventiladores', [15, 16], ['EMOS1AEP/1', 'EMOS1AEP/2']),
    ('Manga ADELTE', [17], ['MANS2AEP/1']),
    ('Mangas Thyssen', [18, 19], ['MANS2AEP/2']),
    ('Mangas Team', [20], ['MANS2AEP/3']),
    ('Cintas balanzas', [21, 30], ['MEQS2AEP/1', 'MBAS1AEP/1']),
    ('Cintas inyectoras', [22], ['MEQS7AEP/1']),
    ('Cintas tramos rectos (patio)', [23], ['MEQS5AEP/1']),
    ('Cintas colectoras (check-in)', [24], ['MEQS3AEP/1']),
    ('Cintas tramos curvos', [25], ['MEQS6AEP/1']),
    ('Brazos desviadores (VB)', [26], ['MEQS3AEP/2']),
    ('Persianas de gateras', [27], ['MDCS1AEP/1', 'MDCS1AEP/2']),
    ('Camas de rodillos', [28], ['MEQS5AEP/2']),
    ('Cintas carruseles', [29], ['MEQS1AEP/1']),
    ('Ascensores / montacargas', [31], ['MAS02AEP/1']),
    ('Escaleras mecánicas', [32], ['MES02AEP/1']),
    ('Tanques de combustible', [33], ['MBOS4AEP/1']),
    ('Motobombas contra incendio', [35, 36], ['MBO10AEP/1', 'MBO10AEP/4', 'MBOS2AEP/1']),
    ('Bombas jockey', [37], ['MBOS3AEP/1', 'MBO11AEP/3']),
    ('Válvulas esclusa', [38], ['VALS1AEP/2', 'VALS1AEP/4']),
    ('Válvulas mariposa supervisadas', [39], ['VALS1AEP/1', 'VALS1AEP/5']),
    ('Válvulas de alivio', [40], ['VALS1AEP/3']),
    ('Puertas automáticas', [54], ['PPAS1AEP/1', 'PPAS1AEP/2']),
    ('Bombas (centrífugas, sumergibles, multietapa)', [55, 56, 57, 58], ['MBOS1AEP/1', 'MBOS1AEP/2']),
]
SIN = [('Batanes de combustible', [34]), ('Estaciones de control y alarma (ECA)', [41]),
       ('Sensores de flujo', [42]), ('Bocas de incendio equipadas (BIE)', [43, 44]),
       ('Postes hidrantes', [45]), ('Matafuegos / extintores', [46]),
       ('Planta de regulación de gas', [59])]
EXCL = [('Vehículos (por kilómetros, no por tiempo)', [47, 48, 49, 50, 51, 52, 53])]

eq_por_par = collections.defaultdict(set)
for r in plan_rows:
    eq_por_par[r[3] + '/' + r[4]].add(r[0])


def match(tm, cand):
    best = (0, None)
    for j, ts in enumerate(cand):
        i = len(tm & ts)
        if i < 2 and not (0 < len(tm) <= 2 and i == len(tm)):
            continue
        sc = i / max(1, min(len(tm), len(ts)))
        if sc > best[0]:
            best = (sc, j)
    return best


TH = 0.6
res = []
for nombre, tabs, pares in G:
    std = []
    for i in tabs:
        for r in STD[i]:
            std.append((sfreq(r[1]), r[2], 'MOEX' in r[1].upper()))
    std = list(dict.fromkeys(std))
    tareas = []
    pinfo = []
    for p in pares:
        rt, ct = p.split('/')
        k = (rt, ct)
        pinfo.append({'rc': p, 'detalle': bool(detalle.get(k)), 'nTareas': len(sap.get(k, [])),
                      'nEquipos': len(eq_por_par.get(p, [])), 'existe': k in ops})
        if detalle.get(k):
            tareas += [(f, s, toks(s)) for f, s in sap[k]]
    g = {'nombre': nombre, 'tablas': tabs, 'pares': pinfo, 'nStd': len(std),
         'conDetalle': any(x['detalle'] for x in pinfo),
         'nEquipos': sum(x['nEquipos'] for x in pinfo)}
    if g['conDetalle']:
        usadas = set()
        cub = otra = 0
        falta = []
        otraL = []
        for f, m, moex in std:
            tm = toks(m)
            idx = [j for j, t in enumerate(tareas) if t[0] == f or t[0] is None or f is None]
            sc, j = match(tm, [tareas[x][2] for x in idx]) if idx else (0, None)
            if j is not None and sc >= TH:
                cub += 1
                usadas.add(idx[j])
                continue
            sc2, j2 = match(tm, [t[2] for t in tareas])
            if j2 is not None and sc2 >= TH:
                otra += 1
                usadas.add(j2)
                otraL.append({'f': f, 'sap': tareas[j2][0], 't': m[:140]})
                continue
            falta.append({'f': f, 't': m[:150], 'moex': moex})
        sobr = [t for j, t in enumerate(tareas) if j not in usadas and t[2]]
        g.update({'cub': cub, 'otraFrec': otra, 'falta': falta, 'otraFrecL': otraL[:40],
                  'nSobrantes': len(sobr),
                  'sobrEj': list(dict.fromkeys('%s: %s' % (t[0] or '–', t[1][:90]) for t in sobr))[:12]})
    else:
        g.update({'cub': 0, 'otraFrec': 0, 'falta': [], 'otraFrecL': [], 'nSobrantes': 0, 'sobrEj': []})
    res.append(g)

sin = [{'nombre': n, 'nStd': sum(len(STD[i]) for i in t)} for n, t in SIN]
excl = [{'nombre': n, 'nStd': sum(len(STD[i]) for i in t)} for n, t in EXCL]
faltan = sorted({r[3] + '/' + r[4] for r in plan_rows if (r[3], r[4]) not in ops})
with open(os.path.join(OUT, 'hdr-estandar-data.js'), 'w', encoding='utf-8') as f:
    f.write('/* ─── HDR_ESTANDAR — gama de tareas de SAP (IA17) vs estándar del Manual de Mtto TER ───\n'
            '   Estándar: "Planes de Mtto TER para Manual de Mtto AEP rev1.docx". SAP: HDR ter aep.xlsm\n'
            '   (operaciones/suboperaciones) + vínculo equipo↔hoja de ruta de HDR_PLAN. Cruce por palabras\n'
            '   (aproximado): una tarea del estándar está "cubierta" si una tarea de SAP tiene ≥60% de sus palabras.\n'
            '   Regenerar: python scratchpad/gen_hdr_plan.py <Planes.xlsx> <HDR.xlsm> <estandar.docx> */\n')
    f.write('const HDR_ESTANDAR = ' + json.dumps(
        {'grupos': res, 'sinHojaDeRuta': sin, 'excluidos': excl, 'paresFueraDelExport': faltan},
        ensure_ascii=False, separators=(',', ':')) + ';\n')
for g in res:
    print('%-44s std=%3d eq=%3d det=%-5s cub=%3d otra=%3d falta=%3d sobr=%d' % (
        g['nombre'][:44], g['nStd'], g['nEquipos'], g['conDetalle'], g['cub'], g['otraFrec'],
        len(g['falta']), g['nSobrantes']))
print('fuera del export:', faltan)
