/* ─── Estado de Equipos — panorama tipo SCADA ─────────────────────
   Estado automático por equipo = estado efectivo de su OT más reciente
   en el historial (getEffectiveEstado, de ots-analyzer.js):
     urgente     → 🔴 Fuera de servicio
     seguimiento → 🟡 Requiere atención
     (cualquier otro / sin OTs) → 🟢 OK
   "🔵 En reparación" NO se calcula solo: siempre lo fija un admin a mano.
   Un admin puede fijar manualmente cualquiera de los 4 estados (o
   quitar el override y volver al cálculo automático).
   Todo lo que se guarda (estado manual, comentarios, tareas) requiere
   haber iniciado sesión como administrador (candado 🔒 de la barra
   lateral) y se persiste vía /api/update-equipment, igual que el resto
   del panel admin. */

const ESTADO_META = {
  ok:             { label: 'OK',                 emoji: '🟢', color: '#10b981' },
  atencion:       { label: 'Requiere atención',  emoji: '🟡', color: '#d97706' },
  reparacion:     { label: 'En reparación',      emoji: '🔵', color: '#0891b2' },
  fuera_servicio: { label: 'Fuera de servicio',  emoji: '🔴', color: '#dc2626' },
};
const ESTADO_ORDEN = ['fuera_servicio', 'atencion', 'reparacion', 'ok'];

const ESTADO_CATEGORIAS = [
  { id: 'aac',         label: 'Equipos de Aire',      icon: '❄️', get: () => (typeof AAC_DATA !== 'undefined' ? AAC_DATA : []) },
  { id: 'meq',         label: 'Patio de Valijas',     icon: '🧳', get: () => (typeof PATIO_DATA !== 'undefined' ? PATIO_DATA : []) },
  { id: 'mangas',      label: 'Mangas de Embarque',   icon: '🛬', get: () => (typeof MANGAS_DATA !== 'undefined' ? MANGAS_DATA : []) },
  { id: 'ascensores',  label: 'Ascensores',           icon: '🛗', get: () => (typeof ASCENSORES_DATA !== 'undefined' ? ASCENSORES_DATA : []) },
  { id: 'escaleras',   label: 'Escaleras Mecánicas',  icon: '🪜', get: () => (typeof ESCALERAS_DATA !== 'undefined' ? ESCALERAS_DATA : []) },
  { id: 'extractores', label: 'Extractores',          icon: '💨', get: () => (typeof EXTRACTORES_DATA !== 'undefined' ? EXTRACTORES_DATA : []) },
  { id: 'persianas',   label: 'Persianas de Gatera',  icon: '🪟', get: () => (typeof PERSIANAS_DATA !== 'undefined' ? PERSIANAS_DATA : []) },
  { id: 'cortinas',    label: 'Cortinas de Aire',     icon: '🌬️', get: () => (typeof CORTINAS_DATA !== 'undefined' ? CORTINAS_DATA : []) },
  { id: 'bombas',      label: 'Bombas',               icon: '💧', get: () => (typeof BOMBAS_DATA !== 'undefined' ? BOMBAS_DATA : []) },
  { id: 'puertas',     label: 'Puertas Automáticas',  icon: '🚪', get: () => (typeof PUERTAS_DATA !== 'undefined' ? PUERTAS_DATA : []) },
  { id: 'ecas',        label: 'Incendios (ECAs)',     icon: '🔥', get: () => (typeof ECAS_DATA !== 'undefined' ? ECAS_DATA : []) },
  { id: 'otros',       label: 'Otros Equipos',        icon: '⚙️', get: () => (typeof OTROS_DATA !== 'undefined' ? OTROS_DATA : []) },
  { id: 'flota',       label: 'Flota Vehicular',      icon: '🚐', get: () => (typeof FLOTA_DATA !== 'undefined' ? FLOTA_DATA : []) },
];

const ESTADO_MODAL_OPENERS = {
  aac: 'openAACModal', ascensores: 'openAscModal', escaleras: 'openEscModal',
  extractores: 'openExtModal', persianas: 'openPersModal', cortinas: 'openCorModal',
  bombas: 'openBomModal', meq: 'openPatioModal', mangas: 'openMangaModal',
  puertas: 'openPuertaModal', otros: 'openOtrosModal', flota: 'openModal',
};

