# -*- coding: utf-8 -*-
"""Genera assets/js/ops-sap-data.js -> agrega OPS_SAP_POR_ORDEN: orden -> [textos de operación].
Es la MISMA fuente que ya usa Auditoría SAP para OPS_SAP_RESUMEN (lista de operaciones.xlsx,
IW49) y que arma gama-ciclos-data.js (GAMA_POS): un solo archivo, tres usos. Con esto,
Programación de OTs sabe la gama (mensual/trimestral/semestral/anual…) de una OT en cuanto SAP
la creó y apareció en este export — sin que la usuaria tenga que volver a cargarlo cada mes.

  OPS_SAP_POR_ORDEN["400677548"] = ["Preventivo Mensual SplitsMP Bimestral"]

Nota: SAP crea las OTs preventivas con antelación (el export trae fechas hasta 2030), así que
la mayoría de las OTs de los próximos meses YA están acá. Igual puede haber alguna orden más
nueva que este export no tenga: para esas, Programación sigue con la hoja de ruta (IA17) y,
si hace falta, el botón "Cargar operaciones" para pegar un export más fresco.

Uso: python scratchpad/gen_ops_por_orden.py ["<ruta a lista de operaciones.xlsx>"]
"""
import sys, os, re, json
import openpyxl

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser('~'), 'Downloads', 'lista de operaciones.xlsx')
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'js', 'ops-por-orden-data.js')

por_orden = {}
ws = openpyxl.load_workbook(SRC, read_only=True, data_only=True).active
for r in ws.iter_rows(min_row=2, values_only=True):
    if not r or not r[1]:
        continue
    orden = re.sub(r'\D', '', str(r[1])).lstrip('0') or '0'
    texto = str(r[3] or '').strip()
    if texto:
        por_orden.setdefault(orden, []).append(texto)

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('/* ─── OPS_SAP_POR_ORDEN — texto de cada operación de OT, por Nº de orden ───\n'
            '   Misma fuente que OPS_SAP_RESUMEN (lista de operaciones.xlsx, IW49): "Orden" → lista de\n'
            '   "Texto breve operación". Programación de OTs la usa para saber si una toma es la básica\n'
            '   o si agrega tareas de mayor frecuencia (mensual/trimestral/semestral/anual…), sin volver a\n'
            '   pedir el export cada mes — el maestro ya trae órdenes futuras (SAP las crea con antelación).\n'
            '   Regenerar junto con OPS_SAP_RESUMEN (mismo archivo fuente): scratchpad/gen_ops_por_orden.py. */\n')
    f.write('const OPS_SAP_POR_ORDEN = ' + json.dumps(por_orden, ensure_ascii=False, separators=(',', ':')) + ';\n')

print('órdenes', len(por_orden), '| operaciones', sum(len(v) for v in por_orden.values()))
