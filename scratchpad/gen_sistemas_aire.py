# -*- coding: utf-8 -*-
"""Arma los 'sistemas' de aire acondicionado: una unidad exterior/condensadora + sus unidades
interiores/evaporadoras (VRF y multi split), para agrupar sus preventivos en una sola OT.
SAP no tiene el vínculo (equipoSup vacío), así que se deduce de la denominación, la ubicación
técnica y la secuencia de códigos. Genera assets/js/aac-sistemas-data.js (AAC_SISTEMAS)."""
import os, re, json, subprocess, collections

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
JS = os.path.join(ROOT, 'assets', 'js')


def load(fn, name):
    code = ("const fs=require('fs');const vm=require('vm');const s=fs.readFileSync(%s,'utf8');"
            "const c=vm.createContext({});vm.runInContext(s.replace(/\\bconst %s\\b/,'var %s'),c);"
            "process.stdout.write(JSON.stringify(c.%s))" % (json.dumps(os.path.join(JS, fn)), name, name, name))
    return json.loads(subprocess.check_output(['node', '-e', code]).decode('utf-8'))


E = [e for e in load('equipos-sap-data.js', 'EQUIPOS_SAP')
     if e['equipo'].startswith('AAC') and (e.get('status') or '').startswith(('MONT', 'AEQS'))]
num = lambda e: int(re.sub(r'\D', '', e['equipo']) or 0)

EXT = re.compile(r'unidad ext|\bext\b|exterior|condensadora|\bU\.?C\b|multi split.*\bU\.C|^U\.C\b', re.I)
INT = re.compile(r'unidad int|\bint\b|interior|evaporadora|^U\.E\b|cassette|conducto|piso techo|\bpared\b', re.I)
SKIP = re.compile(r'^UTA|roof|chiller|split\s*-|autocontenid|split n|split de|split man', re.I)


def clase(e):
    d = e['denom'].strip()
    if SKIP.search(d):
        return None
    if re.search(r'^U\.C\b|unidad ext|exterior|\bext\b|condensadora|\bUC\b', d, re.I) and not re.search(r'\binterior\b|\bint\b', d, re.I):
        return 'ext'
    if INT.search(d):
        return 'int'
    return None


# Las unidades piso-techo (comedores, talleres) son equipos autónomos: no dependen de una condensadora de
# un multi split (la usuaria confirmó que AAC4116/AAC4117 no son de AAC4112). Van directo a 'sin exterior'.
PISO_TECHO = re.compile(r'piso techo', re.I)
piso_techo = [e['equipo'] for e in E if PISO_TECHO.search(e['denom']) and not SKIP.search(e['denom'])]
cand = sorted([(num(e), e, clase(e)) for e in E if clase(e) and e['equipo'] not in piso_techo], key=lambda x: x[0])
print(len(cand), 'candidatos:', collections.Counter(c for _, _, c in cand))

sistemas = []
# sin_par: equipo -> motivo. 'piso-techo' = autónomo, nunca va a tener condensadora asignada.
# 'pendiente-condensadora' = interior real que necesita que alguien confirme de qué condensadora es.
sin_par = {eq: 'piso-techo' for eq in piso_techo}
cur = None
pending = []          # interiores vistos antes de su exterior
for n, e, c in cand:
    if c == 'ext':
        # interiores 'colgados' antes de este exterior que comparten ubicación con él
        lead = [p for p in pending if p['ubic'] == e['ubic']]
        for p in lead:
            pending.remove(p)
        for p in pending:
            sin_par[p['equipo']] = 'pendiente-condensadora'   # interior sin exterior identificable
        pending = []
        cur = {'cabeza': e['equipo'], 'denom': e['denom'], 'ubic': e['ubic'], 'miembros': [p['equipo'] for p in lead],
               'conf': 'alta' if lead else 'media'}
        sistemas.append(cur)
    else:
        if cur and (e['ubic'] == cur['ubic'] or not pending) and n - int(re.sub(r'\D', '', cur['miembros'][-1] if cur['miembros'] else cur['cabeza'])) <= 3:
            cur['miembros'].append(e['equipo'])
            if e['ubic'] != cur['ubic']:
                cur['conf'] = 'media'
        else:
            pending.append(e)
for p in pending:
    sin_par[p['equipo']] = 'pendiente-condensadora'

# ── Corrección a mano de la usuaria (2026-09-22, "Sistemas_de_aire_condensadora_interiores
# corregido.xlsx"): revisó los 17 sistemas y sacó 2 interiores que NO correspondían. La usuaria
# confirmó (2026-09-22) que quedan PENDIENTES de asignar condensadora, no descartados. El resto
# de cada sistema quedó validado → conf 'alta'.
EXCLUIDOS_MANUAL = {
    'AAC2099': ['AAC2089'],   # Checkpoint: AAC2089 no es de este sistema, pendiente de asignar condensadora
    'AAC9412': ['AAC9414'],   # Customer service: AAC9414 no es de este sistema, pendiente de asignar condensadora
}
for cab, quitar in EXCLUIDOS_MANUAL.items():
    s = next((x for x in sistemas if x['cabeza'] == cab), None)
    if not s:
        continue
    for eq in quitar:
        if eq in s['miembros']:
            s['miembros'].remove(eq)
            sin_par[eq] = 'pendiente-condensadora'
for s in sistemas:
    if s['miembros']:
        s['conf'] = 'alta'   # validado a mano por la usuaria 2026-09-22

util = [s for s in sistemas if s['miembros']]
den = {e['equipo']: e['denom'] for e in E}
out = [{'id': 'SIS-' + s['cabeza'], 'nombre': s['denom'], 'cabeza': s['cabeza'], 'ubic': s['ubic'],
        'conf': s['conf'], 'miembros': s['miembros']} for s in util]
header = ('/* ─── AAC_SISTEMAS — sistemas de aire: unidad exterior/condensadora + unidades interiores ───\n'
          '   SAP no tiene el vínculo (equipoSup vacío): se deduce de la denominación, la ubicación técnica y la\n'
          '   secuencia de códigos (los interiores siguen a su exterior). conf "alta" = misma ubicación técnica;\n'
          '   "media" = solo por secuencia de códigos → revisar en Auditoría → Planes.\n'
          '   Lo usa el Planificador para juntar en una sola OT los preventivos de la condensadora y de sus\n'
          '   interiores. Regenerar: python scratchpad/gen_sistemas_aire.py */\n\n')
with open(os.path.join(JS, 'aac-sistemas-data.js'), 'w', encoding='utf-8') as f:
    f.write(header + 'const AAC_SISTEMAS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n\n')
    f.write('/* Equipos sin condensadora asociada. motivo: "piso-techo" = equipo autónomo, nunca va a\n'
            '   tener una (comedores/talleres); "pendiente-condensadora" = interior real cuya condensadora\n'
            '   todavía no está confirmada (AAC2089/AAC9414: la usuaria los sacó de un sistema erróneo el\n'
            '   2026-09-22 y pidió mantenerlos así hasta confirmar el real). */\n')
    f.write('const AAC_SIN_EXTERIOR = ' + json.dumps(
        [{'equipo': eq, 'denom': den[eq], 'motivo': mot} for eq, mot in sin_par.items()], ensure_ascii=False) + ';\n')
pendientes = sum(1 for m in sin_par.values() if m == 'pendiente-condensadora')
print(len(out), 'sistemas;', sum(len(x['miembros']) for x in out), 'interiores;', len(sin_par), 'sin exterior',
      '(', len(sin_par) - pendientes, 'piso-techo +', pendientes, 'pendientes)')