let estadoOverridesIndex = {};
let estadoOTsIndex = {};
let estadoAllEquipos = null;
let estadoSearch = '';
let estadoFiltroCategoria = '';
let estadoFiltroEstado = '';
let estadoVista = 'categorias';
const estadoCatAbierta = {};
const estadoDetalleAbierto = {};

/* ─── Admin ──────────────────────────────────────────────────── */
function estadoIsAdmin() {
  return document.body.classList.contains('admin-mode');
}
function estadoPassword() {
  return sessionStorage.getItem('admin_pwd') || (typeof _adminPwd !== 'undefined' ? _adminPwd : '') || '';
}

/* ─── Índices ────────────────────────────────────────────────── */
function estadoBuildOverridesIndex() {
  const idx = {};
  (typeof ESTADO_OVERRIDES !== 'undefined' ? ESTADO_OVERRIDES : []).forEach(o => { idx[o.equipo] = o; });
  return idx;
}
function estadoBuildOTsIndex() {
  const idx = {};
  if (typeof getOTs !== 'function') return idx;
  getOTs().forEach(o => {
    if (!o.equipo) return;
    const prev = idx[o.equipo];
    if (!prev || String(o.fecha || '') > String(prev.fecha || '')) idx[o.equipo] = o;
  });
  return idx;
}
function estadoBuildAllEquipos() {
  const out = [];
  ESTADO_CATEGORIAS.forEach(cat => {
    (cat.get() || []).forEach(e => {
      if (!e || !e.equipo) return;
      out.push({ equipo: e.equipo, denominacion: e.denominacion || '', categoriaId: cat.id, categoriaLabel: cat.label, icon: cat.icon });
    });
  });
  return out;
}

function estadoCalcularAuto(equipo) {
  const ot = estadoOTsIndex[equipo];
  if (!ot) return 'ok';
  const est = (typeof getEffectiveEstado === 'function') ? getEffectiveEstado(ot) : ot.estado;
  if (est === 'urgente') return 'fuera_servicio';
  if (est === 'seguimiento') return 'atencion';
  return 'ok';
}
function estadoDe(equipo) {
  const ov = estadoOverridesIndex[equipo];
  if (ov && ov.estadoManual) return ov.estadoManual;
  return estadoCalcularAuto(equipo);
}
function estadoEsManual(equipo) {
  const ov = estadoOverridesIndex[equipo];
  return !!(ov && ov.estadoManual);
}
function estadoComentariosDe(equipo) {
  const ov = estadoOverridesIndex[equipo];
  return (ov && ov.comentarios) || [];
}

function estadoRefreshIndices() {
  estadoOverridesIndex = estadoBuildOverridesIndex();
  estadoOTsIndex = estadoBuildOTsIndex();
  if (!estadoAllEquipos) estadoAllEquipos = estadoBuildAllEquipos();
}

/* ─── Guardado (admin, vía GitHub) ───────────────────────────── */
async function estadoCommit(section, data, successMsg) {
  const pwd = estadoPassword();
  if (!pwd) {
    estadoToast('🔒 Iniciá sesión como administrador (candado, abajo a la izquierda) para guardar cambios.', 'error');
    return false;
  }
  try {
    const resp = await fetch('/api/update-equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data, password: pwd }),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || json.error) {
      estadoToast('❌ ' + (json.error || 'Error al guardar'), 'error');
      return false;
    }
    estadoToast(successMsg || '✓ Guardado. El sitio tarda ~1 min en redesplegar para que lo vean los demás.', 'success');
    return true;
  } catch (e) {
    estadoToast('❌ Error de red: ' + e.message, 'error');
    return false;
  }
}

function estadoGetOrCreateOverride(equipo) {
  let ov = ESTADO_OVERRIDES.find(o => o.equipo === equipo);
  if (!ov) { ov = { equipo, estadoManual: null, comentarios: [] }; ESTADO_OVERRIDES.push(ov); }
  if (!ov.comentarios) ov.comentarios = [];
  return ov;
}
function estadoPruneOverrides() {
  const kept = ESTADO_OVERRIDES.filter(o => o.estadoManual || (o.comentarios && o.comentarios.length));
  ESTADO_OVERRIDES.length = 0;
  ESTADO_OVERRIDES.push(...kept);
}

async function estadoSetManual(equipo, estado) {
  const ov = estadoGetOrCreateOverride(equipo);
  const prev = ov.estadoManual;
  ov.estadoManual = estado || null;
  estadoPruneOverrides();
  const ok = await estadoCommit('estados', ESTADO_OVERRIDES);
  if (ok) { estadoRefreshIndices(); renderEstadoSection(); }
  else { ov.estadoManual = prev; }
}

