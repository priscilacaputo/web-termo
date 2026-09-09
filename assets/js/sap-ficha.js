/* ─── sapFichaHTML — bloque "Datos de SAP (IH08)" para los modales ───────
   Toma lo que trae el maestro EQUIPOS_SAP (export IH08) y lo muestra en la
   ficha técnica de cualquier sección. Sirve sobre todo para los equipos
   dados de alta hace poco cuyas fichas de la web están casi vacías
   (ej. AAC9433). Devuelve '' si el equipo no está en el maestro o no
   aporta ningún dato nuevo. */
(function () {
  const IDX = {};
  const PLAN_IDX = {};
  function build() {
    if (typeof EQUIPOS_SAP !== 'undefined') {
      EQUIPOS_SAP.forEach((e) => { if (e && e.equipo) IDX[String(e.equipo).toUpperCase()] = e; });
    }
    if (typeof PLANES_SAP !== 'undefined') {
      PLANES_SAP.forEach((p) => {
        if (!p || !p.equipo) return;
        const k = String(p.equipo).toUpperCase();
        (PLAN_IDX[k] || (PLAN_IDX[k] = [])).push(p);
      });
    }
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
  window.getPlanesEquipo = function (cod) {
    return cod ? (PLAN_IDX[String(cod).toUpperCase()] || []) : [];
  };

  function planesBlock(cod) {
    const ps = window.getPlanesEquipo(cod);
    if (!ps.length) return '';
    const filas = ps.map((p) => {
      const per = p.realBucket && !/s\/fechas/.test(p.realBucket)
        ? p.realBucket + (p.realDias ? ` (~${p.realDias}d)` : '')
        : (p.declara || '—');
      const prox = p.proxima ? ` · próxima ${p.proxima}` : '';
      const alerta = p.desajuste ? ' ⚠️' : '';
      return `<div class="modal-field full">
        <span class="modal-field-label">Pos. ${p.pos}${alerta}</span>
        <span class="modal-field-value">${String(p.desc || '').replace(/[&<>]/g, '')} — <strong>${per}</strong>${prox}</span>
      </div>`;
    }).join('');
    return `<div style="margin-top:20px;padding-top:20px;border-top:2px solid var(--color-border)">
      <h4 style="color:var(--color-navy);font-weight:700;margin-bottom:12px;font-size:14px">🔧 Plan preventivo (SAP · IP24)</h4>
      ${filas}
    </div>`;
  }

  window.sapFichaHTML = function (cod) {
    const e = window.getEquipoSAP(cod);
    let out = '';
    if (e) {
      const rows = [
        field('N° de serie', e.nSerie, { mono: true }),
        field('N° de pieza / fabricante', e.nParte, { mono: true }),
        field('Denominación de tipo (SAP)', e.tipoDenom, { mono: true }),
        field('Fecha puesta en servicio', e.serv),
        field('Equipo superior', e.equipoSup, { mono: true }),
        field('Status en SAP', e.status ? (STATUS_TXT[e.status] || e.status) : ''),
      ].join('');
      if (rows) {
        out += `<div style="margin-top:20px;padding-top:20px;border-top:2px solid var(--color-border)">
          <h4 style="color:var(--color-navy);font-weight:700;margin-bottom:12px;font-size:14px">🗂️ Datos de SAP (IH08)</h4>
          ${rows}
        </div>`;
      }
    }
    out += planesBlock(cod);
    out += otsBlock(cod);
    return out;
  };

  function otsBlock(cod) {
    if (typeof OTS_SAP_POR_EQUIPO === 'undefined') return '';
    const o = OTS_SAP_POR_EQUIPO[String(cod || '').toUpperCase()];
    if (!o) return '';
    const partes = [`<strong>${o.n}</strong> OT` + (o.n === 1 ? '' : 's') + ' (últ. 2 años)'];
    if (o.abiertas) partes.push(`${o.abiertas} abierta${o.abiertas === 1 ? '' : 's'}`);
    if (o.correctivas) partes.push(`${o.correctivas} correctiva${o.correctivas === 1 ? '' : 's'}`);
    if (o.ult) partes.push(`última ${o.ult}`);
    return `<div style="margin-top:20px;padding-top:20px;border-top:2px solid var(--color-border)">
      <h4 style="color:var(--color-navy);font-weight:700;margin-bottom:12px;font-size:14px">🧾 Órdenes de trabajo (SAP · IW38)</h4>
      <div class="modal-field full"><span class="modal-field-value">${partes.join(' · ')}</span></div>
    </div>`;
  }
})();
