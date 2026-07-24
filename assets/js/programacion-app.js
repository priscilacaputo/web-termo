/* ─── Programación de OTs — distribución mensual entre guardias ───
   Reglas fijas de turno (no negociables):
     - Equipos MEQ*        → siempre Turno Noche
     - Equipos Roof Top    → siempre Turno Mañana
     - Equipos AVO*        → siempre Turno Mañana
   Guardias 1 y 2 = Turno Mañana · Guardias 3 y 4 = Turno Noche.

   Dentro de esas reglas, el resto de los equipos (y también los que sí
   tienen regla fija) se reparten entre las guardias del turno que les
   corresponde optimizando dos criterios, en este orden:
     1. Equidad de altura: los equipos que pagan altura (ALTURA_EQUIPOS)
        se reparten lo más parejo posible entre las guardias del turno.
     2. Cercanía física: se prioriza agrupar equipos de la misma zona/
        edificio en la misma guardia, para no perder tiempo en logística.
   Todo queda 100% editable por fila con el desplegable de guardia. */

const PROG_STORAGE_KEY   = 'programacion_ots_v1';
const PROG_GUARDIA_TURNO = { 1: 'mañana', 2: 'mañana', 3: 'noche', 4: 'noche' };
const PROG_POOL_TURNO    = { 'mañana': [1, 2], 'noche': [3, 4], 'libre': [1, 2, 3, 4] };

let progState  = { mes: '', ots: [] };
let progSearch = '';
let progFiltroTurno  = '';
let progFiltroRegla  = '';
let progFiltroZona   = '';
let progFiltroAltura = false;

/* ─── Índice global equipo → registro (ubicación, denominación, tipo) ──
   Las demás secciones declaran sus datos con `const NOMBRE_DATA = [...]`
   a nivel de script, lo que NO cuelga la variable de `window` — por eso
   se referencian directamente (con typeof-guard) en vez de window[nombre]. */
let _progEquipoIndex = null;
function progGetEquipoIndex() {
  if (_progEquipoIndex) return _progEquipoIndex;
  const idx = {};
  const sources = [];
  if (typeof AAC_DATA !== 'undefined')         sources.push(AAC_DATA);
  if (typeof MANGAS_DATA !== 'undefined')      sources.push(MANGAS_DATA);
  if (typeof ASCENSORES_DATA !== 'undefined')  sources.push(ASCENSORES_DATA);
  if (typeof ESCALERAS_DATA !== 'undefined')   sources.push(ESCALERAS_DATA);
  if (typeof EXTRACTORES_DATA !== 'undefined') sources.push(EXTRACTORES_DATA);
  if (typeof PERSIANAS_DATA !== 'undefined')   sources.push(PERSIANAS_DATA);
  if (typeof CORTINAS_DATA !== 'undefined')    sources.push(CORTINAS_DATA);
  if (typeof BOMBAS_DATA !== 'undefined')      sources.push(BOMBAS_DATA);
  if (typeof PATIO_DATA !== 'undefined')       sources.push(PATIO_DATA);
  if (typeof PUERTAS_DATA !== 'undefined')     sources.push(PUERTAS_DATA);
  if (typeof ECAS_DATA !== 'undefined')        sources.push(ECAS_DATA);
  if (typeof OTROS_DATA !== 'undefined')       sources.push(OTROS_DATA);

  sources.forEach(arr => {
    if (Array.isArray(arr)) arr.forEach(e => { if (e && e.equipo) idx[e.equipo] = e; });
  });
  _progEquipoIndex = idx;
  return idx;
}

/* ─── Zona / ubicación física ────────────────────────────────────── */
function progZonaFromUbicacion(ubicacion) {
  const u = String(ubicacion || '').toUpperCase();
  if (!u) return 'Sin ubicación';
  if (u.includes('-ED1-')) return 'Ed. I';
  if (u.includes('-ED2-')) return 'Ed. II';
  if (u.includes('-ED3-')) return 'Ed. III';
  if (u.includes('-ED4-')) return 'Ed. IV';
  if (u.includes('-ED5-')) return 'Ed. V';
  if (u.includes('-ED6-')) return 'Ed. VI';
  if (u.includes('-ED7-')) return 'Ed. VII';
  if (u.includes('-LAA-')) return 'LAA / Plataforma';
  if (u.includes('-ESR-')) return 'Ed. Sur / Estación';
  if (u.includes('-TER-')) return 'Terminal';
  return 'General';
}
function progZonaEquipo(equipo, ubicacionFallback) {
  if (String(equipo).toUpperCase().startsWith('AVO')) return 'Flota Vehicular';
  const rec = progGetEquipoIndex()[equipo];
  return progZonaFromUbicacion((rec && rec.ubicacion) || ubicacionFallback || '');
}