async function estadoAgregarComentarioEquipo(equipo, autor, texto) {
  const ov = estadoGetOrCreateOverride(equipo);
  ov.comentarios.push({ autor: autor || 'Anónimo', texto, fecha: new Date().toISOString() });
  const ok = await estadoCommit('estados', ESTADO_OVERRIDES, '✓ Comentario guardado.');
  if (ok) {
    try { localStorage.setItem('estado_ultimo_autor', autor || ''); } catch (e) {}
    estadoRefreshIndices(); renderEstadoSection();
  } else {
    ov.comentarios.pop();
  }
}

function estadoNuevoTareaId() {
  const nums = TAREAS_DATA.map(t => parseInt(String(t.id || '').replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
  return 'T' + ((nums.length ? Math.max(...nums) : 0) + 1);
}
async function estadoCrearTarea(titulo, descripcion, responsable) {
  const tarea = {
    id: estadoNuevoTareaId(), titulo, descripcion: descripcion || '', responsable: responsable || '',
    estado: 'pendiente', creadoPor: 'admin', fecha: new Date().toISOString(), comentarios: [],
  };
  TAREAS_DATA.push(tarea);
  const ok = await estadoCommit('tareas', TAREAS_DATA, '✓ Tarea creada.');
  if (ok) { renderEstadoSection(); } else { TAREAS_DATA.pop(); }
  return ok;
}
async function estadoToggleTarea(id) {
  const t = TAREAS_DATA.find(x => x.id === id);
  if (!t) return;
  const prev = t.estado;
  t.estado = (t.estado === 'hecha') ? 'pendiente' : 'hecha';
  const ok = await estadoCommit('tareas', TAREAS_DATA);
  if (ok) renderEstadoSection(); else t.estado = prev;
}
async function estadoAgregarComentarioTarea(id, autor, texto) {
  const t = TAREAS_DATA.find(x => x.id === id);
  if (!t) return;
  if (!t.comentarios) t.comentarios = [];
  t.comentarios.push({ autor: autor || 'Anónimo', texto, fecha: new Date().toISOString() });
  const ok = await estadoCommit('tareas', TAREAS_DATA, '✓ Comentario guardado.');
  if (ok) {
    try { localStorage.setItem('estado_ultimo_autor', autor || ''); } catch (e) {}
    renderEstadoSection();
  } else {
    t.comentarios.pop();
  }
}

/* ─── Ficha técnica (dispatcher por categoría) ──────────────── */
function estadoAbrirFicha(categoriaId, equipo) {
  const fnName = ESTADO_MODAL_OPENERS[categoriaId];
  if (fnName && typeof window[fnName] === 'function') { window[fnName](equipo); return; }
  estadoAbrirFichaGenerica(categoriaId, equipo);
}
function estadoAbrirFichaGenerica(categoriaId, equipo) {
  const cat = ESTADO_CATEGORIAS.find(c => c.id === categoriaId);
  const rec = cat ? (cat.get() || []).find(e => e.equipo === equipo) : null;
  const header = document.getElementById('estadoFichaModalHeader');
  const body = document.getElementById('estadoFichaModalBody');
  header.innerHTML = `<span class="modal-equipo">${equipo}</span><div class="modal-denom">${(rec && rec.denominacion) || ''}</div>`;
  if (!rec) {
    body.innerHTML = '<p>No se encontraron datos adicionales para este equipo.</p>';
  } else {
    const skip = new Set(['equipo', 'denominacion']);
    const rows = Object.entries(rec).filter(([k, v]) => v && !skip.has(k));
    body.innerHTML = rows.map(([k, v]) => `
      <div class="modal-field">
        <span class="modal-field-label">${k}</span>
        <span class="modal-field-value">${v}</span>
      </div>`).join('') || '<p>Sin datos adicionales.</p>';
  }
  document.getElementById('estadoFichaModalOverlay').classList.add('open');
}

/* ─── Filtros ────────────────────────────────────────────────── */
function estadoFiltrarLista() {
  return estadoAllEquipos.filter(e => {
    if (estadoFiltroCategoria && e.categoriaId !== estadoFiltroCategoria) return false;
    if (estadoFiltroEstado && estadoDe(e.equipo) !== estadoFiltroEstado) return false;
    if (estadoSearch) {
      const hay = (e.equipo + ' ' + e.denominacion).toLowerCase();
      if (!hay.includes(estadoSearch)) return false;
    }
    return true;
  });
}

/* ─── Toast ──────────────────────────────────────────────────── */
function estadoToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; toast.className = 'admin-toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = `admin-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ─── Render: stats ──────────────────────────────────────────── */
function renderEstadoStats() {
  const wrap = document.getElementById('estado-stats');
  const counts = { ok: 0, atencion: 0, reparacion: 0, fuera_servicio: 0 };
  estadoAllEquipos.forEach(e => { counts[estadoDe(e.equipo)]++; });
  const total = estadoAllEquipos.length;

  const cards = [
    { key: '', label: 'Total equipos', value: total, icon: '🚦', color: '#1a56a4' },
    { key: 'ok', label: ESTADO_META.ok.label, value: counts.ok, icon: ESTADO_META.ok.emoji, color: ESTADO_META.ok.color },
    { key: 'atencion', label: ESTADO_META.atencion.label, value: counts.atencion, icon: ESTADO_META.atencion.emoji, color: ESTADO_META.atencion.color },
    { key: 'reparacion', label: ESTADO_META.reparacion.label, value: counts.reparacion, icon: ESTADO_META.reparacion.emoji, color: ESTADO_META.reparacion.color },
    { key: 'fuera_servicio', label: ESTADO_META.fuera_servicio.label, value: counts.fuera_servicio, icon: ESTADO_META.fuera_servicio.emoji, color: ESTADO_META.fuera_servicio.color },
  ];
  wrap.innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}" data-estado-key="${c.key}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>`).join('');

  wrap.querySelectorAll('.stat-card-clickable').forEach(card => {
    card.addEventListener('click', () => {
      estadoFiltroEstado = card.dataset.estadoKey;
      document.getElementById('estado-filter-estado').value = estadoFiltroEstado;
      renderEstadoResultados();
    });
  });
}

/* ─── Render: fila de equipo (compartida por categorías y lista) ── */
function estadoRenderFilaEquipo(e) {
  const est = estadoDe(e.equipo);
  const meta = ESTADO_META[est];
  const manual = estadoEsManual(e.equipo);
  const comentarios = estadoComentariosDe(e.equipo);
  const abierto = !!estadoDetalleAbierto[e.equipo];
  const admin = estadoIsAdmin();

  const botonesEstado = admin ? `
    <div class="estado-set-botones">
      ${ESTADO_ORDEN.map(k => `
        <button type="button" class="estado-set-btn ${k === est ? 'active' : ''}" style="--btn-color:${ESTADO_META[k].color}" data-equipo="${e.equipo}" data-estado="${k}">
          ${ESTADO_META[k].emoji} ${ESTADO_META[k].label}
        </button>`).join('')}
      ${manual ? `<button type="button" class="estado-set-btn estado-set-auto" data-equipo="${e.equipo}" data-estado="">↺ Volver a automático</button>` : ''}
    </div>` : '';

  const formComentario = admin ? `
    <div class="estado-comentario-form">
      <input type="text" class="estado-comentario-autor" placeholder="Tu nombre" value="${(function(){ try { return localStorage.getItem('estado_ultimo_autor')||''; } catch(e){ return ''; } })()}" />
      <textarea class="estado-comentario-texto" rows="2" placeholder="Dejar un comentario..."></textarea>
      <button type="button" class="prog-btn prog-btn-primary estado-comentario-guardar" data-equipo="${e.equipo}">Comentar</button>
    </div>` : (comentarios.length ? '' : '<p class="estado-sin-comentarios">Sin comentarios. Iniciá sesión como administrador para dejar uno.</p>');

  return `
    <div class="estado-eq-row" data-equipo="${e.equipo}">
      <span class="estado-dot" style="background:${meta.color}" title="${meta.label}"></span>
      <div class="estado-eq-info">
        <span class="estado-eq-cod">${e.equipo}</span>
        <span class="estado-eq-denom" title="${e.denominacion}">${e.denominacion || '—'}</span>
      </div>
      <span class="estado-badge" style="background:${meta.color}18;color:${meta.color};border:1px solid ${meta.color}40">${meta.emoji} ${meta.label}${manual ? ' · manual' : ''}</span>
      ${comentarios.length ? `<span class="estado-comment-count">💬 ${comentarios.length}</span>` : ''}
      <button type="button" class="estado-ficha-btn" data-equipo="${e.equipo}" data-cat="${e.categoriaId}">📄 Ficha</button>
      <button type="button" class="estado-detalle-toggle" data-equipo="${e.equipo}">${abierto ? '▴' : '▾'}</button>
    </div>
    <div class="estado-eq-detalle ${abierto ? '' : 'hidden'}" data-detalle-de="${e.equipo}">
      ${botonesEstado}
      <div class="estado-comentarios-list">
        ${comentarios.length ? comentarios.map(c => `
          <div class="estado-comentario">
            <span class="estado-comentario-autor-nombre">${c.autor}</span>
            <span class="estado-comentario-fecha">${new Date(c.fecha).toLocaleString('es-AR')}</span>
            <p>${c.texto}</p>
          </div>`).join('') : ''}
      </div>
      ${formComentario}
    </div>`;
}

function estadoWireFilas(container) {
  container.querySelectorAll('.estado-ficha-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); estadoAbrirFicha(btn.dataset.cat, btn.dataset.equipo); });
  });
  container.querySelectorAll('.estado-detalle-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const eq = btn.dataset.equipo;
      estadoDetalleAbierto[eq] = !estadoDetalleAbierto[eq];
      renderEstadoResultados();
    });
  });
  container.querySelectorAll('.estado-set-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      estadoSetManual(btn.dataset.equipo, btn.dataset.estado);
    });
  });
  container.querySelectorAll('.estado-comentario-guardar').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const row = btn.closest('.estado-eq-detalle');
      const autor = row.querySelector('.estado-comentario-autor').value.trim();
      const texto = row.querySelector('.estado-comentario-texto').value.trim();
      if (!texto) { estadoToast('Escribí un comentario antes de guardar.', 'error'); return; }
      estadoAgregarComentarioEquipo(btn.dataset.equipo, autor, texto);
    });
  });
}

/* ─── Render: vista por categorías ──────────────────────────── */
function renderEstadoCategorias() {
  const wrap = document.getElementById('estado-categorias-wrap');
  const filtradas = estadoFiltrarLista();
  const equiposPorCat = {};
  filtradas.forEach(e => { (equiposPorCat[e.categoriaId] = equiposPorCat[e.categoriaId] || []).push(e); });

  const hayFiltroActivo = !!(estadoSearch || estadoFiltroEstado);
  const categorias = ESTADO_CATEGORIAS.filter(c => !estadoFiltroCategoria || c.id === estadoFiltroCategoria);

  wrap.innerHTML = categorias.map(cat => {
    const items = equiposPorCat[cat.id] || [];
    if (!items.length && (estadoFiltroCategoria || hayFiltroActivo)) return '';
    const counts = { ok: 0, atencion: 0, reparacion: 0, fuera_servicio: 0 };
    items.forEach(e => counts[estadoDe(e.equipo)]++);
    const abierta = !!estadoCatAbierta[cat.id] || hayFiltroActivo;

    return `
      <div class="estado-cat-card">
        <div class="estado-cat-header" data-cat-toggle="${cat.id}">
          <span class="estado-cat-icon">${cat.icon}</span>
          <span class="estado-cat-label">${cat.label}</span>
          <span class="estado-cat-total">${items.length} equipos</span>
          <div class="estado-cat-pills">
            ${ESTADO_ORDEN.filter(k => counts[k] > 0).map(k => `<span class="estado-cat-pill" style="background:${ESTADO_META[k].color}18;color:${ESTADO_META[k].color}">${ESTADO_META[k].emoji} ${counts[k]}</span>`).join('')}
          </div>
          <span class="estado-cat-chevron">${abierta ? '▴' : '▾'}</span>
        </div>
        <div class="estado-cat-body ${abierta ? '' : 'hidden'}">
          ${items.map(estadoRenderFilaEquipo).join('') || '<p class="estado-guardia-empty">Sin equipos en esta categoría.</p>'}
        </div>
      </div>`;
  }).join('');

  wrap.querySelectorAll('[data-cat-toggle]').forEach(h => {
    h.addEventListener('click', () => {
      const id = h.dataset.catToggle;
      estadoCatAbierta[id] = !estadoCatAbierta[id];
      renderEstadoCategorias();
    });
  });
  estadoWireFilas(wrap);
}

/* ─── Render: vista lista plana ─────────────────────────────── */
function renderEstadoLista() {
  const wrap = document.getElementById('estado-lista-wrap');
  const filtradas = estadoFiltrarLista();
  wrap.innerHTML = `<div class="estado-lista-count">${filtradas.length} de ${estadoAllEquipos.length} equipos</div>` +
    filtradas.map(estadoRenderFilaEquipo).join('');
  estadoWireFilas(wrap);
}

/* ─── Render: tareas ─────────────────────────────────────────── */
function renderEstadoTareas() {
  const wrap = document.getElementById('estado-tareas-wrap');
  const admin = estadoIsAdmin();
  const tareas = [...TAREAS_DATA].sort((a, b) => (a.estado === b.estado ? 0 : a.estado === 'hecha' ? 1 : -1));

  if (!tareas.length) {
    wrap.innerHTML = `<div class="prog-empty-state">
      <span class="prog-empty-icon">✅</span>
      <h3>No hay tareas cargadas</h3>
      <p>${admin ? 'Usá el botón "+ Nueva tarea" de arriba para cargar la primera.' : 'Iniciá sesión como administrador para cargar tareas.'}</p>
    </div>`;
    return;
  }

  wrap.innerHTML = tareas.map(t => `
    <div class="estado-tarea-row ${t.estado === 'hecha' ? 'hecha' : ''}">
      <button type="button" class="estado-tarea-check ${t.estado === 'hecha' ? 'checked' : ''}" data-tarea="${t.id}" title="${t.estado === 'hecha' ? 'Marcar pendiente' : 'Marcar hecha'}" ${admin ? '' : 'disabled'}>${t.estado === 'hecha' ? '✓' : ''}</button>
      <div class="estado-tarea-info">
        <span class="estado-tarea-titulo">${t.titulo}</span>
        ${t.descripcion ? `<span class="estado-tarea-desc">${t.descripcion}</span>` : ''}
        <span class="estado-tarea-meta">${t.responsable ? '👤 ' + t.responsable + ' · ' : ''}${new Date(t.fecha).toLocaleDateString('es-AR')}${t.comentarios && t.comentarios.length ? ' · 💬 ' + t.comentarios.length : ''}</span>
      </div>
      <button type="button" class="estado-detalle-toggle" data-tarea-toggle="${t.id}">${estadoDetalleAbierto['tarea_' + t.id] ? '▴' : '▾'}</button>
    </div>
    <div class="estado-eq-detalle ${estadoDetalleAbierto['tarea_' + t.id] ? '' : 'hidden'}">
      <div class="estado-comentarios-list">
        ${(t.comentarios || []).map(c => `
          <div class="estado-comentario">
            <span class="estado-comentario-autor-nombre">${c.autor}</span>
            <span class="estado-comentario-fecha">${new Date(c.fecha).toLocaleString('es-AR')}</span>
            <p>${c.texto}</p>
          </div>`).join('')}
      </div>
      ${admin ? `
        <div class="estado-comentario-form">
          <input type="text" class="estado-comentario-autor" placeholder="Tu nombre" value="${(function(){ try { return localStorage.getItem('estado_ultimo_autor')||''; } catch(e){ return ''; } })()}" />
          <textarea class="estado-comentario-texto" rows="2" placeholder="Dejar un comentario..."></textarea>
          <button type="button" class="prog-btn prog-btn-primary estado-tarea-comentario-guardar" data-tarea="${t.id}">Comentar</button>
        </div>` : ''}
    </div>
  `).join('');

  wrap.querySelectorAll('.estado-tarea-check').forEach(btn => {
    btn.addEventListener('click', () => estadoToggleTarea(btn.dataset.tarea));
  });
  wrap.querySelectorAll('[data-tarea-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = 'tarea_' + btn.dataset.tareaToggle;
      estadoDetalleAbierto[key] = !estadoDetalleAbierto[key];
      renderEstadoTareas();
    });
  });
  wrap.querySelectorAll('.estado-tarea-comentario-guardar').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.estado-eq-detalle');
      const autor = row.querySelector('.estado-comentario-autor').value.trim();
      const texto = row.querySelector('.estado-comentario-texto').value.trim();
      if (!texto) { estadoToast('Escribí un comentario antes de guardar.', 'error'); return; }
      estadoAgregarComentarioTarea(btn.dataset.tarea, autor, texto);
    });
  });
}

/* ─── Render dispatcher ──────────────────────────────────────── */
function renderEstadoResultados() {
  document.getElementById('estado-categorias-wrap').classList.toggle('hidden', estadoVista !== 'categorias');
  document.getElementById('estado-lista-wrap').classList.toggle('hidden', estadoVista !== 'lista');
  document.getElementById('estado-tareas-wrap').classList.toggle('hidden', estadoVista !== 'tareas');
  if (estadoVista === 'categorias') renderEstadoCategorias();
  if (estadoVista === 'lista') renderEstadoLista();
  if (estadoVista === 'tareas') renderEstadoTareas();
}

function renderEstadoSection() {
  if (!estadoAllEquipos) return;
  document.getElementById('estado-nueva-tarea-btn').classList.toggle('hidden', !estadoIsAdmin());
  renderEstadoStats();
  renderEstadoResultados();
}

/* ─── Init ───────────────────────────────────────────────────── */
(function initEstado() {
  const selCat = document.getElementById('estado-filter-categoria');
  ESTADO_CATEGORIAS.forEach(cat => {
    const o = document.createElement('option');
    o.value = cat.id; o.textContent = `${cat.icon} ${cat.label}`;
    selCat.appendChild(o);
  });

  document.getElementById('estado-search').addEventListener('input', function () {
    estadoSearch = this.value.trim().toLowerCase();
    document.getElementById('estado-clear-search').style.display = estadoSearch ? 'flex' : 'none';
    renderEstadoResultados();
  });
  document.getElementById('estado-clear-search').addEventListener('click', function () {
    estadoSearch = '';
    document.getElementById('estado-search').value = '';
    this.style.display = 'none';
    renderEstadoResultados();
  });
  document.getElementById('estado-filter-categoria').addEventListener('change', function () {
    estadoFiltroCategoria = this.value;
    renderEstadoResultados();
  });
  document.getElementById('estado-filter-estado').addEventListener('change', function () {
    estadoFiltroEstado = this.value;
    renderEstadoResultados();
  });
  document.querySelectorAll('[data-eview]').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-eview]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      estadoVista = this.dataset.eview;
      renderEstadoResultados();
    });
  });

  // Modal ficha genérica
  document.getElementById('estadoFichaModalClose').addEventListener('click', () => {
    document.getElementById('estadoFichaModalOverlay').classList.remove('open');
  });
  document.getElementById('estadoFichaModalOverlay').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });

  // Modal nueva tarea
  document.getElementById('estado-nueva-tarea-btn').addEventListener('click', () => {
    document.getElementById('estado-tarea-titulo').value = '';
    document.getElementById('estado-tarea-descripcion').value = '';
    document.getElementById('estado-tarea-responsable').value = '';
    document.getElementById('estadoTareaModalOverlay').classList.add('open');
  });
  document.getElementById('estadoTareaModalClose').addEventListener('click', () => {
    document.getElementById('estadoTareaModalOverlay').classList.remove('open');
  });
  document.getElementById('estadoTareaModalOverlay').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });
  document.getElementById('estado-tarea-guardar-btn').addEventListener('click', async () => {
    const titulo = document.getElementById('estado-tarea-titulo').value.trim();
    if (!titulo) { estadoToast('El título es obligatorio.', 'error'); return; }
    const descripcion = document.getElementById('estado-tarea-descripcion').value.trim();
    const responsable = document.getElementById('estado-tarea-responsable').value.trim();
    const ok = await estadoCrearTarea(titulo, descripcion, responsable);
    if (ok) document.getElementById('estadoTareaModalOverlay').classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.getElementById('estadoFichaModalOverlay').classList.remove('open');
    document.getElementById('estadoTareaModalOverlay').classList.remove('open');
  });

  // Re-renderizar si cambia el estado de sesión admin (login/logout) mientras la página está abierta
  new MutationObserver(() => {
    const page = document.getElementById('page-estado');
    if (page && !page.classList.contains('hidden')) renderEstadoSection();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Enganchar a la navegación: cargar OTs del servidor si hace falta y renderizar
  const _estadoOrigShowPage = window.showPage;
  window.showPage = function (pageId) {
    _estadoOrigShowPage(pageId);
    if (pageId === 'estado') {
      estadoRefreshIndices();
      renderEstadoSection();
      if (typeof getOTs === 'function' && getOTs().length === 0 && typeof initOTsFromServer === 'function') {
        initOTsFromServer().then(() => { estadoRefreshIndices(); renderEstadoSection(); });
      }
    }
  };
})();
