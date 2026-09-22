import openpyxl, collections, sys
def scan(path):
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    cur = None; op = None; out = collections.OrderedDict()
    for r in ws.iter_rows(values_only=True):
        c = [(i, ' '.join(str(x).split())) for i, x in enumerate(r) if x is not None and str(x).strip()]
        if not c: continue
        f = c[0][1]; v = dict(c)
        if c[0][0] == 0 and f.startswith('Hoja de ruta') and len(c) >= 2:
            cur = (v.get(3, ''), v.get(9, '')); out[cur] = {'desc': v.get(15, ''), 'ops': collections.OrderedDict()}; op = None
        elif c[0][0] == 1 and f == 'Operación' and cur:
            op = v.get(3, ''); out[cur]['ops'][op] = {'desc': v.get(15, ''), 'p': []}
        elif f == 'Puesto de trabajo' and op is not None and cur:
            out[cur]['ops'][op]['p'].append(c[-1][1])
    return out
old = scan(r'C:\Users\aa2k8428\Downloads\ia17.xlsx')
new = scan(r'C:\Users\aa2k8428\Downloads\EXPORT_20260921163329.xlsx')
print(len(old), len(new), 'solo viejo', len(set(old) - set(new)), 'solo nuevo', len(set(new) - set(old)))
cnt = lambda d: collections.Counter(p for k in d.values() for o in k['ops'].values() for p in set(o['p']))
print('viejo', cnt(old)); print('nuevo', cnt(new))
ch = []
for k in old:
    if k in new:
        for op, o in old[k]['ops'].items():
            n = new[k]['ops'].get(op)
            if n and set(o['p']) != set(n['p']): ch.append((k, op, o['desc'][:30], sorted(set(o['p'])), sorted(set(n['p']))))
print('ops con puesto cambiado', len(ch))
for x in ch[:25]: print(x)
