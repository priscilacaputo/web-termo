/* ─── Admin Mode — Excel Upload ──────────────────────────── */

/* Section metadata: export btn id, global data variable name, key field */
const SECTION_META = {
  mangas:      { btnId: 'mangas-export-btn',      dataVar: 'MANGAS_DATA',      key: 'equipo' },
  ascensores:  { btnId: 'ascensores-export-btn',  dataVar: 'ASCENSORES_DATA',  key: 'equipo' },
  escaleras:   { btnId: 'escaleras-export-btn',   dataVar: 'ESCALERAS_DATA',   key: 'equipo' },
  extractores: { btnId: 'extractores-export-btn', dataVar: 'EXTRACTORES_DATA', key: 'equipo' },
  persianas:   { btnId: 'persianas-export-btn',   dataVar: 'PERSIANAS_DATA',   key: 'equipo' },
  cortinas:    { btnId: 'cortinas-export-btn',     dataVar: 'CORTINAS_DATA',    key: 'equipo' },
  bombas:      { btnId: 'bombas-export-btn',       dataVar: 'BOMBAS_DATA',      key: 'equipo' },
  patio:       { btnId: 'patio-export-btn',        dataVar: 'PATIO_DATA',       key: 'equipo' },
  puertas:     { btnId: 'puertas-export-btn',      dataVar: 'PUERTAS_DATA',     key: 'equipo' },
  aac:         { btnId: 'aac-export-btn',          dataVar: 'AAC_DATA',         key: 'equipo' },
  ecas:        { btnId: 'ecas-export-btn',         dataVar: 'ECAS_DATA',        key: 'equipo' },
  otros:       { btnId: 'otros-export-btn',        dataVar: 'OTROS_DATA',       key: 'equipo' },
  panol:       { btnId: 'panol-export-btn',        dataVar: 'PANOL_DATA',       key: 'cod' },
};

function _getExportConfig(section) {
  const meta = SECTION_META[section];
  if (!meta || typeof EXPORT_CONFIGS === 'undefined') return null;
  return EXPORT_CONFIGS.find(c => c.btnId === meta.btnId) || null;
}

function _getKeyField(section)    { return SECTION_META[section]?.key     || 'equipo'; }
function _getCurrentData(section) { return window[SECTION_META[section]?.dataVar] || []; }

/* ─── State ─────────────────────────────────────────────── */
window.adminMode = false;
let _adminPwd = null;
let _pendingUpload = null; // { section, data }

/* ─── Restore session ────────────────────────────────────── */
if (sessionStorage.getItem('admin_auth') === 'true') {
  _adminPwd = sessionStorage.getItem('admin_pwd') || '';
  _activateAdminMode();
}

/* ─── Lock button ────────────────────────────────────────── */
document.getElementById('admin-lock-btn').addEventListener('click', () => {
  if (window.adminMode) {
    _adminLogout();
  } else {
    const modal = document.getElementById('admin-login-modal');
    modal.classList.add('open');
    setTimeout(() => document.getElementById('admin-pwd-input').focus(), 80);
  }
});

document.getElementById('admin-pwd-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') adminSubmitLogin();
  if (e.key === 'Escape') document.getElementById('admin-login-modal').classList.remove('open');
});

/* ─── Login ──────────────────────────────────────────────── */
function adminSubmitLogin() {
  const pwd = document.getElementById('admin-pwd-input').value.trim();
  if (!pwd) return;
  _adminPwd = pwd;
  sessionStorage.setItem('admin_pwd', pwd);
  sessionStorage.setItem('admin_auth', 'true');
  document.getElementById('admin-login-modal').classList.remove('open');
  document.getElementById('admin-pwd-input').value = '';
  document.getElementById('admin-login-error').textContent = '';
  _activateAdminMode();
}

function _activateAdminMode() {
  window.adminMode = true;
  document.body.classList.add('admin-mode');
  document.getElementById('admin-banner').classList.remove('hidden');
  document.getElementById('admin-lock-btn').title = 'Salir del modo admin';
  document.getElementById('admin-lock-btn').textContent = '🔓';
  _injectUploadButtons();
}

function _adminLogout() {
  window.adminMode = false;
  sessionStorage.removeItem('admin_auth');
  sessionStorage.removeItem('admin_pwd');
  document.body.classList.remove('admin-mode');
  document.getElementById('admin-banner').classList.add('hidden');
  document.getElementById('admin-lock-btn').title = 'Acceso administrador';
  document.getElementById('admin-lock-btn').textContent = '🔒';
  document.querySelectorAll('.admin-upload-btn').forEach(el => el.remove());
}

