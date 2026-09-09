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
      nota: 'Solo alcance TER + MEC: 988 equipos del IH08 que tienen plan TER/MEC, OT TER/MEC o ficha en la web (se descartaron 121 de otros grupos). Cruce contra las fichas de la web abajo.' },
    { dim: 'Ubicación técnica', estado: 'ok',
      nota: 'Marcada como correcta (decisión 2026-09-08). No se audita el campo.' },
    { dim: 'Planes y asignación a equipo', estado: 'curso',
      nota: 'IP24 MOD (TER + MEC) con objeto técnico: cada posición cruzada contra el maestro. Abajo: equipos sin plan, planes a equipos fuera del maestro, planes sobre equipos de baja, posiciones sin equipo.' },
    { dim: 'Periodicidad de los planes', estado: 'curso',
      nota: 'Periodicidad real calculada de las fechas de IP24 (mediana entre tomas). Se marcan los planes que corren a otra frecuencia que la de su nombre.' },
    { dim: 'Materiales de OT y stock', estado: 'curso',
      nota: 'Stock (MB52), maestro (MM60) y consumo 2 años (MB51) cargados: cobertura, faltantes e inmovilizado abajo. Falta solo el link material↔equipo (componentes por plan/OT: IA08 / COOIS / IW3D).' },
    { dim: 'Ejecución de OTs', estado: 'curso',
      nota: 'IW38 2 años: 1.881 OTs, 946 equipos. Casi ninguna se cierra en SAP (quedan ABIE); 124 equipos con plan no generaron ninguna OT.' },
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
      ${checklistHTML()}
      ${planesHTML()}
      ${otsHTML()}
      ${mm60HTML()}
      ${mb51HTML()}
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
    `;

    wire();
    renderRows();
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

  function mb51HTML() {
    const B = (typeof MB51_RESUMEN !== 'undefined') ? MB51_RESUMEN : null;
    if (!B) return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const list = (arr, fmt) => (arr || []).map(fmt).join('');
    const c261 = B.consumo261 || {};
    const inm = B.inmovilizado || { total: 0, top: [] };
    const maxTop = Math.max(1, ...(B.topConsumo || []).map((x) => x.u));

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

        ${heading('Materiales con más consumo (261)')}
        ${list(B.topConsumo.slice(0, 12), (x) => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
          <span class="equipo-tag" style="flex:0 0 82px;background:#6366f1">${esc(x.m)}</span>
          <span style="flex:1;min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(x.txt)}">${esc(x.txt)}</span>
          <span style="flex:0 0 90px;text-align:right;font-weight:700">${x.anual.toLocaleString('es-AR')}/año</span></div>`)}

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
    const abcMax = Math.max(1, ...(M.porABC || []).map((x) => x.n));

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

        ${heading('Materiales por indicador ABC')}
        ${(M.porABC || []).map((x) => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
          <span style="flex:0 0 90px">${esc(x.k)}</span>
          <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.n / abcMax) * 100)}%;background:${/sin ABC/.test(x.k) ? '#f59e0b' : '#0096d6'}"></span></span>
          <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.n.toLocaleString('es-AR')}</span></div>`).join('')}

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
    const pctCerr = O.total ? Math.round((O.cerradas / O.total) * 100) : 0;
    const noMaestro = O.equiposConOTfueraDelMaestro || [];
    const planSinOT = O.equiposConPlanSinOT || [];
    const planSinOTpfx = {};
    planSinOT.forEach((e) => { const p = (e.match(/^[A-Za-z]+/) || ['?'])[0]; planSinOTpfx[p] = (planSinOTpfx[p] || 0) + 1; });
    const top = O.topEquiposPorOT || [];
    const maxTop = Math.max(1, ...top.map((x) => x.n));

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Órdenes de trabajo · IW38 (TER + MEC)
        <span style="font-weight:500;color:var(--color-muted)"> — ${esc(O.periodo[0])} a ${esc(O.periodo[1])}</span>
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('OTs (2 años)', O.total.toLocaleString('es-AR'), '#0096d6', `${(O.equiposConOT || 0).toLocaleString('es-AR')} equipos con OT`)}
          ${card('OTs cerradas en SAP', O.cerradas, '#dc2626', `${pctCerr}% — el resto quedan ABIE`)}
          ${card('Correctivas', O.correctivas, '#f59e0b', `de ${O.total.toLocaleString('es-AR')} — historia de fallas muy corta`)}
          ${card('Planes sin ninguna OT', planSinOT.length, '#dc2626', 'Equipos con plan que no generó OT en 2 años')}
        </div>

        <div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">
          <strong>Hallazgo:</strong> ${(100 - pctCerr)}% de las OTs siguen ABIE (sin cerrar) en SAP — no se puede medir cumplimiento real ni tiempos.
        </div>

        ${heading('Por clase de orden')}
        ${(O.porClase || []).map((x) => `<div style="font-size:12px;padding:2px 0"><strong>${esc(x.k)}</strong>: ${x.n.toLocaleString('es-AR')}</div>`).join('')}

        ${heading('Equipos con más OTs (demanda de trabajo)')}
        ${top.slice(0, 12).map((x) => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
          <span class="equipo-tag" style="flex:0 0 90px">${esc(x.equipo)}</span>
          <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.n / maxTop) * 100)}%;background:#6366f1"></span></span>
          <span style="flex:0 0 40px;text-align:right;font-weight:700">${x.n}</span></div>`).join('')}

        ${heading('Equipos con plan pero SIN ninguna OT en 2 años · ' + planSinOT.length)}
        ${Object.entries(planSinOTpfx).sort((a, b) => b[1] - a[1]).map(([p, n]) => `<div style="font-size:12px;padding:2px 0">${esc(famLabel(p))} (${p}): <strong>${n}</strong></div>`).join('')}
        <details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:var(--color-primary)">ver los ${planSinOT.length} equipos</summary>
          <div style="margin-top:6px">${codes(planSinOT)}</div></details>

        ${noMaestro.length ? heading('Equipos con OT que no están en el maestro IH08 · ' + noMaestro.length) + `<div>${codes(noMaestro)}</div>` : ''}

        ${(O.otSinEquipo || []).length ? heading('OTs sin equipo asignado · ' + O.otSinEquipo.length) +
          O.otSinEquipo.map((x) => `<div style="font-size:12px;padding:2px 0"><span class="equipo-tag" style="background:#6366f1">${esc(x.orden)}</span> ${esc(x.texto)}</div>`).join('') : ''}

        <div style="margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px">
          Este IW38 <strong>no trae componentes/materiales</strong> ni historial de correctivas cerradas. Para cerrar "Materiales de OT y stock" falta: lista de componentes de OT (COOIS/IW3D) + MB52 + MB51.
        </div>
      </div>
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
    const per = P.porPeriodicidadReal || [];
    const maxPer = Math.max(1, ...per.map((x) => x.n));
    const fam = P.porFamiliaPrefijo || [];
    const maxFam = Math.max(1, ...fam.map((x) => x.n));
    const sinEq = P.planesSinEquipo || [];
    const noMaestro = P.equiposConPlanNoEnMaestro || [];
    const baja = P.equiposConPlanDadosDeBaja || [];
    const sinPlan = P.equiposMaestroSinPlan || { total: 0, porPrefijo: {}, lista: [] };
    const desaj = [].concat(P.desajusteMenosSeguido || [], P.desajusteNoCoincide || []);

    return `<div class="table-card" style="margin-bottom:20px">
      <div style="padding:14px 16px;font-weight:800;font-size:13px;border-bottom:1px solid var(--color-border)">
        Planes de mantenimiento · IP24 (TER + MEC)
        <span style="font-weight:500;color:var(--color-muted)"> — con objeto técnico · periodicidad real = mediana de días entre tomas</span>
      </div>
      <div style="padding:14px 16px">
        <div class="stats-grid" style="margin-bottom:14px">
          ${card('Posiciones de plan', P.posiciones.toLocaleString('es-AR'), '#0096d6', `${(P.equiposConPlan || 0).toLocaleString('es-AR')} equipos con plan`)}
          ${card('Equipos sin plan', sinPlan.total, '#f59e0b', 'Del maestro, familias TER/MEC — sin preventivo')}
          ${card('Plan → equipo fuera del maestro', noMaestro.length, '#dc2626', 'El plan apunta a un equipo que no está en IH08')}
          ${card('Plan sobre equipo de baja', baja.length, '#dc2626', 'Equipo NOAC/PTBO con plan activo')}
        </div>

        ${heading('Equipos del maestro (TER/MEC) sin ningún plan · ' + sinPlan.total)}
        ${Object.entries(sinPlan.porPrefijo).map(([p, n]) => bar(famLabel(p) + ' (' + p + ')', n, Math.max(1, ...Object.values(sinPlan.porPrefijo)), '#f59e0b')).join('')}
        <details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;color:var(--color-primary)">ver los ${sinPlan.total} equipos</summary>
          <div style="margin-top:6px">${codes(sinPlan.lista)}</div></details>

        ${noMaestro.length ? heading('Planes que apuntan a un equipo que no está en el maestro IH08 · ' + noMaestro.length) +
          `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">O el export de altas está incompleto, o son equipos viejos/de baja con plan vivo.</div>
           <div>${codes(noMaestro)}</div>` : ''}

        ${baja.length ? heading('Planes activos sobre equipos dados de baja · ' + baja.length) +
          `<div>${codes(baja)}</div>
           <div style="font-size:11.5px;color:var(--color-muted);margin-top:4px">Dar de baja el plan o reactivar el equipo.</div>` : ''}

        ${sinEq.length ? heading('Posiciones de plan sin equipo asignado · ' + sinEq.length) +
          sinEq.map((d) => `<div style="font-size:12px;padding:3px 0"><span class="equipo-tag" style="background:#6366f1">${esc(d.pos)}</span> ${esc(d.desc)}${d.ubic ? ` · <span style="color:var(--color-muted)">${esc(d.ubic)}</span>` : ''}</div>`).join('') : ''}

        ${heading('Periodicidad real')}
        ${per.map((x) => bar(x.k, x.n, maxPer, /s\/fechas/.test(x.k) ? '#f59e0b' : '#0096d6')).join('')}

        ${heading('Posiciones por familia')}
        ${fam.map((x) => bar(famLabel(x.k) + ' (' + x.k + ')', x.n, maxFam, '#6366f1')).join('')}

        ${desaj.length ? heading('Desajuste nombre del plan ↔ ejecución real') +
          desaj.map((d) => `<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--color-surface)">
            <span class="equipo-tag" style="background:#6366f1">${esc(d.pos)}</span> ${esc(d.equipo)}
            <strong> ${esc(d.desc)}</strong><br>
            <span style="color:var(--color-muted)">nombre dice <strong>${esc(d.declara || '—')}</strong> · se ejecuta cada <strong>~${d.realDias}d</strong> (${esc(d.realBucket)})</span>
          </div>`).join('') : ''}

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
