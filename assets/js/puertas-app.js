/* ─── Puertas Automáticas — AEP ─────────────────────────── */

let puertasFiltered   = [...PUERTAS_DATA];
let puertasView       = "grid";   // "grid" | "table" | "plano" | "planes" | "guia"
let puertasFabFilter  = "";
let puertasZonaFilter = "";
let puertasSearch     = "";
let puertasPlanoZoom  = 1.0;

/* ─── Init ──────────────────────────────────────────────── */
(function initPuertas() {
  renderPuertasStats();
  buildPuertasFilters();
  applyPuertasFilters();

  document.getElementById("puertas-search").addEventListener("input", function () {
    puertasSearch = this.value.trim().toLowerCase();
    document.getElementById("puertas-clear-search").style.display = puertasSearch ? "flex" : "none";
    applyPuertasFilters();
  });

  document.getElementById("puertas-clear-search").addEventListener("click", function () {
    puertasSearch = "";
    document.getElementById("puertas-search").value = "";
    this.style.display = "none";
    applyPuertasFilters();
  });

  document.getElementById("puertas-filter-fab").addEventListener("change", function () {
    puertasFabFilter = this.value;
    applyPuertasFilters();
  });

  document.getElementById("puertas-filter-zona").addEventListener("change", function () {
    puertasZonaFilter = this.value;
    applyPuertasFilters();
  });

  document.querySelectorAll(".puertas-view-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".puertas-view-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      puertasView = this.dataset.view;
      renderPuertas();
    });
  });

  document.getElementById("puertas-modal-close").addEventListener("click", closePuertaModal);
  document.getElementById("puertas-modal-overlay").addEventListener("click", function (e) {
    if (e.target === this) closePuertaModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePuertaModal();
  });

  // Zoom controls
  document.getElementById("puertasPlanoZoomIn").addEventListener("click",  () => setPuertasZoom(puertasPlanoZoom + 0.2));
  document.getElementById("puertasPlanoZoomOut").addEventListener("click", () => setPuertasZoom(puertasPlanoZoom - 0.2));
  document.getElementById("puertasPlanoZoomFit").addEventListener("click", () => setPuertasZoom(1.0));

  // Drag-to-pan on plano
  (function initPlanoDrag() {
    const wrap = document.getElementById("puertasPlanoContainer");
    const img  = document.getElementById("puertasPlanoImg");
    let dragging = false, startX, startY, scrollLeft, scrollTop;
    wrap.addEventListener("mousedown", e => {
      dragging = true; wrap.style.cursor = "grabbing";
      startX = e.pageX - wrap.offsetLeft; startY = e.pageY - wrap.offsetTop;
      scrollLeft = wrap.scrollLeft; scrollTop = wrap.scrollTop;
    });
    wrap.addEventListener("mouseleave", () => { dragging = false; wrap.style.cursor = "grab"; });
    wrap.addEventListener("mouseup",    () => { dragging = false; wrap.style.cursor = "grab"; });
    wrap.addEventListener("mousemove", e => {
      if (!dragging) return; e.preventDefault();
      wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX);
      wrap.scrollTop  = scrollTop  - (e.pageY - wrap.offsetTop  - startY);
    });
  })();
})();

function setPuertasZoom(z) {
  puertasPlanoZoom = Math.max(0.4, Math.min(4.0, z));
  const img = document.getElementById("puertasPlanoImg");
  img.style.width  = (puertasPlanoZoom * 100) + "%";
  img.style.height = "auto";
  document.getElementById("puertasPlanoZoomLabel").textContent = Math.round(puertasPlanoZoom * 100) + "%";
}

/* ─── Stats ─────────────────────────────────────────────── */
function renderPuertasStats() {
  const total   = PUERTAS_DATA.length;
  const manusa  = PUERTAS_DATA.filter(p => p.fabricante === "Manusa").length;
  const audoor  = PUERTAS_DATA.filter(p => p.fabricante === "Audoor").length;
  const sinData = PUERTAS_DATA.filter(p => !p.fabricante).length;

  const cards = [
    { label: "Total puertas",  value: total,   icon: "🚪", color: "#1a56a4" },
    { label: "Manusa",         value: manusa,  icon: "🔵", color: "#1a56a4" },
    { label: "Audoor",         value: audoor,  icon: "🔷", color: "#0891b2" },
    { label: "Sin identificar",value: sinData, icon: "❓", color: "#6b7280" },
  ];

  document.getElementById("puertas-stats").innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
}

