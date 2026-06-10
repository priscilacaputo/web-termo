/* ─── Personal — Guardias Termomecánica AEP ─────────────── */

const GUARDIAS = [
  {
    id: 1,
    miembros: [
      { nombre: "BARBERIO",      legajo: "6081", rol: "SUP. B"    },
      { nombre: "AVALOS",        legajo: "4025", rol: "SUP. A"    },
      { nombre: "ANDRADE",       legajo: "4004", rol: "MEC ESP"   },
      { nombre: "SENGER",        legajo: "5842", rol: "MEC ESP"   },
      { nombre: "DEFILLIPI",     legajo: "7600", rol: "MEC A"     },
      { nombre: "DELGADILLO",    legajo: "6390", rol: "TERMO ESP" },
      { nombre: "BLANCO",        legajo: "6862", rol: "TERMO B"   },
      { nombre: "HORTAL",        legajo: "8267", rol: "TERMO B"   },
    ]
  },
  {
    id: 2,
    miembros: [
      { nombre: "HASAN",         legajo: "4117", rol: "SUP. A"    },
      { nombre: "GONZALEZ",      legajo: "3999", rol: "SUP. B"    },
      { nombre: "MERCADO",       legajo: "4783", rol: "TERMO ESP" },
      { nombre: "CRISMAN",       legajo: "8075", rol: "TERMO B"   },
      { nombre: "SENABRE",       legajo: "6918", rol: "TERMO B"   },
      { nombre: "D'ELIA",        legajo: "8052", rol: "TERMO B"   },
      { nombre: "MOREIRA",       legajo: "8051", rol: "MEC B"     },
      { nombre: "BARBATO",       legajo: "4898", rol: "MEC ESP"   },
      { nombre: "TORRES",        legajo: "3948", rol: "MEC ESP"   },
      { nombre: "GIAMPAOLLI",    legajo: "6983", rol: "MEC B"     },
    ]
  },
  {
    id: 3,
    miembros: [
      { nombre: "PEREZ",         legajo: "4386", rol: "SUP. B"    },
      { nombre: "RAMIREZ",       legajo: "4030", rol: "SUP. A"    },
      { nombre: "LIA",           legajo: "5841", rol: "SUP. B"    },
      { nombre: "VARGAS",        legajo: "6006", rol: "MEC ESP"   },
      { nombre: "CANIZA",        legajo: "6938", rol: "MEC ESP"   },
      { nombre: "CABRERA",       legajo: "8000", rol: "MEC B"     },
      { nombre: "GUTIERREZ",     legajo: "8286", rol: "TERMO B"   },
      { nombre: "SAUCEDO",       legajo: "7829", rol: "TERMO B"   },
      { nombre: "TOLEDO",        legajo: "6919", rol: "TERMO ESP" },
    ]
  },
  {
    id: 4,
    miembros: [
      { nombre: "VILLARDI",      legajo: "4023", rol: "SUP. A"    },
      { nombre: "ORTIZ",         legajo: "5721", rol: "SUP. B"    },
      { nombre: "BENEGAS",       legajo: "8001", rol: "TERMO B"   },
      { nombre: "FERNANDEZ",     legajo: "4034", rol: "TERMO ESP" },
      { nombre: "LOPEZ CRISTIAN",legajo: "6148", rol: "TERMO ESP" },
      { nombre: "MARTINEZ",      legajo: "8002", rol: "TERMO B"   },
      { nombre: "MUÑOZ",         legajo: "4693", rol: "TERMO ESP" },
      { nombre: "CILLA",         legajo: "6917", rol: "MEC ESP"   },
      { nombre: "NAEF",          legajo: "7601", rol: "MEC A"     },
      { nombre: "PAGLIARDINI",   legajo: "8275", rol: "MEC B"     },
    ]
  },
];

/* Personal fuera de guardia */
const PERSONAL_EXTRA = [
  { nombre: "JORGE", legajo: "7875", rol: "DATA" },
];

function rolClass(rol) {
  const r = rol.toUpperCase();
  if (r.startsWith("SUP"))   return "sup";
  if (r.startsWith("TERMO")) return "termo";
  if (r.startsWith("MEC"))   return "mec";
  return "data";
}

/* ─── Stats ──────────────────────────────────────────────── */
(function renderPersonalStats() {
  const todos = GUARDIAS.flatMap(g => g.miembros);
  const total  = todos.length;
  const sups   = todos.filter(m => m.rol.toUpperCase().startsWith("SUP")).length;
  const termos = todos.filter(m => m.rol.toUpperCase().startsWith("TERMO")).length;
  const mecs   = todos.filter(m => m.rol.toUpperCase().startsWith("MEC")).length;

  const cards = [
    { label: "Total personal",   value: total,  icon: "👷", color: "#1a56a4" },
    { label: "Supervisores",     value: sups,   icon: "⭐", color: "#1a56a4" },
    { label: "Técnicos de Aire",     value: termos, icon: "🔥", color: "#d97706" },
    { label: "Técnicos Mecánicos",   value: mecs,   icon: "🔧", color: "#059669" },
  ];

  document.getElementById("personal-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Guardias grid ──────────────────────────────────────── */
document.getElementById("personal-guardias-grid").innerHTML = GUARDIAS.map(g => `
  <div class="personal-guardia-card">
    <div class="personal-guardia-header">
      <span class="personal-guardia-num">${g.id}</span>
      <span class="personal-guardia-title">Guardia ${g.id}</span>
      <span class="personal-guardia-count">${g.miembros.length} personas</span>
    </div>
    <div class="personal-guardia-members">
      ${g.miembros.map(m => `
        <div class="personal-member">
          <span class="personal-member-name">${m.nombre}</span>
          <span class="personal-member-file">${m.legajo}</span>
          <span class="personal-role-badge ${rolClass(m.rol)}">${m.rol}</span>
        </div>
      `).join("")}
    </div>
  </div>
`).join("");

/* ─── Personal fuera de guardia ──────────────────────────── */
if (PERSONAL_EXTRA.length) {
  const extraHtml = `
    <div class="personal-extra-section">
      <div class="personal-extra-header">
        <span class="personal-extra-icon">💼</span>
        <span class="personal-extra-title">Personal fuera de guardia</span>
        <span class="personal-guardia-count">${PERSONAL_EXTRA.length} persona${PERSONAL_EXTRA.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="personal-guardia-members">
        ${PERSONAL_EXTRA.map(m => `
          <div class="personal-member">
            <span class="personal-member-name">${m.nombre}</span>
            <span class="personal-member-file">${m.legajo}</span>
            <span class="personal-role-badge ${rolClass(m.rol)}">${m.rol}</span>
          </div>
        `).join("")}
      </div>
    </div>`;
  document.getElementById("personal-extra-wrap").innerHTML = extraHtml;
}
