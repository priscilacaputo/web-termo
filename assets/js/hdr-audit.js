/* ─── Auditoría de Hojas de Ruta (IA17) ───────────────────────────────
   Panel que se agrega al final de la página "Auditoría SAP". Cruza
   PLANES_SAP (posiciones de plan, IP24) contra HDR_DATA (maestro de
   hojas de ruta) para detectar:
     · Planes SIN hoja de ruta clara → generan OTs sin operaciones.
     · Planes que apuntan a un contador "NO USAR" o vacío (0 HH).
   Usa las funciones de match de hdr-data.js (hdrBestMatch, hdrParaEquipo). */

(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function hdrAuditData() {
    if (typeof HDR_DATA === 'undefined' || typeof hdrBestMatch !== 'function') return null;
    const planes = (typeof PLANES_SAP !== 'undefined' && Array.isArray(PLANES_SAP)) ? PLANES_SAP : [];
    const rutas = new Set(HDR_DATA.map(e => e.ruta));
    const nOps = HDR_DATA.reduce((s, e) => s + (e.ops || 0), 0);

    /* Posiciones únicas por (equipo|desc) para no contar 10 veces lo mismo. */
    const vistos = new Set();
    const sinRuta = {};        // desc → { n, equipos:Set }
    const aDeprecado = {};     // desc → { n, equipos:Set, ruta, motivo }
    let conRuta = 0, total = 0;

    planes.forEach(p => {
      const k = (p.equipo || '') + '|' + (p.desc || '');
      if (vistos.has(k)) return;
      vistos.add(k);
      total++;
      const m = hdrBestMatch(p.desc);
      if (!m) {
        const d = sinRuta[p.desc] || (sinRuta[p.desc] = { n: 0, equipos: new Set() });
        d.n++; if (p.equipo) d.equipos.add(p.equipo);
        return;
      }
      conRuta++;
      const e = m.entry;
      const vacio = (e.trabajoMin || 0) === 0 && (e.duracionMin || 0) === 0;
      if (e.noUsar || vacio) {
        const key = p.desc + ' → ' + e.ruta + '/' + e.cont;
        const d = aDeprecado[key] || (aDeprecado[key] = {
          n: 0, equipos: new Set(), desc: p.desc || '', ruta: e.ruta + '/' + e.cont,
          motivo: e.noUsar ? 'contador marcado "NO USAR"' : 'hoja de ruta sin operaciones (0 HH)',
          rutaDesc: e.desc,
        });
        d.n++; if (p.equipo) d.equipos.add(p.equipo);
      }
    });

    const sinRutaArr = Object.entries(sinRuta)
      .map(([desc, d]) => ({ desc, n: d.n, equipos: [...d.equipos] }))
      .sort((a, b) => b.n - a.n);
    const deprecArr = Object.values(aDeprecado)
      .map(d => ({ ...d, equipos: [...d.equipos] }))
      .sort((a, b) => b.n - a.n);

    return {
      nRutas: rutas.size, nCont: HDR_DATA.length, nOps,
      total, conRuta, sinRutaArr, deprecArr,
      cobertura: total ? Math.round(conRuta / total * 100) : 0,
      contNoUsar: HDR_DATA.filter(e => e.noUsar).length,
      contVacios: HDR_DATA.filter(e => (e.trabajoMin || 0) === 0 && (e.duracionMin || 0) === 0).length,
    };
  }

  let _cache = null;
  function data() { return _cache || (_cache = hdrAuditData()); }

  window.hdrAuditCardHTML = function () {
    const d = data();
    if (!d) return '';
    const stat = (label, val, color) =>
      `<div class="stat-card" style="--stat-color:${color};min-width:150px">
        <span class="stat-label">${label}</span><span class="stat-value">${val}</span></div>`;

    const sinRutaRows = d.sinRutaArr.length
      ? d.sinRutaArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 8).map(esc).join(', ')}${r.equipos.length > 8 ? ` +${r.equipos.length - 8}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="3" style="color:var(--color-muted)">Todas las posiciones de plan matchean una hoja de ruta.</td></tr>`;

    const deprecRows = d.deprecArr.length
      ? d.deprecArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td><code>${esc(r.ruta)}</code></td>
          <td>${esc(r.motivo)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 6).map(esc).join(', ')}${r.equipos.length > 6 ? ` +${r.equipos.length - 6}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" style="color:var(--color-muted)">Ningún plan apunta a un contador "NO USAR" ni a una hoja de ruta vacía.</td></tr>`;

    return `
    <div class="table-card" style="margin-bottom:20px" id="aud-hdr">
      <div style="padding:16px 16px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        <h3 style="margin:0;font-size:15px;color:var(--color-navy)">🧭 Hojas de Ruta (IA17)</h3>
        <span style="font-size:12px;color:var(--color-muted)">Maestro de tareas de SAP · duración y Nº de personas por rutina</span>
        <button class="mant-tab" style="margin-left:auto" onclick="hdrAuditExport()">⬇ Exportar Excel</button>
      </div>
      <div class="stats-grid" style="padding:14px 16px 4px">
        ${stat('Hojas de ruta', d.nRutas, '#0096d6')}
        ${stat('Contadores', d.nCont, '#0096d6')}
        ${stat('Operaciones', d.nOps.toLocaleString('es-AR'), '#0096d6')}
        ${stat('Planes con hoja de ruta', d.cobertura + '%', d.cobertura >= 95 ? '#10b981' : '#f59e0b')}
        ${stat('Contadores "NO USAR"', d.contNoUsar, d.contNoUsar ? '#f59e0b' : '#10b981')}
        ${stat('Hojas de ruta vacías', d.contVacios, d.contVacios ? '#f59e0b' : '#10b981')}
      </div>

      <div style="padding:8px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Planes sin hoja de ruta clara <span style="font-weight:400;color:var(--color-muted)">— generan OTs sin operaciones / sin HH planificadas</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Descripción del plan</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${sinRutaRows}</tbody>
      </table></div>

      <div style="padding:14px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Planes apuntando a contadores "NO USAR" o vacíos
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Descripción del plan</th><th>Hoja de ruta</th><th>Problema</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${deprecRows}</tbody>
      </table></div>
    </div>`;
  };

  window.hdrAuditExport = function () {
    const d = data();
    if (!d || typeof XLSX === 'undefined') return;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      d.sinRutaArr.map(r => ({ 'Descripción plan': r.desc, 'Posiciones': r.n, 'Equipos': r.equipos.join(', ') }))
    ), 'Planes sin hoja de ruta');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      d.deprecArr.map(r => ({ 'Descripción plan': r.desc, 'Hoja de ruta': r.ruta, 'Problema': r.motivo, 'Posiciones': r.n, 'Equipos': r.equipos.join(', ') }))
    ), 'Contadores NO USAR o vacíos');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      (typeof HDR_DATA !== 'undefined' ? HDR_DATA : []).map(e => ({
        'Hoja de ruta': e.ruta, 'Contador': e.cont, 'Descripción': e.desc,
        'Puesto': e.puesto, 'Operaciones': e.ops, 'Personas': e.nPers,
        'Trabajo (min)': e.trabajoMin, 'Duración (min)': e.duracionMin, 'NO USAR': e.noUsar ? 'Sí' : '',
      }))
    ), 'Maestro HDR');
    XLSX.writeFile(wb, 'Auditoria_HojasDeRuta.xlsx');
  };
})();
