# -*- coding: utf-8 -*-
"""Genera assets/js/hdr-data.js a partir del maestro de Hojas de Ruta de SAP.
Fuente: "HDR ter aep.xlsm" (export IA17), hoja "Hojas de Ruta".
Uso:  python scratchpad/gen_hdr.py "C:\\ruta\\HDR ter aep.xlsm"
"""
import sys, os, re, json, collections
import openpyxl

SRC = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\aa2k8428\Downloads\HDR ter aep.xlsm"
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "js", "hdr-data.js")

FREQ = [
    ("Diaria",        r"diari[ao]|\b1d\b"),
    ("Semanal",       r"semanal|\b7d\b"),
    ("Quincenal",     r"quincenal|\b15\s*d\b|\b15d\b"),
    ("Mensual",       r"mensual|\b1m\b"),
    ("Bimestral",     r"bimestral|\b2m\b"),
    ("Trimestral",    r"trimestral|\b3m\b"),
    ("Cuatrimestral", r"cuatrimestral|\b4m\b"),
    ("Semestral",     r"semestral|\b6m\b"),
    ("Anual",         r"anual|\b1a\b|\b12m\b"),
    ("Bianual",       r"bianual|bienal|\b2a\b"),
]

def freq_of(text):
    t = (text or "").lower()
    for name, pat in FREQ:
        if re.search(pat, t):
            return name
    return "_base"

def to_min(v, u):
    try:
        v = float(v)
    except (TypeError, ValueError):
        return 0.0
    return v * 60 if str(u).strip().upper() == "HRA" else v

wb = openpyxl.load_workbook(SRC, data_only=True)
ws = wb["Hojas de Ruta"]

# cols: 0 HdR 1 Contador 2 Desc 3 Oper 4 DescOper 5 Puesto 6 Clave 7 NPers
#       8 Trabajo 9 UnTrab 10 Duracion 11 UnDur 12 PaqMant ...
acc = {}
for r in ws.iter_rows(min_row=2, values_only=True):
    if not r or not r[0]:
        continue
    ruta = str(r[0]).strip()
    cont = str(r[1]).strip() if r[1] is not None else ""
    key = (ruta, cont)
    a = acc.get(key)
    if a is None:
        a = acc[key] = {
            "ruta": ruta, "cont": cont, "desc": (r[2] or "").strip(),
            "ops": 0, "trab": 0.0, "dur": 0.0, "np": 0,
            "puestos": collections.Counter(),
            "porFrec": collections.defaultdict(lambda: {"dur": 0.0, "trab": 0.0, "np": 0}),
        }
    try:
        npers = int(r[7] or 0)
    except (TypeError, ValueError):
        npers = 0
    trab = to_min(r[8], r[9])
    dur = to_min(r[10], r[11])
    a["ops"] += 1
    a["trab"] += trab
    a["dur"] += dur
    a["np"] = max(a["np"], npers)
    if r[5]:
        a["puestos"][str(r[5]).strip()] += 1
    f = freq_of(r[4])
    if freq_of(r[4]) == "_base" and freq_of(a["desc"]) != "_base" and re.search(r"\d[MA]\b", str(r[4] or "")) is None:
        # op sin palabra de frecuencia y descripción de ruta con una sola frecuencia → esa
        pass
    b = a["porFrec"][f]
    b["dur"] += dur
    b["trab"] += trab
    b["np"] = max(b["np"], npers)

rows = []
for a in acc.values():
    puesto = a["puestos"].most_common(1)[0][0] if a["puestos"] else ""
    porFrec = {}
    for f, b in a["porFrec"].items():
        porFrec[f] = {"dur": round(b["dur"]), "trab": round(b["trab"]), "np": b["np"]}
    rows.append({
        "ruta": a["ruta"],
        "cont": a["cont"],
        "desc": a["desc"],
        "puesto": puesto,
        "ops": a["ops"],
        "nPers": a["np"] or 1,
        "trabajoMin": round(a["trab"]),
        "duracionMin": round(a["dur"]),
        "porFrec": porFrec,
        "noUsar": bool(re.search(r"no\s*usar|error", a["desc"], re.I)),
    })

rows.sort(key=lambda x: (x["ruta"], str(x["cont"]).zfill(3)))

hdr = f"""/* ─── HDR_DATA — maestro de Hojas de Ruta de SAP (IA17) ─────────────────
   Fuente: "HDR ter aep.xlsm" (hoja "Hojas de Ruta"). {len(rows)} contadores
   de {len({r['ruta'] for r in rows})} hojas de ruta · {sum(r['ops'] for r in rows)} operaciones.
   Por cada hoja de ruta + contador: Nº de personas, Trabajo (HH-persona)
   y Duración real (reloj), total y desglosado por frecuencia (porFrec:
   Mensual / Trimestral / Semestral / Anual… + "_base" = logística y pasos
   sin frecuencia, que van SIEMPRE).
   Lo usan el Planificador (duración/personas reales por OT) y la Auditoría
   SAP (planes sin hoja de ruta, contadores "NO USAR", HH teóricas).
   Regenerar:  python scratchpad/gen_hdr.py "<ruta al .xlsm>"  */

const HDR_DATA = {json.dumps(rows, ensure_ascii=False, separators=(',', ':'))};
"""

