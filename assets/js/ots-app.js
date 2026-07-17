/* ═══════════════════════════════════════════════════════
   OTs App — Historial SAP · UI + carga + modal injection
   ═══════════════════════════════════════════════════════ */

/* ── Init: cargar desde servidor si localStorage está vacío ── */
async function initOTsFromServer() {
  if (getOTs().length > 0) return;  // ya hay datos locales
  const serverOTs = await loadOTsFromServer();
  if (serverOTs && serverOTs.length > 0) {
    saveOTs(serverOTs);
    showOTsToast(`✓ ${serverOTs.length} OTs cargadas desde el servidor.`, 'success');
    renderOTsSection();
  }
}

/* ── Render sección principal ──────────────────────────── */
function renderOTsSection() {
  const section = document.getElementById('ots-section');
  if (!section) return;
  const ots          = getOTs();
  const equiposList  = [...new Set(ots.map(o => o.equipo))].sort();
  const tecnicos     = [...new Set(ots.map(o => o.tecnico).filter(Boolean))].sort();
  const preventivos  = ots.filter(o => o.tipo === 'preventivo').length;
  const correctivosT = ots.filter(o => o.tipo === 'correctivo').length;

  section.innerHTML = `
    <!-- Upload card -->
    <div class="ots-upload-card">
      <div class="ots-upload-icon">📂</div>
      <div class="ots-upload-body">
        <h3 class="ots-upload-title">Cargar historial desde Excel SAP</h3>
        <p class="ots-upload-desc">
          Exportá desde SAP el reporte de confirmaciones de OTs y subilo acá.
          El sistema detecta automáticamente el formato SAP y fusiona los datos
          sin eliminar OTs anteriores.
        </p>
        <div class="ots-upload-row">
          <label class="ots-file-btn" for="otsFileInput">📤 Seleccionar archivo Excel</label>
          <input type="file" id="otsFileInput" accept=".xlsx,.xls" style="display:none">
          ${ots.length > 0 ? `
            <span class="ots-loaded-badge">✓ ${ots.length} OTs · ${equiposList.length} equipos</span>
            <button class="ots-clear-btn" onclick="confirmClearOTs()">🗑 Limpiar todo</button>
          ` : ''}
        </div>
        <div class="ots-server-row">
          <button class="ots-server-btn ots-server-save" onclick="promptSaveToServer()">💾 Guardar permanentemente</button>
          <button class="ots-server-btn ots-server-load" onclick="promptLoadFromServer()">☁ Cargar desde servidor</button>
          <span class="ots-server-hint">Los datos se guardan en el navegador. Usá "Guardar permanentemente" para que persistan entre dispositivos y limpiezas de caché.</span>
        </div>
      </div>
    </div>

    ${ots.length === 0 ? `
      <div class="ots-empty-state">
        <div class="ots-empty-icon">📋</div>
        <p>Aún no hay OTs cargadas.<br>Subí el Excel exportado de SAP para comenzar el análisis.</p>
      </div>
    ` : `

      <!-- Stats -->
      <div class="ots-stats-row">
        ${otsStatCard(ots.length,                                    'OTs totales',         '#1a56a4', '📋')}
        ${otsStatCard(equiposList.length,                            'Equipos',             '#7c3aed', '🏭')}
        ${otsStatCard(preventivos,                                   'Preventivos',         '#1a56a4', '🛡','','preventivo')}
        ${otsStatCard(correctivosT,                                  'Correctivos',         '#9a3412', '🔧','','correctivo')}
        ${otsStatCard(ots.filter(o=>getEffectiveEstado(o)==='urgente').length,    'Urgentes',            '#dc2626', '🔴','urgente')}
        ${otsStatCard(ots.filter(o=>getEffectiveEstado(o)==='correctivo').length, 'Correctivo sugerido', '#ea580c', '🟠','correctivo')}
        ${otsStatCard(ots.filter(o=>getEffectiveEstado(o)==='seguimiento').length,'Seguimiento',         '#d97706', '🟡','seguimiento')}
        ${otsStatCard(ots.filter(o=>getEffectiveEstado(o)==='ok').length,         'OK',                  '#10b981', '🟢','ok')}
      </div>

      <!-- Filtros -->
      <div class="ots-filters">
        <select id="otsEquipoFilter"  class="ots-filter-sel">
          <option value="">Todos los equipos</option>
          ${equiposList.map(e=>`<option value="${e}">${e}</option>`).join('')}
        </select>
        <select id="otsTipoFilter" class="ots-filter-sel">
          <option value="">Preventivo + Correctivo</option>
          <option value="preventivo">🛡 Preventivo</option>
          <option value="correctivo">🔧 Correctivo</option>
          <option value="otro">📌 Otro</option>
        </select>
        <select id="otsTecnicoFilter" class="ots-filter-sel">
          <option value="">Todos los técnicos</option>
          ${tecnicos.map(t=>`<option value="${t}">${t}</option>`).join('')}
        </select>
        <select id="otsEstadoFilter"  class="ots-filter-sel">
          <option value="">Todos los estados</option>
          <option value="urgente">🔴 Urgente</option>
          <option value="correctivo">🟠 Correctivo sugerido</option>
          <option value="seguimiento">🟡 Seguimiento</option>
          <option value="ok">🟢 OK</option>
        </select>
        <div class="ots-date-group">
          <input type="date" id="otsFechaDesde" class="ots-filter-sel" title="Desde">
          <span style="color:var(--color-muted);font-size:12px">—</span>
          <input type="date" id="otsFechaHasta" class="ots-filter-sel" title="Hasta">
        </div>
        <button class="ots-filter-clear-btn" onclick="clearOTsFilters()">✕ Limpiar</button>
        <button class="ots-export-btn"       onclick="exportOTsExcel()">⬇ Excel</button>
      </div>

      <!-- Tabla -->
      <div class="ots-table-wrap">
        <table class="ots-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Tipo</th>
              <th>OT</th>
              <th>Título</th>
              <th>Fecha</th>
              <th>Técnico</th>
              <th style="text-align:center">Tiempo (h)</th>
              <th>Comentario</th>
              <th>Estado detectado</th>
              <th>Acción sugerida</th>
            </tr>
          </thead>
          <tbody id="otsTableBody"></tbody>
        </table>
      </div>

      <!-- Recomendaciones por equipo -->
      <div class="ots-recs-section">
        <div class="ots-recs-header">
          <h2 class="ots-recs-title">Recomendaciones por equipo</h2>
          <button class="ots-export-btn" onclick="exportCorrectivosExcel()">⬇ Excel correctivos</button>
        </div>
        <div id="otsRecsGrid" class="ots-recs-grid"></div>
      </div>
    `}
  `;

  const fileInput = document.getElementById('otsFileInput');
  if (fileInput) fileInput.addEventListener('change', handleOTsFile);

  if (ots.length > 0) {
    ['otsEquipoFilter','otsTipoFilter','otsTecnicoFilter','otsEstadoFilter','otsFechaDesde','otsFechaHasta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', renderOTsTable);
    });
    document.querySelectorAll('.ots-stat-card[data-estado]').forEach(card => {
      card.addEventListener('click', () => {
        const el = document.getElementById('otsEstadoFilter');
        if (el) { el.value = card.dataset.estado; renderOTsTable(); }
      });
    });
    document.querySelectorAll('.ots-stat-card[data-tipo]').forEach(card => {
      card.addEventListener('click', () => {
        const el = document.getElementById('otsTipoFilter');
        if (el) { el.value = card.dataset.tipo; renderOTsTable(); }
      });
    });
    renderOTsTable();
    renderOTsRecommendations();
  }
}

