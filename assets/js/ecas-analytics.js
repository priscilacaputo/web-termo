/* ─── ECAs Analytics — Resumen por Edificio y Piso ─── */

function getECASAnalytics() {
  // Extraer edificios y pisos únicos
  const edificios = [...new Set(ECAS_DATA.map(e => {
    const match = e.ubicacion.match(/Ed(?:ificio)?\s+([A-Z0-9]+)/i) || e.ubicacion.match(/^([^-]+)/);
    return match ? match[1].trim() : 'Otro';
  }))].sort();

  const pisos = [...new Set(ECAS_DATA.map(e => e.piso))].sort((a, b) => {
    if (a === 'PB') return -1;
    if (b === 'PB') return 1;
    return parseInt(a) - parseInt(b);
  });

  // Contar por edificio y piso
  const countByEdificioPiso = {};
  const countByEdificio = {};
  const countByPiso = {};

  ECAS_DATA.forEach(e => {
    const match = e.ubicacion.match(/Ed(?:ificio)?\s+([A-Z0-9]+)/i) || e.ubicacion.match(/^([^-]+)/);
    const edificio = match ? match[1].trim() : 'Otro';
    const piso = e.piso;

    countByEdificio[edificio] = (countByEdificio[edificio] || 0) + 1;
    countByPiso[piso] = (countByPiso[piso] || 0) + 1;

    const key = `${edificio}|${piso}`;
    countByEdificioPiso[key] = (countByEdificioPiso[key] || 0) + 1;
  });

  return {
    edificios,
    pisos,
    countByEdificio,
    countByPiso,
    countByEdificioPiso
  };
}

function renderECASAnalytics() {
  const analytics = getECASAnalytics();
  const container = document.getElementById('ecas-analytics-container');

  if (!container) return;

  // Crear HTML
  let html = `
    <div style="margin-bottom:32px">
      <h3 style="margin-bottom:20px; color:var(--color-navy); font-weight:800; font-size:20px">🏢 Distribución por Edificio</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px">
  `;

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  analytics.edificios.forEach((edificio, idx) => {
    const count = analytics.countByEdificio[edificio];
    const color = colors[idx % colors.length];
    html += `
      <div class="ecas-stat-card" style="border-left:4px solid ${color}; cursor:pointer" title="Click para filtrar por ${edificio}">
        <div style="font-weight:700; color:var(--color-navy); margin-bottom:8px">${edificio}</div>
        <div style="font-size:28px; font-weight:900; color:${color}; margin-bottom:4px">${count}</div>
        <div style="font-size:11px; color:var(--color-muted)">ECAs</div>
      </div>
    `;
  });

  html += `</div></div>`;

  // Pisos
  html += `
    <div>
      <h3 style="margin-bottom:20px; color:var(--color-navy); font-weight:800; font-size:20px">📍 Distribución por Piso</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px">
  `;

  const pisoColors = {
    'PB': '#1f2937',
    '1': '#3b82f6',
    '2': '#8b5cf6',
    '3': '#ec4899',
    '4': '#f59e0b',
    '5': '#06b6d4',
    '6': '#10b981',
  };

  analytics.pisos.forEach(piso => {
    const count = analytics.countByPiso[piso];
    const color = pisoColors[piso] || '#6b7280';
    const label = piso === 'PB' ? 'Planta Baja' : `Piso ${piso}`;
    html += `
      <div class="ecas-stat-card" style="border-left:4px solid ${color}; cursor:pointer" title="Click para filtrar por ${label}">
        <div style="font-weight:700; color:var(--color-navy); margin-bottom:8px">${label}</div>
        <div style="font-size:28px; font-weight:900; color:${color}; margin-bottom:4px">${count}</div>
        <div style="font-size:11px; color:var(--color-muted)">ECAs</div>
      </div>
    `;
  });

  html += `</div></div>`;

  // Matriz edificio x piso
  html += `
    <div style="margin-top:32px">
      <h3 style="margin-bottom:20px; color:var(--color-navy); font-weight:800; font-size:20px">🗂️ Matriz Edificio × Piso</h3>
      <div style="overflow-x:auto">
        <table style="width:100%; border-collapse:collapse; font-size:13px">
          <thead>
            <tr style="background:#f3f4f6; border-bottom:2px solid var(--color-border)">
              <th style="padding:12px; text-align:left; font-weight:700; color:var(--color-navy); border-right:1px solid var(--color-border)">Edificio</th>
  `;

  analytics.pisos.forEach(piso => {
    html += `<th style="padding:12px; text-align:center; font-weight:700; color:var(--color-navy)">${piso === 'PB' ? 'PB' : `P${piso}`}</th>`;
  });

  html += `<th style="padding:12px; text-align:center; font-weight:700; color:var(--color-navy)">Total</th></tr></thead><tbody>`;

  analytics.edificios.forEach(edificio => {
    let total = 0;
    html += `<tr style="border-bottom:1px solid var(--color-border)"><td style="padding:12px; font-weight:600; color:var(--color-navy); border-right:1px solid var(--color-border)">${edificio}</td>`;

    analytics.pisos.forEach(piso => {
      const key = `${edificio}|${piso}`;
      const count = analytics.countByEdificioPiso[key] || 0;
      total += count;
      const bgColor = count > 0 ? '#f0f9ff' : '#f9fafb';
      html += `<td style="padding:12px; text-align:center; background:${bgColor}; font-weight:${count > 0 ? '700' : '400'}; color:${count > 0 ? '#0369a1' : '#999'}">${count || '-'}</td>`;
    });

    html += `<td style="padding:12px; text-align:center; font-weight:700; background:#fef3c7; color:#b45309">${total}</td></tr>`;
  });

  html += `</tbody></table></div></div>`;

  container.innerHTML = html;

  // Agregar event listeners a los cards
  document.querySelectorAll('.ecas-stat-card').forEach(card => {
    card.addEventListener('click', function() {
      // Puedes agregar lógica de filtrado aquí si lo deseas
      card.style.boxShadow = '0 0 0 2px var(--color-primary)';
      setTimeout(() => {
        card.style.boxShadow = 'none';
      }, 300);
    });
  });
}

// Renderizar cuando la página se carga
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderECASAnalytics);
} else {
  renderECASAnalytics();
}