/* ─── Persistencia ───────────────────────────────────────── */
function progLoad() {
  try {
    const raw = localStorage.getItem(PROG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.ots)) progState = parsed;
    }
  } catch (e) { /* localStorage corrupto o no disponible: arrancamos vacío */ }
}
function progSave() {
  try { localStorage.setItem(PROG_STORAGE_KEY, JSON.stringify(progState)); }
  catch (e) { progToast('⚠ No se pudo guardar en este navegador.', 'error'); }
}

/* ─── Clasificación por Puesto de trabajo principal (Aire / Mecánicos) ──
   Viene del Excel de SAP: AUX_TER (Auxiliar Termomecánica) → Aire,
   AUX_MEC (Auxiliar Mecánica) → Mecánicos. Se detecta por substring para
   tolerar tanto el código corto como el texto descriptivo completo. */
function progClasificarPuesto(raw) {
  const v = String(raw || '').trim().toUpperCase();
  if (!v) return null;
  if (v.includes('MEC')) return 'mecanico';
  if (v.includes('TER')) return 'aire';
  return null;
}

/* ─── Clasificación por regla fija de turno ─────────────────────── */
function progClasificar(equipo, denominacionExcel, tipoExcel) {
  const eq  = String(equipo || '').trim().toUpperCase();
  const rec = progGetEquipoIndex()[eq];
  const denom = String(denominacionExcel || (rec && rec.denominacion) || '').toLowerCase();
  const tipo  = String(tipoExcel || (rec && rec.tipo) || '').toLowerCase();

  if (eq.startsWith('MEQ')) return { regla: 'MEQ', turno: 'noche' };
  if (eq.startsWith('AVO')) return { regla: 'AVO', turno: 'mañana' };

  const esRoofTop = tipo.includes('roof top') || denom.includes('roof top') || (rec && rec.tipo === 'Roof Top');
  if (esRoofTop) return { regla: 'Roof Top', turno: 'mañana' };

  return { regla: null, turno: null };
}

/* ─── Asignación de guardia: equidad de altura + cercanía física ──
   Se procesa agrupando por zona (para favorecer que una misma guardia
   se quede con los equipos de un mismo edificio) y, dentro de cada
   zona, primero los que pagan altura (para repartirlos parejo antes
   de que el resto llene el cupo de cada guardia). */
function progCompararClaves(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}
function progAsignarPendientes(pendientes, yaAsignados) {
  const totalCount  = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const alturaCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const zonaCount   = { 1: {}, 2: {}, 3: {}, 4: {} };

  function registrar(o) {
    totalCount[o.guardia]++;
    if (o.esAltura) alturaCount[o.guardia]++;
    zonaCount[o.guardia][o.zona] = (zonaCount[o.guardia][o.zona] || 0) + 1;
  }
  yaAsignados.forEach(registrar);

  const ordenados = [...pendientes].sort((a, b) => {
    if (a.zona !== b.zona) return a.zona.localeCompare(b.zona);
    if (a.esAltura !== b.esAltura) return a.esAltura ? -1 : 1;
    return 0;
  });

  ordenados.forEach(o => {
    const pool = PROG_POOL_TURNO[o.turno] || PROG_POOL_TURNO.libre;
    let mejorGuardia = pool[0];
    let mejorClave = null;
    pool.forEach(g => {
      const cercania = zonaCount[g][o.zona] || 0;
      const clave = o.esAltura
        ? [alturaCount[g], -cercania, totalCount[g], g]   // 1° equidad de altura, 2° cercanía, 3° carga total
        : [-cercania, totalCount[g], g];                   // 1° cercanía, 2° carga total
      if (mejorClave === null || progCompararClaves(clave, mejorClave) < 0) {
        mejorClave = clave;
        mejorGuardia = g;
      }
    });
    o.guardia = mejorGuardia;
    registrar(o);
  });

  return pendientes;
}

