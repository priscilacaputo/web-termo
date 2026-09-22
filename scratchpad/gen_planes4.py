# -*- coding: utf-8 -*-
"""Regenera assets/js/planes-sap-data.js (PLANES_SAP + PLANES_SAP_RESUMEN).

Modos:
  --check                 reproduce el archivo actual desde 'IP24 MOD.xlsx' y compara (validación)
  <IP24.xlsx> <Planes.xlsx>   IP24 (tomas por posición, sin equipo) + 'Planes de Mantenimiento.xlsx'
                          (equipo / denominación / ubicación / grupo por plan) -> reescribe el archivo
Reemplaza a gen_planes3.py (perdido)."""
import sys, os, re, json, statistics, subprocess, collections, datetime as dt
import openpyxl

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
JS = os.path.join(ROOT, 'assets', 'js')
REF = dt.datetime(2026, 9, 21)
# equipos "MONT NOAC PTBO" eliminados del portal (regla permanente, ver memoria)
NOAC = {'AAC193', 'AAC250', 'AAC1272', 'AAC2112', 'AAC2721', 'AAC2722', 'AAC2723', 'AAC2724', 'AAC2725',
        'AAC2732', 'AVO018', 'AVO876'}


def load_js_const(fn, name):
    """Lee una const de un .js del portal vía node (evita reparsear a mano)."""
    code = ("const fs=require('fs');const vm=require('vm');const s=fs.readFileSync(%s,'utf8');"
            "const c=vm.createContext({});vm.runInContext(s.replace(/\\bconst %s\\b/,'var %s'),c);"
            "process.stdout.write(JSON.stringify(c.%s))" % (json.dumps(os.path.join(JS, fn)), name, name, name))
    return json.loads(subprocess.check_output(['node', '-e', code]).decode('utf-8'))


def bucket(d):
    if d is None: return '(s/fechas)'
    for lo, hi, n in [(1, 10, 'Semanal'), (12, 18, 'Quincenal'), (25, 40, 'Mensual'), (50, 70, 'Bimestral'),
                      (80, 100, 'Trimestral'), (110, 130, 'Cuatrimestral'), (150, 210, 'Semestral'),
                      (330, 400, 'Anual')]:
        if lo <= d <= hi: return n
    return 'otro (~%dd)' % d


def declara_de(desc):
    """'MP 2M-6M-1A VRF' -> '2M-6M-12M' (años a meses; ignora 'R410A')."""
    m = re.findall(r'(?<![A-Za-z0-9])(\d{1,2})\s*([MA])(?![A-Za-z0-9])', desc or '')
    out = []
    for n, u in m:
        n = int(n)
        out.append('%dM' % (n * 12 if u == 'A' else n))
    if not out:   # sin token numérico: por palabra ('Preventivo semestral tanque de agua')
        low = (desc or '').lower()
        for w, t in [('semanal', '1S'), ('mensual', '1M'), ('bimestral', '2M'), ('trimestral', '3M'),
                     ('cuatrimestral', '4M'), ('semestral', '6M'), ('bianual', '24M'), ('anual', '12M')]:
            if w in low:
                out.append(t)
                break
    return '-'.join(dict.fromkeys(out))


def dias_de(tok):
    return int(tok[:-1]) * (7 if tok.endswith('S') else 30)


def compute(rs, ref):
    """rs: filas [(nToma, fecha, orden)] de una posición."""
    fechas = sorted(f for _, f, _ in rs if isinstance(f, dt.datetime))
    gaps = [(b - a).days for a, b in zip(fechas, fechas[1:]) if (b - a).days > 0]
    real = round(statistics.median(gaps)) if gaps else None
    venc = sum(1 for _, f, o in rs if isinstance(f, dt.datetime) and f < ref and not o)
    sin_orden = [f for _, f, o in rs if isinstance(f, dt.datetime) and not o]
    return real, venc, fechas, sin_orden