/* ─── Filters ────────────────────────────────────────────── */
function buildPuertasFilters() {
  const fabs  = [...new Set(PUERTAS_DATA.map(p => p.fabricante || ""))].sort();
  const zonas = [...new Set(PUERTAS_DATA.map(p => puertaZona(p.ubicacion)))].sort();

  const selFab  = document.getElementById("puertas-filter-fab");
  const selZona = document.getElementById("puertas-filter-zona");

  fabs.forEach(f => {
    const o = document.createElement("option");
    o.value = f;
    o.textContent = f || "Sin datos";
    selFab.appendChild(o);
  });

  zonas.forEach(z => {
    const o = document.createElement("option");
    o.value = z;
    o.textContent = z;
    selZona.appendChild(o);
  });
}

function applyPuertasFilters() {
  puertasFiltered = PUERTAS_DATA.filter(p => {
    const zona = puertaZona(p.ubicacion);
    if (puertasFabFilter !== "" && (p.fabricante || "") !== puertasFabFilter) return false;
    if (puertasZonaFilter && zona !== puertasZonaFilter) return false;
    if (puertasSearch) {
      const hay = [p.equipo, p.denominacion, p.ubicacion, p.fabricante, p.serie, p.modelo, zona]
        .join(" ").toLowerCase();
      if (!hay.includes(puertasSearch)) return false;
    }
    return true;
  });
  renderPuertas();
}

/* ─── Render dispatcher ──────────────────────────────────── */
function renderPuertas() {
  const isGrid   = puertasView === "grid";
  const isTable  = puertasView === "table";
  const isPlano  = puertasView === "plano";
  const isPlanes = puertasView === "planes";
  const isGuia   = puertasView === "guia";
  const showFilters = isGrid || isTable;

  document.getElementById("puertas-result-count").textContent =
    showFilters ? `${puertasFiltered.length} de ${PUERTAS_DATA.length} puertas` : "";

  document.getElementById("puertas-grid").classList.toggle("hidden",        !isGrid);
  document.getElementById("puertas-table-wrap").classList.toggle("hidden",  !isTable);
  document.getElementById("puertas-plano-wrap").classList.toggle("hidden",  !isPlano);
  document.getElementById("puertas-planes-wrap").classList.toggle("hidden", !isPlanes);
  document.getElementById("puertas-guia-wrap").classList.toggle("hidden",   !isGuia);

  // mostrar/ocultar fila de filtros según la vista activa
  document.getElementById("puertas-toolbar-filters").style.display = showFilters ? "" : "none";

  if (isGrid)   renderPuertasGrid();
  if (isTable)  renderPuertasTable();
  if (isPlanes) renderPuertasPlanes();
}

/* ─── Planes preventivos ─────────────────────────────────── */
function renderPuertasPlanes() {
  const container = document.getElementById("puertas-plan-content");
  const plan = PUERTAS_PLAN;

  container.innerHTML = plan.frecuencias.map(freq => `
    <div class="patio-plan-card" style="margin-bottom:20px">
      <div class="patio-plan-header" style="background:${freq.color}">
        <span class="patio-plan-freq-icon">${freq.icono}</span>
        <div>
          <div class="patio-plan-freq-name">${freq.nombre}</div>
          <div class="patio-plan-freq-ref">${plan.referencia}</div>
        </div>
        <span class="patio-plan-task-count">${freq.tareas.length} tareas</span>
      </div>
      <div class="patio-plan-body">
        <table class="patio-plan-table">
          <thead>
            <tr>
              <th style="width:44px">#</th>
              <th>Tarea de mantenimiento</th>
            </tr>
          </thead>
          <tbody>
            ${freq.tareas.map(t => `
              <tr>
                <td class="patio-plan-num">${t.num}</td>
                <td>${t.texto}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `).join("");
}

/* ─── Grid view ──────────────────────────────────────────── */
function renderPuertasGrid() {
  const container = document.getElementById("puertas-grid");

  if (!puertasFiltered.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <p>No se encontraron puertas con los filtros aplicados.</p>
    </div>`;
    return;
  }

  container.innerHTML = puertasFiltered.map(p => {
    const zona    = puertaZona(p.ubicacion);
    const fabColor = PUERTA_FAB_COLORS[p.fabricante] || PUERTA_FAB_COLORS[""];
    const zonaColor = PUERTA_ZONA_COLORS[zona] || "#6b7280";
    const fab     = p.fabricante || "Sin datos";
    const modelo  = p.modelo  || "";
    const serie   = p.serie   || "";

    return `<div class="puertas-card" data-equipo="${p.equipo}" title="${p.denominacion}">
      <div class="puertas-card-header">
        <span class="puertas-card-code">${p.equipo}</span>
        <span class="puertas-fab-badge" style="background:${fabColor}15;color:${fabColor};border-color:${fabColor}30">${fab}</span>
      </div>
      <div class="puertas-card-denom">${p.denominacion}</div>
      <div class="puertas-card-footer">
        <span class="puertas-zona-badge" style="background:${zonaColor}15;color:${zonaColor}">${zona}</span>
        ${modelo ? `<span class="puertas-modelo-tag">${modelo}</span>` : ""}
        ${serie  ? `<span class="puertas-serie-tag">${serie}</span>`  : ""}
      </div>
    </div>`;
  }).join("");

  container.querySelectorAll(".puertas-card").forEach(card => {
    card.addEventListener("click", () => openPuertaModal(card.dataset.equipo));
  });
}

