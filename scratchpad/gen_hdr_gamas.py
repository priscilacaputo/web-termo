# -*- coding: utf-8 -*-
"""Genera assets/js/hdr-gamas-data.js = HDR_GAMAS: texto completo de cada operación de las hojas de ruta
(lista de impresión IA17 exportada a Excel: ia17.xlsx), estructurado para rearmarlo en formato legible en SAM.

Uso: python gen_hdr_gamas.py "<ia17.xlsx>" [otro_export.xlsx ...]  (se combinan; el último gana por RUTA/CONT)

HDR_GAMAS["RUTA/CONT"] = {d: descripción, o: [ {n: Nº op, d: desc, p: puesto, np: personas, t: trabajo(min),
   du: duración(min), pq: [paquetes], S: id seguridad, A: id autocontrol,
   ga: [{h: encabezado, i: [tareas]}], li: [texto libre], sb: [{n, d, x: [texto], p: puesto}]} ]}
HDR_GAMAS_TXT = listas de líneas de seguridad/autocontrol compartidas (S y A son índices)."""
import sys, re, json, os, unicodedata
import openpyxl

SRCS = sys.argv[1:] or [os.path.expanduser('~/Downloads/ia17.xlsx')]   # varios exports: los últimos pisan a los primeros
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'hdr-gamas-data.js')


def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')


FREQ_H = re.compile(r'^(tareas\s+(correspondientes?|de)\b|(diaria|semanal|quincenal|mensual|bimestral|trimestral|cuatrimestral|semestral|anual|bienal)\b)', re.I)
SEC = re.compile(r'^(?:(\d)\s*-\s*)?(consignas de seguridad|gama de tareas|consignas de autocontrol)\s*$', re.I)
GAMA_H = re.compile(r'^gama de tareas\b\s*(.*)$', re.I)
ST = re.compile(r'^S-{3,}T-{3,}\}?$')
ATTR = {'puesto de trabajo': 'p', 'número de personas': 'np', 'trabajo': 't', 'duración': 'du'}
SKIP = ('clave de control', 'estrategia', 'utilización', 'centro', 'menú', 'finalizar')


TAG = re.compile(r'^<\d+>\s*')   # marcas de formato de SAP (<1317> ...) en exports viejos


def num(s):
    try:
        return float(str(s).replace('.', '').replace(',', '.'))
    except ValueError:
        return 0


ARRANCA = re.compile(r'^(verific|limpi|realiz|med[ie]|control|lavad|tensad|retir|reinstal|hidrolav|lubric|reemplaz|cambi|ajust|revis|inspecc|efectu|agreg|engras|inyect|drenar|purg|comprob|registr|anotar|asegur|garantiz|confirm|senaliz|interrump|observ|energiz|lectur|chequ|reapret|tomar|mantener|inspecci|reapriet)')


def nuevo_item(prev, txt):
    """¿esta línea arranca una tarea nueva o continúa la anterior?"""
    if prev is None:
        return True
    if re.match(r'^[-•·]\s*', txt):
        return True
    if txt.startswith('R ___'):
        return False
    if prev.rstrip().endswith(('.', ':', ';', ')')) and txt[:1].isupper():
        return True
    # formato viejo: una tarea por renglón; si el renglón anterior quedó corto (no llegó a partirse) esta es otra tarea
    if txt[:1].isupper() and len(prev.split('')[-1]) < 32 and ARRANCA.match(norm(txt)):
        return True
    return False


def limpia(txt):
    txt = txt.replace('', ' ')
    return re.sub(r'\s+', ' ', re.sub(r'^[-•·]\s*', '', txt)).strip()


def cierra_items(items):
    return [limpia(x) for x in items if limpia(x)]


