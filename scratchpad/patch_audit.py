import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'hdr-audit.js')
s = open(p, encoding='utf-8').read()

s = s.replace("""        ${stat('Planes con hoja de ruta', d.cobertura + '%', d.cobertura >= 95 ? '#10b981' : '#f59e0b')}""",
"""        ${stat(d.exactoMode ? 'Posiciones con hoja de ruta (exacto)' : 'Planes con hoja de ruta (por texto)', d.cobertura + '%', d.cobertura >= 95 ? '#10b981' : '#f59e0b')}
        ${d.exactoMode ? stat('Match por texto erraba', d.cmpTexto ? Math.round(d.difTexto / d.cmpTexto * 100) + '%' : '–', '#8b5cf6') : ''}""")

NEW_BLOCK = r'''        <tbody>${deprecRows}</tbody>
      </table></div>
      ${noCorrHTML(d)}
      ${estandarHTML()}
    </div>`;
  };

  function noCorrHTML(d) {
    if (!d.exactoMode) return '';
    const rows = d.noCorrArr.length
      ? d.noCorrArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td><code>${esc(r.ruta)}</code> ${esc(r.rutaDesc)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 6).map(esc).join(', ')}${r.equipos.length > 6 ? ` +${r.equipos.length - 6}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="4" style="color:var(--color-muted)">Todas las hojas de ruta asignadas coinciden con la descripción del plan.</td></tr>`;
    return `
      <div style="padding:14px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Hoja de ruta asignada que no parece corresponder al plan
        <span style="font-weight:400;color:var(--color-muted)">— posible error de asignación en SAP</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Plan</th><th>Hoja de ruta asignada</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }

  /* ── Gama de tareas de SAP vs estándar del Manual de Mtto ── */
  function estandarHTML() {
    if (typeof HDR_ESTANDAR === 'undefined') return '';
    const E = HDR_ESTANDAR;
    const pct = g => g.nStd ? Math.round(g.cub / g.nStd * 100) : 0;
    const color = p => p >= 85 ? '#10b981' : p >= 60 ? '#f59e0b' : '#ef4444';
    const conDet = E.grupos.filter(g => g.conDetalle);
    const sinDet = E.grupos.filter(g => !g.conDetalle);
    const tot = conDet.reduce((a, g) => ({ std: a.std + g.nStd, cub: a.cub + g.cub }), { std: 0, cub: 0 });
    const pTot = tot.std ? Math.round(tot.cub / tot.std * 100) : 0;

    const detalle = g => {
      const falta = g.falta.map(t => `<li><b>${esc(t.f || '–')}</b>${t.moex ? ' <i>(MOEX)</i>' : ''}: ${esc(t.t)}</li>`).join('');
      const otra = g.otraFrecL.map(t => `<li><b>Estándar ${esc(t.f || '–')} / SAP ${esc(t.sap || '–')}</b>: ${esc(t.t)}</li>`).join('');
      const sobr = g.sobrEj.map(t => `<li>${esc(t)}</li>`).join('');
      const pares = g.pares.map(x => `<code>${esc(x.rc)}</code> (${x.nEquipos} eq.${x.detalle ? '' : ', sin texto de tareas'}${x.existe ? '' : ', no está en el export'})`).join(' · ');
      return `<details><summary style="cursor:pointer;color:var(--color-blue,#0096d6)">ver</summary>
        <div style="font-size:12px;padding:6px 0">
          <div style="margin-bottom:6px"><b>Hojas de ruta:</b> ${pares}</div>
          ${falta ? `<div><b>Tareas del estándar que no están en SAP (${g.falta.length}):</b><ul style="margin:4px 0 8px 18px">${falta}</ul></div>` : ''}
          ${otra ? `<div><b>Están, pero con otra frecuencia (${g.otraFrec}):</b><ul style="margin:4px 0 8px 18px">${otra}</ul></div>` : ''}
          ${sobr ? `<div><b>Tareas de SAP que el estándar no tiene (${g.nSobrantes}, ejemplos):</b><ul style="margin:4px 0 8px 18px">${sobr}</ul></div>` : ''}
        </div></details>`;
    };

    const rows = conDet.slice().sort((a, b) => pct(a) - pct(b)).map(g => {
      const p = pct(g);
      return `<tr>
        <td>${esc(g.nombre)}</td>
        <td style="text-align:center">${g.nEquipos}</td>
        <td style="text-align:center">${g.nStd}</td>
        <td style="text-align:center">${g.cub}</td>
        <td style="text-align:center">${g.otraFrec}</td>
        <td style="text-align:center">${g.falta.length}</td>
        <td style="text-align:center"><b style="color:${color(p)}">${p}%</b></td>
        <td>${detalle(g)}</td></tr>`;
    }).join('');

    const sinDetRows = sinDet.map(g => `<tr><td>${esc(g.nombre)}</td><td style="text-align:center">${g.nEquipos}</td>
        <td style="text-align:center">${g.nStd}</td>
        <td colspan="5" style="color:var(--color-muted)">${g.pares.map(x => esc(x.rc)).join(', ')} — la hoja de ruta de SAP no trae el texto de las tareas (falta el texto largo del IA17; puede ser MOEX)</td></tr>`).join('');
    const sinHR = E.sinHojaDeRuta.map(g => `<li>${esc(g.nombre)} <span style="color:var(--color-muted)">(${g.nStd} tareas en el estándar)</span></li>`).join('');

    return `
      <div style="padding:18px 16px 4px;font-weight:700;font-size:14px;color:var(--color-navy)">
        📐 Gama de tareas vs estándar del Manual de Mtto
        <span style="font-weight:400;font-size:12px;color:var(--color-muted)">— ¿las hojas de ruta de SAP hacen lo que dice el estándar?</span>
      </div>
      <div class="stats-grid" style="padding:10px 16px 4px">
        <div class="stat-card" style="--stat-color:${color(pTot)};min-width:150px"><span class="stat-label">Tareas del estándar cubiertas</span><span class="stat-value">${pTot}%</span></div>
        <div class="stat-card" style="--stat-color:#0096d6;min-width:150px"><span class="stat-label">Tipos comparados</span><span class="stat-value">${conDet.length}</span></div>
        <div class="stat-card" style="--stat-color:#f59e0b;min-width:150px"><span class="stat-label">Tipos sin texto de tareas en SAP</span><span class="stat-value">${sinDet.length}</span></div>
        <div class="stat-card" style="--stat-color:#ef4444;min-width:150px"><span class="stat-label">Tipos del estándar sin hoja de ruta</span><span class="stat-value">${E.sinHojaDeRuta.length}</span></div>
      </div>
      <div style="padding:0 16px 8px;font-size:11px;color:var(--color-muted)">
        Cruce por palabras (aproximado): una tarea del estándar se considera cubierta si una tarea de la hoja de ruta comparte ≥60% de sus palabras, con la misma frecuencia.
        Los vehículos (por kilómetros) no se comparan.
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Tipo de equipo</th><th style="text-align:center">Equipos</th><th style="text-align:center">Tareas estándar</th><th style="text-align:center">Cubiertas</th><th style="text-align:center">Otra frecuencia</th><th style="text-align:center">Faltan en SAP</th><th style="text-align:center">Cobertura</th><th>Detalle</th></tr></thead>
        <tbody>${rows}${sinDetRows}</tbody>
      </table></div>
      <div style="padding:10px 16px 14px;font-size:12px">
        <b>Tipos del estándar sin ninguna hoja de ruta en SAP:</b>
        <ul style="margin:4px 0 0 18px">${sinHR}</ul>
      </div>`;
  }'''

