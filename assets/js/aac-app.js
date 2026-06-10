/* ─── Equipos de Aire Acondicionado — AEP ─────────────────── */

let aacFiltered      = [...AAC_DATA];
let aacView          = 'grid';
let aacSearch        = '';
let aacTipoFilter    = '';
let aacFabFilter     = '';
let aacZonaFilter    = '';
let aacAlturaOnly    = false;
let aacActivePlanId  = AAC_PLANES[0].id;

/* ─── Init ───────────────────────────────────────────────── */
(function initAAC() {
  renderAACStats();
  buildAACFilters();
  applyAACFilters();

  document.getElementById('aac-search').addEventListener('input', function () {
    aacSearch = this.value.trim().toLowerCase();
    document.getElementById('aac-clear-search').style.display = aacSearch ? 'flex' : 'none';
    applyAACFilters();
  });
  document.getElementById('aac-clear-search').addEventListener('click', function () {
    aacSearch = '';
    document.getElementById('aac-search').value = '';
    this.style.display = 'none';
    applyAACFilters();
  });
  document.getElementById('aac-filter-tipo').addEventListener('change', function () {
    aacTipoFilter = this.value;
    applyAACFilters();
  });
  document.getElementById('aac-filter-fab').addEventListener('change', function () {
    aacFabFilter = this.value;
    applyAACFilters();
  });
  document.getElementById('aac-filter-zona').addEventListener('change', function () {
    aacZonaFilter = this.value;
    applyAACFilters();
  });

  document.getElementById('aac-filter-altura').addEventListener('click', function () {
    aacAlturaOnly = !aacAlturaOnly;
    this.classList.toggle('active', aacAlturaOnly);
    applyAACFilters();
  });

  document.querySelectorAll('.aac-view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.aac-view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      aacView = this.dataset.view;
      renderAAC();
    });
  });

  document.getElementById('aac-modal-close').addEventListener('click', closeAACModal);
  document.getElementById('aac-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeAACModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAACModal();
  });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function renderAACStats() {
  const total    = AAC_DATA.length;
  const splits   = AAC_DATA.filter(e => e.tipo === 'Split').length;
  const vrfs     = AAC_DATA.filter(e => e.tipo === 'VRF').length;
  const rooftops = AAC_DATA.filter(e => e.tipo === 'Roof Top').length;
  const utas     = AAC_DATA.filter(e => e.tipo === 'UTA').length;
  const chillers = AAC_DATA.filter(e => e.tipo === 'Chiller').length;

  const alturaCount = AAC_DATA.filter(e => ALTURA_SET.has(e.equipo)).length;

  const cards = [
    { label: 'Total equipos',  value: total,           icon: '❄️',  color: '#1a56a4', tipo: ''        },
    { label: 'Splits / VRF',   value: splits + vrfs,   icon: '🌡️', color: '#7c3aed', tipo: 'Split'   },
    { label: 'Roof Tops',      value: rooftops,        icon: '🏭',  color: '#059669', tipo: 'Roof Top'},
    { label: '⛰️ Altura',     value: alturaCount,     icon: '🏔️', color: '#0f4c81', tipo: '__altura__'},
  ];

  document.getElementById('aac-stats').innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}" data-tipo="${c.tipo}"
         title="${c.tipo ? 'Filtrar por: ' + c.label : 'Ver todos'}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');

  document.querySelectorAll('#aac-stats .stat-card-clickable').forEach(card => {
    card.addEventListener('click', () => {
      const tipo = card.dataset.tipo;
      // Reset filters
      aacSearch = ''; document.getElementById('aac-search').value = '';
      document.getElementById('aac-clear-search').style.display = 'none';
      aacFabFilter = ''; document.getElementById('aac-filter-fab').value = '';
      aacZonaFilter = ''; document.getElementById('aac-filter-zona').value = '';
      if (tipo === '__altura__') {
        aacAlturaOnly = true;
        aacTipoFilter = '';
        document.getElementById('aac-filter-tipo').value = '';
        document.getElementById('aac-filter-altura').classList.add('active');
      } else {
        aacAlturaOnly = false;
        document.getElementById('aac-filter-altura').classList.remove('active');
        aacTipoFilter = tipo;
        document.getElementById('aac-filter-tipo').value = tipo;
      }
      applyAACFilters();
      document.getElementById('aac-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── Filters ────────────────────────────────────────────── */
function buildAACFilters() {
  const tipos = [...new Set(AAC_DATA.map(e => e.tipo))].sort();
  const fabs  = [...new Set(AAC_DATA.map(e => e.fabricante))].filter(Boolean).sort();
  const zonas = [...new Set(AAC_DATA.map(e => aacZona(e.ubicacion)))].sort();

  const selTipo = document.getElementById('aac-filter-tipo');
  const selFab  = document.getElementById('aac-filter-fab');
  const selZona = document.getElementById('aac-filter-zona');

  tipos.forEach(t => {
    const o = document.createElement('option');
    o.value = t; o.textContent = t;
    selTipo.appendChild(o);
  });
  fabs.forEach(f => {
    const o = document.createElement('option');
    o.value = f; o.textContent = f;
    selFab.appendChild(o);
  });
  zonas.forEach(z => {
    const o = document.createElement('option');
    o.value = z; o.textContent = z;
    selZona.appendChild(o);
  });
}

function applyAACFilters() {
  aacFiltered = AAC_DATA.filter(e => {
    if (aacTipoFilter && e.tipo !== aacTipoFilter) return false;
    if (aacFabFilter  && e.fabricante !== aacFabFilter) return false;
    if (aacZonaFilter && aacZona(e.ubicacion) !== aacZonaFilter) return false;
    if (aacAlturaOnly && !ALTURA_SET.has(e.equipo)) return false;
    if (aacSearch) {
      const hay = [e.equipo, e.denominacion, e.capacidad, e.fabricante, e.modelo, e.sector, aacZona(e.ubicacion)]
        .join(' ').toLowerCase();
      if (!hay.includes(aacSearch)) return false;
    }
    return true;
  });
  renderAAC();
}

/* ─── Render dispatcher ──────────────────────────────────── */
function renderAAC() {
  const isData   = aacView === 'grid' || aacView === 'table';
  const isPlanes = aacView === 'planes';

  document.getElementById('aac-result-count').textContent =
    isData ? `${aacFiltered.length} de ${AAC_DATA.length} equipos` : '';

  document.getElementById('aac-toolbar-filters').style.display = isData ? '' : 'none';

  document.getElementById('aac-grid').classList.toggle('hidden',        aacView !== 'grid');
  document.getElementById('aac-table-wrap').classList.toggle('hidden',  aacView !== 'table');
  document.getElementById('aac-planes-wrap').classList.toggle('hidden', !isPlanes);

  if (aacView === 'grid')   renderAACGrid();
  if (aacView === 'table')  renderAACTable();
  if (isPlanes)             renderAACPlanes();
}

/* ─── Grid ───────────────────────────────────────────────── */
function renderAACGrid() {
  const container = document.getElementById('aac-grid');

  if (!aacFiltered.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <p>No se encontraron equipos con los filtros aplicados.</p>
    </div>`;
    return;
  }

  container.innerHTML = aacFiltered.map(e => {
    const zona      = aacZona(e.ubicacion);
    const tipoColor = AAC_TIPO_COLORS[e.tipo]  || '#6b7280';
    const zonaColor = AAC_ZONA_COLORS[zona]     || '#6b7280';
    const fab       = e.fabricante || '—';
    const esAltura  = ALTURA_SET.has(e.equipo);
    return `<div class="aac-card" data-equipo="${e.equipo}" title="${e.denominacion}" style="--tipo-color:${tipoColor}">
      <div class="aac-card-header">
        <span class="aac-card-code">${e.equipo}</span>
        <span class="aac-tipo-badge" style="background:${tipoColor}18;color:${tipoColor};border-color:${tipoColor}35">${e.tipo}</span>
      </div>
      <div class="aac-card-denom">${e.denominacion}</div>
      <div class="aac-card-meta">
        <span class="aac-fab-text">${fab}</span>
        ${e.capacidad ? `<span class="aac-cap-tag">${e.capacidad}</span>` : ''}
      </div>
      <div class="aac-card-footer">
        <span class="aac-zona-badge" style="background:${zonaColor}15;color:${zonaColor}">${zona}</span>
        <span class="aac-sector-text" title="${e.sector}">${e.sector}</span>
        ${esAltura ? `<span class="altura-badge">⛰️ Altura</span>` : ''}
      </div>
    </div>`;
  }).join('');

  container.querySelectorAll('.aac-card').forEach(card => {
    card.addEventListener('click', () => openAACModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────────── */
function renderAACTable() {
  const tbody = document.getElementById('aac-tbody');

  if (!aacFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron equipos con los filtros aplicados.</p></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = aacFiltered.map(e => {
    const zona      = aacZona(e.ubicacion);
    const tipoColor = AAC_TIPO_COLORS[e.tipo]  || '#6b7280';
    const zonaColor = AAC_ZONA_COLORS[zona]     || '#6b7280';
    const esAltura  = ALTURA_SET.has(e.equipo);
    return `<tr data-equipo="${e.equipo}">
      <td><span class="equipo-tag">${e.equipo}</span>${esAltura ? ' <span class="altura-badge">⛰️ Altura</span>' : ''}</td>
      <td>${e.denominacion}</td>
      <td><span class="aac-tipo-badge" style="background:${tipoColor}15;color:${tipoColor};border-color:${tipoColor}30">${e.tipo}</span></td>
      <td>${e.fabricante || '—'}</td>
      <td><span class="mono-text">${e.modelo || '—'}</span></td>
      <td>${e.capacidad || '—'}</td>
      <td><span class="aac-zona-badge" style="background:${zonaColor}15;color:${zonaColor}">${zona}</span></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('tr[data-equipo]').forEach(row => {
    row.addEventListener('click', () => openAACModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
function openAACModal(equipo) {
  const e = AAC_DATA.find(x => x.equipo === equipo);
  if (!e) return;

  const zona      = aacZona(e.ubicacion);
  const tipoColor = AAC_TIPO_COLORS[e.tipo]  || '#6b7280';
  const zonaColor = AAC_ZONA_COLORS[zona]     || '#6b7280';

  document.getElementById('aac-modal-header').innerHTML = `
    <span class="modal-equipo">${e.equipo}</span>
    <div class="modal-denom">${e.denominacion}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
      <span class="aac-tipo-badge" style="background:${tipoColor}20;color:${tipoColor};border:1px solid ${tipoColor}40">${e.tipo}</span>
      <span class="aac-zona-badge" style="background:${zonaColor}20;color:${zonaColor}">${zona}</span>
    </div>
  `;

  function mf(label, value, full, mono) {
    if (!value) return '';
    return `<div class="modal-field${full ? ' full' : ''}">
      <span class="modal-field-label">${label}</span>
      <span class="modal-field-value${mono ? ' mono' : ''}">${value}</span>
    </div>`;
  }

  document.getElementById('aac-modal-body').innerHTML = `
    ${mf('Fabricante', e.fabricante || '—')}
    ${mf('Tipo', e.tipo)}
    ${mf('Modelo / N° Tipo', e.modelo || '—', false, true)}
    ${mf('Capacidad', e.capacidad || '—')}
    ${mf('Sector / Local', e.sector)}
    ${mf('Zona', zona)}
    ${mf('Ubicación SAP', e.ubicacion, true, true)}
  `;

  document.getElementById('aac-modal-overlay').classList.add('open');
}

function closeAACModal() {
  document.getElementById('aac-modal-overlay').classList.remove('open');
}

/* ─── Planes preventivos ─────────────────────────────────── */
function renderAACPlanes() {
  // ── Selector de plan ──
  const selectorEl = document.getElementById('aac-plan-selector');
  selectorEl.innerHTML = AAC_PLANES.map(p => `
    <button class="aac-plan-sel-btn${p.id === aacActivePlanId ? ' active' : ''}"
            data-plan="${p.id}">
      ${p.denominacion}
    </button>
  `).join('');
  selectorEl.querySelectorAll('.aac-plan-sel-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      aacActivePlanId = this.dataset.plan;
      renderAACPlanes();
    });
  });

  // ── Contenido del plan activo ──
  const plan = AAC_PLANES.find(p => p.id === aacActivePlanId);
  if (!plan) return;

  const contentEl = document.getElementById('aac-plan-content');
  contentEl.innerHTML = `
    <div class="patio-plan-section-title">
      <span>${plan.denominacion}</span>
      <span class="patio-plan-ref-badge">${plan.referencia}</span>
    </div>
    <div class="patio-plans-grid">
      ${plan.frecuencias.map(freq => `
        <div class="patio-plan-card">
          <div class="patio-plan-header" style="background:${freq.color}">
            <span class="patio-plan-freq-icon">${freq.icono}</span>
            <div>
              <div class="patio-plan-freq-name">${freq.nombre}</div>
              <div class="patio-plan-freq-ref">${plan.referencia}</div>
            </div>
            <span class="patio-plan-task-count">${freq.tareas.length} tarea${freq.tareas.length !== 1 ? 's' : ''}</span>
          </div>
          <ul class="patio-plan-task-list">
            ${freq.tareas.map(t => `
              <li class="patio-plan-task-item">
                <span class="patio-plan-task-num">${t.num}</span>
                <span class="patio-plan-task-text">${t.texto}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}