def build(pos_rows, meta, maestro, ref, hoja_de_ruta=None):
    """pos_rows: pos -> {'plan','estr','desc','tomas':[(n,f,orden)]}; meta(pos)->dict equipo/denomOT/ubic/grupo."""
    out = []
    for pos, d in pos_rows.items():
        m = meta(pos, d)
        real, venc, fechas, sin_orden = compute(d['tomas'], ref)
        dec = declara_de(d['desc'])
        prox = min((f for f in fechas if f >= ref), default=None)   # próxima fecha programada (con o sin orden)
        row = {'pos': pos, 'plan': d['plan'], 'equipo': m['equipo'], 'desc': d['desc'], 'estr': d['estr'],
               'grupoPlan': m['grupo'], 'realDias': real, 'realBucket': bucket(real), 'declara': dec,
               'proxima': prox.strftime('%Y-%m-%d') if prox else None, 'vencidasSinOrden': venc,
               'desajuste': None}
        toks = [dias_de(t) for t in dec.split('-') if t]
        if real and toks:
            mn = min(toks)
            if real > mn * 1.6: row['desajuste'] = 'menos_seguido'
            elif real < mn * 0.6: row['desajuste'] = 'mas_seguido'
        eq = m['equipo']
        e = maestro.get(eq)
        row['equipoNoEnSap'] = bool(eq) and e is None
        row['equipoBaja'] = bool(e) and ('NOAC' in (e.get('status') or '') or 'BAJA' in (e.get('status') or '').upper())
        row['sinEquipo'] = not eq
        if m.get('ubicDesc'): row['ubicDesc'] = m['ubicDesc']
        if m.get('denomOT'): row['denomOT'] = m['denomOT'].strip()
        out.append(row)
    return out


def main():
    maestro = {e['equipo']: e for e in load_js_const('equipos-sap-data.js', 'EQUIPOS_SAP')}
    old = load_js_const('planes-sap-data.js', 'PLANES_SAP')
    old_by = {o['pos']: o for o in old}

    if sys.argv[1] == '--check':
        ws = openpyxl.load_workbook(r'C:\Users\aa2k8428\Downloads\IP24 MOD.xlsx', read_only=True, data_only=True).active
        rows = [r for r in ws.iter_rows(min_row=2, values_only=True) if r and r[1]]
        pr = collections.OrderedDict()
        info = {}
        for r in rows:
            pos = str(r[1])
            if pos not in old_by:
                continue
            pr.setdefault(pos, {'plan': str(r[2]), 'estr': r[3], 'desc': r[4], 'tomas': []})['tomas'].append((r[5], r[6], r[7]))
            info[pos] = {'equipo': str(r[25] or ''), 'grupo': r[19], 'ubicDesc': r[13] or '', 'denomOT': r[24] or ''}
        ref = dt.datetime(2026, 9, 9)
        new = build(pr, lambda p, d: info[p], maestro, ref)
        cnt = collections.Counter()
        bad = collections.defaultdict(list)
        for n in new:
            o = old_by[n['pos']]
            for k in ['equipo', 'grupoPlan', 'realDias', 'realBucket', 'declara', 'proxima', 'vencidasSinOrden',
                      'desajuste', 'equipoNoEnSap', 'equipoBaja', 'sinEquipo', 'ubicDesc', 'denomOT']:
                if n.get(k) == o.get(k): cnt[k] += 1
                elif len(bad[k]) < 4: bad[k].append((n['pos'], n.get(k), o.get(k)))
        print(len(new), dict(cnt))
        for k, v in bad.items(): print(k, v)
        return

    ip24, planes = sys.argv[1], sys.argv[2]
    pm = {}
    for r in openpyxl.load_workbook(planes, read_only=True, data_only=True).active.iter_rows(min_row=2, values_only=True):
        if r and r[0]:
            pm[str(r[0])] = {'equipo': str(r[2] or ''), 'denomOT': r[3] or '', 'grupo': r[6] or '', 'ubic': r[11] or ''}
    ws = openpyxl.load_workbook(ip24, read_only=True, data_only=True).active
    pr = collections.OrderedDict()
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not r or not r[1]: continue
        pos = str(r[1])
        pr.setdefault(pos, {'plan': str(r[2]), 'estr': r[3], 'desc': r[4], 'tomas': []})['tomas'].append((r[5], r[6], r[7]))
    excl = [p for p, d in pr.items() if (pm.get(d['plan']) or {}).get('equipo') in NOAC]
    for p in excl: del pr[p]

    def meta(pos, d):
        x = pm.get(d['plan'], {'equipo': '', 'denomOT': '', 'grupo': '', 'ubic': ''})
        o = old_by.get(pos, {})
        return {'equipo': x['equipo'], 'grupo': x['grupo'], 'denomOT': x['denomOT'], 'ubicDesc': o.get('ubicDesc', '')}
    rows = build(pr, meta, maestro, REF)
    resumen(rows, pr, maestro, pm)