/* ─── Inject upload button per section ───────────────────── */
const SECTION_PAGE_IDS = [
  'mangas','ascensores','escaleras','extractores',
  'persianas','cortinas','bombas','patio',
  'puertas','aac','ecas','otros','panol'
];

function _injectUploadButtons() {
  SECTION_PAGE_IDS.forEach(section => {
    const page = document.getElementById(`page-${section}`);
    if (!page || page.querySelector('.admin-upload-btn')) return;
    const toolbar = page.querySelector(
      '.toolbar, .puertas-toolbar-top, .mangas-toolbar, ' +
      '.asc-toolbar-top, .esc-toolbar-top'
    );
    if (!toolbar) return;

    const btn = document.createElement('button');
    btn.className = 'admin-upload-btn';
    btn.dataset.section = section;
    btn.textContent = '📤 Subir Excel';
    btn.title = 'Reemplazar listado completo desde archivo Excel';
    toolbar.appendChild(btn);
  });
}

/* ─── Edit button injection into table rows ─────────────── */
let _editState = { section: null, equipo: null };

function _injectEditButtons() {
  document.querySelectorAll('tbody tr[data-equipo]').forEach(row => {
    if (row.querySelector('.admin-edit-btn')) return;
    const page = row.closest('[id^="page-"]');
    const section = page?.id?.replace('page-', '');
    if (!section || !SECTION_META[section]) return;

    const td = document.createElement('td');
    td.className = 'admin-edit-td';
    const btn = document.createElement('button');
    btn.className = 'admin-edit-btn';
    btn.textContent = '✏';
    btn.title = 'Editar equipo';
    btn.addEventListener('click', e => {
      e.stopPropagation(); // don't trigger row click (detail modal)
      _openEditModal(section, row.dataset.equipo);
    });
    td.appendChild(btn);
    row.appendChild(td);
  });
}

new MutationObserver(() => {
  if (window.adminMode) _injectEditButtons();
}).observe(document.body, { childList: true, subtree: true });

/* ─── Edit modal ─────────────────────────────────────────── */
function _openEditModal(section, equipoCode) {
  const cfg  = _getExportConfig(section);
  const meta = SECTION_META[section];
  const data = window[meta.dataVar] || [];
  const item = data.find(x => String(x[meta.key] ?? '').trim() === String(equipoCode).trim()) || {};

  _editState = { section, equipo: equipoCode };

  const schemaFields = cfg ? cfg.columns.map(c => ({ key: c.key, label: c.header })) : [];
  const schemaKeys   = new Set(schemaFields.map(f => f.key));
  const extraKeys    = Object.keys(item).filter(k => !schemaKeys.has(k));

  document.getElementById('admin-edit-title').textContent = `Editar: ${equipoCode}`;

  const container = document.getElementById('admin-edit-fields');
  container.innerHTML =
    schemaFields.map(f => `
      <div class="admin-efield">
        <label class="admin-efield-label">${f.label}</label>
        <input class="admin-field-input" data-ekey="${f.key}"
               value="${String(item[f.key] ?? '').replace(/"/g, '&quot;')}" />
      </div>`).join('') +

    (extraKeys.length
      ? `<div class="admin-extra-sep">Campos adicionales (ficha técnica)</div>` +
        extraKeys.map(k => `
          <div class="admin-efield admin-efield-extra">
            <span class="admin-efield-key">${k}</span>
            <input class="admin-field-input" data-ekey="${k}"
                   value="${String(item[k] ?? '').replace(/"/g, '&quot;')}" />
          </div>`).join('')
      : '');

  document.getElementById('admin-edit-modal').classList.add('open');
  container.querySelector('input')?.focus();
}

function adminCloseEditModal() {
  document.getElementById('admin-edit-modal').classList.remove('open');
  _editState = { section: null, equipo: null };
}

function adminAddCustomField() {
  const container = document.getElementById('admin-edit-fields');
  const div = document.createElement('div');
  div.className = 'admin-efield admin-newfield-row';
  div.innerHTML = `
    <input class="admin-field-input admin-newfield-key" placeholder="Nombre del campo (ej: n_serie)" />
    <input class="admin-field-input admin-newfield-val" placeholder="Valor" />
    <button class="admin-newfield-rm" onclick="this.parentElement.remove()" title="Quitar">✕</button>`;
  container.appendChild(div);
  div.querySelector('.admin-newfield-key').focus();
}