function otsStatCard(value, label, color, icon, estado, tipo) {
  const attrs = [
    estado ? `data-estado="${estado}"` : '',
    tipo   ? `data-tipo="${tipo}"`     : ''
  ].filter(Boolean).join(' ');
  const cursor = (estado || tipo) ? 'cursor:pointer' : '';
  return `
    <div class="ots-stat-card" style="--ots-color:${color};${cursor}" ${attrs}>
      <span class="ots-stat-icon">${icon}</span>
      <span class="ots-stat-n">${value}</span>
      <span class="ots-stat-l">${label}</span>
    </div>
  `;
}

/* ── Tabla ─────────────────────────────────────────────── */
function getFilteredOTs() {
  let ots = getOTs();
  const equipo = document.getElementById('otsEquipoFilter')?.value;
  const tipo   = document.getElementById('otsTipoFilter')?.value;
  const tecnico= document.getElementById('otsTecnicoFilter')?.value;
  const estado = document.getElementById('otsEstadoFilter')?.value;
  const desde  = document.getElementById('otsFechaDesde')?.value;
  const hasta  = document.getElementById('otsFechaHasta')?.value;
  if (equipo)  ots = ots.filter(o => o.equipo === equipo);
  if (tipo)    ots = ots.filter(o => o.tipo   === tipo);
  if (tecnico) ots = ots.filter(o => o.tecnico=== tecnico);
  if (estado)  ots = ots.filter(o => getEffectiveEstado(o) === estado);
  if (desde)   ots = ots.filter(o => o.fecha  >= desde);
  if (hasta)   ots = ots.filter(o => o.fecha  <= hasta);
  return ots;
}

function clearOTsFilters() {
  ['otsEquipoFilter','otsTipoFilter','otsTecnicoFilter','otsEstadoFilter','otsFechaDesde','otsFechaHasta']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value=''; });
  renderOTsTable();
}

