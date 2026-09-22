# -*- coding: utf-8 -*-
import os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
p = os.path.join(root, 'assets', 'js', 'planificador-app.js')
s = open(p, encoding='utf-8').read()


def rep(old, new, count=1):
    global s
    assert old in s, old[:70]
    s = s.replace(old, new, count)


# 1) estado
rep("  hidrolavado: false,\n  ots: [],", "  hidrolavado: false,\n  agrupar: true,         // juntar condensadora + interiores del mismo sistema en una sola OT\n  ots: [],")

# 2) funciones de agrupación
FN = r'''/* ════════ Sistemas de aire: condensadora + interiores en una sola OT ════════
   SAP genera una OT por equipo, así que la unidad exterior y sus unidades interiores salen en
   OTs distintas. AAC_SISTEMAS (aac-sistemas-data.js) dice qué equipos son del mismo sistema:
   sus preventivos del mes se juntan en UNA tarea del calendario (mismo día, guardia y hora). La
   tarea guarda las OTs originales en `miembros` (para exportarlas y para desagrupar). */
let _planSistIdx = null;
function planSistemaDe(equipo) {
  if (typeof AAC_SISTEMAS === 'undefined') return null;
  if (!_planSistIdx) {
    _planSistIdx = new Map();
    AAC_SISTEMAS.forEach(sis => { _planSistIdx.set(sis.cabeza, sis); sis.miembros.forEach(m => _planSistIdx.set(m, sis)); });
  }
  return _planSistIdx.get(String(equipo || '').trim().toUpperCase()) || null;
}
function planFusionarSistema(sis, its) {
  const orden = its.slice().sort((a, b) =>
    ((b.equipo === sis.cabeza) - (a.equipo === sis.cabeza)) || String(a.equipo).localeCompare(String(b.equipo), 'es', { numeric: true }));
  const base = orden[0];
  const conCab = orden.some(o => o.equipo === sis.cabeza);
  const nPers = Math.max(...orden.map(o => o.nPers || 1));
  /* Trabajo total (min-persona) repartido entre el máximo de técnicos que pide alguna de las OTs. */
  const trabajo = orden.reduce((t, o) => t + (o.duracionMin || 0) * (o.nPers || 1), 0);
  const duracionMin = Math.max(15, Math.ceil(trabajo / nPers / 5) * 5);
  const fuentes = new Set(orden.map(o => o.durFuente));
  const fijada = orden.find(o => o.pin && o.fecha && o.guardia);
  const ants = orden.map(o => o.antiguedadDias).filter(v => v != null);
  const g = Object.assign({}, base, {
    id: 'SIS#' + sis.id + '#' + (base.ot_num || Math.random().toString(36).slice(2, 8)),
    ot_num: orden.map(o => o.ot_num).filter(Boolean).join(' + '),
    denom: `${sis.nombre} — ${conCab ? 'condensadora + ' + (orden.length - 1) + ' interior' + (orden.length - 1 > 1 ? 'es' : '') : orden.length + ' interiores'} (mismo sistema)`,
    esAltura: orden.some(o => o.esAltura),
    duracionMin, nPers,
    durFuente: fuentes.size === 1 ? base.durFuente : 'estim',
    antiguedadDias: ants.length ? Math.max(...ants) : null,
    miembros: orden, sistemaId: sis.id,
    fecha: null, guardia: null, inicio: null, fin: null, pin: false,
  });
  if (fijada) Object.assign(g, { fecha: fijada.fecha, guardia: fijada.guardia, inicio: fijada.inicio, fin: fijada.fin, pin: true });
  return g;
}
function planAgruparSistemas(items) {
  const grupos = new Map();
  const salida = [];
  items.forEach(it => {
    const sis = (it.tipo === 'preventivo' && it.origen === 'mensual') ? planSistemaDe(it.equipo) : null;
    if (!sis) { salida.push(it); return; }
    if (!grupos.has(sis.id)) grupos.set(sis.id, { sis, its: [] });
    grupos.get(sis.id).its.push(it);
  });
  grupos.forEach(({ sis, its }) => salida.push(its.length < 2 ? its[0] : planFusionarSistema(sis, its)));
  return salida;
}
function planDesagrupar(ots) { return ots.flatMap(o => (o.miembros ? o.miembros : [o])); }
function planToggleAgrupar(on) {
  planState.agrupar = !!on;
  const sueltas = planDesagrupar(planState.ots);
  const mens = sueltas.filter(o => o.origen === 'mensual');
  const otras = sueltas.filter(o => o.origen !== 'mensual');
  /* al agrupar/desagrupar se vuelve a repartir (las fijadas con 📌 se respetan) */
  mens.forEach(o => { if (!o.pin) { o.fecha = null; o.guardia = null; o.inicio = null; o.fin = null; } });
  planState.ots = [...(planState.agrupar ? planAgruparSistemas(mens) : mens), ...otras];
  planDistribuir(); planSave(); renderPlanificador();
  const n = planState.ots.filter(o => o.miembros).length;
  planToast(planState.agrupar ? `🔗 ${n} sistema${n === 1 ? '' : 's'} agrupado${n === 1 ? '' : 's'} (condensadora + interiores en una sola OT).` : 'OTs desagrupadas: una por equipo.', 'success');
}

'''
rep("/* ════════ Carga del Excel mensual de OTs ════════ */", FN + "/* ════════ Carga del Excel mensual de OTs ════════ */")

