import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()

a = s.index("        ${heading('Periodicidad real por tipo de equipo · '")
b = s.index("        <div style=\"margin-top:12px;padding:10px 12px;background:var(--color-surface)", a)

NEW = r'''        ${periodicidadPorTipoHTML(consist)}

'''
s = s[:a] + NEW + s[b:]

# función auxiliar, antes de "function diagnosticoHTML" (o donde se define el diagnóstico)
marker = "  function diagnosticoHTML"
assert marker in s
FN = r'''  /* Periodicidad real por tipo de equipo: ¿todos los equipos del mismo tipo se
     mantienen con la misma frecuencia? Un equipo que se aparta de los demás de su
     tipo suele tener un plan mal asignado. */
  const PER_COLOR = {
    'Semanal': '#0ea5e9', 'Quincenal': '#06b6d4', 'Mensual': '#10b981', 'Bimestral': '#84cc16',
    'Trimestral': '#f59e0b', 'Cuatrimestral': '#f97316', 'Semestral': '#ef4444', 'Anual': '#8b5cf6',
  };
  const perColor = (k) => PER_COLOR[k] || '#94a3b8';
  window.audPerToggle = function (cb) {
    const box = cb.closest('.aud-per-box');
    if (box) box.classList.toggle('aud-per-solo-alertas', cb.checked);
  };

  function periodicidadPorTipoHTML(consist) {
    const conAlerta = consist.filter((c) => c.outliers.length && c.n >= 4);
    const uniformes = consist.length - conAlerta.length;
    const orden = consist.slice().sort((a, b) => {
      const aa = a.n >= 4 ? a.outliers.length : 0, bb = b.n >= 4 ? b.outliers.length : 0;
      return (bb - aa) || (b.n - a.n);
    });
    const chip = (k, extra) => `<span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:11px;font-weight:700;color:#fff;background:${perColor(k)}">${esc(k)}${extra || ''}</span>`;

    const filas = orden.map((c) => {
      const alerta = c.outliers.length && c.n >= 4;
      const barra = c.dist.map(([k, n]) =>
        `<div title="${esc(k)}: ${n} equipos" style="flex:${n};background:${perColor(k)};min-width:3px"></div>`).join('');
      const leyenda = c.dist.map(([k, n]) =>
        `<span style="white-space:nowrap"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${perColor(k)};margin-right:3px"></span>${esc(k)} <b>${n}</b></span>`).join(' &nbsp; ');
      const porB = {};
      c.outliers.forEach((o) => { (porB[o.b] = porB[o.b] || []).push(o.equipo); });
      const detalle = Object.entries(porB).map(([k, eqs]) =>
        `<div style="margin:2px 0">${chip(k)} <span style="color:var(--color-muted)">${eqs.length} equipo${eqs.length > 1 ? 's' : ''}:</span> ${eqs.slice(0, 40).map(esc).join(', ')}${eqs.length > 40 ? ' …' : ''}</div>`).join('');
      const estado = alerta
        ? `<details style="margin-top:6px"><summary style="cursor:pointer;color:#b45309;font-weight:700;font-size:12px">⚠ ${c.outliers.length} equipo${c.outliers.length > 1 ? 's' : ''} se aparta${c.outliers.length > 1 ? 'n' : ''} de la frecuencia típica — ver cuáles</summary><div style="padding:6px 0 2px;font-size:12px">${detalle}</div></details>`
        : `<div style="margin-top:4px;font-size:12px;color:#059669;font-weight:600">✓ ${c.outliers.length ? 'Uniforme (muestra chica)' : 'Todos con la misma frecuencia'}</div>`;
      return `<div class="aud-per-fila${alerta ? '' : ' aud-per-ok'}" style="padding:10px 0;border-bottom:1px solid var(--color-surface)">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between">
          <div style="font-weight:700;font-size:13px">${esc(c.te)} <span style="font-weight:400;color:var(--color-muted)">· ${c.n} equipos</span></div>
          <div style="font-size:12px;color:var(--color-muted)">Lo habitual: ${chip(c.norma)}</div>
        </div>
        <div style="display:flex;height:10px;border-radius:5px;overflow:hidden;margin:6px 0 4px;background:var(--color-surface)">${barra}</div>
        <div style="font-size:11.5px;color:var(--color-muted)">${leyenda}</div>
        ${estado}
      </div>`;
    }).join('');

    return `<div class="aud-per-box aud-per-solo-alertas">
      <style>
        .aud-per-solo-alertas .aud-per-ok { display: none; }
      </style>
      ${heading('Frecuencia de mantenimiento por tipo de equipo')}
      <div style="font-size:12px;color:var(--color-muted);margin-bottom:8px;line-height:1.5">
        <b>Qué muestra:</b> con qué frecuencia se interviene realmente cada equipo (el plan más seguido que tiene, según las fechas de IP24),
        agrupado por tipo. Si la mayoría de los Splits va cada 2 meses y unos pocos van cada mes, esos pocos se marcan:
        puede ser un plan mal asignado o una necesidad real que conviene dejar documentada.
        <br><b>Cómo leerlo:</b> cada barra es el tipo de equipo; los colores son las frecuencias y el largo, cuántos equipos.
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:4px;font-size:12px">
        <span><b style="color:#b45309">${conAlerta.length}</b> tipos con equipos apartados · <b style="color:#059669">${uniformes}</b> uniformes</span>
        <label style="cursor:pointer;margin-left:auto"><input type="checkbox" checked onchange="audPerToggle(this)"> Mostrar solo los que tienen equipos apartados</label>
      </div>
      ${filas}
    </div>`;
  }

'''
s = s.replace(marker, FN + marker, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
