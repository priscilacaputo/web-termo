"""Genera assets/js/prog-anual-data.js desde exports SAPUI5 'Órdenes de mantenimiento' (programación).
Uso: python scratchpad/gen_prog_anual.py "<export completo del año (con hoja de ruta)>" ["<export más nuevo, solo OTs abiertas>" ...]

El primer archivo es la base (trae 'Hoja de ruta para mantenimiento'). Los siguientes solo suman OTs que la base
no tiene (SAP las va creando con antelación); como no traen hoja de ruta, se la infiere de otra OT del mismo equipo
y mismo texto de la base."""
import openpyxl, re, json, sys, datetime, os

def leer(path):
    wb = openpyxl.load_workbook(path, read_only=True)
    it = wb.active.iter_rows(values_only=True)
    cab = [str(c or '') for c in next(it)]
    def col(pref):
        for i, c in enumerate(cab):
            if c.lower().startswith(pref): return i
        return None
    ix = {k: col(v) for k, v in dict(orden='orden', obj='objeto', estado='estado del', puesto='puesto', fecha='fecha de inicio', hr='hoja de ruta').items()}
    out = []
    for r in it:
        g = lambda k: (r[ix[k]] if ix[k] is not None else None)
        m = re.search(r'\((\d+)\)\s*$', g('orden') or '')
        if not m or not g('fecha'): continue
        eq = re.search(r'\(([A-Z]{2,5}\d+[A-Z0-9]*)\)\s*$', g('obj') or '')
        hr = re.search(r'\((?:[A-Z]/)?([A-Z0-9]+)/(\w+)\)\s*$', g('hr') or '')
        pu = re.search(r'\((\w+)\)\s*$', g('puesto') or '')
        out.append(dict(orden=m.group(1), equipo=eq.group(1) if eq else '', puesto=pu.group(1) if pu else '', fecha=g('fecha').strftime('%Y-%m-%d'),
                        hr=(hr.group(1) + '/' + hr.group(2)) if hr else '', cerrada=1 if 'CTEC' in (g('estado') or '') else 0,
                        texto=re.sub(r'\s*\(\d+\)\s*$', '', g('orden'))))
    return out

archivos = sys.argv[1:]
filas = leer(archivos[0])
vistas = {f['orden'] for f in filas}
hr_por = {}
for f in filas:
    if f['hr']: hr_por.setdefault((f['equipo'], f['texto']), f['hr'])
sumadas = 0
for p in archivos[1:]:
    for f in leer(p):
        if f['orden'] in vistas: continue
        vistas.add(f['orden']); sumadas += 1
        f['hr'] = f['hr'] or hr_por.get((f['equipo'], f['texto']), '')
        filas.append(f)
textos, tidx, out = [], {}, []
for f in filas:
    t = f['texto']
    if t not in tidx: tidx[t] = len(textos); textos.append(t)
    out.append([f['orden'], f['equipo'], f['puesto'], f['fecha'], f['hr'], f['cerrada'], tidx[t]])
js = ("/* ─── PROG_ANUAL — programación de OTs preventivas (exports SAPUI5 'Órdenes de mantenimiento') ───\n"
      "   Fila: [orden, equipo, puesto (AUX_TER/AUX_MEC/…), fecha de inicio, hoja de ruta 'RUTA/contador' ('' si no se pudo inferir), cerrada (CTEC), índice de texto].\n"
      "   Lo usan la pestaña Capacidad del personal y la nivelación de carga (Auditoría). Regenerar: python scratchpad/gen_prog_anual.py <xlsx base> [<xlsx más nuevo>…] */\n"
      "const PROG_ANUAL = " + json.dumps({'generado': datetime.date.today().isoformat(), 'fuente': [os.path.basename(a.replace(chr(92), '/')) for a in archivos], 'textos': textos, 'filas': out}, ensure_ascii=False, separators=(',', ':')) + ";\n")
open('assets/js/prog-anual-data.js', 'w', encoding='utf8').write(js)
print(len(out), 'OTs', sumadas, 'sumadas de archivos nuevos', sum(1 for o in out if not o[4]), 'sin hoja de ruta', len(js) // 1024, 'KB')
