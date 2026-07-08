/* ═══════════════════════════════════════════════════════
   OTs App — Historial SAP · UI + Modal injection
   ═══════════════════════════════════════════════════════ */

/* ── Render sección principal ──────────────────────────── */
function renderOTsSection() {
  const section = document.getElementById('ots-section');
  if (!section) return;
  const ots = getOTs();
  const equiposList = [...new Set(ots.map(o => o.equipo))].sort();
  const tecnicos    = [...new Set(ots.map(o => o.tecnico).filter(Boolean))].sort();

  section.innerHTML = `
    <!-- Upload card -->
    <div class="ots-upload-card">
      <div class="ots-upload-icon">📂</div>
      <div class="ots-upload-body">
        <h3 class="ots-upload-title">Cargar historial desde Excel SAP</h3>
        <p class="ots-upload-desc">El archivo debe contener al menos: número de equipo, número de OT, fecha, tiempo imputado, técnico y comentario técnico.</p>
        <div class="ots-upload-row">
          <label class="ots-file-btn" for="otsFileInput">📤 Seleccionar archivo Excel</label>
          <input type="file" id="otsFileInput" accept=".xlsx,.xls" style="display:none">
          ${ots.length > 0 ? `
            <span class="ots-loaded-badge">✓ ${ots.length} OTs cargadas · ${equiposList.length} equipos</span>
            <button class="ots-clear-btn" onclick="confirmClearOTs()">🗑 Limpiar datos</button>
          ` : ''}
        </div>
      </div>
    </div>

    ${ots.length === 0 ? `
      <div class="ots-empty-state">
        <div class="ots-empty-icon">📋</div>
        <p>Aún no hay OTs cargadas.<br>Subí el Excel exportado de SAP para comenzar el análisis.</p>
      </div>
    ` : `

      <!-- Stats rápidas -->
      <div class="ots-stats-row">
        ${otsStatCard(ots.length,                                       'OTs totales',          '#1a56a4', '📋')}
        ${otsStatCard(equiposList.length,                               'Equipos',              '#7c3aed', '🏭')}
        ${otsStatCard(ots.filter(o=>o.estado==='urgente').length,       'Urgentes',             '#dc2626', '🔴', 'urgente')}
        ${otsStatCard(ots.filter(o=>o.estado==='correctivo').length,    'Correctivo sugerido',  '#ea580c', '🟠', 'correctivo')}
        ${otsStatCard(ots.filter(o=>o.estado==='seguimiento').length,   'Seguimiento',          '#d97706', '🟡', 'seguimiento')}
        ${otsStatCard(ots.filter(o=>o.estado==='ok').length,            'OK',                   '#10b981', '🟢', 'ok')}
      </div>

      <!-- Filtros -->
      <div class="ots-filters">
        <select id="otsEquipoFilter" class="ots-filter-sel">
          <option value="">Todos los equipos</option>
          ${equiposList.map(e => `<option value="${e}">${e}</option>`).join('')}
        </select>
        <select id="otsTecnicoFilter" class="ots-filter-sel">
          <option value="">Todos los técnicos</option>
          ${tecnicos.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <select id="otsEstadoFilter" class="ots-filter-sel">
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
        <button class="ots-export-btn" onclick="exportOTsExcel()">⬇ Excel</button>
      </div>

      <!-- Tabla -->
      <div class="ots-table-wrap">
        <table class="ots-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>OT</th>
              <th>Fecha</th>
              <th>Técnico</th>
              <th style="text-align:center">Tiempo (h)</th>
              <th>Comentario técnico</th>
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
    ['otsEquipoFilter','otsTecnicoFilter','otsEstadoFilter','otsFechaDesde','otsFechaHasta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', renderOTsTable);
    });

    // Clic en stat card filtra por estado
    document.querySelectorAll('.ots-stat-card[data-estado]').forEach(card => {
      card.addEventListener('click', () => {
        const el = document.getElementById('otsEstadoFilter');
        if (el) { el.value = card.dataset.estado; renderOTsTable(); }
      });
    });

    renderOTsTable();
    renderOTsRecommendations();
  }
}

function otsStatCard(value, label, color, icon, estado) {
  const attr = estado ? `data-estado="${estado}"` : '';
  const cursor = estado ? 'cursor:pointer' : '';
  return `
    <div class="ots-stat-card" style="--ots-color:${color};${cursor}" ${attr}>
      <span class="ots-stat-icon">${icon}</span>
      <span class="ots-stat-n">${value}</span>
      <span class="ots-stat-l">${label}</span>
    </div>
  `;
}

