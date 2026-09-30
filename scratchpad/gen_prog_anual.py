"""Genera assets/js/prog-anual-data.js desde el export SAPUI5 'Órdenes de mantenimiento' (programación anual).
Uso: python scratchpad/gen_prog_anual.py "<ruta al .xlsx>" """
import openpyxl, re, json, sys, datetime, os, os
src = sys.argv[1]
wb = openpyxl.load_workbook(src, read_only=True)
rows = list(wb.active.iter_rows(values_only=True))[1:]
textos, tidx, out = [], {}, []
for r in rows:
    m = re.search(r'\((\d+)\)\s*$', r[0] or '')
    if not m or not r[9]: continue
    eq = re.search(r'\(([A-Z]{2,5}\d+[A-Z0-9]*)\)\s*$', r[2] or '')
    hr = re.search(r'\((?:[A-Z]/)?([A-Z0-9]+)/(\w+)\)\s*$', r[11] or '')
    pu = re.search(r'\((\w+)\)\s*$', r[7] or '')
    t = re.sub(r'\s*\(\d+\)\s*$', '', r[0])
    if t not in tidx: tidx[t] = len(textos); textos.append(t)
    out.append([m.group(1), eq.group(1) if eq else '', pu.group(1) if pu else '', r[9].strftime('%Y-%m-%d'),
                (hr.group(1) + '/' + hr.group(2)) if hr else '', 1 if 'CTEC' in (r[5] or '') else 0, tidx[t]])
js = ("/* ─── PROG_ANUAL — programación de OTs preventivas del año (export SAPUI5 'Órdenes de mantenimiento') ───\n"
      "   Fila: [orden, equipo, puesto (AUX_TER/AUX_MEC/…), fecha de inicio, hoja de ruta 'RUTA/contador', cerrada (CTEC), índice de texto].\n"
      "   Lo usa la pestaña Capacidad del personal (Auditoría). Regenerar: python scratchpad/gen_prog_anual.py <xlsx> */\n"
      "const PROG_ANUAL = " + json.dumps({'generado': datetime.date.today().isoformat(), 'fuente': os.path.basename(src.replace(chr(92), '/')), 'textos': textos, 'filas': out}, ensure_ascii=False, separators=(',', ':')) + ";\n")
open('assets/js/prog-anual-data.js', 'w', encoding='utf8').write(js)
print(len(out), 'OTs', len(textos), 'textos', len(js) // 1024, 'KB')
