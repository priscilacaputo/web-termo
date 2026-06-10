/* ─── Navigation ────────────────────────────────────── */
const PAGE_TITLES = {
  flota:       ["Flota Vehicular",    "Gestión de vehículos SAP (AVO)"],
  mangas:      ["Mangas de Embarque", "AEP — Posiciones 3 a 12 · Plataforma Comercial"],
  ascensores:  ["Ascensores",         "AEP — Ascensores electromecánicos"],
  escaleras:   ["Escaleras Mecánicas","AEP — Escaleras mecánicas electromecánicas"],
  extractores: ["Extractores",        "AEP — Extractores, ventiladores y presurizadores"],
  persianas:   ["Persianas de Gatera","AEP — Persianas de gatera en Check In y Arribos"],
  cortinas:    ["Cortinas de Aire",  "AEP — Cortinas de aire forzado con calefacción"],
  bombas:      ["Bombas",            "AEP — Bombas de agua, cloacales, pluviales e incendio"],
  patio:       ["Patio de Valijas",  "AEP — Sistema BHS · Cintas, curvas, desviadores y scanner · Edificio VI"],
  personal:    ["Personal",          "AEP — Composición de guardias · Termomecánica"],
  puertas:     ["Puertas Automáticas", "AEP — Puertas automáticas corredizas · Manusa · Audoor"],
  aac:         ["Equipos de Aire",     "AEP — Aire acondicionado · Splits · VRF · Roof Tops · UTAs · Chillers"],
  otros:       ["Otros Equipos",       "AEP — Arcos de lectura · Cisternas · Compresores"],
};

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".nav-item:not(.disabled)").forEach(n => n.classList.remove("active"));

  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.remove("hidden");

  const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add("active");

  const titles = PAGE_TITLES[pageId] || ["", ""];
  document.getElementById("page-title").textContent = titles[0];
  document.getElementById("page-sub").textContent = titles[1];

  // Actualizar bottom nav
  document.querySelectorAll(".mbn-item[data-mbn-page]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mbnPage === pageId);
  });
}

/* ─── Bottom Navigation (mobile) ────────────────────── */
document.querySelectorAll(".mbn-item[data-mbn-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.mbnPage);
    closeMobileNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const mbnSearchBtn = document.getElementById("mbn-search-btn");
if (mbnSearchBtn) {
  mbnSearchBtn.addEventListener("click", () => {
    if (typeof openGlobalSearch === "function") openGlobalSearch();
  });
}

function activateFlotaTab(tabName) {
  document.querySelectorAll(".mant-tab[data-ftab]").forEach(t => t.classList.remove("active"));
  const tab = document.querySelector(`.mant-tab[data-ftab="${tabName}"]`);
  if (tab) tab.classList.add("active");
  document.getElementById("ftab-vehiculos").classList.toggle("hidden", tabName !== "vehiculos");
  document.getElementById("ftab-mantenimiento").classList.toggle("hidden", tabName !== "mantenimiento");
}

document.querySelectorAll(".nav-item:not(.disabled)").forEach(item => {
  item.addEventListener("click", () => {
    if (item.dataset.page === "mantenimiento") {
      showPage("flota");
      activateFlotaTab("mantenimiento");
    } else {
      showPage(item.dataset.page);
    }
    // Cerrar sidebar en mobile al navegar
    closeMobileNav();
  });
});

/* ─── Mobile nav toggle ──────────────────────────────── */
function closeMobileNav() {
  document.querySelector(".sidebar")?.classList.remove("open");
  document.getElementById("sidebar-backdrop")?.classList.remove("open");
}

const navToggle = document.getElementById("nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const sidebar  = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const isOpen   = sidebar.classList.toggle("open");
    backdrop.classList.toggle("open", isOpen);
  });
  document.getElementById("sidebar-backdrop")
    ?.addEventListener("click", closeMobileNav);
}

document.querySelectorAll(".mant-tab[data-ftab]").forEach(tab => {
  tab.addEventListener("click", () => activateFlotaTab(tab.dataset.ftab));
});

/* ─── State ─────────────────────────────────────────── */
let filteredData = [...FLOTA_DATA];
let sortCol = "equipo";
let sortDir = "asc";

/* ─── DOM refs ──────────────────────────────────────── */
const searchInput    = document.getElementById("searchInput");
const clearSearch    = document.getElementById("clearSearch");
const filterFab      = document.getElementById("filterFabricante");
const filterAnio     = document.getElementById("filterAnio");
const flotaBody      = document.getElementById("flotaBody");
const resultCount    = document.getElementById("resultCount");
const statsGrid      = document.getElementById("stats-grid");
const btnExport      = document.getElementById("btnExport");
const modalOverlay   = document.getElementById("modalOverlay");
const modalClose     = document.getElementById("modalClose");
const modalHeader    = document.getElementById("modalHeader");
const modalBody      = document.getElementById("modalBody");