def parse(path):
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    out = {}
    cur = op = sub = None
    sec = None
    gama_h = ''
    for r in ws.iter_rows(values_only=True):
        c = [(i, TAG.sub('', ' '.join(str(x).split())).strip()) for i, x in enumerate(r) if x is not None and str(x).strip()]
        c = [x for x in c if x[1]]
        if not c:
            continue
        col0, first = c[0]
        v = dict(c)
        text = ' '.join(x[1] for x in c)
        if col0 == 0 and first.startswith('Hoja de ruta') and len(c) >= 2:
            vs = [x[1] for x in c]
            cur = out.setdefault((vs[1] if len(vs) > 1 else '') + '/' + (vs[2] if len(vs) > 2 else ''), {'d': vs[3] if len(vs) > 3 else '', 'o': []})
            op = sub = None; sec = None
            continue
        if cur is None or 'Lista de impresión' in text:
            continue
        if col0 == 1 and first == 'Operación':
            vs = [x[1] for x in c]
            op = {'n': vs[1] if len(vs) > 1 else '', 'd': vs[2] if len(vs) > 2 else '', 'p': '', 'np': 0, 't': 0, 'du': 0, 'pq': [],
                  'seg': [], 'au': [], 'ga': [], 'li': [], 'sb': []}
            cur['o'].append(op); sub = None; sec = None; gama_h = ''
            continue
        if op is None:
            continue
        if col0 == 2 and first == 'Suboper.':
            vs = [x[1] for x in c]
            sub = {'n': vs[1] if len(vs) > 1 else '', 'd': vs[2] if len(vs) > 2 else '', 'x': [], 'p': ''}
            op['sb'].append(sub)
            continue
        if col0 == 2 and first == 'Paq.mant.':
            if sub is None and len(c) > 2:
                op['pq'].append(c[-1][1])
            continue
        nl = norm(first)
        if col0 == 3 and nl in ATTR or (col0 == 3 and first in ('Puesto de trabajo', 'Número de personas', 'Trabajo', 'Duración')):
            key = ATTR.get(nl)
            val = c[1][1] if len(c) > 1 else ''
            tgt = sub if sub is not None else op
            if key == 'p':
                tgt['p'] = val
            elif sub is None:
                if key == 'np':
                    op[key] = int(num(val))
                else:   # minutos (SAP exporta a veces en HRA)
                    op[key] = round(num(val) * (60 if any(x[1] == 'HRA' for x in c) else 1))
            continue
        if any(nl.startswith(norm(s)) for s in SKIP) and len(c) > 1:
            continue
        # texto de línea (mide R S T → campos a completar)
        first = c[0][1]
        if len(c) > 1 and any(ST.match(x[1]) for x in c[1:]):
            first = re.sub(r'\bR$', 'R ___', first.rstrip()) + ' S ___ T ___'
        elif re.fullmatch(r'R', first):
            first = 'R ___'
        if sub is not None:
            sub['x'].append(first)
            continue
        m = SEC.match(first)
        if m:
            sec = {'consignas de seguridad': 'seg', 'gama de tareas': 'ga', 'consignas de autocontrol': 'au'}[m.group(2).lower()]
            gama_h = ''
            if sec == 'ga':
                op['ga'].append({'h': '', 'i': []})
            continue
        if sec is None:
            # título repetido de la operación o texto libre
            if first == op['d'] or (op['d'] and first.startswith(op['d'][:30]) and len(first) <= len(op['d']) + 5):
                continue
            op['li'].append(first)
            continue
        if sec in ('seg', 'au'):
            it = op[sec]
            if nuevo_item(it[-1] if it else None, first):
                it.append(first)
            else:
                it[-1] += '' + first
            continue
        # sec == 'ga'
        blk = op['ga'][-1]
        if FREQ_H.match(norm(first)) or GAMA_H.match(first):
            gm = GAMA_H.match(first)
            h = (gm.group(1).strip() or 'Gama') if gm else first
            if blk['h'] == '' and not blk['i']:
                blk['h'] = h
            else:
                op['ga'].append({'h': h, 'i': []})
            continue
        it = blk['i']
        if nuevo_item(it[-1] if it else None, first):
            it.append(first)
        else:
            it[-1] += '' + first
    return out


data = {}
for _f in SRCS:
    data.update(parse(_f))
TXT = []          # listas de seguridad/autocontrol compartidas
idx = {}


def intern(lines):
    k = json.dumps(lines, ensure_ascii=False)
    if k not in idx:
        idx[k] = len(TXT)
        TXT.append(lines)
    return idx[k]


res = {}
nops = 0
for k, h in data.items():
    ops = []
    for o in h['o']:
        nops += 1
        r = {'n': o['n'], 'd': o['d'], 'p': o['p'], 'np': o['np'], 't': o['t'], 'du': o['du'], 'pq': o['pq']}
        s = cierra_items(o['seg']); a = cierra_items(o['au'])
        if s: r['S'] = intern(s)
        if a: r['A'] = intern(a)
        ga = [{'h': g['h'], 'i': cierra_items(g['i'])} for g in o['ga']]
        ga = [g for g in ga if g['i'] or g['h']]
        if ga: r['ga'] = ga
        li = cierra_items(o['li'])
        if li and not (ga or o['sb'] or s or a):
            # paso SAP MOBILE: la operación ES la tarea; el texto breve viene cortado a 40 caracteres y el resto en el texto largo
            d = o['d']; resto = ' '.join(li)
            pegado = len(d) >= 40 and re.match(r'^[a-záéíóúñ]{1,4}(?![a-záéíóúñ])', resto) and d[-1].isalpha()
            r['d'] = d + ('' if pegado else ' ') + resto
            li = []
        if li: r['li'] = li
        sb = [{'n': s_['n'], 'd': s_['d'], 'x': limpia(' '.join(s_['x'])), 'p': s_['p']} for s_ in o['sb']]
        if sb: r['sb'] = sb
        ops.append(r)
    res[k] = {'d': h['d'], 'o': ops}

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('/* ─── HDR_GAMAS — texto completo de cada operación de las hojas de ruta (IA17 → lista de impresión) ───\n'
            '   Lo usa la página "Gamas para SAM" para rearmar la gama de tareas en formato legible (texto plano).\n'
            '   Regenerar: python scratchpad/gen_hdr_gamas.py "<ruta a ia17.xlsx>"\n'
            '   Por operación: S / A = índice en HDR_GAMAS_TXT (consignas de seguridad / autocontrol compartidas),\n'
            '   ga = [{h: encabezado (frecuencia), i: [tareas]}], li = texto libre, sb = suboperaciones. */\n')
    f.write('const HDR_GAMAS_TXT = ' + json.dumps(TXT, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('const HDR_GAMAS = ' + json.dumps(res, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(res), 'contadores,', nops, 'operaciones,', len(TXT), 'textos compartidos,', os.path.getsize(OUT) // 1024, 'KB')
