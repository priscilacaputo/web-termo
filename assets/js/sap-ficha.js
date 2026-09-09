/* ─── sapFichaHTML — bloque "Datos de SAP (IH08)" para los modales ───────
   Toma lo que trae el maestro EQUIPOS_SAP (export IH08) y lo muestra en la
   ficha técnica de cualquier sección. Sirve sobre todo para los equipos
   dados de alta hace poco cuyas fichas de la web están casi vacías
   (ej. AAC9433). Devuelve '' si el equipo no está en el maestro o no
   aporta ningún dato nuevo. */
(function () {
  const IDX = {};
  function build() {
    if (typeof EQUIPOS_SAP === 'undefined') return;
    EQUIPOS_SAP.forEach((e) => { if (e && e.equipo) IDX[String(e.equipo).toUpperCase()] = e; });
  }
  build();

  const STATUS_TXT = {
    'MONT': 'Montado / operativo',
    'AEQS': 'Montado sobre un equipo superior',
    'MONT NOAC PTBO': 'Marcado para baja (NOAC PTBO)',
    'MONT PTBO': 'Marcado para baja (PTBO)',
  };

  function field(label, value, opts) {
    if (value === undefined || value === null || value === '') return '';
    const full = opts && opts.full ? ' full' : '';
    const mono = opts && opts.mono ? ' mono' : '';
    const v = String(value).replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return `<div class="modal-field${full}">
      <span class="modal-field-label">${label}</span>
      <span class="modal-field-value${mono}">${v}</span>
    </div>`;
  }

  // Exponer global
  window.getEquipoSAP = function (cod) {
    return cod ? IDX[String(cod).toUpperCase()] || null : null;
  };

  window.sapFichaHTML = function (cod) {
    const e = window.getEquipoSAP(cod);
    if (!e) return '';
    const rows = [
      field('N° de serie', e.nSerie, { mono: true }),
      field('N° de pieza / fabricante', e.nParte, { mono: true }),
      field('Denominación de tipo (SAP)', e.tipoDenom, { mono: true }),
      field('Fecha puesta en servicio', e.serv),
      field('Equipo superior', e.equipoSup, { mono: true }),
      field('Status en SAP', e.status ? (STATUS_TXT[e.status] || e.status) : ''),
    ].join('');
    if (!rows) return '';
    return `<div style="margin-top:20px;padding-top:20px;border-top:2px solid var(--color-border)">
      <h4 style="color:var(--color-navy);font-weight:700;margin-bottom:12px;font-size:14px">🗂️ Datos de SAP (IH08)</h4>
      ${rows}
    </div>`;
  };
})();
