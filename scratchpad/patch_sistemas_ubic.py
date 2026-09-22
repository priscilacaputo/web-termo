# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()


def rep(old, new):
    global s
    assert old in s, old[:80]
    s = s.replace(old, new, 1)


# ── helper de ubicación (sector de la ficha + ubicación técnica de SAP) ──
HELP = r'''  /* Dónde está un equipo de aire: sector (ficha de la web) + ubicación técnica (SAP). */
  function ubicAire(eq) {
    const m = getMaestro().find((e) => e.equipo === eq) || {};
    const f = (typeof AAC_DATA !== 'undefined' ? AAC_DATA : []).find((a) => a.equipo === eq) || {};
    const ubic = m.ubic || f.ubicacion || '';
    return { sector: f.sector || '', ubic, corta: ubic.replace(/^AEP-/, '') };
  }

'''
rep("  window.audSisFiltro = function (btn, k) {", HELP + "  window.audSisFiltro = function (btn, k) {")

# ── tarjeta: ubicación de la condensadora y de los interiores ──
rep("""      <div style="font-size:11px;color:var(--color-muted);margin:2px 0 8px">${esc(x.ubic)}</div>""",
    """      <div style="font-size:12px;margin:3px 0 8px">📍 <b>${esc(ubicAire(x.cabeza).sector || 'Sin sector en la ficha')}</b> <span style="color:var(--color-muted)">· ${esc(ubicAire(x.cabeza).corta)}</span></div>""")

rep("""      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">${x.miembros.map((m) => tag(m, '#64748b')).join('')}</div>""",
    """      <div style="margin-top:8px;font-size:11.5px;color:var(--color-muted)">${(() => {
        const g = {};
        x.miembros.forEach((m) => { const u = ubicAire(m); const k = u.corta || 'sin ubicación'; (g[k] = g[k] || { sector: u.sector, n: 0 }).n++; });
        const ent = Object.entries(g).sort((a, b) => b[1].n - a[1].n);
        if (ent.length <= 3) return ent.map(([k, v]) => `📍 Interiores${ent.length > 1 || v.n < x.miembros.length ? ' (' + v.n + ')' : ''}: ${esc(v.sector ? v.sector + ' · ' : '')}${esc(k)}`).join('<br>');
        return `📍 Interiores repartidos en <b>${ent.length} ubicaciones</b> (pasá el mouse por cada equipo para ver dónde está)`;
      })()}</div>
      <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${x.miembros.map((m) => tag(m, '#64748b')).join('')}</div>""")

# tooltip de las etiquetas: denominación + ubicación
rep("""title="${esc((maestro[e] || {}).denom || '')}">${esc(e)}</span>`;""",
    """title="${esc(((maestro[e] || {}).denom || '') + ' — ' + (ubicAire(e).sector ? ubicAire(e).sector + ' · ' : '') + ubicAire(e).corta)}">${esc(e)}</span>`;""")

# ── Excel: sector y ubicación de cada equipo ──
rep("""      'Denominación': (maestro[eq] || {}).denom || '', 'Ubicación técnica': (maestro[eq] || {}).ubic || '',
      'Plan': planTxt(eq),""",
    """      'Denominación': (maestro[eq] || {}).denom || '', 'Sector': ubicAire(eq).sector, 'Ubicación técnica': ubicAire(eq).ubic,
      'Plan': planTxt(eq),""")
rep("""        'Sistema': sis.cabeza, 'Nombre': sis.nombre, 'Ubicación técnica condensadora': sis.ubic,""",
    """        'Sistema': sis.cabeza, 'Nombre': sis.nombre, 'Sector de la condensadora': ubicAire(sis.cabeza).sector, 'Ubicación técnica condensadora': ubicAire(sis.cabeza).ubic,
        'Ubicaciones de los interiores': [...new Set(sis.miembros.map((m) => (ubicAire(m).sector ? ubicAire(m).sector + ' · ' : '') + ubicAire(m).corta))].join(' | '),""")
rep("""      'Equipo': x.equipo, 'Denominación': x.denom, 'Ubicación técnica': (maestro[x.equipo] || {}).ubic || '',""",
    """      'Equipo': x.equipo, 'Denominación': x.denom, 'Sector': ubicAire(x.equipo).sector, 'Ubicación técnica': ubicAire(x.equipo).ubic,""")
rep("add(sistemas, 'Sistemas', [10, 44, 26, 12, 34, 46, 18, 26, 12, 70]);", "add(sistemas, 'Sistemas', [10, 44, 28, 26, 50, 12, 34, 46, 18, 26, 12, 70]);")
rep("add(equipos, 'Equipos por sistema', [10, 40, 22, 10, 44, 28, 60, 16, 34, 16, 24]);", "add(equipos, 'Equipos por sistema', [10, 40, 22, 10, 44, 28, 28, 60, 16, 34, 16, 24]);")
rep("if (sinExt.length) add(sinExt, 'Interiores sin condensadora', [10, 44, 28, 60, 16]);", "if (sinExt.length) add(sinExt, 'Interiores sin condensadora', [10, 44, 28, 28, 60, 16]);")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
