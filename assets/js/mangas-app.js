/* ─── Stats mangas ───────────────────────────────────── */
(function renderMangasStats() {
  const total = MANGAS_DATA.length;
  const fabricantes = [...new Set(MANGAS_DATA.map(m => m.fabricante))];
  const thyssen = MANGAS_DATA.filter(m => m.fabricante === "THYSSEN").length;

  const cards = [
    { label: "Total mangas",  value: total,           icon: "🛬", color: "#1a56a4" },
    { label: "Fabricantes",   value: fabricantes.length, icon: "🏭", color: "#10b981" },
    { label: "Posiciones",    value: "3 — 12",        icon: "🔢", color: "#f59e0b" },
    { label: "THYSSEN",       value: thyssen,         icon: "⭐", color: "#1a56a4" }
  ];

  document.getElementById("mangas-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".mangas-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mangas-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.getElementById("mangas-grid-view").classList.toggle("hidden", view !== "grid");
    document.getElementById("mangas-table-view").classList.toggle("hidden", view !== "table");
    document.getElementById("mangas-planes-view").classList.toggle("hidden", view !== "planes");
    document.getElementById("mangasFabFilter").closest(".filter-group").classList.toggle("hidden", view === "planes");
  });
});

/* ─── Fabricante filter ──────────────────────────────── */
const mangasFabFilter = document.getElementById("mangasFabFilter");
[...new Set(MANGAS_DATA.map(m => m.fabricante))].sort().forEach(f => {
  const o = document.createElement("option");
  o.value = f; o.textContent = f;
  mangasFabFilter.appendChild(o);
});

mangasFabFilter.addEventListener("change", () => {
  renderMangasGrid();
  renderMangasTable();
});

/* ─── Grid de posiciones ─────────────────────────────── */
function getFiltered() {
  const fab = mangasFabFilter.value;
  return fab ? MANGAS_DATA.filter(m => m.fabricante === fab) : MANGAS_DATA;
}

