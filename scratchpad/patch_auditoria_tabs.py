# -*- coding: utf-8 -*-
import os, re
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()


def cut(s, start, end, keep_end=True, label=''):
    a = s.index(start)
    b = s.index(end, a)
    return s[:a] + s[b:]


# 1) checklist de dimensiones (redundante con el Diagnóstico) + su función
s = cut(s, "  /* ── Checklist de dimensiones de la auditoría ── */", "  /* ── Observaciones de calidad de datos")
s = cut(s, "  function checklistHTML() {", "  function observacionesHTML() {")

# 2) observaciones: solo las accionables
a = s.index("  const OBSERVACIONES = [")
b = s.index("  ];", a) + len("  ];")
s = s[:a] + """  const OBSERVACIONES = [
    'Incendios: la web usa códigos ECA1–ECA27 (propios); SAP los tiene como ECC054–ECC101 y ECC556–ECC561. Hay que mapear ECA ↔ ECC.',
    'HER0778 / HER0875 / HER0906 / HER0926 / HER0956: dadas de alta como "equipo" en SAP pero son cajas de herramientas asignadas a personas. Revisar si corresponde que sean objetos técnicos.',
    'AVO219 (status "MONT PTBO") sigue pendiente de revisar.',
    'Campanas CPN: solo CPN15 y CPN16 tienen plan "MP 1M Campanas y sistema de extracción" en IP24; las otras 16 no tienen ninguno (probable: falta asignarles el mismo plan mensual).',
  ];""" + s[b:]

# 3) MB51: sin "materiales con más consumo"
s = cut(s, "        ${heading('Materiales con más consumo (261)')}", "        ${heading('Faltantes — consumo alto")
s = re.sub(r"\n    const maxTop = Math\.max\(1, \.\.\.\(B\.topConsumo \|\| \[\]\)\.map\(\(x\) => x\.u\)\);", "", s, count=1)

# 4) MM60: sin "materiales por indicador ABC"
s = cut(s, "        ${heading('Materiales por indicador ABC')}", "        ${(M.bomSinCodigoReal || []).length ? heading(")

# 5) OTs: sin "creadas por trimestre" ni "equipos con más OTs"
s = cut(s, "        ${tri.length ? heading('OTs preventivas creadas por trimestre')", "        ${heading('Equipos con plan pero SIN ninguna OT")

# 6) Planes: sin distribución por periodicidad/familia ni catálogo de estrategias
s = cut(s, "        ${heading('Periodicidad real')}", "        ${desaj.length ? heading('Desajuste nombre del plan")
s = cut(s, "        ${(P.estrategias || []).length ? heading('Estrategias de mantenimiento (IP11)')",
        "        <div style=\"margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px\">\n          Cumplimiento")

# 7) Diagnóstico: nota final fuera; nuevos checks; enlace "ver detalle"
s = cut(s, "        <div style=\"margin-top:12px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:11.5px;color:var(--color-muted)\">\n          El check \"el plan corresponde al tipo\"",
        "      </div>\n    </div>`;\n  }\n\n  function analizarSinPlan") if False else s
m = re.search(r"\n        <div style=\"margin-top:12px;padding:10px 12px;background:var\(--color-surface\);border-radius:8px;font-size:11\.5px;color:var\(--color-muted\)\">\n          El check \"el plan corresponde al tipo\".*?</div>\n", s, re.S)
assert m, 'nota final del diagnóstico'
s = s[:m.start()] + "\n" + s[m.end():]

old_fila = """    const filaCheck = (est, titulo, detalle) => `<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--color-surface)">
      <span style="font-size:16px;line-height:1">${sem(est)}</span>
      <div><div style="font-weight:700;font-size:13px">${titulo}</div>
        <div style="font-size:12px;color:var(--color-muted)">${detalle}</div></div>
    </div>`;"""
new_fila = """    const filaCheck = (est, titulo, detalle, tab) => `<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--color-surface)">
      <span style="font-size:16px;line-height:1">${sem(est)}</span>
      <div style="flex:1"><div style="font-weight:700;font-size:13px">${titulo}</div>
        <div style="font-size:12px;color:var(--color-muted)">${detalle}</div></div>
      ${tab ? `<button class="mant-tab" style="align-self:center;white-space:nowrap" onclick="audGoTab('${tab}')">Ver detalle →</button>` : ''}
    </div>`;"""
assert old_fila in s
s = s.replace(old_fila, new_fila)

# enlaces en los checks existentes
s = s.replace("""          `${sinPlan} equipos operativos sin plan · ${sinEqAlta} planes sin equipo de alta · ${sobreBaja} planes sobre equipo de baja · ${posSinEq} posiciones sin equipo.`)}""",
              """          `${sinPlan} equipos operativos sin plan · ${sinEqAlta} planes sin equipo de alta · ${sobreBaja} planes sobre equipo de baja · ${posSinEq} posiciones sin equipo.`, 'planes')}""")
s = s.replace("""          `${P.posiciones - fueraPaq} de ${P.posiciones} posiciones coinciden con un paquete de su estrategia.`)}""",
              """          `${P.posiciones - fueraPaq} de ${P.posiciones} posiciones coinciden con un paquete de su estrategia.`, 'planes')}""")
old_ej = re.search(r"(\(O\.pctNotificadas \|\| 0\) >= 70 \? 'ok' : 'rev',\n\s+'Se ejecuta y se registra lo programado \(IW38\)',\n\s+`[^\n]*`)\)\}", s)
assert old_ej, 'check de ejecución'
s = s[:old_ej.end() - 2] + ", 'ots')}" + s[old_ej.end():]