def resumen(rows, pr, maestro, pm):
    tomas = sum(len(d['tomas']) for d in pr.values())
    equipos = sorted({r['equipo'] for r in rows if r['equipo']})
    sin_eq = [{'pos': r['pos'], 'desc': r['desc'], 'ubic': (pm.get(r['plan']) or {}).get('ubic', '')} for r in rows if r['sinEquipo']]
    no_mae = sorted({r['equipo'] for r in rows if r['equipoNoEnSap']})
    baja = sorted({r['equipo'] for r in rows if r['equipoBaja']})
    con_plan = set(equipos)
    sin_plan = sorted(e for e, v in maestro.items() if e not in con_plan and re.match(r'^(AAC|AVO|CPN|CTA|MBO|MEQ|PPA|VAL|MAN|MAS|MES|EMO|ACO|MCD|TNQ|CMA|AUT|ARC|MBA)', e)
                      and (v.get('status') or '') == 'MONT')
    pref = lambda e: re.match(r'[A-Z]+', e).group(0)
    por_pref_sinplan = collections.Counter(pref(e) for e in sin_plan)
    per = collections.Counter(r['realBucket'] for r in rows)
    fam = collections.Counter(pref(r['equipo']) for r in rows if r['equipo'])
    estr = load_js_const('estrategias-sap-data.js', 'ESTRATEGIAS_SAP')
    ec = collections.Counter(r['estr'] for r in rows)
    estrategias = [{'k': k, 'denom': v['denom'], 'paquetes': [p['breve'] for p in v['paquetes']],
                    'minDias': v['minDias'], 'planes': ec.get(k, 0)} for k, v in estr.items() if ec.get(k)]
    fuera = []
    for r in rows:
        v = estr.get(r['estr'])
        if v and r['realDias'] and not any(abs(r['realDias'] - d) <= 0.3 * d for d in v['diasSet']):
            fuera.append(r)
    strip = lambda r: {k: r[k] for k in ('pos', 'plan', 'equipo', 'desc', 'estr', 'grupoPlan', 'realDias', 'realBucket', 'declara',
                                          'proxima', 'vencidasSinOrden', 'desajuste', 'equipoNoEnSap', 'equipoBaja', 'sinEquipo')}
    R = {
        'fuente': 'IP24 (1).xlsx + Planes de Mantenimiento.xlsx (TER + MEC, solo Aeroparque)',
        'posiciones': len(rows), 'tomas': tomas, 'equiposConPlan': len(equipos),
        'planesSinEquipo': sin_eq, 'equiposConPlanNoEnMaestro': no_mae, 'equiposConPlanDadosDeBaja': baja,
        'equiposMaestroSinPlan': {'total': len(sin_plan), 'porPrefijo': dict(por_pref_sinplan.most_common()), 'lista': sin_plan},
        'porPeriodicidadReal': [{'k': k, 'n': n} for k, n in per.most_common()],
        'porFamiliaPrefijo': [{'k': k, 'n': n} for k, n in fam.most_common()],
        'cumplimiento': {'tomasVencidas': sum(1 for d in pr.values() for _, f, _ in d['tomas'] if isinstance(f, dt.datetime) and f < REF),
                         'sinOrden': sum(r['vencidasSinOrden'] for r in rows)},
        'desajusteMenosSeguido': [strip(r) for r in rows if r['desajuste'] == 'menos_seguido'],
        'desajusteNoCoincide': [strip(r) for r in rows if r['desajuste'] == 'mas_seguido'],
        'estrategias': estrategias, 'fueraDePaquete': [strip(r) for r in fuera],
    }
    hdr = ('/* ─── PLANES_SAP / PLANES_SAP_RESUMEN — IP24 (TER + MEC, Aeroparque) ───\n'
           '   Fuente: IP24 (1).xlsx (tomas por posición) + Planes de Mantenimiento.xlsx (equipo, denominación y\n'
           '   grupo por plan). PLANES_SAP: una fila por posición de plan, con su equipo, periodicidad real (mediana\n'
           '   de días entre tomas) y próxima toma sin orden. PLANES_SAP_RESUMEN: agregados + reconciliación contra\n'
           '   EQUIPOS_SAP. Regenerar con scratchpad/gen_planes4.py <IP24.xlsx> <Planes.xlsx>.\n'
           '   Se excluyen los equipos "MONT NOAC PTBO" eliminados del portal. */\n\n')
    js = hdr + 'const PLANES_SAP = ' + json.dumps(rows, ensure_ascii=False, separators=(', ', ': ')) + ';\n\n' + \
        'const PLANES_SAP_RESUMEN = ' + json.dumps(R, ensure_ascii=False, indent=1) + ';\n'
    open(os.path.join(JS, 'planes-sap-data.js'), 'w', encoding='utf-8').write(js)
    print('posiciones', len(rows), 'tomas', tomas, 'equipos', len(equipos), 'sin equipo', len(sin_eq), 'no en maestro', len(no_mae),
          'maestro sin plan', len(sin_plan), 'desajuste', len(R['desajusteMenosSeguido']), len(R['desajusteNoCoincide']), 'fuera paquete', len(fuera))


main()
