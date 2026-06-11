/* ─── Stats ──────────────────────────────────────────────── */
(function renderPatioStats() {
  const total = PATIO_DATA.length;
  const bf    = PATIO_DATA.filter(e => e.clase === "BF").length;
  const bfr   = PATIO_DATA.filter(e => e.clase === "BFR").length;
  const bc    = PATIO_DATA.filter(e => e.clase === "BC").length;

  const cards = [
    { label: "Total equipos",    value: total, icon: "🧳", color: "#1a56a4" },
    { label: "Cintas BF",        value: bf,    icon: "▶", color: "#1a56a4" },
    { label: "Cintas retorno",   value: bfr,   icon: "↩",  color: "#7c3aed" },
    { label: "Cintas curvas BC", value: bc,    icon: "↪",  color: "#0891b2" },
  ];

  document.getElementById("patio-stats").innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────────── */
document.querySelectorAll(".patio-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".patio-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planesVisible = view === "planes";
    document.getElementById("patio-grid-view")  .classList.toggle("hidden", view !== "grid");
    document.getElementById("patio-table-view") .classList.toggle("hidden", view !== "table");
    document.getElementById("patio-planes-view").classList.toggle("hidden", !planesVisible);
    document.querySelector("#page-patio .patio-filters").classList.toggle("hidden", planesVisible);
  });
});

/* ─── Filtros ────────────────────────────────────────────── */
const patioClaseFilter = document.getElementById("patioClaseFilter");
const patioSistemaFilter = document.getElementById("patioSistemaFilter");

patioClaseFilter.addEventListener("change",   () => { renderPatioGrid(); renderPatioTable(); });
patioSistemaFilter.addEventListener("change", () => { renderPatioGrid(); renderPatioTable(); });

function getFilteredPatio() {
  const clase   = patioClaseFilter.value;
  const sistema = patioSistemaFilter.value;
  return PATIO_DATA.filter(e => {
    if (clase   && e.clase !== clase) return false;
    if (sistema && patioSubsistema(e.denominacion) !== sistema) return false;
    return true;
  });
}