NUEVOS = """
        ${(() => {
          const E = (typeof HDR_ESTANDAR !== 'undefined') ? HDR_ESTANDAR : null;
          const HP = (typeof hdrPuestosResumen === 'function') ? hdrPuestosResumen() : null;
          const B = (typeof MB51_RESUMEN !== 'undefined') ? MB51_RESUMEN : null;
          let h = '';
          if (E) {
            const g = E.grupos.filter((x) => x.conDetalle);
            const std = g.reduce((t, x) => t + x.nStd, 0), cub = g.reduce((t, x) => t + x.cub, 0);
            const pc = std ? Math.round(cub / std * 100) : 0;
            const bajos = g.filter((x) => x.nStd && x.cub / x.nStd < 0.6).map((x) => x.nombre);
            h += filaCheck(pc >= 85 ? 'ok' : (pc >= 60 ? 'rev' : 'mal'), 'La gama de tareas de SAP cumple el estándar del Manual de Mtto',
              `${pc}% de las tareas del estándar figuran en las hojas de ruta.` + (bajos.length ? ` Por debajo del 60%: ${bajos.join(', ')}.` : '') +
              ` ${E.sinHojaDeRuta.length} tipos del estándar no tienen hoja de ruta.`, 'hdr');
          }
          if (HP) {
            h += filaCheck(HP.planes === 0 ? 'ok' : 'rev', 'Los puestos de trabajo son solo AUX_TER / AUX_MEC / MOEX',
              HP.planes ? `${HP.planes} posiciones de plan (${HP.equipos} equipos) usan ${HP.puestos.join(', ')}.` : 'Ningún plan usa otros puestos.', 'ots');
          }
          if (B) {
            const fal = B.faltantesTotal != null ? B.faltantesTotal : (B.faltantes || []).length;
            const inm = (B.inmovilizado || {}).total || 0;
            h += filaCheck(fal === 0 ? 'ok' : 'rev', 'Hay stock de lo que se consume (MB52 / MB51)',
              `${fal} materiales con consumo alto y stock 0 · ${B.bajaCoberturaTotal != null ? B.bajaCoberturaTotal : (B.bajaCobertura || []).length} con cobertura menor a 1 mes · ${inm.toLocaleString('es-AR')} inmovilizados.`, 'mat');
          }
          return h;
        })()}
"""
anchor = "\n        ${mismatch.length ? heading('Planes de aire con tipo que no coincide"
assert anchor in s
s = s.replace(anchor, NUEVOS + anchor, 1)

# 8) pestañas
old_top = """      ${checklistHTML()}
      ${diagnosticoHTML()}
      ${planesHTML()}
      ${otsHTML()}
      ${mm60HTML()}
      ${mb51HTML()}
      ${observacionesHTML()}
      ${(typeof hdrAuditCardHTML === 'function') ? hdrAuditCardHTML() : ''}

      <div class="table-card" style="margin-top:24px" id="aud-tabla">"""
new_top = """      <div class="mant-tabs aud-tabs" style="margin-bottom:16px">
        ${AUD_TABS.map(([k, t]) => `<button class="mant-tab" data-tab="${k}" onclick="audGoTab('${k}')">${t}</button>`).join('')}
      </div>
      <section class="aud-pane" data-pane="resumen">${diagnosticoHTML()}</section>
      <section class="aud-pane" data-pane="planes">${planesHTML()}</section>
      <section class="aud-pane" data-pane="hdr">${(typeof hdrAuditCardHTML === 'function') ? hdrAuditCardHTML() : ''}</section>
      <section class="aud-pane" data-pane="ots">${otsHTML()}</section>
      <section class="aud-pane" data-pane="mat">${mm60HTML()}${mb51HTML()}</section>
      <section class="aud-pane" data-pane="equipos">
      ${observacionesHTML()}

      <div class="table-card" style="margin-top:24px" id="aud-tabla">"""
assert old_top in s
s = s.replace(old_top, new_top)
old_end = """        <div class="table-footer" id="aud-count"></div>
      </div>
    `;

    wire();
    renderRows();"""
new_end = """        <div class="table-footer" id="aud-count"></div>
      </div>
      </section>
    `;

    wire();
    renderRows();
    audGoTab(audTab);"""
assert old_end in s
s = s.replace(old_end, new_end)

old_fn = "  function render() {"
new_fn = """  /* ── Pestañas de la auditoría ── */
  const AUD_TABS = [['resumen', 'Resumen'], ['equipos', 'Equipos'], ['planes', 'Planes'], ['hdr', 'Hojas de ruta'], ['ots', 'Órdenes de trabajo'], ['mat', 'Materiales']];
  let audTab = 'resumen';
  window.audGoTab = function (k) {
    audTab = k;
    document.querySelectorAll('#auditoria-content .aud-pane').forEach((sec) => { sec.hidden = sec.dataset.pane !== k; });
    document.querySelectorAll('#auditoria-content .aud-tabs .mant-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === k));
    const st = $('auditoria-stats');
    if (st) st.style.display = k === 'equipos' ? '' : 'none';
    const tabs = document.querySelector('#auditoria-content .aud-tabs');
    if (tabs) tabs.scrollIntoView({ block: 'nearest' });
  };

  function render() {"""
assert old_fn in s
s = s.replace(old_fn, new_fn, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