/* ─── Init ──────────────────────────────────────────── */
document.getElementById("current-date").textContent = new Date().toLocaleDateString("es-AR", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

showPage("personal");   // página de inicio por defecto

buildFilters();
renderStats();
renderTable();

/* ─── Build filter dropdowns ────────────────────────── */
function buildFilters() {
  const fabricantes = [...new Set(FLOTA_DATA.map(v => v.fabricante))].sort();
  fabricantes.forEach(f => {
    const o = document.createElement("option");
    o.value = f; o.textContent = f;
    filterFab.appendChild(o);
  });

  const anios = [...new Set(FLOTA_DATA.map(v => v.anio))].sort((a, b) => b - a);
  anios.forEach(a => {
    const o = document.createElement("option");
    o.value = a; o.textContent = a;
    filterAnio.appendChild(o);
  });
}

/* ─── Stats ─────────────────────────────────────────── */
function renderStats() {
  const total = FLOTA_DATA.length;
  const fabricantes = new Set(FLOTA_DATA.map(v => v.fabricante)).size;
  const newest = Math.max(...FLOTA_DATA.map(v => v.anio));
  const toyota = FLOTA_DATA.filter(v => v.fabricante === "TOYOTA").length;

  const cards = [
    { label: "Total vehículos", value: total,       icon: "🚐", color: "#1a56a4" },
    { label: "Fabricantes",     value: fabricantes,  icon: "🏭", color: "#10b981" },
    { label: "Año más reciente",value: newest,       icon: "📅", color: "#f59e0b" },
    { label: "Toyota en flota", value: toyota,       icon: "⭐", color: "#eb0a1e" }
  ];

  statsGrid.innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
}

/* ─── Filter & sort pipeline ────────────────────────── */
function applyFilters() {
  const q   = searchInput.value.trim().toLowerCase();
  const fab = filterFab.value;
  const yr  = filterAnio.value;

  filteredData = FLOTA_DATA.filter(v => {
    const haystack = [v.equipo, v.dominio, v.denominacion, v.fabricante, v.tipo, v.motor, v.chasis]
      .join(" ").toLowerCase();
    if (q && !haystack.includes(q)) return false;
    if (fab && v.fabricante !== fab) return false;
    if (yr && v.anio !== +yr) return false;
    return true;
  });

  applySort();
  renderTable();
}

function applySort() {
  filteredData.sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
}

/* ─── Render table ──────────────────────────────────── */
function renderTable() {
  if (filteredData.length === 0) {
    flotaBody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No se encontraron vehículos con los filtros aplicados.</p>
        </div>
      </td></tr>`;
    resultCount.textContent = "Sin resultados";
    return;
  }

  flotaBody.innerHTML = filteredData.map(v => {
    const color = FAB_COLORS[v.fabricante] || "#888";
    return `
    <tr data-equipo="${v.equipo}">
      <td><span class="equipo-tag">${v.equipo}</span></td>
      <td><span class="dominio-tag">${v.dominio}</span></td>
      <td>${v.denominacion}</td>
      <td class="anio-text">${v.anio}</td>
      <td>
        <span class="fab-badge">
          <span class="fab-dot" style="background:${color}"></span>
          ${v.fabricante}
        </span>
      </td>
      <td><span class="tipo-text" title="${v.tipo}">${v.tipo}</span></td>
      <td><span class="num-text" title="${v.motor}">${v.motor || '<span class="no-data">—</span>'}</span></td>
      <td><span class="num-text" title="${v.chasis}">${v.chasis || '<span class="no-data">—</span>'}</span></td>
    </tr>`;
  }).join("");

  resultCount.textContent = `Mostrando ${filteredData.length} de ${FLOTA_DATA.length} vehículos`;

  // row click → modal
  flotaBody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openModal(row.dataset.equipo));
  });

  // update sort arrows
  document.querySelectorAll("th.sortable").forEach(th => {
    th.classList.remove("sort-asc", "sort-desc");
    if (th.dataset.col === sortCol) th.classList.add(`sort-${sortDir}`);
  });
}

/* ─── Modal ─────────────────────────────────────────── */
function openModal(equipo) {
  const v = FLOTA_DATA.find(x => x.equipo === equipo);
  if (!v) return;

  modalHeader.innerHTML = `
    <span class="modal-equipo">${v.equipo}</span>
    <div class="modal-denom">${v.denominacion}</div>
    <div class="modal-dominio">Dominio: ${v.dominio}</div>
  `;

  modalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Fabricante</span>
      <span class="modal-field-value">${v.fabricante}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Año</span>
      <span class="modal-field-value">${v.anio}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Tipo / Modelo</span>
      <span class="modal-field-value">${v.tipo}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">N° Pieza Motor</span>
      <span class="modal-field-value mono">${v.motor || "—"}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">N° Serie Chasis</span>
      <span class="modal-field-value mono">${v.chasis || "—"}</span>
    </div>
  `;

  modalOverlay.classList.add("open");
}

modalClose.addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) modalOverlay.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") modalOverlay.classList.remove("open"); });

/* ─── Sort headers ──────────────────────────────────── */
document.querySelectorAll("th.sortable").forEach(th => {
  th.addEventListener("click", () => {
    if (sortCol === th.dataset.col) {
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      sortCol = th.dataset.col;
      sortDir = "asc";
    }
    applySort();
    renderTable();
  });
});

/* ─── Search & filter events ────────────────────────── */
searchInput.addEventListener("input", () => {
  clearSearch.style.display = searchInput.value ? "flex" : "none";
  applyFilters();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.style.display = "none";
  applyFilters();
});

filterFab.addEventListener("change", applyFilters);
filterAnio.addEventListener("change", applyFilters);

/* ─── CSV export ─────────────────────────────────────── */
btnExport.addEventListener("click", () => {
  const headers = ["Equipo","Dominio","Denominación","Año","Fabricante","Tipo","Motor","Chasis"];
  const rows = filteredData.map(v =>
    [v.equipo, v.dominio, `"${v.denominacion}"`, v.anio, v.fabricante, `"${v.tipo}"`, v.motor, v.chasis].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `flota_termomecanica_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});
