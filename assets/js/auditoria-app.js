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
    { id: 'valvulas',    get: () => (typeof VALVULAS_DATA    !== 'undefined' ? arr(VALVULAS_DATA)    : []) },
    { id: 'campanas',    get: () => (typeof CAMPANAS_DATA    !== 'undefined' ? arr(CAMPANAS_DATA)    : []) },
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

  /* ── Observaciones de calidad de datos (revisar con SAP) ── */
  const OBSERVACIONES = [
    'Incendios: la web usa códigos ECA1–ECA27 (propios); SAP los tiene como ECC054–ECC101 y ECC556–ECC561. Hay que mapear ECA ↔ ECC.',
    'HER0778 / HER0875 / HER0906 / HER0926 / HER0956: dadas de alta como "equipo" en SAP pero son cajas de herramientas asignadas a personas. Revisar si corresponde que sean objetos técnicos.',
    'AVO219 (status "MONT PTBO") sigue pendiente de revisar.',
    'Campanas CPN: solo CPN15 y CPN16 tienen plan "MP 1M Campanas y sistema de extracción" en IP24; las otras 16 no tienen ninguno (probable: falta asignarles el mismo plan mensual).',
  ];

  /* ── Estado ── */
  let ROWS = [];              // filas enriquecidas del maestro
  let GHOST = [];             // en la web, sin alta en este export
  let fFamilia = '';
  let fCard = '';            // '' | 'ficha' | 'maestro' | 'ghost' | 'aeqs' | 'baja'
  let fQuery = '';
  let sortCol = 'equipo';
  let sortDir = 'asc';

  const CARD_LABEL = {
    ficha: 'Con ficha temática', maestro: 'Solo en el maestro',
    ghost: 'En la web sin alta SAP', aeqs: 'AEQS · sobre otro equipo',
    baja: 'NOAC / PTBO',
  };

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
  /* ── Pestañas de la auditoría ── */
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
      card('Alta en SAP · TER/MEC', total, '#0096d6', 'Equipos del IH08 en alcance TER/MEC — quita el filtro', ''),
      card('Con ficha temática', conFicha, '#10b981', 'Aparecen en una sección de la web', 'ficha'),
      card('Solo en el maestro', soloMaestro, '#f59e0b', 'Sin sección temática — visibles acá', 'maestro'),
      card('En la web sin alta SAP', GHOST.length, '#dc2626', 'Revisar bajas / renombres', 'ghost'),
      card('AEQS · sobre otro equipo', aeqs, '#6366f1', 'Sub-equipo montado en un equipo superior — OK', 'aeqs'),
      card('NOAC / PTBO · revisar', baja, '#dc2626', 'Marcados para baja en SAP', 'baja'),
    ].join('');

    host.innerHTML = `
      <div class="mant-tabs aud-tabs" style="margin-bottom:16px">
        ${AUD_TABS.map(([k, t]) => `<button class="mant-tab" data-tab="${k}" onclick="audGoTab('${k}')">${t}</button>`).join('')}
      </div>
      <section class="aud-pane" data-pane="resumen">${diagnosticoHTML()}</section>
      <section class="aud-pane" data-pane="planes">${planesHTML()}</section>
      <section class="aud-pane" data-pane="hdr">${(typeof hdrAuditCardHTML === 'function') ? hdrAuditCardHTML() : ''}</section>
      <section class="aud-pane" data-pane="ots">${otsHTML()}</section>
      <section class="aud-pane" data-pane="mat">${mm60HTML()}${mb51HTML()}</section>
      <section class="aud-pane" data-pane="equipos">
      ${observacionesHTML()}

      <div class="table-card" style="margin-top:24px" id="aud-tabla">
        <div style="padding:16px 16px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <input type="text" id="aud-search" class="search-input" style="max-width:280px"
                 placeholder="Buscar equipo, denominación, ubicación…" value="${esc(fQuery)}" />
          <select id="aud-familia" class="filter-select">
            <option value="">Todas las familias</option>
            ${[...new Set(ROWS.map((r) => r.familia))].sort().map((f) =>
              `<option value="${esc(f)}"${f === fFamilia ? ' selected' : ''}>${esc(f)}</option>`).join('')}
          </select>
          ${fCard ? `<button class="aud-pill aud-curso" id="aud-clear-card" style="border:0;cursor:pointer;font-size:11px">
            ${esc(CARD_LABEL[fCard] || fCard)} ✕</button>` : ''}
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
      </section>
    `;

    wire();
    renderRows();
    audGoTab(audTab);
  }

  function card(label, value, color, sub, cardKey) {
    const clickable = cardKey !== undefined;
    const active = clickable && fCard === cardKey && cardKey !== '';
    return `<div class="stat-card${clickable ? ' stat-card-clickable aud-kpi' : ''}${active ? ' aud-kpi-active' : ''}"
         style="--stat-color:${color}"${clickable ? ` data-card="${cardKey}" role="button" tabindex="0"` : ''}>
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
      <span style="font-size:11px;color:var(--color-muted)">${sub}</span>
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

  function mb51HTML() {
    const B = (typeof MB51_RESUMEN !== 'undefined') ? MB51_RESUMEN : null;
    if (!B) return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const list = (arr, fmt) => (arr || []).map(fmt).join('');
    const c261 = B.consumo261 || {};
    const inm = B.inmovilizado || { total: 0, top: [] };

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Movimientos de material · MB51
        <span style="font-weight:500;color:var(--color-muted)"> — ${esc(B.periodo[0])} a ${esc(B.periodo[1])} · consumo por material (sin equipo)</span>
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('Consumo (mov. 261)', (c261.movimientos || 0).toLocaleString('es-AR'), '#0096d6', `${(c261.materiales || 0).toLocaleString('es-AR')} materiales · ${(c261.unidades || 0).toLocaleString('es-AR')} u`)}
          ${card('Faltantes', B.faltantesTotal != null ? B.faltantesTotal : (B.faltantes || []).length, '#dc2626', 'Consumo ≥ 6/año y stock 0')}
          ${card('Cobertura < 1 mes', B.bajaCoberturaTotal != null ? B.bajaCoberturaTotal : (B.bajaCobertura || []).length, '#f59e0b', 'Stock alcanza para menos de un mes')}
          ${card('Inmovilizado', inm.total, '#f59e0b', `Stock > 0 y sin consumo en ${B.aniosPeriodo} años`)}
        </div>

        ${heading('Faltantes — consumo alto, stock 0 · ' + (B.faltantesTotal != null ? B.faltantesTotal : (B.faltantes || []).length))}
        ${list((B.faltantes || []).slice(0, 15), (x) => `<div style="font-size:12px;padding:2px 0">
          <span class="equipo-tag" style="background:#dc2626">${esc(x.m)}</span> ${esc(x.txt)} — <strong>~${x.anual.toLocaleString('es-AR')}/año</strong>, stock ${x.stock}</div>`)}

        ${heading('Cobertura crítica (&lt; 1 mes) · ' + (B.bajaCoberturaTotal != null ? B.bajaCoberturaTotal : (B.bajaCobertura || []).length))}
        ${list((B.bajaCobertura || []).slice(0, 12), (x) => `<div style="font-size:12px;padding:2px 0">
          <span class="equipo-tag" style="background:#f59e0b">${esc(x.m)}</span> ${esc(x.txt)} — stock ${x.stock} · ~${x.anual}/año · <strong>${x.meses} meses</strong></div>`)}

        ${heading('Stock inmovilizado (sin consumo) · ' + inm.total)}
        ${list((inm.top || []).slice(0, 10), (x) => `<div style="font-size:12px;padding:2px 0">
          <span class="equipo-tag" style="background:#94a3b8">${esc(x.m)}</span> ${esc(x.txt)} — stock ${x.stock.toLocaleString('es-AR')}</div>`)}

        <div style="margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px">
          Este MB51 <strong>no trae la orden ni el equipo</strong>, así que el consumo es por material, no por equipo. El eslabón que falta sigue siendo componentes por plan/OT (IA08 / COOIS / IW3D).
        </div>
      </div>
    </div>`;
  }

  function mm60HTML() {
    const M = (typeof MM60_RESUMEN !== 'undefined') ? MM60_RESUMEN : null;
    if (!M) return '';
    const codes = (list) => (list || []).map((c) => `<span class="equipo-tag" style="margin:2px 3px 2px 0;display:inline-block;background:#6366f1">${esc(c)}</span>`).join('');
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const pctSinABC = M.materiales ? Math.round((M.sinABC / M.materiales) * 100) : 0;

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Maestro de materiales · MM60
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('Materiales en MM60', M.materiales.toLocaleString('es-AR'), '#0096d6', 'Centro AEP · códigos distintos')}
          ${card('Sin clasificación ABC', M.sinABC.toLocaleString('es-AR'), '#f59e0b', `${pctSinABC}% — no se priorizó criticidad en SAP`)}
          ${card('Con precio 0', (M.precioCero || 0).toLocaleString('es-AR'), '#f59e0b', 'Materiales sin precio cargado')}
          ${card('Repuestos del BOM sin código real', (M.bomSinCodigoReal || []).length, '#dc2626', 'Entradas "?…" que no matchean SAP')}
        </div>

        <div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">
          El catálogo de pañol (stock MB52) tiene <strong>${(M.panolEnMaestro || 0).toLocaleString('es-AR')}</strong> materiales y <strong>todos</strong> figuran en el maestro. El BOM equipo↔repuesto tiene ${M.bomTotal}: ${M.bomEnMaestro} con código real.
        </div>

        ${(M.bomSinCodigoReal || []).length ? heading('Repuestos del BOM cargados como texto (sin código SAP) · ' + M.bomSinCodigoReal.length) +
          `<div>${(M.bomSinCodigoReal || []).map((c) => `<div style="font-size:12px;padding:2px 0">• ${esc(c)}</div>`).join('')}</div>` : ''}

        ${(M.bomSinABC || []).length ? heading('Repuestos del BOM sin clasificación ABC en SAP · ' + M.bomSinABC.length) +
          `<details><summary style="cursor:pointer;font-size:12px;color:var(--color-primary)">ver</summary><div style="margin-top:6px">${codes(M.bomSinABC)}</div></details>` : ''}

        <div style="margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px">
          Ya tenemos stock (MB52 → catálogo de pañol) y maestro (MM60). <strong>Falta el eslabón:</strong> la lista de componentes de cada plan / OT (hoja de ruta IA08 o componentes COOIS/IW3D) para cruzar <em>qué repuesto necesita cada equipo</em> contra stock.
        </div>
      </div>
    </div>`;
  }

  function otsHTML() {
    const O = (typeof OTS_SAP_RESUMEN !== 'undefined') ? OTS_SAP_RESUMEN : null;
    if (!O) return '';
    const famLabel = (pfx) => FAMILIA[pfx] || pfx;
    const codes = (list) => (list || []).map((c) => `<span class="equipo-tag" style="margin:2px 3px 2px 0;display:inline-block">${esc(c)}</span>`).join('');
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const noMaestro = O.equiposConOTfueraDelMaestro || [];
    const planSinOT = O.equiposConPlanSinOT || [];
    const planSinOTpfx = {};
    planSinOT.forEach((e) => { const p = (e.match(/^[A-Za-z]+/) || ['?'])[0]; planSinOTpfx[p] = (planSinOTpfx[p] || 0) + 1; });
    const bl = O.backlogPorEdad || [];
    const maxBl = Math.max(1, ...bl.map((x) => x.n));

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Órdenes de trabajo · IW38 (TER + MEC)
        <span style="font-weight:500;color:var(--color-muted)"> — ${esc(O.periodo[0])} a ${esc(O.periodo[1])} · ${O.total.toLocaleString('es-AR')} OTs preventivas</span>
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('OTs cerradas', (O.pctCerradas || 0) + '%', '#10b981', `${(O.cerradas || 0).toLocaleString('es-AR')} de ${O.total.toLocaleString('es-AR')} — status OTCE/CTEC`)}
          ${card('Backlog abierto', (O.abiertas || 0).toLocaleString('es-AR'), '#f59e0b', `${O.backlogViejo || 0} con más de 6 meses`)}
          ${card('Con parte real (notif.)', (O.notificadas || 0).toLocaleString('es-AR'), '#dc2626', `solo ${O.pctNotificadas || 0}% de las cerradas tiene horas/fecha`)}
          ${card('Planes sin ninguna OT', planSinOT.length, '#dc2626', 'Equipos con plan que no generó OT en 2 años')}
        </div>

        <div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">
          El equipo <strong>sí cierra las OT</strong> (${O.pctCerradas || 0}% OTCE), pero <strong>casi ninguna lleva notificación de horas ni fecha real</strong> (${O.notificadas || 0} de ${(O.cerradas || 0).toLocaleString('es-AR')}) → no se puede medir HH reales ni cumplimiento de fechas.
        </div>

        ${bl.length ? heading('Backlog abierto por antigüedad · ' + (O.abiertas || 0)) +
          bl.map((x) => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
            <span style="flex:0 0 110px">${esc(x.k)}</span>
            <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.n / maxBl) * 100)}%;background:${/año|6–12/.test(x.k) ? '#dc2626' : '#f59e0b'}"></span></span>
            <span style="flex:0 0 48px;text-align:right;font-weight:700">${x.n}</span></div>`).join('') : ''}

        ${heading('Equipos con plan pero SIN ninguna OT en 2 años · ' + planSinOT.length)}
        ${Object.entries(planSinOTpfx).sort((a, b) => b[1] - a[1]).map(([p, n]) => `<div style="font-size:12px;padding:2px 0">${esc(famLabel(p))} (${p}): <strong>${n}</strong></div>`).join('')}
        <details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:var(--color-primary)">ver los ${planSinOT.length} equipos</summary>
          <div style="margin-top:6px">${codes(planSinOT)}</div></details>

        ${noMaestro.length ? heading('Equipos con OT que no están en el maestro IH08 · ' + noMaestro.length) + `<div>${codes(noMaestro)}</div>` : ''}

        ${(O.otSinEquipo || []).length ? heading('OTs preventivas sin equipo asignado · ' + (O.otSinEquipoTotal != null ? O.otSinEquipoTotal : O.otSinEquipo.length)) +
          O.otSinEquipo.map((x) => `<div style="font-size:12px;padding:2px 0"><span class="equipo-tag" style="background:#6366f1">${esc(x.orden)}</span> ${esc(x.texto)}</div>`).join('') : ''}

        ${opsBlock()}

        <div style="margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px">
          Ni IW38 ni la lista de operaciones traen <strong>componentes/materiales</strong> ni ejecución real (todo queda PEND / ABIE en SAP). El link material↔equipo se mantiene con el BOM manual + consumo MB51.
        </div>
      </div>
    </div>`;
  }

  function opsBlock() {
    const S = (typeof OPS_SAP_RESUMEN !== 'undefined') ? OPS_SAP_RESUMEN : null;
    if (!S) return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const maxH = Math.max(1, ...(S.porPuestoHH || []).map((x) => x.h));
    return heading('Carga de trabajo planificada · lista de operaciones (2 años)') +
      `<div style="font-size:12px;margin-bottom:6px">${S.operaciones.toLocaleString('es-AR')} operaciones · <strong>${S.hhPlanificadasTotal.toLocaleString('es-AR')} HH planificadas</strong> · sin ejecución real cargada</div>` +
      `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">Tocá un puesto para ver qué hojas de ruta hay que modificar. Solo deberían quedar AUX_TER, AUX_MEC y MOEX.</div>` +
      (S.porPuestoHH || []).map((x) => {
        const ok = ['AUX_TER', 'AUX_MEC', 'MOEX'].includes(x.k);
        const det = (typeof hdrPuestoDetalleHTML === 'function') ? hdrPuestoDetalleHTML(x.k) : '';
        return `<details style="border-bottom:1px solid var(--color-surface)"><summary style="list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:5px 0;font-size:12px">
        <span style="flex:0 0 122px;font-weight:${ok ? 400 : 700};color:${ok ? 'inherit' : '#b45309'}">${ok ? '' : '⚠ '}${esc(x.k)} ▾</span>
        <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.h / maxH) * 100)}%;background:${ok ? '#6366f1' : '#f59e0b'}"></span></span>
        <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.h.toLocaleString('es-AR')} h</span></summary>${det}</details>`;
      }).join('') +
      (() => {
        const r = (typeof hdrPuestosResumen === 'function') ? hdrPuestosResumen() : null;
        if (!r) return '';
        return `<div style="margin-top:10px;padding:10px 12px;border:1px dashed var(--color-border);border-radius:8px;font-size:12px;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <div style="flex:1;min-width:220px"><b>Limpieza de puestos:</b> ${r.planes} posiciones de plan (${r.equipos} equipos) tienen alguna operación o responsable con puesto distinto de AUX_TER / AUX_MEC / MOEX
            (${r.puestos.map(esc).join(', ')}). El Excel lista cada plan con su hoja de ruta y las operaciones a corregir en SAP (IA17 / IP02).</div>
          <button class="mant-tab" onclick="hdrPuestosExport()">⬇ Descargar planes a limpiar</button></div>`;
      })();
  }

  /* ── Diagnóstico: ¿está bien lo programado? ── */
  /* Periodicidad real por tipo de equipo: ¿todos los equipos del mismo tipo se
     mantienen con la misma frecuencia? Un equipo que se aparta de los demás de su
     tipo suele tener un plan mal asignado. */
  const PER_COLOR = {
    'Semanal': '#0ea5e9', 'Quincenal': '#06b6d4', 'Mensual': '#10b981', 'Bimestral': '#84cc16',
    'Trimestral': '#f59e0b', 'Cuatrimestral': '#f97316', 'Semestral': '#ef4444', 'Anual': '#8b5cf6',
  };
  const perColor = (k) => PER_COLOR[k] || '#94a3b8';
  window.audPerToggle = function (cb) {
    const box = cb.closest('.aud-per-box');
    if (box) box.classList.toggle('aud-per-solo-alertas', cb.checked);
  };

  function periodicidadPorTipoHTML(consist) {
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const conAlerta = consist.filter((c) => c.outliers.length && c.n >= 4);
    const uniformes = consist.length - conAlerta.length;
    const orden = consist.slice().sort((a, b) => {
      const aa = a.n >= 4 ? a.outliers.length : 0, bb = b.n >= 4 ? b.outliers.length : 0;
      return (bb - aa) || (b.n - a.n);
    });
    const chip = (k, extra) => `<span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:11px;font-weight:700;color:#fff;background:${perColor(k)}">${esc(k)}${extra || ''}</span>`;

    const filas = orden.map((c) => {
      const alerta = c.outliers.length && c.n >= 4;
      const barra = c.dist.map(([k, n]) =>
        `<div title="${esc(k)}: ${n} equipos" style="flex:${n};background:${perColor(k)};min-width:3px"></div>`).join('');
      const leyenda = c.dist.map(([k, n]) =>
        `<span style="white-space:nowrap"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${perColor(k)};margin-right:3px"></span>${esc(k)} <b>${n}</b></span>`).join(' &nbsp; ');
      const porB = {};
      c.outliers.forEach((o) => { (porB[o.b] = porB[o.b] || []).push(o.equipo); });
      const detalle = Object.entries(porB).map(([k, eqs]) =>
        `<div style="margin:2px 0">${chip(k)} <span style="color:var(--color-muted)">${eqs.length} equipo${eqs.length > 1 ? 's' : ''}:</span> ${eqs.slice(0, 40).map(esc).join(', ')}${eqs.length > 40 ? ' …' : ''}</div>`).join('');
      const estado = alerta
        ? `<details style="margin-top:6px"><summary style="cursor:pointer;color:#b45309;font-weight:700;font-size:12px">⚠ ${c.outliers.length} equipo${c.outliers.length > 1 ? 's' : ''} se aparta${c.outliers.length > 1 ? 'n' : ''} de la frecuencia típica — ver cuáles</summary><div style="padding:6px 0 2px;font-size:12px">${detalle}</div></details>`
        : `<div style="margin-top:4px;font-size:12px;color:#059669;font-weight:600">✓ ${c.outliers.length ? 'Uniforme (muestra chica)' : 'Todos con la misma frecuencia'}</div>`;
      return `<div class="aud-per-fila${alerta ? '' : ' aud-per-ok'}" style="padding:10px 0;border-bottom:1px solid var(--color-surface)">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between">
          <div style="font-weight:700;font-size:13px">${esc(c.te)} <span style="font-weight:400;color:var(--color-muted)">· ${c.n} equipos</span></div>
          <div style="font-size:12px;color:var(--color-muted)">Lo habitual: ${chip(c.norma)}</div>
        </div>
        <div style="display:flex;height:10px;border-radius:5px;overflow:hidden;margin:6px 0 4px;background:var(--color-surface)">${barra}</div>
        <div style="font-size:11.5px;color:var(--color-muted)">${leyenda}</div>
        ${estado}
      </div>`;
    }).join('');

    return `<div class="aud-per-box aud-per-solo-alertas">
      <style>
        .aud-per-solo-alertas .aud-per-ok { display: none; }
      </style>
      ${heading('Frecuencia de mantenimiento por tipo de equipo')}
      <div style="font-size:12px;color:var(--color-muted);margin-bottom:8px;line-height:1.5">
        <b>Qué muestra:</b> con qué frecuencia se interviene realmente cada equipo (el plan más seguido que tiene, según las fechas de IP24),
        agrupado por tipo. Si la mayoría de los Splits va cada 2 meses y unos pocos van cada mes, esos pocos se marcan:
        puede ser un plan mal asignado o una necesidad real que conviene dejar documentada.
        <br><b>Cómo leerlo:</b> cada barra es el tipo de equipo; los colores son las frecuencias y el largo, cuántos equipos.
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:4px;font-size:12px">
        <span><b style="color:#b45309">${conAlerta.length}</b> tipos con equipos apartados · <b style="color:#059669">${uniformes}</b> uniformes</span>
        <label style="cursor:pointer;margin-left:auto"><input type="checkbox" checked onchange="audPerToggle(this)"> Mostrar solo los que tienen equipos apartados</label>
      </div>
      ${filas}
    </div>`;
  }

  function diagnosticoHTML() {
    const P = (typeof PLANES_SAP_RESUMEN !== 'undefined') ? PLANES_SAP_RESUMEN : null;
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    if (!P || !PL.length) return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const sem = (estado) => ({ ok: '🟢', rev: '🟡', mal: '🔴' }[estado] || '⚪');
    const codes = (list) => (list || []).map((c) => `<span class="equipo-tag" style="margin:2px 3px 2px 0;display:inline-block">${esc(c)}</span>`).join('');

    // equipo -> {tipo, familia} desde todas las fichas temáticas
    const SRC = [
      ['Aire acondicionado', typeof AAC_DATA !== 'undefined' ? AAC_DATA : []],
      ['Patio de valijas (BHS)', typeof PATIO_DATA !== 'undefined' ? PATIO_DATA : []],
      ['Bombas', typeof BOMBAS_DATA !== 'undefined' ? BOMBAS_DATA : []],
      ['Extractores / Ventiladores', typeof EXTRACTORES_DATA !== 'undefined' ? EXTRACTORES_DATA : []],
      ['Puertas automáticas', typeof PUERTAS_DATA !== 'undefined' ? PUERTAS_DATA : []],
      ['Persianas de gatera', typeof PERSIANAS_DATA !== 'undefined' ? PERSIANAS_DATA : []],
      ['Cortinas de aire', typeof CORTINAS_DATA !== 'undefined' ? CORTINAS_DATA : []],
      ['Ascensores', typeof ASCENSORES_DATA !== 'undefined' ? ASCENSORES_DATA : []],
      ['Escaleras mecánicas', typeof ESCALERAS_DATA !== 'undefined' ? ESCALERAS_DATA : []],
      ['Mangas de embarque', typeof MANGAS_DATA !== 'undefined' ? MANGAS_DATA : []],
    ];
    const eqTipo = {};       // equipo -> tipo (solo para el check de coherencia AAC)
    const eqInfo = {};       // equipo -> {tipo, familia} (para consistencia, todas)
    SRC.forEach(([fam, arr]) => arr.forEach((e) => {
      if (!e || !e.equipo) return;
      const t = (e.tipo || e.clase || '').trim();
      eqInfo[e.equipo] = { tipo: t || fam, familia: fam };
      if (fam === 'Aire acondicionado') eqTipo[e.equipo] = e.tipo || '';
    }));

    const planTipo = (d) => {
      const s = (d || '').toLowerCase();
      if (/roof ?top/.test(s)) return 'Roof Top';
      if (/chiller/.test(s)) return 'Chiller';
      if (/\bvr[vf]\b/.test(s)) return 'VRF';
      if (/\buta\b/.test(s) && !/split/.test(s)) return 'UTA';
      if (/cortina/.test(s)) return 'Cortina';
      if (/split|cassette|casete|baja silueta/.test(s)) return 'Split';
      return null;
    };

    // 1. Coherencia plan ↔ tipo de equipo (aire)
    const mismatch = [];
    PL.forEach((p) => {
      const te = eqTipo[p.equipo];
      if (!te) return;
      const tp = planTipo(p.desc);
      if (tp && te && tp !== te && !(tp === 'Split' && (te === 'VRF' || te === 'Otro' || te === 'Autocontenida'))) {
        mismatch.push({ equipo: p.equipo, teq: te, tplan: tp, desc: p.desc });
      }
    });

    // 2. Consistencia de periodicidad dentro de cada tipo (todas las familias).
    //    Un equipo puede tener varias posiciones de plan → se toma su intervalo MÁS CORTO
    //    (la cadencia efectiva con la que se lo interviene).
    const efectiva = {};
    PL.forEach((p) => {
      if (!p.realDias || /s\/fechas/.test(p.realBucket || '')) return;
      if (!efectiva[p.equipo] || p.realDias < efectiva[p.equipo].d) {
        efectiva[p.equipo] = { d: p.realDias, b: p.realBucket };
      }
    });
    const porTipo = {};
    Object.entries(efectiva).forEach(([equipo, v]) => {
      const inf = eqInfo[equipo];
      if (!inf) return;
      const key = inf.familia + ' · ' + inf.tipo;
      (porTipo[key] || (porTipo[key] = [])).push({ equipo, b: v.b, d: v.d });
    });
    const consist = Object.entries(porTipo).map(([key, lst]) => {
      const c = {};
      lst.forEach((x) => { c[x.b] = (c[x.b] || 0) + 1; });
      const orden = Object.entries(c).sort((a, b) => b[1] - a[1]);
      const norma = orden[0][0];
      const outliers = lst.filter((x) => x.b !== norma);
      return { te: key, n: lst.length, norma, dist: orden, outliers };
    }).filter((x) => x.n >= 3).sort((a, b) => b.n - a.n);
    // solo cuenta como "problema" si el tipo tiene ≥4 equipos y >1 se aparta
    const totalOutliers = consist.reduce((s, x) => s + (x.n >= 4 ? x.outliers.length : 0), 0);

    // 3. Cobertura (del resumen)
    const sinPlan = (P.equiposMaestroSinPlan || {}).total || 0;
    const sinEqAlta = (P.equiposConPlanNoEnMaestro || []).length;
    const sobreBaja = (P.equiposConPlanDadosDeBaja || []).length;
    const posSinEq = (P.planesSinEquipo || []).length;
    // 4. Periodicidad vs estrategia
    const fueraPaq = (P.fueraDePaquete || []).length;
    // 5. Ejecución
    const O = (typeof OTS_SAP_RESUMEN !== 'undefined') ? OTS_SAP_RESUMEN : {};

    const filaCheck = (est, titulo, detalle, tab) => `<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--color-surface)">
      <span style="font-size:16px;line-height:1">${sem(est)}</span>
      <div style="flex:1"><div style="font-weight:700;font-size:13px">${titulo}</div>
        <div style="font-size:12px;color:var(--color-muted)">${detalle}</div></div>
      ${tab ? `<button class="mant-tab" style="align-self:center;white-space:nowrap" onclick="audGoTab('${tab}')">Ver detalle →</button>` : ''}
    </div>`;

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Diagnóstico — ¿está bien lo que está programado?
      </div>
      <div style="padding:6px 16px 14px">
        ${filaCheck(
          (sinPlan + sinEqAlta + sobreBaja + posSinEq) === 0 ? 'ok' : 'rev',
          'Cobertura equipo ↔ plan',
          `${sinPlan} equipos operativos sin plan · ${sinEqAlta} planes sin equipo de alta · ${sobreBaja} planes sobre equipo de baja · ${posSinEq} posiciones sin equipo.`, 'planes')}
        ${filaCheck(
          mismatch.length === 0 ? 'ok' : (mismatch.length > 15 ? 'mal' : 'rev'),
          'El plan corresponde al tipo de equipo (aire)',
          mismatch.length ? `${mismatch.length} planes nombran un tipo distinto al del equipo. Ej.: ${mismatch.slice(0, 4).map((m) => `${m.equipo} es ${m.teq} y el plan dice ${m.tplan}`).join('; ')}.` : 'Todos los planes de aire coinciden con el tipo de equipo.')}
        ${filaCheck(
          totalOutliers === 0 ? 'ok' : (totalOutliers > 25 ? 'mal' : 'rev'),
          'Misma periodicidad para equipos del mismo tipo',
          totalOutliers ? `${totalOutliers} equipos se apartan de la periodicidad típica de su tipo (ver abajo).` : 'Cada tipo de equipo corre a una sola periodicidad.')}
        ${filaCheck(
          fueraPaq === 0 ? 'ok' : 'rev',
          'La periodicidad es un ciclo válido de la estrategia (IP11)',
          `${P.posiciones - fueraPaq} de ${P.posiciones} posiciones coinciden con un paquete de su estrategia.`, 'planes')}
        ${filaCheck(
          (O.pctNotificadas || 0) >= 70 ? 'ok' : 'rev',
          'Se ejecuta y se registra lo programado (IW38)',
          `${O.pctCerradas || 0}% de las OT se cierran, pero solo ${O.pctNotificadas || 0}% de las cerradas lleva notificación de horas/fecha. Backlog abierto: ${(O.abiertas || 0).toLocaleString('es-AR')}.`, 'ots')}

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

        ${mismatch.length ? heading('Planes de aire con tipo que no coincide · ' + mismatch.length) +
          mismatch.map((m) => `<div style="font-size:12px;padding:2px 0"><span class="equipo-tag" style="background:#dc2626">${esc(m.equipo)}</span> equipo <strong>${esc(m.teq)}</strong> · plan <strong>${esc(m.tplan)}</strong> — <span style="color:var(--color-muted)">${esc(m.desc)}</span></div>`).join('') : ''}

        ${periodicidadPorTipoHTML(consist)}

      </div>
    </div>`;
  }

  /* ── Plan recomendado para TODOS los equipos sin plan: por analogía con
     equipos de la misma ficha temática y mismo `tipo`/`clase` que sí tienen
     preventivo en IP24. Tres resultados posibles:
     - 'recomendado': todos los "hermanos" del mismo tipo usan el mismo plan
       (o, en Patio, el vecino de numeración de código más cercana) → se
       sugiere ese plan.
     - 'ambiguo': hay más de un plan distinto en uso para ese tipo (ej. AAC
       Split tiene 8 variantes) → no se puede elegir por analogía, hay que
       mirarlo a mano.
     - 'gap': ningún equipo de ese tipo tiene preventivo en SAP → no es
       "falta asignar", es que el plan no existe todavía en IP24.
     No viene de SAP, es una sugerencia para evaluar y dar de alta. */
  function analizarSinPlan(lista) {
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const planesByEquipo = {};
    PL.forEach((p) => { (planesByEquipo[p.equipo] = planesByEquipo[p.equipo] || []).push(p); });
    const planTxt = (eq) => (planesByEquipo[eq] || []).map((p) => `${p.desc} (${p.realBucket}) · plan ${p.plan}`).join(' + ');
    const planSig = (eq) => (planesByEquipo[eq] || []).map((p) => p.desc).sort().join('+');
    const numOf = (s) => {
      const m = String(s || '').match(/-(\d+)(?:\D|$)/);
      return m ? parseInt(m[1], 10) : null;
    };
    const FUENTES = [
      { rx: /^MBO/, get: () => (typeof BOMBAS_DATA !== 'undefined' ? BOMBAS_DATA : []), tipoKey: 'tipo' },
      { rx: /^VAL/, get: () => (typeof VALVULAS_DATA !== 'undefined' ? VALVULAS_DATA : []), tipoKey: 'tipo' },
      { rx: /^CPN/, get: () => (typeof CAMPANAS_DATA !== 'undefined' ? CAMPANAS_DATA : []), tipoKey: null },
      { rx: /^PPA/, get: () => (typeof PUERTAS_DATA !== 'undefined' ? PUERTAS_DATA : []), tipoKey: 'tipo' },
      { rx: /^MEQ/, get: () => (typeof PATIO_DATA !== 'undefined' ? PATIO_DATA : []), tipoKey: 'clase', numeric: true },
      { rx: /^AVO/, get: () => (typeof FLOTA_DATA !== 'undefined' ? FLOTA_DATA : []), tipoKey: 'tipo' },
      { rx: /^AAC/, get: () => (typeof AAC_DATA !== 'undefined' ? AAC_DATA : []), tipoKey: 'tipo' },
      { rx: /^(CTA|ARC|AUT|CMA)/, get: () => (typeof OTROS_DATA !== 'undefined' ? OTROS_DATA : []), tipoKey: 'tipo' },
    ];

    return (lista || []).map((eq) => {
      const fuente = FUENTES.find((f) => f.rx.test(eq));
      const arr = fuente ? fuente.get() : [];
      const rec = arr.find((d) => d.equipo === eq);
      if (!fuente || !rec) return { equipo: eq, estado: 'sin-ficha' };
      const tipoVal = fuente.tipoKey ? rec[fuente.tipoKey] : '';
      const siblings = arr.filter((d) => d.equipo !== eq && (fuente.tipoKey ? d[fuente.tipoKey] === tipoVal : true) && planesByEquipo[d.equipo]);
      const denom = rec.denominacion || rec.denom || '';
      const base = { equipo: eq, denom, tipo: tipoVal };
      if (!siblings.length) return { ...base, estado: 'gap' };
      if (fuente.numeric) {
        const n = numOf(denom);
        const withNum = siblings.map((s) => ({ s, n: numOf(s.denominacion) })).filter((x) => x.n !== null);
        const best = (withNum.length && n !== null)
          ? withNum.reduce((a, b) => (Math.abs(b.n - n) < Math.abs(a.n - n) ? b : a)).s
          : siblings[0];
        return { ...base, estado: 'recomendado', sugerido: planTxt(best.equipo), refEquipo: best.equipo };
      }
      const sigs = new Set(siblings.map((s) => planSig(s.equipo)));
      if (sigs.size === 1) {
        return { ...base, estado: 'recomendado', sugerido: planTxt(siblings[0].equipo), refEquipo: siblings[0].equipo };
      }
      /* Varios planes distintos en uso para ese tipo: se arma la lista de opciones (con cuántos equipos
         usan cada una) y se marca la más parecida por denominación / fabricante / modelo. */
      const tok = (r) => new Set(String([r.denominacion || r.denom, r.fabricante, r.modelo, r.sector].join(' '))
        .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !/^\d+$/.test(w)));
      const jac = (a, b) => { let i = 0; a.forEach((w) => { if (b.has(w)) i++; }); return (a.size + b.size - i) ? i / (a.size + b.size - i) : 0; };
      const mine = tok(rec);
      const opts = {};
      siblings.forEach((sb) => {
        const sig = planSig(sb.equipo);
        const o = opts[sig] || (opts[sig] = { plan: planTxt(sb.equipo), n: 0, ej: [], sim: 0, simDe: '' });
        o.n++;
        if (o.ej.length < 3) o.ej.push(sb.equipo);
        const sc = jac(mine, tok(sb));
        if (sc > o.sim) { o.sim = sc; o.simDe = sb.equipo + ' · ' + (sb.denominacion || sb.denom || ''); }
      });
      const opciones = Object.values(opts).sort((a, b) => b.n - a.n);
      const masParecido = opciones.slice().sort((a, b) => b.sim - a.sim)[0];
      return { ...base, estado: 'ambiguo', nOpciones: sigs.size, opciones,
        parecido: (masParecido && masParecido.sim >= 0.2) ? { plan: masParecido.plan, de: masParecido.simDe } : null };
    });
  }

  /* Descarga de los sistemas de aire (condensadora + interiores) en Excel. */
  window.audSistemasExport = function () {
    if (typeof XLSX === 'undefined' || typeof AAC_SISTEMAS === 'undefined') return;
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const maestro = {};
    getMaestro().forEach((e) => { maestro[e.equipo] = e; });
    const porEq = {};
    PL.forEach((p) => { (porEq[p.equipo] = porEq[p.equipo] || []).push(p); });
    const planTxt = (eq) => (porEq[eq] || []).map((p) => `${p.desc} (plan ${p.plan})`).join(' + ') || 'SIN PLAN';
    const frecTxt = (eq) => [...new Set((porEq[eq] || []).map((p) => p.realBucket))].join(' + ') || '';
    const vinc = (sis) => (sis.conf === 'alta' ? 'Seguro (misma ubicación técnica)' : 'Revisar (deducido por secuencia de códigos)');
    const filaEq = (sis, eq, rol) => ({
      'Sistema': sis.cabeza, 'Nombre del sistema': sis.nombre, 'Rol': rol, 'Equipo': eq,
      'Denominación': (maestro[eq] || {}).denom || '', 'Sector': ubicAire(eq).sector, 'Ubicación técnica': ubicAire(eq).ubic,
      'Plan': planTxt(eq), 'Frecuencia real': frecTxt(eq), 'Vínculo': vinc(sis),
      'Correcto? (completar)': '', 'Condensadora correcta (completar)': '',
    });
    const sistemas = AAC_SISTEMAS.map((sis) => {
      const bC = new Set((porEq[sis.cabeza] || []).map((p) => p.realBucket));
      const bI = new Set(sis.miembros.flatMap((m) => (porEq[m] || []).map((p) => p.realBucket)));
      const distinta = [...bC].some((b) => !bI.has(b)) || [...bI].some((b) => !bC.has(b));
      return {
        'Sistema': sis.cabeza, 'Nombre': sis.nombre, 'Sector de la condensadora': ubicAire(sis.cabeza).sector, 'Ubicación técnica condensadora': ubicAire(sis.cabeza).ubic,
        'Ubicaciones de los interiores': [...new Set(sis.miembros.map((m) => (ubicAire(m).sector ? ubicAire(m).sector + ' · ' : '') + ubicAire(m).corta))].join(' | '),
        'Cantidad de interiores': sis.miembros.length, 'Vínculo': vinc(sis),
        'Plan de la condensadora': planTxt(sis.cabeza), 'Frecuencia condensadora': frecTxt(sis.cabeza),
        'Frecuencia de los interiores': [...bI].join(' + '),
        'Frecuencia distinta': distinta ? 'Sí' : '',
        'Interiores': sis.miembros.join(', '),
      };
    });
    const equipos = [];
    AAC_SISTEMAS.forEach((sis) => {
      equipos.push(filaEq(sis, sis.cabeza, 'Condensadora / exterior'));
      sis.miembros.forEach((m) => equipos.push(filaEq(sis, m, 'Interior')));
    });
    const sinExt = ((typeof AAC_SIN_EXTERIOR !== 'undefined') ? AAC_SIN_EXTERIOR : []).map((x) => ({
      'Equipo': x.equipo, 'Denominación': x.denom, 'Sector': ubicAire(x.equipo).sector, 'Ubicación técnica': ubicAire(x.equipo).ubic,
      'Plan': planTxt(x.equipo), 'Frecuencia real': frecTxt(x.equipo),
    }));
    const wb = XLSX.utils.book_new();
    const add = (rows, name, cols) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      if (cols) ws['!cols'] = cols.map((w) => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    add(sistemas, 'Sistemas', [10, 44, 28, 26, 50, 12, 34, 46, 18, 26, 12, 70]);
    add(equipos, 'Equipos por sistema', [10, 40, 22, 10, 44, 28, 28, 60, 16, 34, 16, 24]);
    if (sinExt.length) add(sinExt, 'Interiores sin condensadora', [10, 44, 28, 28, 60, 16]);
    XLSX.writeFile(wb, 'Sistemas_de_aire_condensadora_interiores.xlsx');
  };

  /* Sistemas de aire (condensadora + interiores): base del agrupado de OTs del Planificador. */
  /* Dónde está un equipo de aire: sector (ficha de la web) + ubicación técnica (SAP). */
  function ubicAire(eq) {
    const m = getMaestro().find((e) => e.equipo === eq) || {};
    const f = (typeof AAC_DATA !== 'undefined' ? AAC_DATA : []).find((a) => a.equipo === eq) || {};
    const ubic = m.ubic || f.ubicacion || '';
    return { sector: f.sector || '', ubic, corta: ubic.replace(/^AEP-/, '') };
  }

  window.audSisFiltro = function (btn, k) {
    const box = btn.closest('.aud-sis-box');
    box.querySelectorAll('.aud-sis-filtro').forEach((x) => x.classList.toggle('active', x === btn));
    box.querySelectorAll('.aud-sis-card').forEach((c) => {
      c.style.display = (k === 'todos' || (k === 'revisar' && c.dataset.conf !== 'alta') || (k === 'freq' && c.dataset.freq === '1')) ? '' : 'none';
    });
  };

  function sistemasAireHTML() {
    if (typeof AAC_SISTEMAS === 'undefined') return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const maestro = {};
    getMaestro().forEach((e) => { maestro[e.equipo] = e; });
    const porEq = {};
    PL.forEach((p) => { (porEq[p.equipo] = porEq[p.equipo] || []).push(p); });
    const chipF = (k) => `<span style="display:inline-block;padding:0 7px;border-radius:9px;font-size:10.5px;font-weight:700;color:#fff;background:${perColor(k)}">${esc(k)}</span>`;
    /* Planes de un grupo de equipos: "descripción" + frecuencia real, con cuántos equipos lo usan */
    const planesDe = (eqs) => {
      const c = {};
      eqs.forEach((e) => (porEq[e] || []).forEach((p) => {
        const k = (p.desc || '—') + '' + (p.realBucket || '—');
        c[k] = (c[k] || 0) + 1;
      }));
      const filas = Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, n]) => {
        const [desc, b] = k.split('');
        return `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:1px 0"><span>${esc(desc)}</span>${chipF(b)}${eqs.length > 1 ? `<span style="color:var(--color-muted);font-size:11px">${n} de ${eqs.length}</span>` : ''}</div>`;
      });
      return filas.join('') || '<span style="color:#dc2626;font-weight:600">sin plan</span>';
    };
    const bucketsDe = (eqs) => new Set(eqs.flatMap((e) => (porEq[e] || []).map((p) => p.realBucket)));
    const tag = (e, fondo) => `<span class="equipo-tag" style="background:${fondo};font-size:10.5px" title="${esc(((maestro[e] || {}).denom || '') + ' — ' + (ubicAire(e).sector ? ubicAire(e).sector + ' · ' : '') + ubicAire(e).corta)}">${esc(e)}</span>`;

    const sis = AAC_SISTEMAS.map((x) => {
      const bC = bucketsDe([x.cabeza]), bI = bucketsDe(x.miembros);
      return { x, distinta: [...bC].some((b) => !bI.has(b)) || [...bI].some((b) => !bC.has(b)) };
    });
    const nInt = AAC_SISTEMAS.reduce((t, x) => t + x.miembros.length, 0);
    const nRev = AAC_SISTEMAS.filter((x) => x.conf !== 'alta').length;
    const nDist = sis.filter((x) => x.distinta).length;

    const tarjetas = sis.map(({ x, distinta }) => `<div class="aud-sis-card" data-conf="${x.conf}" data-freq="${distinta ? 1 : 0}"
        style="border:1px solid var(--color-border);border-radius:10px;padding:12px 14px;background:var(--color-surface)">
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px;min-width:0">
          ${tag(x.cabeza, '#6366f1')}<b style="font-size:13px">${esc(x.nombre)}</b>
        </div>
        <span class="aud-pill aud-${x.conf === 'alta' ? 'ok' : 'curso'}" title="${x.conf === 'alta' ? 'Misma ubicación técnica que sus interiores' : 'Deducido por la secuencia de códigos: conviene confirmarlo'}">${x.conf === 'alta' ? '✓ Seguro' : 'Revisar'}</span>
      </div>
      <div style="font-size:12px;margin:3px 0 8px">📍 <b>${esc(ubicAire(x.cabeza).sector || 'Sin sector en la ficha')}</b> <span style="color:var(--color-muted)">· ${esc(ubicAire(x.cabeza).corta)}</span></div>
      <div style="display:grid;grid-template-columns:96px 1fr;gap:4px 10px;font-size:12px">
        <div style="color:var(--color-muted)">Condensadora</div><div>${planesDe([x.cabeza])}</div>
        <div style="color:var(--color-muted)">${x.miembros.length} interior${x.miembros.length > 1 ? 'es' : ''}</div><div>${planesDe(x.miembros)}</div>
      </div>
      ${distinta ? `<div style="margin-top:6px;font-size:11.5px;color:#b45309;font-weight:700">⚠ La frecuencia de los interiores no coincide con la de la condensadora</div>` : ''}
      <div style="margin-top:8px;font-size:11.5px;color:var(--color-muted)">${(() => {
        const g = {};
        x.miembros.forEach((m) => { const u = ubicAire(m); const k = u.corta || 'sin ubicación'; (g[k] = g[k] || { sector: u.sector, n: 0 }).n++; });
        const ent = Object.entries(g).sort((a, b) => b[1].n - a[1].n);
        if (ent.length <= 3) return ent.map(([k, v]) => `📍 Interiores${ent.length > 1 || v.n < x.miembros.length ? ' (' + v.n + ')' : ''}: ${esc(v.sector ? v.sector + ' · ' : '')}${esc(k)}`).join('<br>');
        return `📍 Interiores repartidos en <b>${ent.length} ubicaciones</b> (pasá el mouse por cada equipo para ver dónde está)`;
      })()}</div>
      <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${x.miembros.map((m) => tag(m, '#64748b')).join('')}</div>
    </div>`).join('');

    const sinExt = (typeof AAC_SIN_EXTERIOR !== 'undefined') ? AAC_SIN_EXTERIOR : [];
    const filtroBtn = (k, txt, act) => `<button class="mant-tab aud-sis-filtro${act ? ' active' : ''}" onclick="audSisFiltro(this,'${k}')">${txt}</button>`;
    return `<div class="aud-sis-box">
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        <div style="flex:1;min-width:220px">${heading('Sistemas de aire · condensadora + interiores · ' + AAC_SISTEMAS.length)}</div>
        <button class="mant-tab" onclick="audSistemasExport()">⬇ Descargar Excel</button>
      </div>
      <div style="font-size:12px;color:var(--color-muted);margin-bottom:10px;line-height:1.5">
        SAP genera una OT por equipo, así que la unidad exterior y sus interiores salen por separado. El Planificador usa esta lista para juntarlos en <b>una sola tarea</b>
        (mismo día, guardia y hora). SAP no informa qué interior depende de qué exterior: se deduce de la denominación, la ubicación técnica y la secuencia de códigos.
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px">
        ${filtroBtn('todos', `Todos · ${AAC_SISTEMAS.length}`, true)}
        ${filtroBtn('revisar', `A confirmar · ${nRev}`, false)}
        ${filtroBtn('freq', `Frecuencia distinta · ${nDist}`, false)}
        <span style="font-size:12px;color:var(--color-muted);margin-left:auto">${nInt} interiores en total · pasá el mouse sobre un equipo para ver su denominación</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:10px">${tarjetas}</div>
      ${sinExt.length ? `<div style="font-size:12px;margin-top:10px"><b>Unidades interiores sin condensadora identificable (${sinExt.length}):</b> ${sinExt.map((z) => tag(z.equipo, '#94a3b8')).join(' ')} <span style="color:var(--color-muted)">— piso-techo aisladas; no se agrupan.</span></div>` : ''}
    </div>`;
  }

  function planesHTML() {
    const P = (typeof PLANES_SAP_RESUMEN !== 'undefined') ? PLANES_SAP_RESUMEN : null;
    if (!P) return '';
    const famLabel = (pfx) => FAMILIA[pfx] || pfx;
    const bar = (label, n, base, color) => {
      const w = base ? Math.round((n / base) * 100) : 0;
      return `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
        <span style="flex:0 0 200px;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</span>
        <span style="flex:1;min-width:60px;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden">
          <span style="display:block;height:100%;width:${w}%;background:${color}"></span></span>
        <span style="flex:0 0 56px;text-align:right;font-weight:700">${n.toLocaleString('es-AR')}</span>
      </div>`;
    };
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const codes = (list) => (list || []).map((c) => `<span class="equipo-tag" style="margin:2px 3px 2px 0;display:inline-block">${esc(c)}</span>`).join('');
    const cmp = P.cumplimiento || {};
    const sinEq = P.planesSinEquipo || [];
    const noMaestro = P.equiposConPlanNoEnMaestro || [];
    const baja = P.equiposConPlanDadosDeBaja || [];
    const sinPlan = P.equiposMaestroSinPlan || { total: 0, porPrefijo: {}, lista: [] };
    const desaj = [].concat(P.desajusteMenosSeguido || [], P.desajusteNoCoincide || []);

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Planes de mantenimiento · IP24 (TER + MEC · solo Aeroparque)
        <span style="font-weight:500;color:var(--color-muted)"> — con objeto técnico · periodicidad real = mediana de días entre tomas</span>
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('Posiciones de plan', P.posiciones.toLocaleString('es-AR'), '#0096d6', `${(P.equiposConPlan || 0).toLocaleString('es-AR')} equipos con plan`)}
          ${card('Equipos sin plan', sinPlan.total, '#f59e0b', 'Del maestro, familias TER/MEC — sin preventivo')}
          ${card('Plan sin equipo en el maestro', noMaestro.length, '#dc2626', 'Preventivo activo pero el equipo no está de alta en SAP')}
          ${card('Plan sobre equipo de baja', baja.length, '#dc2626', 'Equipo NOAC/PTBO con plan activo')}
        </div>

        ${heading('Equipos del maestro (TER/MEC) sin ningún plan · ' + sinPlan.total)}
        ${(() => {
          const spEntries = Object.entries(sinPlan.porPrefijo).sort((a, b) => b[1] - a[1]);
          const spMax = Math.max(1, ...spEntries.map(([, n]) => n));
          const pfxOf = (c) => (String(c).match(/^[A-Za-z]+/) || [''])[0];
          return `<div id="aud-sinplan">
            ${spEntries.map(([p, n]) => `<div class="aud-sp-bar" data-sp-pfx="${esc(p)}" role="button" tabindex="0" title="Filtrar equipos ${esc(famLabel(p))}">${bar(famLabel(p) + ' (' + p + ')', n, spMax, '#f59e0b')}</div>`).join('')}
            <details id="aud-sp-details" style="margin-top:6px">
              <summary style="cursor:pointer;font-size:12px;color:var(--color-primary)">ver los ${sinPlan.total} equipos</summary>
              <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">
                <button type="button" class="aud-sp-pill aud-sp-on" data-sp-pfx="">Todos · ${sinPlan.total}</button>
                ${spEntries.map(([p, n]) => `<button type="button" class="aud-sp-pill" data-sp-pfx="${esc(p)}">${esc(famLabel(p))} (${esc(p)}) · ${n}</button>`).join('')}
              </div>
              <div id="aud-sp-chips" style="margin-top:8px">${sinPlan.lista.map((c) => `<span class="equipo-tag" data-pfx="${esc(pfxOf(c))}" style="margin:2px 3px 2px 0;display:inline-block">${esc(c)}</span>`).join('')}</div>
              <div id="aud-sp-count" style="margin-top:6px;font-size:11px;color:var(--color-muted)"></div>
            </details>
          </div>`;
        })()}

        ${(() => {
          const analisis = analizarSinPlan(sinPlan.lista);
          const conFicha = analisis.filter((r) => r.estado !== 'sin-ficha');
          if (!conFicha.length) return '';
          const rec = analisis.filter((r) => r.estado === 'recomendado');
          const amb = analisis.filter((r) => r.estado === 'ambiguo');
          const gap = analisis.filter((r) => r.estado === 'gap');
          const pfxOf2 = (c) => (String(c).match(/^[A-Za-z]+/) || [''])[0];
          const groupBy = (list, keyFn) => {
            const m = new Map();
            list.forEach((r) => {
              const k = keyFn(r);
              if (!m.has(k)) m.set(k, []);
              m.get(k).push(r);
            });
            return [...m.values()];
          };
          const tagsOf = (list) => list.map((r) => `<span class="equipo-tag" style="margin:2px 3px 2px 0;display:inline-block">${esc(r.equipo)}</span>`).join('');
          const recGroups = groupBy(rec, (r) => r.tipo + '|' + r.sugerido + '|' + r.refEquipo).sort((a, b) => b.length - a.length);
          const ambGroups = groupBy(amb, (r) => famLabel(pfxOf2(r.equipo)) + '|' + r.tipo).sort((a, b) => b.length - a.length);
          const gapGroups = groupBy(gap, (r) => famLabel(pfxOf2(r.equipo)) + '|' + r.tipo).sort((a, b) => b.length - a.length);
          return heading(`Sugerencia de plan · ${conFicha.length} equipos sin preventivo`) +
            `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:8px">Por analogía con equipos de la misma ficha y mismo tipo que sí tienen preventivo en IP24 (en Patio de valijas, además, el vecino de numeración de código más cercana). No viene de SAP — es para evaluar y dar de alta.</div>` +
            (recGroups.length ? `<div style="font-weight:700;font-size:12px;color:#16a34a;margin:10px 0 4px">✓ Recomendado · ${rec.length}</div>` +
              recGroups.map((g) => `<div style="font-size:12px;padding:5px 0;border-bottom:1px solid var(--color-surface)">
                <strong>${esc(g[0].sugerido)}</strong> <span style="color:var(--color-muted)">— ${esc(famLabel(pfxOf2(g[0].equipo)))}${g[0].tipo ? ' · ' + esc(g[0].tipo) : ''} · igual que ${esc(g[0].refEquipo)} · ${g.length} equipo${g.length > 1 ? 's' : ''}</span>
                <div style="margin-top:2px">${tagsOf(g)}</div>
              </div>`).join('') : '') +
            (ambGroups.length ? `<div style="font-weight:700;font-size:12px;color:#f59e0b;margin:12px 0 4px">? Hay que elegir el plan a mano · ${amb.length} equipos</div>` +
              ambGroups.map((g) => `<div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--color-surface)">
                <div><b>${esc(famLabel(pfxOf2(g[0].equipo)))}${g[0].tipo ? ' · ' + esc(g[0].tipo) : ''}</b>:
                  ${g.length} equipo${g.length > 1 ? 's' : ''} sin plan. Los demás del mismo tipo usan <b>${g[0].nOpciones} planes distintos</b>, así que no se puede copiar uno solo.
                  Hay que elegir cuál corresponde a cada equipo:</div>
                <div style="margin:6px 0 4px;padding:6px 10px;background:var(--color-surface);border-radius:8px">
                  ${(g[0].opciones || []).map((o) => `<div style="padding:1px 0">• ${esc(o.plan)} <span style="color:var(--color-muted)">— ${o.n} equipo${o.n > 1 ? 's' : ''} (ej. ${o.ej.map(esc).join(', ')})</span></div>`).join('')}
                </div>
                ${g.map((r) => `<div style="padding:2px 0"><span class="equipo-tag" style="background:#0096d6">${esc(r.equipo)}</span> ${esc(r.denom || '')}
                  ${r.parecido ? `<span style="color:var(--color-muted)">→ el más parecido usa</span> <b>${esc(r.parecido.plan)}</b> <span style="color:var(--color-muted)">(por ${esc(r.parecido.de)})</span>` : '<span style="color:var(--color-muted)">→ ninguno se parece: hay que definirlo con quien conoce el equipo</span>'}</div>`).join('')}
              </div>`).join('') : '') +
            (gapGroups.length ? `<div style="font-weight:700;font-size:12px;color:#dc2626;margin:12px 0 4px">✕ Sin plan de referencia en SAP para ese tipo · ${gap.length}</div>` +
              `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">Ningún equipo de ese tipo tiene preventivo en IP24 todavía — no es "falta asignar", es que el plan no existe.</div>` +
              gapGroups.map((g) => `<div style="font-size:12px;padding:5px 0;border-bottom:1px solid var(--color-surface)">
                <span style="color:var(--color-muted)">${esc(famLabel(pfxOf2(g[0].equipo)))} · ${esc(g[0].tipo || '—')} · ${g.length} equipo${g.length > 1 ? 's' : ''}</span>
                <div style="margin-top:2px">${tagsOf(g)}</div>
              </div>`).join('') : '');
        })()}

        ${noMaestro.length ? heading('Plan activo pero el equipo no está dado de alta en SAP · ' + noMaestro.length) +
          `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">Se les hace preventivo pero nunca se creó el equipo (objeto técnico sí, equipo no): persianas MCD, tanques TNQ, etc. Crear el equipo o reasignar el plan.</div>
           <div>${codes(noMaestro)}</div>` : ''}

        ${baja.length ? heading('Planes activos sobre equipos dados de baja · ' + baja.length) +
          `<div>${codes(baja)}</div>
           <div style="font-size:11.5px;color:var(--color-muted);margin-top:4px">Dar de baja el plan o reactivar el equipo.</div>` : ''}

        ${sinEq.length ? heading('Posiciones de plan sin equipo asignado · ' + sinEq.length) +
          sinEq.map((d) => `<div style="font-size:12px;padding:3px 0"><span class="equipo-tag" style="background:#6366f1">${esc(d.pos)}</span> ${esc(d.desc)}${d.ubic ? ` · <span style="color:var(--color-muted)">${esc(d.ubic)}</span>` : ''}</div>`).join('') : ''}

        ${desaj.length ? heading('Desajuste nombre del plan ↔ ejecución real') +
          desaj.map((d) => `<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--color-surface)">
            <span class="equipo-tag" style="background:#6366f1">${esc(d.pos)}</span> ${esc(d.equipo)}
            <strong> ${esc(d.desc)}</strong><br>
            <span style="color:var(--color-muted)">nombre dice <strong>${esc(d.declara || '—')}</strong> · se ejecuta cada <strong>~${d.realDias}d</strong> (${esc(d.realBucket)})</span>
          </div>`).join('') : ''}

        ${sistemasAireHTML()}

        <div style="margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px">
          Cumplimiento: de ${(cmp.tomasVencidas || 0).toLocaleString('es-AR')} tomas vencidas solo ${cmp.sinOrden || 0} quedaron sin OT.
        </div>
      </div>
    </div>`;
  }

  function th(col, label) {
    const cls = sortCol === col ? `sortable sort-${sortDir}` : 'sortable';
    return `<th class="${cls}" data-col="${col}">${label} <span class="sort-arrow"></span></th>`;
  }

  // Filas base según la tarjeta activa (ghost usa otro dataset).
  function baseRows() {
    if (fCard === 'ghost') {
      return GHOST.map((g) => ({
        equipo: g.equipo, denom: g.denom, familia: g.familia,
        ubic: 'Sección web: ' + g.seccion, status: 'sin alta SAP',
        estadoClase: 'baja', ficha: 'ghost', serv: '', sup: '',
      }));
    }
    return ROWS.filter((r) => {
      if (fCard === 'ficha') return r.ficha === 'temática';
      if (fCard === 'maestro') return r.ficha === 'maestro';
      if (fCard === 'aeqs') return r.estadoClase === 'aeqs';
      if (fCard === 'baja') return r.estadoClase === 'baja';
      return true;
    });
  }

  function filtered() {
    const q = fQuery.trim().toLowerCase();
    let out = baseRows().filter((r) => {
      if (fFamilia && r.familia !== fFamilia) return false;
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
              : r.ficha === 'ghost'
              ? '<span class="aud-pill aud-warn">solo web</span>'
              : '<span class="aud-pill aud-parcial">maestro</span>'}</td>
        <td class="anio-text">${esc(r.serv) || '—'}</td>
      </tr>`).join('');
    }
    const universo = fCard === 'ghost' ? GHOST.length : ROWS.length;
    const etiqueta = fCard ? ` · filtro: ${CARD_LABEL[fCard] || fCard}` : '';
    $('aud-count').textContent = `${rows.length} de ${universo} equipos${etiqueta}`;
  }

  function setCard(key) {
    fCard = (fCard === key) ? '' : key;
    render();
    const t = $('aud-tabla');
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function wire() {
    const s = $('aud-search');
    if (s) s.oninput = debounce(() => { fQuery = s.value; renderRows(); }, 180);
    const fam = $('aud-familia');
    if (fam) fam.onchange = () => { fFamilia = fam.value; renderRows(); };
    const clr = $('aud-clear-card');
    if (clr) clr.onclick = () => { fCard = ''; render(); };
    const ex = $('aud-export');
    if (ex) ex.onclick = doExport;
    document.querySelectorAll('#auditoria-stats .stat-card[data-card]').forEach((el) => {
      el.onclick = () => setCard(el.dataset.card);
      el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCard(el.dataset.card); } };
    });
    document.querySelectorAll('#auditoria-content th.sortable').forEach((el) => {
      el.onclick = () => {
        const c = el.dataset.col;
        if (sortCol === c) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortCol = c; sortDir = 'asc'; }
        render();
      };
    });
    wireSinPlanFiltro();
  }

  /* Filtro por tipo de equipo en "Equipos del maestro sin ningún plan". */
  function wireSinPlanFiltro() {
    const box = $('aud-sinplan');
    if (!box) return;
    const bars = [...box.querySelectorAll('.aud-sp-bar')];
    const pills = [...box.querySelectorAll('.aud-sp-pill')];
    const chips = [...box.querySelectorAll('#aud-sp-chips .equipo-tag')];
    const det = $('aud-sp-details');
    const count = $('aud-sp-count');
    let pfx = '';

    const apply = (next, open) => {
      pfx = (pfx === next) ? '' : next;
      let vis = 0;
      chips.forEach((ch) => {
        const show = !pfx || ch.dataset.pfx === pfx;
        ch.style.display = show ? 'inline-block' : 'none';
        if (show) vis++;
      });
      bars.forEach((b) => b.classList.toggle('aud-sp-on', !!pfx && b.dataset.spPfx === pfx));
      pills.forEach((p) => p.classList.toggle('aud-sp-on', (p.dataset.spPfx || '') === pfx));
      if (count) count.textContent = pfx ? `${vis} equipo${vis === 1 ? '' : 's'} · filtro ${pfx} — clic de nuevo para quitar` : '';
      if (open && pfx && det) det.open = true;
    };

    bars.forEach((b) => {
      b.style.cursor = 'pointer';
      b.onclick = () => apply(b.dataset.spPfx, true);
      b.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(b.dataset.spPfx, true); } };
    });
    pills.forEach((p) => { p.onclick = () => apply(p.dataset.spPfx || '', false); });
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