/* ─── Grid ───────────────────────────────────────────────── */
function renderPatioGrid() {
  const filtered    = getFilteredPatio();
  const filteredSet = new Set(filtered.map(e => e.equipo));

  document.getElementById("patio-grid").innerHTML = PATIO_DATA.map(eq => {
    const color  = PATIO_CLASE_COLORS[eq.clase] || "#6b7280";
    const sub    = patioSubsistema(eq.denominacion);
    const subCol = PATIO_SUBSISTEMA_COLORS[sub] || "#6b7280";
    const dimmed = filtered.length === PATIO_DATA.length || filteredSet.has(eq.equipo);
    const kwBadge = eq.kw ? `<span style="font-size:9px;color:${color};font-weight:700;font-family:monospace">${eq.kw} kW</span>` : '';
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${eq.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${eq.equipo}</span>
          <span class="asc-fab-label">${patioClaseLabel(eq.clase)}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${eq.denominacion}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
            <span class="asc-location" style="font-size:10px;color:${subCol};font-weight:600">${sub}</span>
            ${kwBadge}
          </div>
          ${ALTURA_SET.has(eq.equipo) ? `<span class="altura-badge" style="margin-top:6px">⛰️ Altura</span>` : ''}
        </div>
      </div>`;
  }).join("");

  document.querySelectorAll("#patio-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openPatioModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────────── */
function renderPatioTable() {
  const filtered = getFilteredPatio();
  const tbody    = document.getElementById("patioBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(eq => {
    const color = PATIO_CLASE_COLORS[eq.clase] || "#6b7280";
    const sub   = patioSubsistema(eq.denominacion);
    return `
      <tr data-equipo="${eq.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${eq.equipo}</span>${ALTURA_SET.has(eq.equipo) ? ' <span class="altura-badge">⛰️ Altura</span>' : ''}</td>
        <td>${eq.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${patioClaseLabel(eq.clase)}</span></td>
        <td style="font-size:11px;color:var(--color-muted)">${sub}</td>
        <td style="font-size:10px;font-family:monospace;color:var(--color-muted)">${eq.kw ? eq.kw + ' kW' : '—'}</td>
      </tr>`;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openPatioModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
const patioModal      = document.getElementById("patioModalOverlay");
const patioModalClose = document.getElementById("patioModalClose");
const patioModalHdr   = document.getElementById("patioModalHeader");
const patioModalBody  = document.getElementById("patioModalBody");

function modalSection(title) {
  return `<div class="modal-section-title" style="grid-column:1/-1;margin:14px 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);border-bottom:1px solid var(--color-border);padding-bottom:4px">${title}</div>`;
}

function modalField(label, value, full = false, mono = false) {
  if (!value) return '';
  return `<div class="modal-field${full ? ' full' : ''}">
    <span class="modal-field-label">${label}</span>
    <span class="modal-field-value${mono ? ' mono' : ''}">${value}</span>
  </div>`;
}

function openPatioModal(equipo) {
  const eq = PATIO_DATA.find(x => x.equipo === equipo);
  if (!eq) return;
  const color = PATIO_CLASE_COLORS[eq.clase] || "#6b7280";
  const sub   = patioSubsistema(eq.denominacion);
  const ex    = (typeof PATIO_EXTRA !== 'undefined') ? (PATIO_EXTRA[equipo] || {}) : {};

  patioModalHdr.style.background = color;
  patioModalHdr.innerHTML = `
    <span class="modal-equipo">${eq.equipo}</span>
    <div class="modal-denom">${patioClaseLabel(eq.clase)}</div>
    <div class="modal-dominio">${eq.denominacion}</div>
  `;

  const freno = ex['Freno'] ? (ex['Freno'].toLowerCase() === 'no' ? 'No' : 'Sí') : '';
  const docVDL = ex['Documento VDL'] && ex['Rev doc VDL']
    ? `${parseInt(ex['Documento VDL'])} Rev. ${ex['Rev doc VDL']}`
    : (ex['Documento VDL'] ? parseInt(ex['Documento VDL']) : '');

  patioModalBody.innerHTML = `
    ${modalSection('Identificación')}
    ${modalField('Tipo / Clase', `${patioClaseLabel(eq.clase)} (${eq.clase})`)}
    ${modalField('Subsistema', sub)}
    ${modalField('Sector', eq.sector)}
    ${modalField('Ubicación técnica (SAP)', eq.ubicacion, false, true)}

    ${modalSection('Banda transportadora')}
    ${modalField('Longitud', ex['Long. Banda mm'] ? `${parseFloat(ex['Long. Banda mm']).toLocaleString('es-AR')} mm` : '', false, true)}
    ${modalField('Ancho', ex['Ancho mm'] ? `${ex['Ancho mm']} mm` : '', false, true)}
    ${modalField('Tipo de banda', ex['Tipo de banda'], true)}
    ${modalField('Unión banda', ex['Union banda'])}
    ${modalField('Carga', ex['Carga kg/m'] ? `${ex['Carga kg/m']} kg/m` : '', false, true)}

    ${modalSection('Motor / Accionamiento')}
    ${modalField('Motoreductor', ex['Motoreductor'] || ex['Motor'] || '', false, true)}
    ${modalField('Motor', ex['Motor'], false, true)}
    ${modalField('Reductor', ex['Reductor'], false, true)}
    ${modalField('Potencia nominal', ex['Potencia kW final'] ? `${ex['Potencia kW final']} kW` : (eq.kw ? `${eq.kw} kW` : ''), false, true)}
    ${modalField('Potencia requerida', ex['Potencia requerida kW'] ? `${ex['Potencia requerida kW']} kW` : '', false, true)}
    ${modalField('Velocidad de diseño', ex['Veloc. m/min'] ? `${ex['Veloc. m/min']} m/min` : '', false, true)}
    ${modalField('Velocidad real', ex['Veloc. real m/min'] ? `${ex['Veloc. real m/min']} m/min` : '', false, true)}
    ${modalField('Freno', freno)}
    ${modalField('Diám. rodillo tractor', ex['Rod. Tractor diam. mm'] ? `ø ${ex['Rod. Tractor diam. mm']} mm` : '', false, true)}
    ${modalField('Pull requerido', ex['Pull req N'] ? `${parseFloat(ex['Pull req N']).toLocaleString('es-AR')} N` : '', false, true)}
    ${modalField('Pull máximo', ex['Pull max N'] ? `${parseFloat(ex['Pull max N']).toLocaleString('es-AR')} N` : '', false, true)}
    ${ex['Notas spec'] ? modalField('Notas especificación', ex['Notas spec'], true) : ''}

    ${(ex['Reductor instalado actual'] || ex['Potencia instalada actual kW']) ? modalSection('Instalación actual') : ''}
    ${modalField('Reductor instalado', ex['Reductor instalado actual'], true, true)}
    ${modalField('Potencia instalada', ex['Potencia instalada actual kW'] ? `${ex['Potencia instalada actual kW']} kW` : '', false, true)}
    ${modalField('RPM instalada', ex['RPM instalada actual'] ? `${parseFloat(ex['RPM instalada actual']).toFixed(0)} RPM` : '', false, true)}

    ${(ex['Motor assembly code VDL'] || ex['Drive assy VDL'] || ex['Motor item number']) ? modalSection('Códigos técnicos VDL') : ''}
    ${modalField('Motor assembly code VDL', ex['Motor assembly code VDL'], true, true)}
    ${modalField('Drive assembly VDL', ex['Drive assy VDL'], true, true)}
    ${modalField('Drive L × W', (ex['Drive L mm'] && ex['Drive W mm']) ? `${ex['Drive L mm']} × ${ex['Drive W mm']} mm` : '', false, true)}
    ${modalField('Motor item number', ex['Motor item number'], false, true)}
    ${modalField('Drive item number', ex['Drive item number'], false, true)}

    ${(ex['Repuesto motor recomendado'] || ex['Repuesto banda recomendado']) ? modalSection('Repuestos recomendados') : ''}
    ${modalField('Repuesto motor (cód.)', ex['Repuesto motor recomendado'], false, true)}
    ${modalField('Motor — descripción', ex['Repuesto motor descripcion'], true)}
    ${modalField('Repuesto banda (cód.)', ex['Repuesto banda recomendado'], false, true)}
    ${modalField('Banda — descripción', ex['Repuesto banda descripcion'], true)}
    ${modalField('Doc. repuestos', ex['Doc repuestos'], true, true)}

    ${(ex['PDF origen'] || ex['Documento VDL'] || ex['Doc fallas/averias']) ? modalSection('Documentación') : ''}
    ${modalField('Documento VDL', docVDL, false, true)}
    ${modalField('PDF de especificación', ex['PDF origen'], true, true)}
    ${modalField('Doc. fallas / averías', ex['Doc fallas/averias'], true, true)}
  `;

  patioModal.classList.add("open");
}

patioModalClose.addEventListener("click", () => patioModal.classList.remove("open"));
patioModal.addEventListener("click", ev => { if (ev.target === patioModal) patioModal.classList.remove("open"); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") patioModal.classList.remove("open"); });

/* ─── Planes preventivos — Selector ─────────────────────── */
let selectedPatioPlan = null;

function renderPatioPlanesSelector() {
  const container = document.getElementById("patioPlanesSelector");
  container.innerHTML = PATIO_DATA.map(eq => {
    const planId = PATIO_A_PLAN[eq.equipo];
    const color  = PATIO_CLASE_COLORS[eq.clase] || "#6b7280";
    return `
      <div class="manga-sel-card ${planId ? '' : 'no-plan'} ${selectedPatioPlan === eq.equipo ? 'selected' : ''}" data-equipo="${eq.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${eq.equipo}</span>
          ${planId
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:10px;line-height:1.3">${eq.denominacion.substring(0, 30)}</div>
        <div class="manga-sel-fab" style="color:${color};font-size:10px">${patioSubsistema(eq.denominacion)}</div>
      </div>`;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedPatioPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      renderPatioPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes preventivos — Render plan ──────────────────── */
function renderPatioPlan(equipo) {
  const eq      = PATIO_DATA.find(x => x.equipo === equipo);
  const planId  = PATIO_A_PLAN[equipo];
  const container = document.getElementById("patioPlanContent");
  const color   = PATIO_CLASE_COLORS[eq.clase] || "#6b7280";

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${eq.denominacion}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan   = PATIO_PLANES.find(p => p.id === planId);
  const sub    = patioSubsistema(eq.denominacion);

  const eqTags = plan.clases.map(cl => {
    const c2 = PATIO_CLASE_COLORS[cl] || "#6b7280";
    return `<span class="manga-equipo-tag" style="background:${c2}">${patioClaseLabel(cl)}</span>`;
  }).join(" ");

  const freqSections = plan.frecuencias.map(frec => {
    const totalTareas = frec.grupos.reduce((s, g) => s + g.tareas.length, 0);
    const grupos = frec.grupos.map(g => `
      <div class="manga-grupo">
        <div class="manga-grupo-nombre">${g.nombre}</div>
        <ul class="km-task-list">
          ${g.tareas.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>`).join("");
    return `
      <div class="manga-freq-section">
        <div class="manga-freq-header" style="background:${frec.color}">
          <div>
            <span class="manga-freq-label">${frec.sublabel} — Frecuencia</span>
            <span class="manga-freq-badge">${frec.label}</span>
          </div>
          <span class="manga-freq-count">${totalTareas} tareas</span>
        </div>
        <div class="manga-grupo-grid">${grupos}</div>
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title">${plan.denominacion}</h2>
        <p class="mant-section-desc" style="margin-top:4px">
          <span style="color:${color};font-weight:700">${patioClaseLabel(eq.clase)}</span>
          · ${eq.denominacion} · ${sub}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${eqTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Init ───────────────────────────────────────────────── */
renderPatioGrid();
renderPatioTable();
renderPatioPlanesSelector();