/* ─── Carga de Excel ─────────────────────────────────────── */
function progHandleFile(file) {
  if (typeof XLSX === 'undefined') {
    progToast('❌ La librería para leer Excel no está disponible (revisá tu conexión).', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb   = XLSX.read(e.target.result, { type: 'array' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) {
        progToast('❌ El archivo está vacío o no tiene filas de datos.', 'error');
        return;
      }

      const ALIASES = {
        'equipo': 'equipo', 'código de equipo': 'equipo', 'codigo de equipo': 'equipo',
        'objeto técnico': 'objeto_tecnico', 'objeto tecnico': 'objeto_tecnico',
        'denominación': 'denominacion', 'denominacion': 'denominacion',
        'denominación de objeto técnico': 'denominacion', 'denominacion de objeto tecnico': 'denominacion',
        'descripción': 'denominacion', 'descripcion': 'denominacion',
        'texto breve de objeto': 'denominacion',
        'tipo': 'tipo', 'clase de equipo': 'tipo',
        'ubicación técnica': 'ubicacion_tecnica', 'ubicacion tecnica': 'ubicacion_tecnica',
        'orden': 'ot_num', 'ot': 'ot_num', 'n° de orden': 'ot_num', 'número de orden': 'ot_num',
        'puesto de trabajo principal': 'puesto_trabajo', 'puesto de trabajo': 'puesto_trabajo',
      };

      const parsedRows = rows.map(row => {
        const obj = {};
        Object.entries(row).forEach(([header, val]) => {
          const key = ALIASES[String(header).trim().toLowerCase()];
          if (key) obj[key] = (val === null || val === undefined) ? '' : String(val).trim();
        });
        /* "Objeto técnico" de SAP suele venir como "Denominación (CÓDIGO)".
           Es la fuente de equipo que pide este formato — tiene prioridad
           sobre una columna "Equipo" suelta si ambas están presentes. */
        if (obj.objeto_tecnico) {
          const codigo = (typeof extractEquipoCode === 'function')
            ? extractEquipoCode(obj.objeto_tecnico)
            : obj.objeto_tecnico.toUpperCase();
          if (codigo) obj.equipo = codigo;
          if (!obj.denominacion && typeof extractEquipoDesc === 'function') {
            const desc = extractEquipoDesc(obj.objeto_tecnico);
            if (desc) obj.denominacion = desc;
          }
        }
        return obj;
      }).filter(o => String(o.equipo || '').trim() !== '');

      if (!parsedRows.length) {
        const found = Object.keys(rows[0] || {}).join(', ');
        progToast(`❌ No encontré la columna "Objeto técnico" ni "Equipo" en el archivo.\nColumnas encontradas: ${found}`, 'error');
        return;
      }

      const idx = progGetEquipoIndex();
      const existingByKey = {};
      progState.ots.forEach(o => { existingByKey[o.equipo + '|' + (o.ot_num || '')] = o; });

      const merged = [];
      const pendientes = [];
      const yaAsignados = [];

      parsedRows.forEach((r, i) => {
        const equipo = String(r.equipo).trim().toUpperCase();
        const otNum = (typeof extractOTNum === 'function' && r.ot_num) ? extractOTNum(r.ot_num) : (r.ot_num || '');
        const key  = equipo + '|' + otNum;
        const prev = existingByKey[key];
        const rec  = idx[equipo];
        const denominacion = r.denominacion || (rec && rec.denominacion) || (prev && prev.denominacion) || '';
        const { regla, turno } = progClasificar(equipo, denominacion, r.tipo);
        const esAltura = (typeof ALTURA_EQUIPOS !== 'undefined') && ALTURA_EQUIPOS.has(equipo);
        const zona = progZonaEquipo(equipo, (rec && rec.ubicacion) || r.ubicacion_tecnica);
        const puesto = r.puesto_trabajo ? progClasificarPuesto(r.puesto_trabajo) : ((prev && prev.puesto) || null);

        if (prev) {
          const item = { ...prev, equipo, denominacion, ot_num: otNum, regla, turno, esAltura, zona, puesto };
          merged.push(item);
          yaAsignados.push(item);
        } else {
          const item = {
            id: equipo + '#' + i + '#' + Date.now(),
            equipo, denominacion, ot_num: otNum,
            regla, turno, esAltura, zona, puesto,
            guardia: null,
          };
          merged.push(item);
          pendientes.push(item);
        }
      });

      progAsignarPendientes(pendientes, yaAsignados);

      progState.ots = merged;
      if (!progState.mes) progState.mes = document.getElementById('prog-mes-input').value || new Date().toISOString().slice(0, 7);
      progSave();
      renderProgramacion();
      progToast(`✓ ${merged.length} equipos cargados (${pendientes.length} nuevos distribuidos automáticamente).`, 'success');

    } catch (err) {
      progToast(`❌ Error al leer el archivo: ${err.message}`, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ─── Filtros ────────────────────────────────────────────── */
function progFiltered() {
  return progState.ots.filter(o => {
    if (progFiltroTurno && o.turno !== progFiltroTurno) return false;
    if (progFiltroRegla === '__sin_regla__' && o.regla) return false;
    if (progFiltroRegla && progFiltroRegla !== '__sin_regla__' && o.regla !== progFiltroRegla) return false;
    if (progFiltroZona && o.zona !== progFiltroZona) return false;
    if (progFiltroAltura && !o.esAltura) return false;
    if (progSearch) {
      const hay = (o.equipo + ' ' + o.denominacion).toLowerCase();
      if (!hay.includes(progSearch)) return false;
    }
    return true;
  });
}

/* ─── Render ─────────────────────────────────────────────── */
function renderProgramacion() {
  const hasData = progState.ots.length > 0;
  document.getElementById('prog-empty-state').classList.toggle('hidden', hasData);
  document.getElementById('prog-toolbar').style.display = hasData ? '' : 'none';
  document.getElementById('prog-stats').style.display = hasData ? '' : 'none';

  renderProgFiltroZona();
  renderProgStats();
  renderProgGuardias();
}

function renderProgFiltroZona() {
  const sel = document.getElementById('prog-filter-zona');
  const zonas = [...new Set(progState.ots.map(o => o.zona))].sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">Todas las zonas</option>' +
    zonas.map(z => `<option value="${z}">${z}</option>`).join('');
  if (zonas.includes(current)) sel.value = current;
  else progFiltroZona = '';
}

function renderProgStats() {
  const wrap = document.getElementById('prog-stats');
  if (!progState.ots.length) { wrap.innerHTML = ''; return; }

  const total          = progState.ots.length;
  const manana         = progState.ots.filter(o => o.turno === 'mañana').length;
  const noche          = progState.ots.filter(o => o.turno === 'noche').length;
  const altura         = progState.ots.filter(o => o.esAltura).length;
  const alturaAire      = progState.ots.filter(o => o.esAltura && o.puesto === 'aire').length;
  const alturaMecanico  = progState.ots.filter(o => o.esAltura && o.puesto === 'mecanico').length;

  const cards = [
    { label: 'Total equipos', value: total, icon: '🗓️', color: '#1a56a4' },
    { label: '☀️ Turno mañana', value: manana, icon: '☀️', color: '#d97706' },
    { label: '🌙 Turno noche', value: noche, icon: '🌙', color: '#4338ca' },
    { label: '⛰️ Pagan altura', value: altura, icon: '⛰️', color: '#92400e' },
    { label: '⛰️ Altura Aire', value: alturaAire, icon: '💨', color: '#0369a1' },
    { label: '⛰️ Altura Mecánicos', value: alturaMecanico, icon: '🔧', color: '#b45309' },
  ];

  wrap.innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

function progGuardiaLabel(id) {
  return `Guardia ${id}`;
}

function renderProgGuardias() {
  const wrap = document.getElementById('prog-guardias-wrap');
  if (!progState.ots.length) { wrap.innerHTML = ''; return; }

  const filtradas = progFiltered();
  const hayFiltrosActivos = !!(progSearch || progFiltroTurno || progFiltroRegla || progFiltroZona || progFiltroAltura);

  wrap.innerHTML = [1, 2, 3, 4].map(gid => {
    const turno = PROG_GUARDIA_TURNO[gid];
    const items = filtradas.filter(o => o.guardia === gid);
    const alturaEnGuardia = items.filter(o => o.esAltura).length;

    const rows = items.length
      ? items.map(o => `
          <div class="prog-ot-row">
            <div class="prog-ot-info">
              <span class="prog-ot-equipo">${o.equipo}</span>
              <span class="prog-ot-denom" title="${o.denominacion}">${o.denominacion || '—'}</span>
              <span class="prog-ot-zona">📍 ${o.zona}</span>
            </div>
            ${o.esAltura ? `<span class="prog-altura-badge" title="Paga altura">⛰️</span>` : ''}
            ${o.regla ? `<span class="prog-regla-badge ${o.turno === 'noche' ? 'noche' : 'manana'}">${o.regla === 'MEQ' ? '🌙' : '☀️'} ${o.regla}</span>` : `<span class="prog-regla-badge libre">✏️ Sin regla</span>`}
            <select class="prog-ot-select" data-id="${o.id}">
              ${[1, 2, 3, 4].map(n => `<option value="${n}" ${n === o.guardia ? 'selected' : ''}>Guardia ${n} (${PROG_GUARDIA_TURNO[n] === 'mañana' ? '☀️ Mañana' : '🌙 Noche'})</option>`).join('')}
            </select>
          </div>
        `).join('')
      : `<p class="prog-guardia-empty">Sin equipos asignados${hayFiltrosActivos ? ' (con los filtros actuales)' : ''}.</p>`;

    return `
      <div class="prog-guardia-card">
        <div class="prog-guardia-header">
          <span class="prog-guardia-name">${progGuardiaLabel(gid)}</span>
          <span class="turno-badge ${turno === 'noche' ? 'noche' : 'manana'}">${turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
          <span class="prog-guardia-count">${items.length} OT${items.length === 1 ? '' : 's'}${alturaEnGuardia ? ` · ⛰️ ${alturaEnGuardia}` : ''}</span>
        </div>
        <div class="prog-guardia-list">${rows}</div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('.prog-ot-select').forEach(sel => {
    sel.addEventListener('change', function () {
      const ot = progState.ots.find(o => o.id === this.dataset.id);
      if (ot) {
        ot.guardia = parseInt(this.value, 10);
        progSave();
        renderProgramacion();
      }
    });
  });
}

/* ─── Exportar Excel ─────────────────────────────────────── */
function progExportExcel() {
  if (!progState.ots.length) {
    progToast('No hay datos para exportar.', 'error');
    return;
  }
  if (typeof XLSX === 'undefined') {
    progToast('❌ La librería para exportar Excel no está disponible.', 'error');
    return;
  }
  const rows = [...progState.ots]
    .sort((a, b) => a.guardia - b.guardia || a.equipo.localeCompare(b.equipo))
    .map(o => ({
      'Guardia': progGuardiaLabel(o.guardia),
      'Turno': PROG_GUARDIA_TURNO[o.guardia] === 'noche' ? 'Noche' : 'Mañana',
      'Equipo': o.equipo,
      'Denominación': o.denominacion || '',
      'Zona': o.zona,
      'Paga altura': o.esAltura ? 'Sí' : 'No',
      'Puesto de trabajo': o.puesto === 'aire' ? 'Aire' : (o.puesto === 'mecanico' ? 'Mecánicos' : ''),
      'Regla aplicada': o.regla || 'Sin regla fija',
    }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Programación');
  const mes = progState.mes || new Date().toISOString().slice(0, 7);
  XLSX.writeFile(wb, `Programacion_OTs_${mes}.xlsx`);
}

/* ─── Reset ──────────────────────────────────────────────── */
function progReset() {
  if (!progState.ots.length) return;
  const ok = window.confirm('¿Vaciar la programación actual? Esto borra todas las asignaciones cargadas (no afecta el Excel original).');
  if (!ok) return;
  progState = { mes: document.getElementById('prog-mes-input').value || '', ots: [] };
  progSave();
  renderProgramacion();
}

/* ─── Toast ──────────────────────────────────────────────── */
function progToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; toast.className = 'admin-toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = `admin-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ─── Init ───────────────────────────────────────────────── */
(function initProgramacion() {
  progLoad();

  const mesInput = document.getElementById('prog-mes-input');
  mesInput.value = progState.mes || new Date().toISOString().slice(0, 7);
  mesInput.addEventListener('change', function () {
    progState.mes = this.value;
    progSave();
  });

  document.getElementById('prog-upload-btn').addEventListener('click', () => {
    document.getElementById('prog-file-input').click();
  });
  document.getElementById('prog-file-input').addEventListener('change', function () {
    const file = this.files[0];
    this.value = '';
    if (file) progHandleFile(file);
  });

  document.getElementById('prog-export-btn').addEventListener('click', progExportExcel);
  document.getElementById('prog-reset-btn').addEventListener('click', progReset);

  document.getElementById('prog-search').addEventListener('input', function () {
    progSearch = this.value.trim().toLowerCase();
    document.getElementById('prog-clear-search').style.display = progSearch ? 'flex' : 'none';
    renderProgGuardias();
  });
  document.getElementById('prog-clear-search').addEventListener('click', function () {
    progSearch = '';
    document.getElementById('prog-search').value = '';
    this.style.display = 'none';
    renderProgGuardias();
  });
  document.getElementById('prog-filter-turno').addEventListener('change', function () {
    progFiltroTurno = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-regla').addEventListener('change', function () {
    progFiltroRegla = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-zona').addEventListener('change', function () {
    progFiltroZona = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-altura').addEventListener('click', function () {
    progFiltroAltura = !progFiltroAltura;
    this.classList.toggle('active', progFiltroAltura);
    renderProgGuardias();
  });

  renderProgramacion();
})();
