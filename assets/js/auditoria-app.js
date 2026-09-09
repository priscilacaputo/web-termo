/* ─── Auditoría SAP — Inventario de equipos ────────────────────────
   Cruza EQUIPOS_SAP (maestro, export IH08) contra las fichas temáticas
   (AAC_DATA, BOMBAS_DATA, …) para responder: ¿qué está dado de alta en
   SAP, qué tiene ficha en la web y qué no reconcilia?

   Alcance actual = dimensión "Inventario". Las otras dimensiones
   (planes, periodicidad, materiales/stock) quedan pendientes de sus
   exports (IP16 / IA08 / IW38+componentes / MB52).

   La "Ubicación técnica" se toma como correcta por decisión del
   2026-09-08 y no se audita como campo. */

(function () {
  const $ = (id) => document.getElementById(id);

  /* ── Fuentes de fichas temáticas (mismo criterio que estado-app).
     Ojo: las *_DATA se declaran con `const` a nivel módulo, así que NO
     quedan colgadas de `window` — hay que referenciarlas por nombre. ── */
  const arr = (v) => (Array.isArray(v) ? v : []);
  const FICHAS = [
    { id: 'aac',         get: () => (typeof AAC_DATA         !== 'undefined' ? arr(AAC_DATA)         : []) },
    { id: 'patio',       get: () => (typeof PATIO_DATA       !== 'undefined' ? arr(PATIO_DATA)       : []) },
    { id: 'mangas',      get: () => (typeof MANGAS_DATA      !== 'undefined' ? arr(MANGAS_DATA)      : []) },
    { id: 'ascensores',  get: () => (typeof ASCENSORES_DATA  !== 'undefined' ? arr(ASCENSORES_DATA)  : []) },
    { id: 'escaleras',   get: () => (typeof ESCALERAS_DATA   !== 'undefined' ? arr(ESCALERAS_DATA)   : []) },
    { id: 'extractores', get: () => (typeof EXTRACTORES_DATA !== 'undefined' ? arr(EXTRACTORES_DATA) : []) },
    { id: 'persianas',   get: () => (typeof PERSIANAS_DATA   !== 'undefined' ? arr(PERSIANAS_DATA)   : []) },
    { id: 'cortinas',    get: () => (typeof CORTINAS_DATA    !== 'undefined' ? arr(CORTINAS_DATA)    : []) },
    { id: 'bombas',      get: () => (typeof BOMBAS_DATA      !== 'undefined' ? arr(BOMBAS_DATA)      : []) },
    { id: 'puertas',     get: () => (typeof PUERTAS_DATA     !== 'undefined' ? arr(PUERTAS_DATA)     : []) },
    { id: 'ecas',        get: () => (typeof ECAS_DATA        !== 'undefined' ? arr(ECAS_DATA)        : []) },
    { id: 'otros',       get: () => (typeof OTROS_DATA       !== 'undefined' ? arr(OTROS_DATA)       : []) },
    { id: 'flota',       get: () => (typeof FLOTA_DATA       !== 'undefined' ? arr(FLOTA_DATA)       : []) },
  ];
  const getMaestro = () => (typeof EQUIPOS_SAP !== 'undefined' ? arr(EQUIPOS_SAP) : []);

  /* ── Prefijo → familia legible ── */
  const FAMILIA = {
    AAC: 'Aire acondicionado', UTA: 'Aire acondicionado (UTA)', ACO: 'Cortinas de aire',
    MBO: 'Bombas', MBA: 'Balanzas', MEQ: 'Patio de valijas (BHS)', ARC: 'Patio de valijas (BHS)',
    MAN: 'Mangas de embarque', MAS: 'Ascensores', MES: 'Escaleras mecánicas',
    EMO: 'Extractores / Ventiladores', CPN: 'Campanas de extracción',
    MCD: 'Persianas de gatera', PPA: 'Puertas automáticas', PAA: 'Puertas automáticas',
    ECA: 'Incendios (ECA)', ECC: 'Incendios — rociadores (ECC)', VAL: 'Válvulas',
    TNQ: 'Tanques', ATQ: 'Termotanques', GAS: 'Medición energía', CAU: 'Medición energía',
    AUT: 'Autoelevadores', AVO: 'Flota vehicular', HER: 'Cajas de herramientas',
    CMA: 'Compresores', CTA: 'Compresores / Tableros', MBR: 'Barreras',
  };
  const prefixOf = (code) => (String(code).match(/^[A-Za-z]+/) || ['?'])[0].toUpperCase();
  // Código de objeto técnico = 2-5 letras + dígitos (MEQ1078, AAC130…).
  // Devuelve '' si el valor no parece un código (p.ej. "ECA21 Valvula Sprinkler 021" → ECA21).
  const tokenOf  = (code) => {
    const m = String(code || '').match(/^([A-Za-z]{2,5}\d+)/);
    return m ? m[1].toUpperCase() : '';
  };
  const familiaOf = (code) => FAMILIA[prefixOf(code)] || prefixOf(code);

  /* ── Checklist de dimensiones de la auditoría ── */
  const DIMENSIONES = [
    { dim: 'Inventario de equipos', estado: 'curso',
      nota: 'Cruce del export IH08 contra las fichas de la web (abajo).' },
    { dim: 'Ubicación técnica', estado: 'ok',
      nota: 'Marcada como correcta (decisión 2026-09-08). No se audita el campo.' },
    { dim: 'Planes y asignación a equipo', estado: 'pendiente',
      nota: 'Falta export IP16 / IP24 + hojas de ruta (IA08).' },
    { dim: 'Periodicidad de los planes', estado: 'pendiente',
      nota: 'Falta el ciclo de cada plan + historial de OT correctivas para contrastar.' },
    { dim: 'Materiales de OT y stock', estado: 'parcial',
      nota: 'Pañol → "Repuestos críticos" ya cubre parte. Falta IW38 con componentes + MB52 completo.' },
  ];
  const EST_META = {
    ok:        { label: 'OK',          cls: 'ok' },
    curso:     { label: 'En curso',    cls: 'curso' },
    parcial:   { label: 'Parcial',     cls: 'parcial' },
    pendiente: { label: 'Pendiente',   cls: 'pend' },
  };

  /* ── Observaciones de calidad de datos (revisar con SAP) ── */
  const OBSERVACIONES = [
    'Status "AEQS": son sub-equipos montados sobre un equipo superior (splits de manga, UTAs de núcleo, bombas de grupo…). Es correcto que sigan en sus secciones — no son un hallazgo.',
    'Status "MONT NOAC PTBO": marcados para baja. Ya se sacaron de las secciones de Equipos e Instalaciones; quedan solo en este maestro. Los "MONT PTBO" (AVO219, MBR001) quedan pendientes de revisar.',
    'Incendios: la web usa códigos ECA1–ECA27 (propios); SAP los tiene como ECC054–ECC101 y ECC556–ECC561. Hay que mapear ECA ↔ ECC.',
    'Persianas de gatera: las fichas MCD100–MCD135 no aparecen en este export de SAP. Confirmar si están de alta con otro código o si faltan crear.',
    'HER0778 / HER0875 / HER0906 / HER0926 / HER0956: dadas de alta como "equipo" en SAP pero son cajas de herramientas asignadas a personas. Revisar si corresponde que sean objetos técnicos.',
    'Familias sin sección propia en la web (viven solo en el maestro): campanas CPN, válvulas VAL, tanques TNQ/ATQ, medidores GAS/CAU, autoelevador AUT.',
  ];

  /* ── Estado ── */
  let ROWS = [];              // filas enriquecidas del maestro
  let GHOST = [];             // en la web, sin alta en este export
  let fFamilia = '';
  let fSoloSinFicha = false;
  let fSoloNoMont = false;
  let fQuery = '';
  let sortCol = 'equipo';
  let sortDir = 'asc';

  function build() {
    const maestro = getMaestro();
    if (!maestro.length) return;

    // set de códigos con ficha temática
    const conFicha = new Set();
    FICHAS.forEach((f) => f.get().forEach((e) => {
      const t = e && e.equipo ? tokenOf(e.equipo) : '';
      if (t) conFicha.add(t);
    }));

    const sapSet = new Set(maestro.map((e) => tokenOf(e.equipo)));

    ROWS = maestro.map((e) => {
      const tok = tokenOf(e.equipo);
      const st = e.status || '';
      return {
        equipo: e.equipo,
        denom: e.denom || '',
        familia: familiaOf(e.equipo),
        ubic: e.ubic || '',
        status: st,
        sup: e.equipoSup || '',
        // AEQS = sub-equipo montado sobre un equipo superior (válido, no es hallazgo).
        // NOAC / PTBO = marcado para baja → se saca de las secciones temáticas.
        estadoClase: st === 'MONT' ? 'ok' : /AEQS/.test(st) ? 'aeqs' : 'baja',
        ficha: conFicha.has(tok) ? 'temática' : 'maestro',
        serv: e.serv || '',
      };
    });

    // ghost: códigos en fichas temáticas que no están en el maestro SAP
    const seen = new Set();
    GHOST = [];
    FICHAS.forEach((f) => f.get().forEach((e) => {
      if (!e || !e.equipo) return;
      const tok = tokenOf(e.equipo);
      if (!tok || sapSet.has(tok) || seen.has(tok)) return;
      seen.add(tok);
      GHOST.push({ equipo: tok, denom: e.denominacion || e.denom || '', familia: familiaOf(tok), seccion: f.id });
    }));
    GHOST.sort((a, b) => a.equipo.localeCompare(b.equipo));
  }

  /* ── Render ── */
  function render() {
    const host = $('auditoria-content');
    if (!host) return;
    if (!ROWS.length) {
      host.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div>
        <p>No se pudo cargar el maestro <code>EQUIPOS_SAP</code>.</p></div>`;
      return;
    }

    const total = ROWS.length;
    const conFicha = ROWS.filter((r) => r.ficha === 'temática').length;
    const soloMaestro = total - conFicha;
    const aeqs = ROWS.filter((r) => r.estadoClase === 'aeqs').length;
    const baja = ROWS.filter((r) => r.estadoClase === 'baja').length;

    $('auditoria-stats').innerHTML = [
      card('Alta en SAP', total, '#0096d6', 'Equipos en el export IH08 (centro AEP)'),
      card('Con ficha temática', conFicha, '#10b981', 'Aparecen en una sección de la web'),
      card('Solo en el maestro', soloMaestro, '#f59e0b', 'Sin sección temática — visibles acá'),
      card('En la web sin alta SAP', GHOST.length, '#dc2626', 'Revisar bajas / renombres'),
      card('AEQS · sobre otro equipo', aeqs, '#6366f1', 'Sub-equipo montado en un equipo superior — OK'),
      card('NOAC / PTBO · revisar', baja, '#dc2626', 'Marcados para baja en SAP'),
    ].join('');

    host.innerHTML = `
      ${checklistHTML()}
      ${observacionesHTML()}

      <div class="table-card" style="margin-top:24px">
        <div style="padding:16px 16px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <input type="text" id="aud-search" class="search-input" style="max-width:280px"
                 placeholder="Buscar equipo, denominación, ubicación…" value="${esc(fQuery)}" />
          <select id="aud-familia" class="filter-select">
            <option value="">Todas las familias</option>
            ${[...new Set(ROWS.map((r) => r.familia))].sort().map((f) =>
              `<option value="${esc(f)}"${f === fFamilia ? ' selected' : ''}>${esc(f)}</option>`).join('')}
          </select>
          <label class="panol-checkbox"><input type="checkbox" id="aud-sinficha"${fSoloSinFicha ? ' checked' : ''}/> Solo sin ficha temática</label>
          <label class="panol-checkbox"><input type="checkbox" id="aud-nomont"${fSoloNoMont ? ' checked' : ''}/> Solo NOAC / PTBO</label>
          <button class="mant-tab" id="aud-export" style="margin-left:auto">⬇ Exportar Excel</button>
        </div>
        <div class="table-wrap" style="margin-top:12px">
          <table>
            <thead><tr>
              ${th('equipo', 'Equipo')}${th('denom', 'Denominación')}${th('familia', 'Familia')}
              ${th('ubic', 'Ubicación técnica')}${th('status', 'Status')}${th('ficha', 'Ficha')}${th('serv', 'Alta')}
            </tr></thead>
            <tbody id="aud-tbody"></tbody>
          </table>
        </div>
        <div class="table-footer" id="aud-count"></div>
      </div>
    `;

    wire();
    renderRows();
  }

  function card(label, value, color, sub) {
    return `<div class="stat-card" style="--stat-color:${color}">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
      <span style="font-size:11px;color:var(--color-muted)">${sub}</span>
    </div>`;
  }

  function checklistHTML() {
    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Estado de la auditoría · barrido de SAP
      </div>
      <div style="padding:6px 0">
      ${DIMENSIONES.map((d) => {
        const m = EST_META[d.estado];
        return `<div style="display:flex;gap:12px;align-items:flex-start;padding:11px 16px;border-bottom:1px solid var(--color-surface)">
          <span class="aud-pill aud-${m.cls}">${m.label}</span>
          <div>
            <div style="font-weight:700;font-size:13px">${d.dim}</div>
            <div style="font-size:12px;color:var(--color-muted)">${d.nota}</div>
          </div>
        </div>`;
      }).join('')}
      </div>
    </div>`;
  }

  function observacionesHTML() {
    const ghostByFam = {};
    GHOST.forEach((g) => { ghostByFam[g.familia] = (ghostByFam[g.familia] || 0) + 1; });
    const famLine = Object.entries(ghostByFam).sort((a, b) => b[1] - a[1])
      .map(([f, n]) => `${f}: ${n}`).join(' · ');

    return `<div class="table-card">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Inconsistencias a revisar con SAP
      </div>
      <ul style="margin:0;padding:14px 16px 14px 34px;font-size:12.5px;line-height:1.7;color:var(--color-text)">
        ${OBSERVACIONES.map((o) => `<li>${esc(o)}</li>`).join('')}
        ${GHOST.length ? `<li><strong>${GHOST.length} códigos en la web sin alta en este export</strong> — ${esc(famLine)}.</li>` : ''}
      </ul>
    </div>`;
  }

  function th(col, label) {
    const cls = sortCol === col ? `sortable sort-${sortDir}` : 'sortable';
    return `<th class="${cls}" data-col="${col}">${label} <span class="sort-arrow"></span></th>`;
  }

  function filtered() {
    const q = fQuery.trim().toLowerCase();
    let out = ROWS.filter((r) => {
      if (fFamilia && r.familia !== fFamilia) return false;
      if (fSoloSinFicha && r.ficha !== 'maestro') return false;
      if (fSoloNoMont && r.estadoClase !== 'baja') return false;
      if (q) {
        const hay = `${r.equipo} ${r.denom} ${r.ubic} ${r.familia} ${r.status}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    out.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }

  function renderRows() {
    const rows = filtered();
    const tb = $('aud-tbody');
    if (!tb) return;
    if (!rows.length) {
      tb.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🔍</div>
        <p>Sin equipos con esos filtros.</p></div></td></tr>`;
    } else {
      tb.innerHTML = rows.map((r) => `<tr>
        <td><span class="equipo-tag">${esc(r.equipo)}</span></td>
        <td>${esc(r.denom) || '<span class="no-data">—</span>'}</td>
        <td>${esc(r.familia)}</td>
        <td><span class="num-text" title="${esc(r.ubic)}">${esc(r.ubic) || '<span class="no-data">—</span>'}</span></td>
        <td>${r.estadoClase === 'ok'
              ? '<span class="aud-pill aud-ok">MONT</span>'
              : r.estadoClase === 'aeqs'
              ? `<span class="aud-pill aud-curso" title="Montado sobre ${esc(r.sup) || 'un equipo superior'}">${esc(r.status)}</span>`
              : `<span class="aud-pill aud-warn">${esc(r.status) || '—'}</span>`}</td>
        <td>${r.ficha === 'temática'
              ? '<span class="aud-pill aud-ok">temática</span>'
              : '<span class="aud-pill aud-parcial">maestro</span>'}</td>
        <td class="anio-text">${esc(r.serv) || '—'}</td>
      </tr>`).join('');
    }
    $('aud-count').textContent =
      `${rows.length} de ${ROWS.length} equipos · ${rows.filter((r) => r.ficha === 'maestro').length} sin ficha temática en la vista`;
  }

  function wire() {
    const s = $('aud-search');
    if (s) s.oninput = debounce(() => { fQuery = s.value; renderRows(); }, 180);
    const fam = $('aud-familia');
    if (fam) fam.onchange = () => { fFamilia = fam.value; renderRows(); };
    const sf = $('aud-sinficha');
    if (sf) sf.onchange = () => { fSoloSinFicha = sf.checked; renderRows(); };
    const nm = $('aud-nomont');
    if (nm) nm.onchange = () => { fSoloNoMont = nm.checked; renderRows(); };
    const ex = $('aud-export');
    if (ex) ex.onclick = doExport;
    document.querySelectorAll('#auditoria-content th.sortable').forEach((el) => {
      el.onclick = () => {
        const c = el.dataset.col;
        if (sortCol === c) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortCol = c; sortDir = 'asc'; }
        render();
      };
    });
  }

  function doExport() {
    const cols = [
      { key: 'equipo', header: 'Equipo' },
      { key: 'denom', header: 'Denominación' },
      { key: 'familia', header: 'Familia' },
      { key: 'ubic', header: 'Ubicación técnica' },
      { key: 'status', header: 'Status SAP' },
      { key: 'sup', header: 'Equipo superior' },
      { key: 'ficha', header: 'Ficha en la web' },
      { key: 'serv', header: 'Fecha alta' },
    ];
    const fname = `AEP_Auditoria_Inventario_${new Date().toISOString().slice(0, 10)}`;
    if (typeof exportToExcel === 'function') exportToExcel(filtered(), cols, fname);
  }

  function debounce(fn, ms) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* ── Init: render la primera vez que se entra a la página ── */
  let done = false;
  function maybeRender() {
    const page = $('page-auditoria');
    if (!page || page.classList.contains('hidden')) return;
    if (done) return;
    done = true;
    build();
    render();
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page="auditoria"], [data-mbn-page="auditoria"]').forEach((el) =>
      el.addEventListener('click', () => setTimeout(maybeRender, 0)));
    maybeRender();
  });
  window.addEventListener('load', maybeRender);
})();