async function adminSaveEdit() {
  const { section, equipo } = _editState;
  if (!section || !equipo) return;
  const meta = SECTION_META[section];
  const data = window[meta.dataVar];
  if (!data) return;
  const idx = data.findIndex(x => String(x[meta.key] ?? '').trim() === String(equipo).trim());
  if (idx === -1) { alert('Equipo no encontrado'); return; }

  const updated = { ...data[idx] };

  // Update existing fields
  document.querySelectorAll('#admin-edit-fields input[data-ekey]').forEach(inp => {
    updated[inp.dataset.ekey] = inp.value.trim();
  });

  // Collect new custom fields
  document.querySelectorAll('#admin-edit-fields .admin-newfield-row').forEach(row => {
    const k = row.querySelector('.admin-newfield-key')?.value.trim();
    const v = row.querySelector('.admin-newfield-val')?.value.trim() ?? '';
    if (k) updated[k] = v;
  });

  data[idx] = updated;
  adminCloseEditModal();
  await _commitSection(section, data);
}

/* ─── Click on upload button ─────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('admin-upload-btn')) {
    const section = e.target.dataset.section;
    const input = document.getElementById('admin-file-input');
    input.dataset.section = section;
    input.value = '';
    input.click();
  }
  if (e.target.id === 'admin-banner-logout') _adminLogout();
  if (e.target.id === 'admin-confirm-btn')   _confirmUpload();
  if (e.target.id === 'admin-cancel-btn')    _closeConfirm();
});

/* ─── File input change ───────────────────────────────────── */
document.getElementById('admin-file-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const section = this.dataset.section;

  if (typeof XLSX === 'undefined') {
    _showToast('❌ La librería XLSX no está disponible (revisá tu conexión).', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) {
        _showToast('❌ El archivo está vacío o no tiene filas de datos.', 'error');
        return;
      }

      const cfg = _getExportConfig(section);
      if (!cfg) {
        _showToast('❌ No se encontró la configuración de columnas para esta sección.', 'error');
        return;
      }

      // Map header → key — case-insensitive, trim whitespace, plus SAP column name aliases
      const SAP_ALIASES = {
        'denominación de objeto técnico': 'denominacion',
        'denominacion de objeto tecnico':  'denominacion',
        'texto breve de objeto':           'denominacion',
        'ubicación técnica':               'ubicacion',
        'ubicacion tecnica':               'ubicacion',
        'fabricante del activo fijo':      'fabricante',
        'fabricante':                      'fabricante',
        'denominación de la ubicación técnica': 'ubi_desc',
        'denominacion de la ubicacion tecnica': 'ubi_desc',
        'descripción de la ubicación':     'ubi_desc',
        'clase de equipo':                 'tipo',
        'modelo de construcción':          'tipo',
        'tipo / modelo':                   'tipo',
        'n° de serie':                     'n_serie',
        'número de serie':                 'n_serie',
      };
      const headerToKey = { ...SAP_ALIASES };
      cfg.columns.forEach(col => {
        headerToKey[col.header.trim().toLowerCase()] = col.key;
      });

      // Parse uploaded rows into objects using known column headers
      const fromUpload = rows.map(row => {
        const obj = {};
        Object.entries(row).forEach(([header, val]) => {
          const key = headerToKey[String(header).trim().toLowerCase()];
          if (key !== undefined) obj[key] = (val === null || val === undefined) ? '' : String(val).trim();
        });
        return obj;
      }).filter(obj => Object.keys(obj).length > 0);

      if (!fromUpload.length) {
        const found = Object.keys(rows[0] || {}).join(', ');
        const expected = cfg.columns.map(c => c.header).join(', ');
        _showToast(
          `❌ Ninguna columna coincide.\nColumnas en el archivo: ${found}\nColumnas esperadas: ${expected}`,
          'error'
        );
        return;
      }

      // --- VALIDACIÓN DEL CAMPO CLAVE ---
      const keyField    = _getKeyField(section);
      const currentData = _getCurrentData(section);

      // Abort if the key column (equipo) is missing or empty in uploaded rows
      const rowsWithKey = fromUpload.filter(item => String(item[keyField] || '').trim() !== '');
      if (rowsWithKey.length === 0) {
        const found = Object.keys(rows[0] || {}).join(', ');
        _showToast(
          `❌ El archivo no contiene la columna de código de equipo ("Equipo").\n` +
          `Columnas encontradas: ${found}\n` +
          `Asegurate de que el archivo tenga una columna llamada "Equipo".`,
          'error'
        );
        return;
      }

      // --- MERGE ---
      // Rule 1: campos del Excel → actualizar
      // Rule 2: campos extra que no están en el Excel pero el equipo sí → conservar
      // Rule 3: equipos que no están en el Excel → eliminar
      const currentByKey = {};
      currentData.forEach(item => {
        const k = String(item[keyField] || '').trim();
        if (k) currentByKey[k] = item;
      });

      let updated = 0, added = 0;
      const finalData = rowsWithKey.map(uploadItem => {
        const code = String(uploadItem[keyField] || '').trim();
        const existing = currentByKey[code];
        if (existing) {
          updated++;
          return { ...existing, ...uploadItem };
        }
        added++;
        return uploadItem;
      });

      const uploadKeys = new Set(rowsWithKey.map(r => String(r[keyField] || '').trim()));
      const deleted = currentData.filter(item => !uploadKeys.has(String(item[keyField] || '').trim())).length;

      // Warn if all existing data would be lost (likely a mapping error)
      if (updated === 0 && currentData.length > 0) {
        const confirmAnyway = window.confirm(
          `⚠ ATENCIÓN: Ninguno de los ${rowsWithKey.length} equipos del archivo coincide con los ${currentData.length} equipos existentes.\n\n` +
          `Esto eliminaría TODOS los datos actuales y los reemplazaría con equipos nuevos.\n\n` +
          `¿Los códigos de equipo en el archivo son correctos? ¿Querés continuar de todas formas?`
        );
        if (!confirmAnyway) return;
      }

      _pendingUpload = {
        section, data: finalData, filename: file.name,
        stats: { updated, added, deleted, total: finalData.length }
      };
      _openConfirm();

    } catch (err) {
      _showToast(`❌ Error al leer el archivo: ${err.message}`, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
});

/* ─── Confirm modal ──────────────────────────────────────── */
function _openConfirm() {
  const { section, filename, stats } = _pendingUpload;
  const cfg = _getExportConfig(section);
  const label = cfg ? cfg.filename.replace('AEP_', '').replace(/_/g, ' ') : section;
  document.getElementById('admin-confirm-msg').innerHTML =
    `Archivo: <em>${filename}</em> — <strong>${label}</strong><br><br>` +
    `<span class="admin-merge-stat">✏️ ${stats.updated} equipos actualizados (campos del Excel reemplazados, campos extra conservados)</span><br>` +
    `<span class="admin-merge-stat">➕ ${stats.added} equipos nuevos agregados</span><br>` +
    `<span class="admin-merge-stat admin-merge-del">🗑 ${stats.deleted} equipos eliminados (no figuran en el Excel)</span><br>` +
    `<span class="admin-merge-stat"><strong>Total resultante: ${stats.total} equipos</strong></span><br>` +
    `<span class="admin-confirm-warning">⚠ Los campos propios que no están en el Excel (ficha técnica, notas, etc.) se conservan en los equipos que sí figuran.</span>`;
  document.getElementById('admin-confirm-modal').classList.add('open');
}

function _closeConfirm() {
  document.getElementById('admin-confirm-modal').classList.remove('open');
  _pendingUpload = null;
}

async function _confirmUpload() {
  if (!_pendingUpload) return;
  const { section, data } = _pendingUpload;
  _closeConfirm();
  await _commitSection(section, data);
}

/* ─── API call ───────────────────────────────────────────── */
async function _commitSection(section, data) {
  const pwd = _adminPwd || sessionStorage.getItem('admin_pwd');
  if (!pwd) { _adminLogout(); return; }

  _showToast('⏳ Guardando en GitHub…', '');

  try {
    const res = await fetch('/api/update-equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data, password: pwd }),
    });
    const json = await res.json();

    if (json.success) {
      _showToast('✅ Guardado en GitHub. Vercel está redesplegando… recargá la página en 1-2 minutos.', 'success');
    } else {
      if (res.status === 401) {
        _showToast('❌ Contraseña incorrecta. Saliendo del modo admin.', 'error');
        setTimeout(_adminLogout, 2000);
      } else {
        _showToast(`❌ Error: ${json.error}`, 'error');
      }
    }
  } catch (err) {
    _showToast(`❌ Error de red: ${err.message}`, 'error');
  }
}

/* ─── Toast ──────────────────────────────────────────────── */
function _showToast(msg, type) {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.className = `admin-toast show${type ? ' ' + type : ''}`;
  if (type === 'success' || type === 'error') {
    setTimeout(() => t.classList.remove('show'), 9000);
  }
}

/* ─── Keyboard shortcuts ─────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('admin-login-modal').classList.remove('open');
    _closeConfirm();
    adminCloseEditModal();
  }
  if (e.key === 'Enter' && document.getElementById('admin-confirm-modal').classList.contains('open')) {
    _confirmUpload();
  }
});