function renderOTsTable() {
  const tbody = document.getElementById('otsTableBody');
  if (!tbody) return;
  const ots = getFilteredOTs().sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));

  if (ots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="ots-empty-row">Sin resultados con los filtros aplicados.</td></tr>`;
    return;
  }

  tbody.innerHTML = ots.map((o, i) => {
    const efectivo = getEffectiveEstado(o);
    const em       = OTS_ESTADO_META[efectivo] || OTS_ESTADO_META.ok;
    const tm       = OTS_TIPO_META[o.tipo]     || OTS_TIPO_META.otro;
    const preview  = (o.comentario||'').length > 55
      ? (o.comentario||'').substring(0, 55) + '…'
      : (o.comentario||'—');
    const gestionado = o.estado_manual
      ? `<span class="ots-gestionado-badge" title="${o.nota_manual||''}">✏ Gestionado</span>`
      : '';
    return `
      <tr class="ots-row" data-ot-idx="${i}" style="cursor:pointer">
        <td><span class="ots-equipo-tag">${o.equipo}</span></td>
        <td><span class="ots-tipo-badge ${tm.cls}">${tm.emoji} ${tm.label}</span></td>
        <td><code class="ots-ot-code">${o.ot_num||o.ot||'—'}</code></td>
        <td class="ots-titulo-cell" title="${o.ot_nombre||''}">${o.ot_nombre||'—'}</td>
        <td class="ots-fecha-cell">${o.fecha||'—'}</td>
        <td class="ots-tecnico-cell">${o.tecnico||'—'}</td>
        <td style="text-align:center">${o.tiempo!=null&&o.tiempo!==''?Number(o.tiempo).toFixed(1):'—'}</td>
        <td class="ots-comentario-cell">
          ${preview}
          ${(o.comentario||'').length > 55 ? `<button class="ots-ver-mas" onclick="openOTDetail(event,${i})">ver todo</button>` : ''}
        </td>
        <td><span class="ots-badge ${em.cls}">${em.emoji} ${em.label}</span>${gestionado}</td>
        <td class="ots-accion-cell">${o.accion||'—'}</td>
      </tr>
    `;
  }).join('');

  /* Clic en fila (no en el botón) → abre detalle */
  tbody.querySelectorAll('.ots-row').forEach((tr, i) => {
    tr.addEventListener('click', e => {
      if (e.target.classList.contains('ots-ver-mas')) return;
      openOTDetail(e, i);
    });
  });
}

/* ── Modal de detalle de OT ─────────────────────────────── */
function openOTDetail(event, idx) {
  event.stopPropagation();
  const ots = getFilteredOTs().sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
  const o   = ots[idx];
  if (!o) return;

  let modal = document.getElementById('ots-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ots-detail-modal';
    modal.className = 'ots-detail-overlay';
    modal.innerHTML = `
      <div class="ots-detail-box">
        <button class="ots-detail-close" id="ots-detail-close">✕</button>
        <div id="ots-detail-content"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.getElementById('ots-detail-close').addEventListener('click', () => modal.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
  }

  const efectivo = getEffectiveEstado(o);
  const em = OTS_ESTADO_META[efectivo] || OTS_ESTADO_META.ok;
  const tm = OTS_TIPO_META[o.tipo]     || OTS_TIPO_META.otro;
  const otKey = o.ot_num || o.ot || '';

  const estadoOpts = [
    { v:'',            label:'— Sin cambio (usar detección automática) —' },
    { v:'urgente',     label:'🔴 Urgente' },
    { v:'correctivo',  label:'🟠 Correctivo sugerido' },
    { v:'seguimiento', label:'🟡 Seguimiento' },
    { v:'ok',          label:'🟢 OK / Resuelto' },
  ];

  document.getElementById('ots-detail-content').innerHTML = `
    <div class="ots-detail-header">
      <div class="ots-detail-header-top">
        <span class="ots-equipo-tag" style="font-size:16px;padding:4px 12px">${o.equipo}</span>
        <span class="ots-tipo-badge ${tm.cls}" style="font-size:13px">${tm.emoji} ${tm.label}</span>
        <span class="ots-badge ${em.cls}">${em.emoji} ${em.label}</span>
        ${o.estado_manual ? `<span class="ots-gestionado-badge">✏ Gestionado manualmente</span>` : ''}
      </div>
      <div class="ots-detail-ot-name">${o.ot_nombre || o.ot_num || o.ot || ''}</div>
    </div>

    <div class="ots-detail-grid">
      <div class="ots-detail-field">
        <span class="ots-detail-label">Número de OT</span>
        <span class="ots-detail-value"><code>${o.ot_num || o.ot || '—'}</code></span>
      </div>
      <div class="ots-detail-field">
        <span class="ots-detail-label">Fecha</span>
        <span class="ots-detail-value">${o.fecha || '—'}</span>
      </div>
      <div class="ots-detail-field">
        <span class="ots-detail-label">Técnico</span>
        <span class="ots-detail-value">${o.tecnico || '—'}</span>
      </div>
      <div class="ots-detail-field">
        <span class="ots-detail-label">Tiempo imputado</span>
        <span class="ots-detail-value">${o.tiempo != null ? Number(o.tiempo).toFixed(2) + ' h' : '—'}</span>
      </div>
      ${o.equipo_desc ? `
      <div class="ots-detail-field ots-detail-full">
        <span class="ots-detail-label">Descripción del equipo</span>
        <span class="ots-detail-value">${o.equipo_desc}</span>
      </div>` : ''}
      ${o.estado_orden ? `
      <div class="ots-detail-field">
        <span class="ots-detail-label">Estado en SAP</span>
        <span class="ots-detail-value">${o.estado_orden}</span>
      </div>` : ''}
      ${o.motivo ? `
      <div class="ots-detail-field">
        <span class="ots-detail-label">Motivo / Resultado SAP</span>
        <span class="ots-detail-value">${o.motivo}</span>
      </div>` : ''}
    </div>

    <div class="ots-detail-section">
      <div class="ots-detail-label">📝 Comentario técnico completo</div>
      <div class="ots-detail-comentario">${o.comentario || 'Sin comentario registrado.'}</div>
    </div>

    ${o.accion && o.accion !== 'Sin observaciones relevantes detectadas.' ? `
    <div class="ots-detail-section">
      <div class="ots-detail-label">🔍 Acción sugerida por análisis automático</div>
      <div class="ots-detail-accion ots-detail-accion-${o.estado}">${o.accion}</div>
    </div>` : ''}

    <!-- ── Gestión manual ── -->
    <div class="ots-detail-section ots-override-section">
      <div class="ots-override-header">
        <span class="ots-detail-label">✏ Gestión manual</span>
        ${o.estado_manual && o.fecha_revision ? `<span class="ots-override-meta">Última revisión: ${o.fecha_revision}</span>` : ''}
      </div>
      <div class="ots-override-form">
        <div class="ots-override-field">
          <label class="ots-override-label">Estado</label>
          <select class="ots-override-select" id="ots-override-estado">
            ${estadoOpts.map(opt =>
              `<option value="${opt.v}"${o.estado_manual===opt.v?' selected':''}>${opt.label}</option>`
            ).join('')}
          </select>
        </div>
        <div class="ots-override-field ots-override-full">
          <label class="ots-override-label">Nota / Comentario personal</label>
          <textarea class="ots-override-textarea" id="ots-override-nota" rows="3" placeholder="Ej: Se verificó con técnico, equipo reparado el 15/07...">${o.nota_manual||''}</textarea>
        </div>
        <div class="ots-override-actions">
          <button class="ots-override-save-btn" onclick="saveOTOverride('${otKey}')">💾 Guardar gestión</button>
          ${o.estado_manual || o.nota_manual ? `<button class="ots-override-clear-btn" onclick="clearOTOverride('${otKey}')">✕ Quitar gestión manual</button>` : ''}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/* ── Recomendaciones por equipo ────────────────────────── */
function renderOTsRecommendations() {
  const grid = document.getElementById('otsRecsGrid');
  if (!grid) return;
  const ots    = getOTs();
  const equipos= [...new Set(ots.map(o => o.equipo))].sort();

  const items = equipos.map(eq => {
    /* Para el análisis de recomendación, aplicar estado efectivo */
    const eqOTs = ots.filter(o => o.equipo === eq).map(o => ({
      ...o,
      estado: getEffectiveEstado(o)
    }));
    return { equipo: eq, analysis: analyzeEquipmentHistory(eqOTs), rawOTs: ots.filter(o => o.equipo === eq) };
  }).sort((a,b) => {
    const ord = { urgente:0, correctivo:1, seguimiento:2, ok:3 };
    return (ord[a.analysis.nivel]||3) - (ord[b.analysis.nivel]||3);
  });

  grid.innerHTML = items.map(({equipo, analysis:a, rawOTs}) => {
    const m = OTS_ESTADO_META[a.nivel] || OTS_ESTADO_META.ok;
    const gestionadas = rawOTs.filter(o => o.estado_manual).length;
    return `
      <div class="ots-rec-card ots-rec-${a.nivel}">
        <div class="ots-rec-header">
          <span class="ots-equipo-tag">${equipo}</span>
          <span class="ots-badge ${m.cls}">${m.emoji} ${m.label}</span>
          ${gestionadas > 0 ? `<span class="ots-gestionado-badge" title="${gestionadas} OT(s) gestionadas manualmente">✏ ${gestionadas} gestionada${gestionadas>1?'s':''}</span>` : ''}
        </div>
        <p class="ots-rec-text">${a.recomendacion}</p>
        <div class="ots-rec-meta">
          <span>📋 ${a.totalOTs} OTs</span>
          <span>🛡 ${a.totalPreventivos} prev.</span>
          <span>🔧 ${a.totalCorrectivos} corr.</span>
          <span>⏱ ${a.tiempoTotal.toFixed(1)} h</span>
          ${a.urgentes    >0?`<span class="ots-rec-meta-alert">🔴 ${a.urgentes} urgentes</span>`:''}
          ${a.correctivos >0?`<span class="ots-rec-meta-warn">🟠 ${a.correctivos} con falla</span>`:''}
          ${a.seguimiento >0?`<span class="ots-rec-meta-info">🟡 ${a.seguimiento} seguimiento</span>`:''}
        </div>
      </div>
    `;
  }).join('');
}

/* ── Parser SAP (formato confirmaciones) ─────────────────
   El Excel de SAP tiene UNA FILA POR OPERACIÓN.
   Múltiples filas pueden corresponder a la misma OT (mismo Orden).
   Se agrupan por número de OT extraído de "Orden".
   ──────────────────────────────────────────────────────── */
function isSAPFormat(headers) {
  const h = headers.map(x => String(x||'').toLowerCase().trim());
  return h.includes('orden') && h.includes('objeto técnico');
}

function parseSAPRows(rows) {
  const headers = rows[0].map(x => String(x||'').trim());
  const idx = {};
  headers.forEach((h, i) => { idx[h] = i; });

  const get = (row, col) => {
    const v = row[idx[col]];
    return v == null ? '' : String(v).trim();
  };

  /* Agrupar filas por número de OT */
  const groups = {};
  rows.slice(1).forEach(row => {
    const ordenRaw = get(row, 'Orden');
    if (!ordenRaw) return;
    const otNum = extractOTNum(ordenRaw);
    if (!groups[otNum]) groups[otNum] = { otNum, ordenRaw, rows: [] };
    groups[otNum].rows.push(row);
  });

  return Object.values(groups).map(g => {
    const firstRow  = g.rows[0];
    const finalRow  = g.rows.find(r => get(r,'Notificación final') === '1' || get(r,'Notificación final') === '1.0') || firstRow;

    /* Nombre de la OT (sin el número al final) */
    const otNombre = extractOTName(g.ordenRaw);
    const tipo     = detectTipoOT(otNombre);

    /* Equipo: preferir cualquier fila con "Objeto técnico" */
    const objTecRaw = g.rows.map(r => get(r,'Objeto técnico')).find(Boolean) || '';
    const equipo    = extractEquipoCode(objTecRaw);
    const equipoDesc= extractEquipoDesc(objTecRaw);

    /* Fecha contable más temprana (fecha real de ejecución) */
    let fecha = '';
    g.rows.forEach(r => {
      const raw = get(r, 'Fe.contab.');
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const s = d.toISOString().split('T')[0];
      if (!fecha || s < fecha) fecha = s;
    });

    /* Técnico: de la fila de notificación final, o la primera */
    const tecnicoRaw = get(finalRow, 'Número de personal');
    const tecnico    = tecnicoRaw ? extractTecnicoName(tecnicoRaw) : '';

    /* Tiempo: "Trabajo real acumulado" de la fila final (en minutos → horas) */
    const tiempoMin = parseFloat(get(finalRow,'Trabajo real acumulado').replace(',','.')) || 0;
    const tiempo    = +(tiempoMin / 60).toFixed(2);

    /* Comentarios: concatenar textos únicos de todas las operaciones */
    const textos = [...new Set(
      g.rows.map(r => get(r,'Texto de la notificación'))
             .filter(t => t && t.toLowerCase() !== 'nan')
    )];
    const comentario = textos.join(' | ');

    /* Motivo de desviación y estado de orden */
    const motivo      = g.rows.map(r => get(r,'Nomb.mot.desviación')).find(v => v && v.toLowerCase() !== 'nan') || '';
    const estadoOrden = get(firstRow, 'Estado de la orden');

    /* Análisis automático */
    const { estado, accion } = analyzeComment(comentario, motivo, tipo, otNombre);

    return {
      ot_num:      g.otNum,
      ot_nombre:   otNombre,
      ot:          g.otNum,        // compat. con código anterior
      tipo,
      equipo,
      equipo_desc: equipoDesc,
      fecha,
      tecnico,
      tiempo,
      comentario,
      motivo,
      estado_orden: estadoOrden,
      estado,
      accion
    };
  }).filter(o => o.equipo);
}

/* ── Parser genérico (fallback para otros formatos) ──────── */
const OTS_SAP_ALIASES = {
  equipo:     ["equipo","número de equipo","nro equipo","objeto técnico",
               "objeto tecnico","cod equipo","código equipo","codigo equipo"],
  ot:         ["ot","orden","número de ot","nro ot","notificación","notificacion",
               "número de orden","numero de orden"],
  fecha:      ["fecha","fecha de creación","fecha de creacion","fe.contab.",
               "fecha ini.real","fecha inicio","fecha real inicio","date",
               "fecha notif.","fecha entrada","fecha de inicio"],
  tiempo:     ["tiempo imputado","hrs.reales","horas reales","duración","duracion",
               "horas","trabajo real acumulado","tiempo real","hs imputadas"],
  tecnico:    ["técnico","tecnico","nombre","responsable","ejecutado por",
               "número de personal","numero de personal","personal","operario"],
  comentario: ["comentario","comentario técnico","texto breve","descripción",
               "descripcion","notas","observaciones","text","texto de la notificación",
               "texto de la notificacion","detalle"]
};

function mapOTSHeaders(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const norm = String(h).toLowerCase().trim().replace(/\s+/g,' ');
    for (const [key, aliases] of Object.entries(OTS_SAP_ALIASES)) {
      if (map[key] === undefined && aliases.includes(norm)) map[key] = i;
    }
  });
  return map;
}

function parseGenericRows(rows) {
  const headers = rows[0];
  const colMap  = mapOTSHeaders(headers);
  const missing = ['equipo','ot'].filter(k => colMap[k] === undefined);
  if (missing.length > 0) throw new Error(`Columnas no encontradas: ${missing.join(', ')}`);

  return rows.slice(1)
    .filter(r => r.some(c => c!=null && c!==undefined && c!==''))
    .map(row => {
      const comentario = colMap.comentario !== undefined
        ? String(row[colMap.comentario]||'').trim() : '';
      let fecha = '';
      if (colMap.fecha !== undefined) {
        const raw = row[colMap.fecha];
        if (raw) {
          const d = new Date(raw);
          if (!isNaN(d.getTime())) {
            fecha = d.toISOString().split('T')[0];
          } else {
            fecha = String(raw).trim();
          }
        }
      }
      const tiempoRaw = colMap.tiempo !== undefined
        ? String(row[colMap.tiempo]||'0').replace(',','.') : '0';
      const tiempo = parseFloat(tiempoRaw)||0;
      const equipoRaw = String(row[colMap.equipo]||'').trim();
      const equipo    = extractEquipoCode(equipoRaw) || equipoRaw.toUpperCase();
      const otRaw     = colMap.ot !== undefined ? String(row[colMap.ot]||'').trim() : '';
      const otNum     = extractOTNum(otRaw);
      const tipo      = detectTipoOT(extractOTName(otRaw));
      const tecRaw    = colMap.tecnico !== undefined ? String(row[colMap.tecnico]||'').trim() : '';
      const tecnico   = extractTecnicoName(tecRaw) || tecRaw;
      const otNombre = extractOTName(otRaw);
      const { estado, accion } = analyzeComment(comentario, '', tipo, otNombre);
      return { ot_num:otNum, ot_nombre:otNombre, ot:otNum, tipo, equipo, equipo_desc:'', fecha, tiempo, tecnico, comentario, motivo:'', estado_orden:'', estado, accion };
    })
    .filter(o => o.equipo);
}

/* ── Manejo de archivo ──────────────────────────────────── */
function handleOTsFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const wb   = XLSX.read(ev.target.result, { type:'binary', cellDates:true });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header:1, raw:false, dateNF:'yyyy-mm-dd' });

      if (rows.length < 2) {
        showOTsToast('El archivo está vacío o no tiene datos.', 'error');
        return;
      }

      let parsed;
      if (isSAPFormat(rows[0])) {
        parsed = parseSAPRows(rows);
        if (parsed.length === 0) {
          showOTsToast('No se procesaron registros SAP. Verificá el archivo.', 'error');
          return;
        }
      } else {
        try {
          parsed = parseGenericRows(rows);
        } catch(err) {
          showOTsToast('Formato no reconocido: ' + err.message, 'error');
          return;
        }
      }

      if (parsed.length === 0) {
        showOTsToast('No se encontraron registros válidos en el archivo.', 'error');
        return;
      }

      const existing = getOTs();
      const merged   = mergeOTs(existing, parsed);

      const nuevas       = parsed.filter(p => !existing.find(e => (e.ot_num||e.ot) === p.ot_num)).length;
      const actualizadas = parsed.length - nuevas;

      saveOTs(merged);
      e.target.value = '';
      showOTsToast(
        `✓ ${parsed.length} OTs procesadas — ${nuevas} nuevas, ${actualizadas} actualizadas. Total: ${merged.length} OTs.`,
        'success'
      );
      setTimeout(renderOTsSection, 400);

    } catch(err) {
      showOTsToast('Error al procesar el archivo: ' + err.message, 'error');
      console.error(err);
    }
  };
  reader.readAsBinaryString(file);
}

function confirmClearOTs() {
  if (confirm('¿Eliminar todos los datos de OTs?\nEsta acción no se puede deshacer.')) {
    clearOTs();
    renderOTsSection();
    showOTsToast('Datos de OTs eliminados.', 'success');
  }
}

/* ── Override manual de OT ──────────────────────────────── */
function saveOTOverride(otKey) {
  const estado = document.getElementById('ots-override-estado')?.value || '';
  const nota   = document.getElementById('ots-override-nota')?.value.trim() || '';
  const fecha  = new Date().toISOString().slice(0,10);

  const changes = {
    ...(estado ? { estado_manual: estado } : { estado_manual: '' }),
    nota_manual:    nota,
    fecha_revision: fecha,
  };
  if (!changes.estado_manual && !changes.nota_manual) {
    changes.estado_manual = '';
    changes.nota_manual   = '';
    changes.fecha_revision= '';
  }

  const ok = updateOTManual(otKey, changes);
  if (ok) {
    showOTsToast('Gestión guardada correctamente.', 'success');
    document.getElementById('ots-detail-modal')?.classList.remove('open');
    renderOTsTable();
    renderOTsRecommendations();
  } else {
    showOTsToast('No se encontró la OT para actualizar.', 'error');
  }
}

function clearOTOverride(otKey) {
  const ok = updateOTManual(otKey, { estado_manual:'', nota_manual:'', fecha_revision:'' });
  if (ok) {
    showOTsToast('Gestión manual eliminada.', 'success');
    document.getElementById('ots-detail-modal')?.classList.remove('open');
    renderOTsTable();
    renderOTsRecommendations();
  }
}

/* ── Guardar / cargar desde servidor ───────────────────── */
function promptSaveToServer() {
  /* Modal con campo de contraseña visible */
  let dlg = document.getElementById('ots-save-dlg');
  if (!dlg) {
    dlg = document.createElement('div');
    dlg.id = 'ots-save-dlg';
    dlg.className = 'ots-save-dlg-overlay';
    dlg.innerHTML = `
      <div class="ots-save-dlg-box">
        <div class="ots-save-dlg-title">💾 Guardar permanentemente</div>
        <p class="ots-save-dlg-desc">Ingresá la contraseña de administrador para guardar los datos en el servidor.</p>
        <input type="password" id="ots-save-pwd" class="ots-save-dlg-input" placeholder="Contraseña" autocomplete="current-password">
        <div id="ots-save-dlg-error" class="ots-save-dlg-error" style="display:none"></div>
        <div class="ots-save-dlg-actions">
          <button class="ots-override-save-btn" id="ots-save-dlg-ok">Guardar</button>
          <button class="ots-override-clear-btn" id="ots-save-dlg-cancel">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);

    document.getElementById('ots-save-dlg-cancel').addEventListener('click', () => {
      dlg.classList.remove('open');
      document.getElementById('ots-save-pwd').value = '';
      document.getElementById('ots-save-dlg-error').style.display = 'none';
    });
    dlg.addEventListener('click', e => { if (e.target === dlg) document.getElementById('ots-save-dlg-cancel').click(); });

    document.getElementById('ots-save-dlg-ok').addEventListener('click', _doSaveToServer);
    document.getElementById('ots-save-pwd').addEventListener('keydown', e => {
      if (e.key === 'Enter') _doSaveToServer();
    });
  }
  dlg.classList.add('open');
  setTimeout(() => document.getElementById('ots-save-pwd').focus(), 80);
}

