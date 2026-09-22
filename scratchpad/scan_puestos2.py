import openpyxl, collections, json, re
def scan(path):
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    cur = None; item = None; op = None; items = []
    for r in ws.iter_rows(values_only=True):
        c = [(i, ' '.join(str(x).split())) for i, x in enumerate(r) if x is not None and str(x).strip()]
        if not c: continue
        f = c[0][1]; v = dict(c)
        if c[0][0] == 0 and f.startswith('Hoja de ruta') and len(c) >= 2:
            cur = (v.get(3, ''), v.get(9, ''), v.get(15, '')); item = None; op = None
        elif c[0][0] == 1 and f == 'Operación' and cur:
            op = (v.get(3, ''), v.get(15, '')); item = {'k': cur, 'op': op[0], 'desc': op[1], 'sub': '', 'p': None, 'n': 0, 'w': ''}; items.append(item)
        elif c[0][0] == 2 and f == 'Suboper.' and cur and op:
            item = {'k': cur, 'op': op[0], 'desc': op[1], 'sub': v.get(3, '') + ' ' + v.get(15, ''), 'p': None, 'n': 0, 'w': ''}; items.append(item)
        elif f == 'Puesto de trabajo' and item is not None:
            item['p'] = c[-1][1]
        elif f == 'Número de personas' and item is not None:
            item['n'] = c[-1][1]
        elif f == 'Trabajo' and item is not None:
            item['w'] = ' '.join(x[1] for x in c[1:])
    return items
items = scan(r'C:\Users\aa2k8428\Downloads\EXPORT_20260921163329.xlsx')
OK = {'AUX_TER', 'AUX_MEC', 'MOEX'}
off = [i for i in items if i['p'] and i['p'] not in OK]
print(len(items), 'items;', len(off), 'fuera de estándar;', collections.Counter(i['p'] for i in off))
src = open('assets/js/hdr-plan-data.js', encoding='utf-8').read()
plan = json.loads(src[src.index('= [') + 2:src.index(';\n', src.index('= ['))])
used = {(r[3], r[4]) for r in plan}
by = collections.Counter((i['k'][0], i['k'][1], i['p'], bool(i['sub'])) for i in off if (i['k'][0], i['k'][1]) in used)
for k, n in sorted(by.items()): print(k, n)