function renderMangasGrid() {
  const filtered = getFiltered();
  const filteredEquipos = new Set(filtered.map(m => m.equipo));

  document.getElementById("mangas-grid").innerHTML = MANGAS_DATA.map(m => {
    const color = FAB_COLORS_MANGAS[m.fabricante] || "#888";
    const dimida = filtered.length === MANGAS_DATA.length || filteredEquipos.has(m.equipo);
    return `
      <div class="manga-gate ${dimida ? '' : 'dimmed'}" data-equipo="${m.equipo}">
        <div class="gate-pos" style="background:${color}">
          <span class="gate-pos-num">${m.pos}</span>
        </div>
        <div class="gate-body">
          <span class="gate-equipo">${m.equipo}</span>
          <span class="gate-fab" style="color:${color}">${m.fabricante}</span>
          <span class="gate-tipo">${m.tipo}</span>
          ${m.dimension ? `<span class="gate-dim">${m.dimension}</span>` : ''}
          ${ALTURA_SET.has(m.equipo) ? `<span class="altura-badge" style="margin-top:4px">⛰️ Altura</span>` : ''}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".manga-gate").forEach(gate => {
    gate.addEventListener("click", () => openMangaModal(gate.dataset.equipo));
  });
}

/* ─── Tabla ──────────────────────────────────────────── */
function renderMangasTable() {
  const filtered = getFiltered();
  const tbody = document.getElementById("mangasBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const color = FAB_COLORS_MANGAS[m.fabricante] || "#888";
    return `
      <tr data-equipo="${m.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${m.equipo}</span>${ALTURA_SET.has(m.equipo) ? ' <span class="altura-badge">⛰️ Altura</span>' : ''}</td>
        <td style="font-weight:700;font-size:15px;color:var(--color-primary)">POS N°${m.pos}</td>
        <td>${m.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${m.fabricante}</span></td>
        <td><code class="tipo-code">${m.tipo}</code></td>
        <td>${m.dimension ? `<span class="dim-tag">${m.dimension}</span>` : '<span class="no-data">—</span>'}</td>
        <td style="font-size:11px;color:var(--color-muted)">${m.ubicacion}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openMangaModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const mangaModal      = document.getElementById("mangaModalOverlay");
const mangaModalClose = document.getElementById("mangaModalClose");
const mangaModalHdr   = document.getElementById("mangaModalHeader");
const mangaModalBody  = document.getElementById("mangaModalBody");

function openMangaModal(equipo) {
  const m = MANGAS_DATA.find(x => x.equipo === equipo);
  if (!m) return;
  const color = FAB_COLORS_MANGAS[m.fabricante] || "#888";

  mangaModalHdr.style.background = color;
  mangaModalHdr.innerHTML = `
    <span class="modal-equipo">${m.equipo}</span>
    <div class="modal-denom">Posición N°${m.pos} — ${m.fabricante}</div>
    <div class="modal-dominio">${m.denominacion}</div>
  `;

  mangaModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Fabricante</span>
      <span class="modal-field-value">${m.fabricante}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Posición</span>
      <span class="modal-field-value">N°${m.pos}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Tipo / Modelo</span>
      <span class="modal-field-value mono">${m.tipo}</span>
    </div>
    ${m.dimension ? `
    <div class="modal-field full">
      <span class="modal-field-label">Dimensión / Especificación eléctrica</span>
      <span class="modal-field-value mono">${m.dimension}</span>
    </div>` : ''}
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${m.ubicacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${m.ubi_desc}</span>
    </div>
  `;

  mangaModal.classList.add("open");
}

mangaModalClose.addEventListener("click", () => mangaModal.classList.remove("open"));
mangaModal.addEventListener("click", e => { if (e.target === mangaModal) mangaModal.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") mangaModal.classList.remove("open"); });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedMangaPlan = null;

function renderMangaPlanesSelector() {
  const container = document.getElementById("mangaPlanesSelector");
  container.innerHTML = MANGAS_DATA.map(m => {
    const planId = MANGA_A_PLAN[m.equipo];
    const color = FAB_COLORS_MANGAS[m.fabricante] || "#888";
    const hasPlan = !!planId;
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedMangaPlan === m.equipo ? 'selected' : ''}" data-equipo="${m.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${m.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos">POS N°${m.pos}</div>
        <div class="manga-sel-fab" style="color:${color}">${m.fabricante}</div>
        <div class="manga-sel-tipo">${m.tipo}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedMangaPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderMangaPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderMangaPlan(equipo) {
  const m = MANGAS_DATA.find(x => x.equipo === equipo);
  const planId = MANGA_A_PLAN[equipo];
  const container = document.getElementById("mangaPlanContent");
  const color = FAB_COLORS_MANGAS[m.fabricante] || "#888";

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">La manga <strong>${equipo}</strong> (${m.denominacion}) de fabricante <strong style="color:${color}">${m.fabricante}</strong> — modelo <strong>${m.tipo}</strong> — no tiene un plan preventivo cargado aún. Consultá la documentación técnica del fabricante.</p>
        </div>
      </div>
    `;
    return;
  }

  const plan = MANGAS_PLANES.find(p => p.id === planId);
  const mangaTags = plan.mangas.map(eq => {
    const mg = MANGAS_DATA.find(x => x.equipo === eq);
    return `<span class="manga-equipo-tag" style="background:${FAB_COLORS_MANGAS[mg ? mg.fabricante : ''] || '#888'}" title="${mg ? mg.denominacion : ''}">${eq}</span>`;
  }).join(" ");

  const freqSections = plan.frecuencias.map(frec => {
    const totalTareas = frec.grupos.reduce((sum, g) => sum + g.tareas.length, 0);
    const grupos = frec.grupos.map(g => `
      <div class="manga-grupo">
        <div class="manga-grupo-nombre">${g.nombre}</div>
        <ul class="km-task-list">
          ${g.tareas.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `).join("");

    return `
      <div class="manga-freq-section">
        <div class="manga-freq-header" style="background:${frec.color}">
          <div>
            <span class="manga-freq-label">Frecuencia</span>
            <span class="manga-freq-badge">${frec.label}</span>
          </div>
          <span class="manga-freq-count">${frec.grupos.length} grupos · ${totalTareas} tareas</span>
        </div>
        <div class="manga-grupo-grid">${grupos}</div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title">${plan.denominacion}</h2>
        <p class="mant-section-desc" style="margin-top:4px">
          <span style="color:${color};font-weight:700">${plan.fabricante}</span> · Modelo: <code class="tipo-code">${plan.tipo}</code>
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${mangaTags}</div>
      </div>
    </div>
    ${freqSections}
  `;
}

/* ─── Init ───────────────────────────────────────────── */
renderMangasGrid();
renderMangasTable();
renderMangaPlanesSelector();