/* ─── Table view ─────────────────────────────────────────── */
function renderPuertasTable() {
  const tbody = document.getElementById("puertas-tbody");

  if (!puertasFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No se encontraron puertas con los filtros aplicados.</p>
      </div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = puertasFiltered.map(p => {
    const zona     = puertaZona(p.ubicacion);
    const fabColor = PUERTA_FAB_COLORS[p.fabricante] || PUERTA_FAB_COLORS[""];
    const zonaColor = PUERTA_ZONA_COLORS[zona] || "#6b7280";
    const fab      = p.fabricante || "—";
    return `<tr data-equipo="${p.equipo}">
      <td><span class="equipo-tag">${p.equipo}</span></td>
      <td>${p.denominacion}</td>
      <td><span class="puertas-zona-badge" style="background:${zonaColor}15;color:${zonaColor}">${zona}</span></td>
      <td><span class="puertas-fab-badge" style="background:${fabColor}15;color:${fabColor};border-color:${fabColor}30">${fab}</span></td>
      <td><span class="mono-text">${p.serie || "—"}</span></td>
      <td>${p.modelo || "—"}</td>
      <td><span class="no-data" style="font-size:11px">${p.ubicacion}</span></td>
    </tr>`;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openPuertaModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
function openPuertaModal(equipo) {
  const p = PUERTAS_DATA.find(x => x.equipo === equipo);
  if (!p) return;

  const zona      = puertaZona(p.ubicacion);
  const fabColor  = PUERTA_FAB_COLORS[p.fabricante] || PUERTA_FAB_COLORS[""];
  const zonaColor = PUERTA_ZONA_COLORS[zona] || "#6b7280";
  const fab       = p.fabricante || "Sin datos";

  document.getElementById("puertas-modal-header").innerHTML = `
    <span class="modal-equipo">${p.equipo}</span>
    <div class="modal-denom">${p.denominacion}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
      <span class="puertas-fab-badge" style="background:${fabColor}20;color:${fabColor};border:1px solid ${fabColor}40">${fab}</span>
      <span class="puertas-zona-badge" style="background:${zonaColor}20;color:${zonaColor}">${zona}</span>
    </div>
  `;

  function mf(label, value, full, mono) {
    if (!value) return "";
    return `<div class="modal-field${full ? " full" : ""}">
      <span class="modal-field-label">${label}</span>
      <span class="modal-field-value${mono ? " mono" : ""}">${value}</span>
    </div>`;
  }

  document.getElementById("puertas-modal-body").innerHTML = `
    ${mf("Fabricante", fab)}
    ${mf("Modelo", p.modelo || "Sin datos")}
    ${mf("N° Serie", p.serie || "Sin datos", false, true)}
    ${mf("Zona", zona)}
    ${mf("Ubicación SAP", p.ubicacion, true, true)}
  `;

  document.getElementById("puertas-modal-overlay").classList.add("open");
}

function closePuertaModal() {
  document.getElementById("puertas-modal-overlay").classList.remove("open");
}