async function _doSaveToServer() {
  const pwd = document.getElementById('ots-save-pwd')?.value || '';
  const errEl = document.getElementById('ots-save-dlg-error');
  if (!pwd) { errEl.textContent = 'Ingresá la contraseña.'; errEl.style.display='block'; return; }

  const btn = document.getElementById('ots-save-dlg-ok');
  btn.textContent = 'Guardando…'; btn.disabled = true;

  const result = await saveOTsToServer(pwd);

  btn.textContent = 'Guardar'; btn.disabled = false;

  if (result.ok) {
    document.getElementById('ots-save-dlg').classList.remove('open');
    document.getElementById('ots-save-pwd').value = '';
    errEl.style.display = 'none';
    showOTsToast(`✓ ${result.total} OTs guardadas en el servidor correctamente.`, 'success');
  } else {
    errEl.textContent = result.error || 'Error al guardar.';
    errEl.style.display = 'block';
    document.getElementById('ots-save-pwd').select();
  }
}

async function promptLoadFromServer() {
  const ots = getOTs();
  if (ots.length > 0) {
    const ok = confirm(
      `Hay ${ots.length} OTs en el navegador.\n` +
      '¿Cargar desde servidor y FUSIONAR con los datos locales?\n' +
      '(Los datos locales más recientes tienen prioridad.)'
    );
    if (!ok) return;
  }
  showOTsToast('Cargando desde servidor…', 'success');
  const serverOTs = await loadOTsFromServer();
  if (!serverOTs || serverOTs.length === 0) {
    showOTsToast('No hay datos en el servidor todavía.', 'error');
    return;
  }
  const merged = ots.length > 0 ? mergeOTs(serverOTs, ots) : serverOTs;
  saveOTs(merged);
  showOTsToast(`✓ ${serverOTs.length} OTs del servidor fusionadas. Total: ${merged.length} OTs.`, 'success');
  setTimeout(renderOTsSection, 400);
}