OLD = """        <tbody>${deprecRows}</tbody>
      </table></div>
    </div>`;
  };"""
assert OLD in s
s = s.replace(OLD, NEW_BLOCK)

EXP_OLD = """    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      (typeof HDR_DATA"""
EXP_NEW = r'''    if (typeof HDR_ESTANDAR !== 'undefined') {
      const filas = [];
      HDR_ESTANDAR.grupos.forEach(g => {
        g.falta.forEach(t => filas.push({ 'Tipo de equipo': g.nombre, 'Resultado': 'Falta en SAP', 'Frecuencia estándar': t.f || '', 'Tarea (estándar)': t.t, 'Frecuencia en SAP': '' }));
        g.otraFrecL.forEach(t => filas.push({ 'Tipo de equipo': g.nombre, 'Resultado': 'Otra frecuencia', 'Frecuencia estándar': t.f || '', 'Tarea (estándar)': t.t, 'Frecuencia en SAP': t.sap || '' }));
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filas), 'Gama vs estándar');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(HDR_ESTANDAR.grupos.map(g => ({
        'Tipo de equipo': g.nombre, 'Equipos': g.nEquipos, 'Tareas estándar': g.nStd,
        'Con texto de tareas en SAP': g.conDetalle ? 'Sí' : 'No', 'Cubiertas': g.cub,
        'Otra frecuencia': g.otraFrec, 'Faltan': g.falta.length, 'Hojas de ruta': g.pares.map(x => x.rc).join(', '),
      }))), 'Resumen estándar');
    }
''' + EXP_OLD
assert EXP_OLD in s
s = s.replace(EXP_OLD, EXP_NEW)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