hdr += r"""
/* ─── Normalización + match por descripción ───────────────────────────
   Las descripciones de PLANES_SAP ("MP 3M Cinta Tramo Recto VDL") y de las
   OTs coinciden con las de las hojas de ruta ("MP Cinta Tramo Recto VDL
   3M") salvo orden de palabras y tokens de frecuencia. Se comparan como
   conjuntos de palabras (Jaccard) tras quitar ruido. */
const HDR_STOP = new Set(['mp','ip','pd','sap','mobile','sapmob','sapmobi','sapmobile',
  'res','de','del','la','el','los','las','y','o','a','con','sin','para','por','no','usar','error',
  'aa','equipos','equipo','1m','2m','3m','4m','5m','6m','1a','2a','3a','4a','5a','12m','7d','15d','1d','1s',
  'mensual','bimestral','trimestral','cuatrimestral','semestral','anual','bianual','bienal',
  'diaria','diario','semanal','quincenal']);

function hdrNorm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[()\/.,:;–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function hdrTokens(s) {
  const out = new Set();
  hdrNorm(s).split(' ').forEach(w => {
    if (!w || w.length < 2 || HDR_STOP.has(w)) return;
    if (w.length > 5 && w.endsWith('es')) w = w.slice(0, -2);        // extractores→extractor
    else if (w.length > 4 && w.endsWith('s')) w = w.slice(0, -1);    // cintas→cinta
    if (!HDR_STOP.has(w)) out.add(w);
  });
  return out;
}
function hdrJaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach(w => { if (b.has(w)) inter++; });
  return inter / (a.size + b.size - inter);
}

const _HDR_TOK = HDR_DATA.map(e => ({ e, tok: hdrTokens(e.desc) }));

/* Mejor hoja de ruta para una descripción. Devuelve {entry, score} o null. */
function hdrBestMatch(desc, minScore) {
  const t = hdrTokens(desc);
  if (!t.size) return null;
  let best = null;
  _HDR_TOK.forEach(({ e, tok }) => {
    const sc = hdrJaccard(t, tok);
    if (!best || sc > best.score || (sc === best.score && e.ops > best.entry.ops)) best = { entry: e, score: sc };
  });
  if (!best || best.score < (minScore == null ? 0.34 : minScore)) return null;
  return best;
}

/* Duración/personas reales de una OT.
   1) por el/los plan(es) de PLANES_SAP del equipo (traen desc + frecuencia)
   2) si no hay, por el texto de la OT
   Devuelve {durMin, nPers, ruta, fuente:'sap'} o null (→ estimar por regex). */
const HDR_BUCKET = {
  'MENSUAL': 'Mensual', '1M': 'Mensual',
  'BIMESTRAL': 'Bimestral', '2M': 'Bimestral',
  'TRIMESTRAL': 'Trimestral', '3M': 'Trimestral',
  'CUATRIMESTRAL': 'Cuatrimestral', '4M': 'Cuatrimestral',
  'SEMESTRAL': 'Semestral', '6M': 'Semestral',
  'ANUAL': 'Anual', '1A': 'Anual',
};
function hdrBucketDe(txt) {
  const u = String(txt || '').toUpperCase();
  for (const k in HDR_BUCKET) if (u.includes(k)) return HDR_BUCKET[k];
  return null;
}
/* Tope de duración creíble para UNA OT (min). Los contadores "SAP MOBILE"
   que agrupan 1M-3M-6M-1A de decenas de equipos suman miles de minutos:
   por encima de esto no es una visita, es la lista entera → se descarta la
   duración (el Planificador estima por regla) pero se conserva nPers. */
const HDR_TOPE_MIN = 480;
function hdrDuracion(entry, bucket) {
  const base = entry.porFrec && entry.porFrec._base ? entry.porFrec._base : { dur: 0, np: 0 };
  const fb = bucket && entry.porFrec && entry.porFrec[bucket] ? entry.porFrec[bucket] : null;
  const nPers = Math.max(1, entry.nPers || 1);
  if (fb && fb.dur > 0) {
    return { durMin: Math.max(15, Math.round(base.dur + fb.dur)), nPers: Math.max(nPers, base.np, fb.np) };
  }
  if ((entry.duracionMin || 0) > 0 && entry.duracionMin <= HDR_TOPE_MIN) {
    return { durMin: entry.duracionMin, nPers };
  }
  return { durMin: null, nPers };   // duración no confiable; el caller estima
}
function hdrParaEquipo(equipo, textoOT) {
  const eq = String(equipo || '').trim().toUpperCase();
  let planes = [];
  if (typeof PLANES_SAP !== 'undefined' && Array.isArray(PLANES_SAP)) {
    planes = PLANES_SAP.filter(p => String(p.equipo || '').toUpperCase() === eq);
  }
  let best = null;
  planes.forEach(p => {
    const m = hdrBestMatch(p.desc);
    if (m && (!best || m.score > best.score)) {
      const bucket = hdrBucketDe(p.declara) || hdrBucketDe(p.realBucket) || hdrBucketDe(p.desc);
      best = { score: m.score, entry: m.entry, bucket };
    }
  });
  if (!best && textoOT) {
    const m = hdrBestMatch(textoOT);
    if (m) best = { score: m.score, entry: m.entry, bucket: hdrBucketDe(textoOT) };
  }
  if (!best) return null;
  const d = hdrDuracion(best.entry, best.bucket);
  return {
    durMin: d.durMin,                 // null ⇒ estimá la duración por regla
    nPers: d.nPers,
    ruta: best.entry.ruta + '/' + best.entry.cont,
    desc: best.entry.desc,
    bucket: best.bucket || null,
    score: Math.round(best.score * 100) / 100,
    fuente: d.durMin != null ? 'sap' : 'sap-personas',
  };
}
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(hdr)

print(f"OK  {len(rows)} contadores  ->  {os.path.relpath(OUT)}")
# quick self-check
tot = collections.Counter()
for r in rows:
    tot[r["ruta"][:3]] += 1
print("familias:", dict(tot))