/* ── Toast ─────────────────────────────────────────────── */
function showOTsToast(msg, type='success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) { toast=document.createElement('div'); toast.id='admin-toast'; toast.className='admin-toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className   = `admin-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Exportar Excel historial ───────────────────────────── */
function exportOTsExcel() {
  const ots = getFilteredOTs();
  if (!ots.length) { showOTsToast('Sin datos para exportar.','error'); return; }
  const rows = ots.map(o => ({
    'Equipo':          o.equipo,
    'Descripción':     o.equipo_desc||'',
    'Tipo OT':         OTS_TIPO_META[o.tipo]?.label||o.tipo||'',
    'Número OT':       o.ot_num||o.ot,
    'Nombre OT':       o.ot_nombre||'',
    'Fecha':           o.fecha,
    'Técnico':         o.tecnico,
    'Tiempo (h)':      o.tiempo,
    'Comentario':      o.comentario,
    'Estado SAP':      o.estado_orden||'',
    'Motivo':          o.motivo||'',
    'Estado detectado':OTS_ESTADO_META[o.estado]?.label||o.estado,
    'Acción sugerida': o.accion
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [10,28,12,12,32,12,24,10,45,24,18,22,45].map(w=>({wch:w}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial OTs');
  XLSX.writeFile(wb, `historial-ots-${new Date().toISOString().slice(0,10)}.xlsx`);
}

/* ── Exportar Excel correctivos ─────────────────────────── */
function exportCorrectivosExcel() {
  const ots    = getOTs();
  const equipos= [...new Set(ots.map(o=>o.equipo))];
  const rows   = equipos
    .map(eq => {
      const eqOTs = ots.filter(o=>o.equipo===eq);
      const a = analyzeEquipmentHistory(eqOTs);
      return {
        'Equipo':           eq,
        'Nivel':            OTS_ESTADO_META[a.nivel]?.label||a.nivel,
        'Total OTs':        a.totalOTs,
        'Preventivos':      a.totalPreventivos,
        'Correctivos OT':   a.totalCorrectivos,
        'Tiempo total (h)': a.tiempoTotal.toFixed(1),
        'Urgentes':         a.urgentes,
        'Con falla':        a.correctivos,
        'Seguimiento':      a.seguimiento,
        'Recomendación':    a.recomendacion
      };
    })
    .filter(r => r['Nivel'] !== 'OK')
    .sort((a,b) => {
      const ord={'Urgente':0,'Correctivo sugerido':1,'Seguimiento':2};
      return (ord[a['Nivel']]??9)-(ord[b['Nivel']]??9);
    });

  if (!rows.length) { showOTsToast('No hay equipos con correctivos sugeridos.','error'); return; }
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [10,22,10,12,14,14,10,10,12,55].map(w=>({wch:w}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Correctivos');
  XLSX.writeFile(wb, `equipos-correctivos-${new Date().toISOString().slice(0,10)}.xlsx`);
}

/* ── Historial SAP en modal de equipo ───────────────────── */
function buildModalOTHistory(equipoId) {
  const ots      = getOTsByEquipo(equipoId);
  const analysis = analyzeEquipmentHistory(ots);
  const m        = OTS_ESTADO_META[analysis.nivel] || OTS_ESTADO_META.ok;

  const wrap = document.createElement('div');
  wrap.className = 'ots-modal-section';
  wrap.innerHTML = `
    <div class="ots-modal-sep"></div>
    <div class="ots-modal-heading">
      <span class="ots-modal-title-text">📋 Historial SAP</span>
      <span class="ots-badge ${m.cls}">${m.emoji} ${m.label}</span>
    </div>
    ${analysis.nivel !== 'ok' ? `
      <div class="ots-modal-rec ots-modal-rec-${analysis.nivel}">
        <strong>Recomendación:</strong> ${analysis.recomendacion}
      </div>
    ` : ''}
    ${ots.length === 0 ? `
      <p class="ots-modal-empty">Sin OTs registradas para este equipo en el historial cargado.</p>
    ` : `
      <div class="ots-modal-meta-row">
        <span>📋 ${ots.length} OTs</span>
        <span>🛡 ${analysis.totalPreventivos} prev.</span>
        <span>🔧 ${analysis.totalCorrectivos} corr.</span>
        <span>⏱ ${analysis.tiempoTotal.toFixed(1)} h</span>
        ${analysis.urgentes    >0?`<span style="color:#dc2626">🔴 ${analysis.urgentes} urgentes</span>`:''}
        ${analysis.correctivos >0?`<span style="color:#ea580c">🟠 ${analysis.correctivos} con falla</span>`:''}
        ${analysis.seguimiento >0?`<span style="color:#d97706">🟡 ${analysis.seguimiento} seguimiento</span>`:''}
      </div>
      <div class="ots-modal-table-wrap">
        <table class="ots-modal-table">
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>OT</th><th>Técnico</th><th>h</th><th>Estado</th><th>Comentario</th></tr>
          </thead>
          <tbody>
            ${ots
              .sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''))
              .map(o => {
                const em = OTS_ESTADO_META[o.estado] || OTS_ESTADO_META.ok;
                const tm = OTS_TIPO_META[o.tipo]     || OTS_TIPO_META.otro;
                return `
                  <tr>
                    <td class="ots-modal-td-mono">${o.fecha||'—'}</td>
                    <td><span class="ots-tipo-badge-sm ${tm.cls}">${tm.emoji}</span></td>
                    <td class="ots-modal-td-mono"><code title="${o.ot_nombre||''}">${o.ot_num||o.ot||'—'}</code></td>
                    <td>${o.tecnico||'—'}</td>
                    <td style="text-align:center">${o.tiempo!=null?Number(o.tiempo).toFixed(1):'—'}</td>
                    <td><span class="ots-badge-sm ${em.cls}">${em.emoji} ${em.label}</span></td>
                    <td class="ots-modal-comentario">${o.comentario||'—'}</td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
  return wrap;
}

/* ── Observer: inyectar historial en modales ────────────── */
(function setupOTModalObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ target, attributeName }) => {
      if (attributeName !== 'class') return;
      if (!target.classList.contains('open')) return;
      const isModal = target.classList.contains('modal-overlay') ||
                      (target.id && (target.id.includes('Overlay')||target.id.includes('Modal')));
      if (!isModal) return;
      const equipoEl = target.querySelector('.modal-equipo');
      if (!equipoEl) return;
      const equipoId = equipoEl.textContent.trim();
      if (!equipoId) return;
      const body = target.querySelector('[id$="ModalBody"],[id$="modalBody"],.modal-body');
      if (!body || body.querySelector('.ots-modal-section')) return;
      body.appendChild(buildModalOTHistory(equipoId));
    });
  });
  observer.observe(document.body, { subtree:true, attributes:true, attributeFilter:['class'] });
})();

/* ── Navegar a sección ──────────────────────────────────── */
const _origShowPage = window.showPage;
window.showPage = function(pageId) {
  _origShowPage(pageId);
  if (pageId === 'historial') {
    renderOTsSection();
    /* Si no hay datos locales, intentar cargar desde servidor */
    if (getOTs().length === 0) initOTsFromServer();
  }
  if (pageId === 'kpis') renderKPIsSection();
};
