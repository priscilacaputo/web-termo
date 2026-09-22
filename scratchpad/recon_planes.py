# -*- coding: utf-8 -*-
"""Prueba: reproducir PLANES_SAP a partir de IP24 MOD.xlsx y comparar con el archivo actual."""
import sys, json, re, statistics, datetime as dt, collections
import openpyxl

MOD = r"C:\Users\aa2k8428\Downloads\IP24 MOD.xlsx"
cur = open(r"C:\Users\aa2k8428\OneDrive - caairports\Escritorio\WEB-TERMO\assets\js\planes-sap-data.js", encoding='utf-8').read()
i = cur.index('const PLANES_SAP = ') + len('const PLANES_SAP = ')
j = cur.index('\nconst PLANES_SAP_RESUMEN')
old = json.loads(cur[i:cur.rindex(';', i, j)])
oldp = {(o['pos']): o for o in old}

ws = openpyxl.load_workbook(MOD, read_only=True, data_only=True).active
rows = [r for r in ws.iter_rows(min_row=2, values_only=True) if r and r[1]]
by = collections.defaultdict(list)
for r in rows:
    by[str(r[1])].append(r)
print(len(by), 'posiciones MOD;', len(oldp), 'actuales')

REF = dt.datetime(2026, 9, 10)
ok = collections.Counter()
diffs = collections.defaultdict(list)
for pos, rs in by.items():
    o = oldp.get(pos)
    if not o:
        continue
    rs.sort(key=lambda r: r[5])
    fechas = [r[6] for r in rs if isinstance(r[6], dt.datetime)]
    gaps = [(b - a).days for a, b in zip(fechas, fechas[1:])]
    med = round(statistics.median(gaps)) if gaps else None
    venc = sum(1 for r in rs if isinstance(r[6], dt.datetime) and r[6] < REF and not r[7])
    prox = next((f for f in fechas if f >= REF), None)
    ok['realDias'] += (med == o['realDias'])
    ok['venc'] += (venc == o['vencidasSinOrden'])
    ok['prox'] += ((prox.strftime('%Y-%m-%d') if prox else None) == o['proxima'])
    ok['n'] += 1
    if med != o['realDias'] and len(diffs['rd']) < 6:
        diffs['rd'].append((pos, med, o['realDias'], gaps[:6]))
    if venc != o['vencidasSinOrden'] and len(diffs['v']) < 6:
        diffs['v'].append((pos, venc, o['vencidasSinOrden']))
    if ((prox.strftime('%Y-%m-%d') if prox else None) != o['proxima']) and len(diffs['p']) < 6:
        diffs['p'].append((pos, prox, o['proxima']))
print(ok)
for k, v in diffs.items():
    print(k, v)
print('declara ejemplos', collections.Counter(o['declara'] for o in old).most_common(20))
print('bucket', collections.Counter(o['realBucket'] for o in old).most_common(20))
print('desajuste', collections.Counter(o['desajuste'] for o in old))