# 3) al cargar el Excel
rep("      planState.ots = [...nuevas, ...patio];",
    "      const nAgrup = planState.agrupar !== false ? planAgruparSistemas(nuevas) : nuevas;\n      planState.ots = [...nAgrup, ...patio];")
rep("      planToast(`✓ ${nuevas.length} OTs del mes cargadas y distribuidas.`, 'success');",
    "      const nSis = planState.ots.filter(o => o.miembros).length;\n      planToast(`✓ ${nuevas.length} OTs del mes cargadas y distribuidas.` + (nSis ? `\\n🔗 ${nSis} sistema${nSis === 1 ? '' : 's'} de aire: condensadora + interiores juntos en una sola tarea.` : ''), 'success');")

# 4) tarjeta
rep("      const fuTxt = o.durFuente === 'sap'",
    "      const miem = o.miembros ? ' · OTs juntas: ' + o.miembros.map(m => m.equipo + (m.ot_num ? ' (' + m.ot_num + ')' : '')).join(', ') : '';\n      const fuTxt = o.durFuente === 'sap'")
rep("${o.antiguedadDias != null ? ' · lleva ' + o.antiguedadDias + ' d' : ''}\">\n          <span class=\"plan-ot-eq\">${o.equipo}${o.pin ? ' 📌' : ''}",
    "${o.antiguedadDias != null ? ' · lleva ' + o.antiguedadDias + ' d' : ''}${miem}\">\n          <span class=\"plan-ot-eq\">${o.equipo}${o.miembros ? ' 🔗' + o.miembros.length : ''}${o.pin ? ' 📌' : ''}")

# 5) export: una fila por OT original
old_rows = "  const rows = [...planState.ots].sort((a, b) =>"
new_rows = "  const rows = planExpandirGrupos([...planState.ots]).sort((a, b) =>"
rep(old_rows, new_rows)
rep("    'OT': o.ot_num || '', 'Equipo': o.equipo, 'Denominación': o.denom || '',",
    "    'OT': o.ot_num || '', 'Equipo': o.equipo, 'Denominación': o.denom || '',\n    'Sistema (OTs juntas)': o.grupoDe || '',")
rep("function planExport() {", r'''/* Una fila por OT original: las de un sistema comparten día, guardia y hora. */
function planExpandirGrupos(ots) {
  return ots.flatMap(o => o.miembros
    ? o.miembros.map(m => Object.assign({}, m, {
        fecha: o.fecha, guardia: o.guardia, turno: o.turno, inicio: o.inicio, fin: o.fin, zona: o.zona,
        nPersUsadas: o.nPersUsadas, motivoSinUbicar: o.motivoSinUbicar, grupoDe: o.equipo + ' (' + o.miembros.length + ' equipos)',
      }))
    : [o]);
}
function planExport() {''')

# 6) cableado del checkbox
rep("  document.getElementById('plan-export-btn').addEventListener('click', planExport);",
    "  document.getElementById('plan-export-btn').addEventListener('click', planExport);\n"
    "  const chkAgr = document.getElementById('plan-agrupar-chk');\n"
    "  if (chkAgr) {\n"
    "    chkAgr.checked = planState.agrupar !== false;\n"
    "    chkAgr.addEventListener('change', () => planToggleAgrupar(chkAgr.checked));\n"
    "  }")
open(p, 'w', encoding='utf-8').write(s)

# index.html: checkbox + script
ph = os.path.join(root, 'index.html')
h = open(ph, encoding='utf-8').read()
old = '<button class="export-btn" id="plan-export-btn">⬇ Exportar plan</button>'
assert old in h
h = h.replace(old, old + '\n          <label class="plan-adhoc-alt" title="Junta en una sola tarea los preventivos de la unidad exterior/condensadora y de sus unidades interiores"><input type="checkbox" id="plan-agrupar-chk" checked /> 🔗 Agrupar condensadora + interiores</label>')
if 'aac-sistemas-data.js' not in h:
    a = '<script src="assets/js/planificador-data.js'
    i = h.index(a)
    h = h[:i] + '<script src="assets/js/aac-sistemas-data.js?v=1"></script>\n  ' + h[i:]
open(ph, 'w', encoding='utf-8').write(h)
print('ok')
