# -*- coding: utf-8 -*-
"""Parsea el 'Lista de impresión de la hoja de ruta' exportado a Excel (ia17.xlsx).
Devuelve {(ruta, cont): {'desc':..., 'ops': [{'op','desc','freqTareas':{freq:[tarea,...]}, 'tareas':[(freq,txt)]}]}}"""
import re, unicodedata, collections
import openpyxl

FQ = [('Diaria', r'diari'), ('Semanal', r'semanal|\b7d\b'), ('Quincenal', r'quincenal'), ('Mensual', r'mensual|\b1m\b'),
      ('Bimestral', r'bimestral|\b2m\b'), ('Trimestral', r'trimestral|\b3m\b'),
      ('Cuatrimestral', r'cuatrimestral|\b4m\b'), ('Semestral', r'semestral|\b6m\b'),
      ('Anual', r'anual|\b1a\b'), ('Bienal', r'bienal|bianual|\b2a\b'),
      ('Trienal', r'trienal|\b3a\b'), ('Quinquenal', r'quinquenal|\b5a\b')]


def _n(s):
    s = unicodedata.normalize('NFD', (s or '').lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')


def freq_de(t):
    t = _n(t)
    for n, p in FQ:
        if re.search(p, t):
            return n
    return None


LABELS = ('puesto de trabajo', 'clave de control', 'numero de personas', 'trabajo', 'duracion', 'paq.mant',
          'estrategia', 'utilizacion', 'centro', 'menu', 'finalizar')


def parse(path):
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    lines = []
    for r in ws.iter_rows(values_only=True):
        c = [(i, ' '.join(str(x).split())) for i, x in enumerate(r) if x is not None and str(x).strip()]
        if c:
            lines.append(c)
    out = collections.OrderedDict()
    cur = None
    op = None
    sec = None        # 'seg' | 'gama' | 'auto' | None
    freq = None
    task = None

    def cerrar():
        nonlocal task
        if task is not None and op is not None:
            txt = ' '.join(task[1]).strip(' -') or (task[2] if len(task) > 2 else '')
            if len(txt) > 3:
                op['tareas'].append((task[0], txt))
        task = None

    for c in lines:
        first = c[0][1]
        col0 = c[0][0]
        text = ' '.join(x[1] for x in c)
        if col0 == 0 and first.startswith('Hoja de ruta') and len(c) >= 2:
            cerrar()
            vals = {i: v for i, v in c}
            ruta = vals.get(3, '')
            cont = vals.get(9, '')
            cur = out.setdefault((ruta, cont), {'desc': vals.get(15, ''), 'ops': []})
            op = None; sec = None; freq = None
            continue
        if cur is None:
            continue
        if first == 'Operación' and col0 == 1:
            cerrar()
            vals = {i: v for i, v in c}
            op = {'op': vals.get(3, ''), 'desc': vals.get(15, ''), 'tareas': [], 'puesto': '', 'paqs': []}
            cur['ops'].append(op)
            sec = None; freq = None
            continue
        if op is None:
            continue
        nl = _n(text)
        if nl.startswith('lista de impresion') or nl.startswith('menu') or nl.startswith('finalizar') or 'pctodo' in nl:
            continue
        if 'Lista de impresión' in text:
            continue
        if col0 == 2 and first == 'Paq.mant.':
            if not op.get('enSub'):
                op['paqs'].append(c[2][1] if len(c) > 2 else '')
            continue
        if col0 == 2 and first == 'Suboper.':
            cerrar()
            op['enSub'] = True
            vals = {i: v for i, v in c}
            f = freq_de(op['desc'])
            if f is None and len(op['paqs']) == 1:
                f = freq_de(op['paqs'][0])
            freq = f
            task = (f, [], vals.get(15, ''))
            sec = 'sub'
            continue
        if first == 'Puesto de trabajo':
            op['puesto'] = c[-1][1]
            continue
        if any(nl.startswith(l) for l in LABELS):
            continue
        m = re.match(r'^(\d)\s*-\s*(.*)', text)
        if m and text.upper() == text.upper() and re.match(r'^\d-\s*[A-ZÁÉÍÓÚ ]+$', text):
            cerrar()
            sec = {'1': 'seg', '2': 'gama', '3': 'auto'}.get(m.group(1), None)
            freq = None
            continue
        if sec in ('seg', 'auto'):
            continue
        if re.search(r'S-{4,}T', text):
            continue
        # encabezado de frecuencia
        if nl.startswith('tareas correspondientes') or nl.startswith('tareas de') or re.match(r'^(mensual|bimestral|trimestral|semestral|anual)\b', nl):
            cerrar()
            freq = freq_de(text)
            continue
        if sec is None and (text == op['desc']):
            continue
        if sec == 'sub':
            if task is not None:
                task[1].append(text)
            continue
        # tarea (viñeta nueva o continuación)
        if re.match(r'^[-•·]\s*', text) or task is None:
            cerrar()
            task = (freq, [re.sub(r'^[-•·]\s*', '', text)], '')
        else:
            task[1].append(text)
    cerrar()
    return out


def scan_items(path):
    """Operaciones y suboperaciones con su puesto de trabajo, Nº de personas y trabajo.
    -> lista de dict {k:(ruta,cont,desc), op, desc, sub, p, n, w}"""
    ws = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    cur = None; item = None; op = None; items = []
    for r in ws.iter_rows(values_only=True):
        c = [(i, ' '.join(str(x).split())) for i, x in enumerate(r) if x is not None and str(x).strip()]
        if not c:
            continue
        f = c[0][1]
        v = dict(c)
        if c[0][0] == 0 and f.startswith('Hoja de ruta') and len(c) >= 2:
            cur = (v.get(3, ''), v.get(9, ''), v.get(15, '')); item = None; op = None
        elif c[0][0] == 1 and f == 'Operación' and cur:
            op = (v.get(3, ''), v.get(15, ''))
            item = {'k': cur, 'op': op[0], 'desc': op[1], 'sub': '', 'p': None, 'n': 0, 'w': ''}
            items.append(item)
        elif c[0][0] == 2 and f == 'Suboper.' and cur and op:
            item = {'k': cur, 'op': op[0], 'desc': op[1], 'sub': (v.get(3, '') + ' ' + v.get(15, '')).strip(), 'p': None, 'n': 0, 'w': ''}
            items.append(item)
        elif f == 'Puesto de trabajo' and item is not None:
            item['p'] = c[-1][1]
        elif f == 'Número de personas' and item is not None:
            item['n'] = c[-1][1]
        elif f == 'Trabajo' and item is not None:
            item['w'] = ' '.join(x[1] for x in c[1:])
    return items


if __name__ == '__main__':
    import sys
    d = parse(sys.argv[1])
    print(len(d), 'contadores', sum(len(v['ops']) for v in d.values()), 'ops',
          sum(len(o['tareas']) for v in d.values() for o in v['ops']), 'tareas')
    k = ('AAC01AEP', '1')
    for o in d[k]['ops']:
        print(o['op'], o['desc'], len(o['tareas']))
        for t in o['tareas'][:6]:
            print('   ', t)
