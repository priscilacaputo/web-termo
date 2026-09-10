/* ─── Planificador real de OTs — datos y configuración ──────────────────
   Lleva las OTs del mes a un calendario con día, guardia y hora.
   Reutiliza la lógica de turno / altura / zona de programacion-app.js
   (funciones prog*), GUARDIAS de personal-app.js y el historial de
   ots-analyzer.js (antigüedad de cada OT). */

const PLAN_STORAGE_KEY = 'planificador_ots_v2';   // v2: turnos de 12 h (06–18 / 18–06)

/* ─── Estructura del día por turno ────────────────────────────────────
   Dos turnos de 12 h: Mañana 06:00–18:00 y Tarde 18:00–06:00 (cruza
   medianoche: fin < inicio ⇒ termina al día siguiente). Horas en "HH:MM"
   (24 h), editable desde el panel "Configuración de día tipo". Los tres
   bloques (recorridas al inicio + almuerzo/cena + un descanso) se restan
   del tiempo disponible de cada guardia.
   La clave interna del turno Tarde sigue siendo `noche` (es el turno en
   el que se hacen los trabajos "solo de noche": MEQ, Sala VIP, etc.). */
const PLAN_TURNO_LBL  = { manana: 'Mañana', noche: 'Tarde' };
const PLAN_TURNO_ICON = { manana: '☀️', noche: '🌆' };
const PLAN_DIA_TEMPLATE = {
  manana: {
    inicio: '06:00', fin: '18:00',
    recorridasMin: 120,
    almuerzo: { inicio: '12:00', min: 60 },
    descanso: { inicio: '15:30', min: 20 },
  },
  noche: {
    inicio: '18:00', fin: '06:00',
    recorridasMin: 120,
    almuerzo: { inicio: '00:00', min: 60 },   // cena
    descanso: { inicio: '03:30', min: 20 },
  },
};

/* ─── Duración estimada de una OT (minutos) ───────────────────────────
   Se busca la primera regla cuyo patrón matchee el texto de la OT; si
   ninguna, se usa el fallback por familia de equipo; si tampoco,
   PLAN_DUR_DEFAULT. Todo es editable OT por OT en la grilla del día. */
const PLAN_DUR_DEFAULT = 90;
const PLAN_DUR_POR_TEXTO = [
  { re: /recorrida|gama de tareas|tareas varias|reclamos/i, min: 0 },
  { re: /\bmensual\b|\b1\s*m\b/i, min: 60 },
  { re: /bimestral|\b2\s*m\b/i, min: 90 },
  { re: /trimestral|\b3\s*m\b/i, min: 120 },
  { re: /cuatrimestral|\b4\s*m\b/i, min: 150 },
  { re: /semestral|\b6\s*m\b/i, min: 180 },
  { re: /anual/i, min: 240 },
  { re: /hidrolav/i, min: 180 },
  { re: /^\s*(atenci|reparar|correctivo|falla|emergencia|cambio|revisar|seteo)/i, min: 180 },
];
const PLAN_DUR_POR_FAMILIA = {
  AAC: 90, UTA: 120, MEQ: 120, MAN: 180, MAS: 120, MES: 120,
  EMO: 60, MCD: 60, ACO: 60, MBO: 90, PPA: 60, AVO: 60, ECA: 90, ECC: 90,
};

function planDuracionEstimada(otTexto, equipo) {
  const txt = String(otTexto || '');
  if (txt) for (const r of PLAN_DUR_POR_TEXTO) if (r.re.test(txt)) return r.min;
  const fam = String(equipo || '').toUpperCase().slice(0, 3);
  if (PLAN_DUR_POR_FAMILIA[fam] != null) return PLAN_DUR_POR_FAMILIA[fam];
  return PLAN_DUR_DEFAULT;
}

/* ─── ¿El equipo es de Sala VIP? → regla nueva: siempre Turno Noche ───
   Mira el texto/denominación de la OT y, si hay registro del equipo en
   el índice de programacion-app.js, sus campos denominacion / sector /
   local / ubi_desc. */
function planEsSalaVIP(equipo, denomOT) {
  const hay = s => /sala\s*vip/i.test(String(s || ''));
  if (hay(denomOT)) return true;
  const rec = (typeof progGetEquipoIndex === 'function')
    ? progGetEquipoIndex()[String(equipo || '').toUpperCase()]
    : null;
  return !!rec && (hay(rec.denominacion) || hay(rec.sector) || hay(rec.local) || hay(rec.ubi_desc));
}

/* Nivel de compatibilidad que informa la app del patio (Plan Maestro BHS). */
const PLAN_NIVEL_PATIO = {
  'hueco recomendado': 'recomendado',
  'posible con condiciones': 'condiciones',
  'no compatible': 'incompatible',
  'información insuficiente': 'insuficiente',
  'informacion insuficiente': 'insuficiente',
};
