# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()

old1 = "      return { ...base, estado: 'ambiguo', nOpciones: sigs.size };"
new1 = r'''      /* Varios planes distintos en uso para ese tipo: se arma la lista de opciones (con cuántos equipos
         usan cada una) y se marca la más parecida por denominación / fabricante / modelo. */
      const tok = (r) => new Set(String([r.denominacion || r.denom, r.fabricante, r.modelo, r.sector].join(' '))
        .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !/^\d+$/.test(w)));
      const jac = (a, b) => { let i = 0; a.forEach((w) => { if (b.has(w)) i++; }); return (a.size + b.size - i) ? i / (a.size + b.size - i) : 0; };
      const mine = tok(rec);
      const opts = {};
      siblings.forEach((sb) => {
        const sig = planSig(sb.equipo);
        const o = opts[sig] || (opts[sig] = { plan: planTxt(sb.equipo), n: 0, ej: [], sim: 0, simDe: '' });
        o.n++;
        if (o.ej.length < 3) o.ej.push(sb.equipo);
        const sc = jac(mine, tok(sb));
        if (sc > o.sim) { o.sim = sc; o.simDe = sb.equipo + ' · ' + (sb.denominacion || sb.denom || ''); }
      });
      const opciones = Object.values(opts).sort((a, b) => b.n - a.n);
      const masParecido = opciones.slice().sort((a, b) => b.sim - a.sim)[0];
      return { ...base, estado: 'ambiguo', nOpciones: sigs.size, opciones,
        parecido: (masParecido && masParecido.sim >= 0.2) ? { plan: masParecido.plan, de: masParecido.simDe } : null };'''
assert old1 in s
s = s.replace(old1, new1, 1)

a = s.index("            (ambGroups.length ? `<div style=\"font-weight:700;font-size:12px;color:#f59e0b;margin:12px 0 4px\">? Más de un plan posible")
b = s.index("            (gapGroups.length ?", a)
new2 = r'''            (ambGroups.length ? `<div style="font-weight:700;font-size:12px;color:#f59e0b;margin:12px 0 4px">? Hay que elegir el plan a mano · ${amb.length} equipos</div>` +
              ambGroups.map((g) => `<div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--color-surface)">
                <div><b>${esc(famLabel(pfxOf2(g[0].equipo)))}${g[0].tipo ? ' · ' + esc(g[0].tipo) : ''}</b>:
                  ${g.length} equipo${g.length > 1 ? 's' : ''} sin plan. Los demás del mismo tipo usan <b>${g[0].nOpciones} planes distintos</b>, así que no se puede copiar uno solo.
                  Hay que elegir cuál corresponde a cada equipo:</div>
                <div style="margin:6px 0 4px;padding:6px 10px;background:var(--color-surface);border-radius:8px">
                  ${(g[0].opciones || []).map((o) => `<div style="padding:1px 0">• ${esc(o.plan)} <span style="color:var(--color-muted)">— ${o.n} equipo${o.n > 1 ? 's' : ''} (ej. ${o.ej.map(esc).join(', ')})</span></div>`).join('')}
                </div>
                ${g.map((r) => `<div style="padding:2px 0"><span class="equipo-tag" style="background:#0096d6">${esc(r.equipo)}</span> ${esc(r.denom || '')}
                  ${r.parecido ? `<span style="color:var(--color-muted)">→ el más parecido usa</span> <b>${esc(r.parecido.plan)}</b> <span style="color:var(--color-muted)">(por ${esc(r.parecido.de)})</span>` : '<span style="color:var(--color-muted)">→ ninguno se parece: hay que definirlo con quien conoce el equipo</span>'}</div>`).join('')}
              </div>`).join('') : '') +
'''
s = s[:a] + new2 + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print('ok')