/* ── Tabla principal ───────────────────────────────────── */
function getFilteredOTs() {
  let ots = getOTs();
  const equipo = document.getElementById('otsEquipoFilter')?.value;
  const tecnico = document.getElementById('otsTecnicoFilter')?.value;
  const estado  = document.getElementById('otsEstadoFilter')?.value;
  const desde   = document.getElementById('otsFechaDesde')?.value;
  const hasta   = document.getElementById('otsFechaHasta')?.value;
  if (equipo)  ots = ots.filter(o => o.equipo === equipo);
  if (tecnico) ots = ots.filter(o => o.tecnico === tecnico);
  if (estado)  ots = ots.filter(o => o.estado === estado);
  if (desde)   ots = ots.filter(o => o.fecha >= desde);
  if (hasta)   ots = ots.filter(o => o.fecha <= hasta);
  return ots;
}

function clearOTsFilters() {
  ['otsEquipoFilter','otsTecnicoFilter','otsEstadoFilter','otsFechaDesde','otsFechaHasta']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  renderOTsTable();
}

function renderOTsTable() {
  const tbody = document.getElementById('otsTableBody');
  if (!tbody) return;
  const ots = getFilteredOTs();

  if (ots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="ots-empty-row">Sin resultados con los filtros aplicados.</td></tr>`;
    return;
  }

  tbody.innerHTML = ots.map(o => {
    const m = OTS_ESTADO_META[o.estado] || OTS_ESTADO_META.ok;
    return `
      <tr>
        <td><span class="ots-equipo-tag">${o.equipo}</span></td>
        <td><code class="ots-ot-code">${o.ot || '—'}</code></td>
        <td class="ots-fecha-cell">${o.fecha || '—'}</td>
        <td class="ots-tecnico-cell">${o.tecnico || '—'}</td>
        <td style="text-align:center">${o.tiempo != null && o.tiempo !== '' ? Number(o.tiempo).toFixed(1) : '—'}</td>
        <td class="ots-comentario-cell" title="${(o.comentario||'').replace(/"/g,"'")}">${o.comentario || '—'}</td>
        <td><span class="ots-badge ${m.cls}">${m.emoji} ${m.label}</span></td>
        <td class="ots-accion-cell">${o.accion || '—'}</td>
      </tr>
    `;
  }).join('');
}

/* ── Recomendaciones por equipo ────────────────────────── */
function renderOTsRecommendations() {
  const grid = document.getElementById('otsRecsGrid');
  if (!grid) return;
  const ots = getOTs();
  const equipos = [...new Set(ots.map(o => o.equipo))].sort();

  const items = equipos.map(eq => {
    const eqOTs = ots.filter(o => o.equipo === eq);
    return { equipo: eq, analysis: analyzeEquipmentHistory(eqOTs) };
  }).sort((a, b) => {
    const order = { urgente: 0, correctivo: 1, seguimiento: 2, ok: 3 };
    return (order[a.analysis.nivel] || 3) - (order[b.analysis.nivel] || 3);
  });

  grid.innerHTML = items.map(({ equipo, analysis: a }) => {
    const m = OTS_ESTADO_META[a.nivel] || OTS_ESTADO_META.ok;
    return `
      <div class="ots-rec-card ots-rec-${a.nivel}">
        <div class="ots-rec-header">
          <span class="ots-equipo-tag">${equipo}</span>
          <span class="ots-badge ${m.cls}">${m.emoji} ${m.label}</span>
        </div>
        <p class="ots-rec-text">${a.recomendacion}</p>
        <div class="ots-rec-meta">
          <span>📋 ${a.totalOTs} OTs</span>
          <span>⏱ ${a.tiempoTotal.toFixed(1)} h</span>
          ${a.urgentes    > 0 ? `<span class="ots-rec-meta-alert">🔴 ${a.urgentes} urgentes</span>` : ''}
          ${a.correctivos > 0 ? `<span class="ots-rec-meta-warn">🟠 ${a.correctivos} correctivos</span>` : ''}
          ${a.seguimiento > 0 ? `<span class="ots-rec-meta-info">🟡 ${a.seguimiento} seguimiento</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* ── Manejo de archivo Excel ───────────────────────────── */
function handleOTsFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const wb   = XLSX.read(ev.target.result, { type: 'binary', cellDates: true });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

      if (rows.length < 2) {
        showOTsToast('El archivo está vacío o no tiene datos.', 'error');
        return;
      }

      const headers = rows[0];
      const colMap  = mapOTSHeaders(headers);
      const missing = ['equipo', 'ot'].filter(k => colMap[k] === undefined);

      if (missing.length > 0) {
        showOTsToast(
          `No se encontraron las columnas: ${missing.join(', ')}. ` +
          `Columnas detectadas: ${headers.slice(0,8).join(', ')}`, 'error'
        );
        return;
      }

      const parsed = rows.slice(1)
        .filter(r => r.some(c => c !== null && c !== undefined && c !== ''))
        .map(row => {
          const comentario = colMap.comentario !== undefined
            ? String(row[colMap.comentario] || '').trim() : '';
          const analysis = analyzeComment(comentario);

          let fecha = '';
          if (colMap.fecha !== undefined) {
            const raw = row[colMap.fecha];
            if (raw) {
              const d = new Date(raw);
              if (!isNaN(d.getTime())) {
                fecha = d.toISOString().split('T')[0];
              } else {
                // Try dd/mm/yyyy
                const parts = String(raw).split(/[\/\-\.]/);
                if (parts.length === 3) {
                  const [p1, p2, p3] = parts;
                  const year  = p3.length === 4 ? p3 : p1;
                  const month = p3.length === 4 ? p2 : p2;
                  const day   = p3.length === 4 ? p1 : p3;
                  fecha = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
                } else {
                  fecha = String(raw).trim();
                }
              }
            }
          }

          const tiempoRaw = colMap.tiempo !== undefined
            ? String(row[colMap.tiempo] || '0').replace(',', '.') : '0';
          const tiempo = parseFloat(tiempoRaw) || 0;

          return {
            equipo:     String(row[colMap.equipo] || '').trim().toUpperCase(),
            ot:         colMap.ot !== undefined ? String(row[colMap.ot] || '').trim() : '',
            fecha,
            tiempo,
            tecnico:    colMap.tecnico !== undefined ? String(row[colMap.tecnico] || '').trim() : '',
            comentario,
            estado:     analysis.estado,
            accion:     analysis.accion
          };
        })
        .filter(o => o.equipo);

      if (parsed.length === 0) {
        showOTsToast('No se pudieron procesar registros. Verificá el formato del archivo.', 'error');
        return;
      }

      const existing = getOTs();
      if (existing.length > 0) {
        if (!confirm(`Ya hay ${existing.length} OTs cargadas.\n¿Reemplazar con las ${parsed.length} OTs del nuevo archivo?`)) {
          e.target.value = '';
          return;
        }
      }

      saveOTs(parsed);
      e.target.value = '';
      showOTsToast(`✓ ${parsed.length} OTs cargadas y analizadas correctamente.`, 'success');
      setTimeout(renderOTsSection, 400);

    } catch(err) {
      showOTsToast('Error al procesar el archivo: ' + err.message, 'error');
      console.error(err);
    }
  };
  reader.readAsBinaryString(file);
}

function confirmClearOTs() {
  if (confirm('¿Eliminar todos los datos de OTs cargados?\nEsta acción no se puede deshacer.')) {
    clearOTs();
    renderOTsSection();
    showOTsToast('Datos de OTs eliminados.', 'success');
  }
}

/* ── Toast ─────────────────────────────────────────────── */
function showOTsToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `admin-toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── Exportar Excel historial filtrado ─────────────────── */
function exportOTsExcel() {
  const ots = getFilteredOTs();
  if (ots.length === 0) { showOTsToast('Sin datos para exportar con los filtros actuales.', 'error'); return; }

  const rows = ots.map(o => ({
    'Equipo':          o.equipo,
    'Número OT':       o.ot,
    'Fecha':           o.fecha,
    'Técnico':         o.tecnico,
    'Tiempo (h)':      o.tiempo,
    'Comentario':      o.comentario,
    'Estado detectado': OTS_ESTADO_META[o.estado]?.label || o.estado,
    'Acción sugerida': o.accion
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [12,14,12,20,10,40,22,40].map(w => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial OTs');
  XLSX.writeFile(wb, `historial-ots-${new Date().toISOString().slice(0,10)}.xlsx`);
}

/* ── Exportar Excel correctivos sugeridos ──────────────── */
function exportCorrectivosExcel() {
  const ots    = getOTs();
  const equipos = [...new Set(ots.map(o => o.equipo))];

  const rows = equipos
    .map(eq => {
      const eqOTs = ots.filter(o => o.equipo === eq);
      const a = analyzeEquipmentHistory(eqOTs);
      return {
        'Equipo':            eq,
        'Nivel':             OTS_ESTADO_META[a.nivel]?.label || a.nivel,
        'Total OTs':         a.totalOTs,
        'Tiempo total (h)':  a.tiempoTotal.toFixed(1),
        'Urgentes':          a.urgentes,
        'Correctivos':       a.correctivos,
        'Seguimiento':       a.seguimiento,
        'Recomendación':     a.recomendacion
      };
    })
    .filter(r => r['Nivel'] !== 'OK')
    .sort((a, b) => {
      const order = { 'Urgente': 0, 'Correctivo sugerido': 1, 'Seguimiento': 2 };
      return (order[a['Nivel']] ?? 9) - (order[b['Nivel']] ?? 9);
    });

  if (rows.length === 0) { showOTsToast('No hay equipos con correctivos sugeridos.', 'error'); return; }

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [12,22,10,14,10,12,12,50].map(w => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Correctivos');
  XLSX.writeFile(wb, `equipos-correctivos-${new Date().toISOString().slice(0,10)}.xlsx`);
}

/* ── Historial en modal de equipo ──────────────────────── */
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
        <span>⏱ ${analysis.tiempoTotal.toFixed(1)} h imputadas</span>
        ${analysis.urgentes    > 0 ? `<span style="color:#dc2626">🔴 ${analysis.urgentes} urgentes</span>` : ''}
        ${analysis.correctivos > 0 ? `<span style="color:#ea580c">🟠 ${analysis.correctivos} correctivos</span>` : ''}
        ${analysis.seguimiento > 0 ? `<span style="color:#d97706">🟡 ${analysis.seguimiento} seguimiento</span>` : ''}
      </div>
      <div class="ots-modal-table-wrap">
        <table class="ots-modal-table">
          <thead>
            <tr><th>Fecha</th><th>OT</th><th>Técnico</th><th>Tiempo</th><th>Estado</th><th>Comentario</th></tr>
          </thead>
          <tbody>
            ${ots
              .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
              .map(o => {
                const em = OTS_ESTADO_META[o.estado] || OTS_ESTADO_META.ok;
                return `
                  <tr>
                    <td class="ots-modal-td-mono">${o.fecha || '—'}</td>
                    <td class="ots-modal-td-mono"><code>${o.ot || '—'}</code></td>
                    <td>${o.tecnico || '—'}</td>
                    <td style="text-align:center">${o.tiempo != null ? Number(o.tiempo).toFixed(1) : '—'}</td>
                    <td><span class="ots-badge-sm ${em.cls}">${em.emoji} ${em.label}</span></td>
                    <td class="ots-modal-comentario">${o.comentario || '—'}</td>
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

/* ── MutationObserver: inyectar historial en modales ───── */
(function setupOTModalObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ target, attributeName }) => {
      if (attributeName !== 'class') return;
      // Solo procesar overlays que acaben de abrirse
      if (!target.classList.contains('modal-overlay') && !target.id?.includes('Overlay') && !target.id?.includes('Modal')) return;
      if (!target.classList.contains('open')) return;

      const equipoEl = target.querySelector('.modal-equipo');
      if (!equipoEl) return;
      const equipoId = equipoEl.textContent.trim();
      if (!equipoId) return;

      const body = target.querySelector('[id$="ModalBody"], [id$="modalBody"], .modal-body');
      if (!body || body.querySelector('.ots-modal-section')) return;

      body.appendChild(buildModalOTHistory(equipoId));
    });
  });

  observer.observe(document.body, {
    subtree:         true,
    attributes:      true,
    attributeFilter: ['class']
  });
})();

/* ── Mostrar sección al navegar ────────────────────────── */
const _origShowPage = window.showPage;
window.showPage = function(pageId) {
  _origShowPage(pageId);
  if (pageId === 'historial') renderOTsSection();
  if (pageId === 'kpis')      renderKPIsSection();
};
