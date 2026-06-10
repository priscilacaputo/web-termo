/* ─── Puertas Automáticas — AEP ─────────────────────────── */

const PUERTAS_DATA = [

  /* ── LAA / Pasarelas ─── */
  { equipo:"PPA652",  denominacion:"PPA plataf.acc. remoto manga puente 4",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI002", modelo:"Visio 125" },
  { equipo:"PPA653",  denominacion:"PPA plataf.acc. remoto manga puente 5",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI003", modelo:"Visio 125" },
  { equipo:"PPA654",  denominacion:"PPA plataf.acc. remoto manga puente 6",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI004", modelo:"Visio 125" },
  { equipo:"PPA655",  denominacion:"PPA plataf.acc. remoto manga puente 7",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI005", modelo:"Visio 125" },
  { equipo:"PPA656",  denominacion:"PPA plataf.acc. remoto manga puente 8",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC006", modelo:"Visio 125" },
  { equipo:"PPA664",  denominacion:"Puerta automatica Intermedia Manga 3",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"" },
  { equipo:"PPA911",  denominacion:"Puerta Automática Posicion 3 Norte",         ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"Visio 125" },
  { equipo:"PPA912",  denominacion:"Puerta Automática Posicion 3 Sur",           ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"Visio 125" },
  { equipo:"PPA913",  denominacion:"Puerta Automática Posicion 9",               ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC007", modelo:"Visio 125" },
  { equipo:"PPA914",  denominacion:"Puerta Automática Posicion 10",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC008", modelo:"Visio 125" },
  { equipo:"PPA915",  denominacion:"Puerta Automática Posicion 11",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC009", modelo:"Visio 125" },
  { equipo:"PPA916",  denominacion:"Puerta Automática Posicion 12",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC010", modelo:"Visio 125" },
  { equipo:"PPA988",  denominacion:"Puerta Automática intermedia Manga 5",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA990",  denominacion:"Puerta Automática intermedia Manga 6",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA991",  denominacion:"Puerta Automática intermedia Manga 7",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA992",  denominacion:"Puerta Automática intermedia Manga 8",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA993",  denominacion:"Puerta Automática intermedia Manga 9",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA994",  denominacion:"Puerta Automática intermedia Manga 10",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA995",  denominacion:"Puerta Automática intermedia Manga 11",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA996",  denominacion:"Puerta Automática intermedia Manga 12",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA1001", denominacion:"Puerta Automática intermedia Manga 4",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1002", denominacion:"PPA plataf.acc. remoto manga puente 9",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1003", denominacion:"PPA plataf.acc. remoto manga puente 11",     ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1004", denominacion:"PPA plataf.acc. remoto manga puente 12",     ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. VII — Internacional ─── */
  { equipo:"PPA1000", denominacion:"Puerta Automática Arribos Internacional",    ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA943",  denominacion:"Puerta Automática Interior Sur",             ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA944",  denominacion:"Puerta Automática Interior Norte",           ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA945",  denominacion:"Puerta Automática Exterior Sur",             ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA946",  denominacion:"Puerta Automática Exterior Norte",           ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA956",  denominacion:"Puerta auto arribos inter plataforma",       ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA957",  denominacion:"Puerta auto arribo inter salida aduana",     ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 126" },

  /* ── Ed. VI ─── */
  { equipo:"PPA694",  denominacion:"Puerta autom 1 ext Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA695",  denominacion:"Puerta autom 2 ext Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA696",  denominacion:"Puerta autom 3 ext Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA697",  denominacion:"Puerta autom 4 ext Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA698",  denominacion:"Puerta autom 1 int Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA699",  denominacion:"Puerta autom 2 int Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA700",  denominacion:"Puerta autom 3 int Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA701",  denominacion:"Puerta autom 4 int Acceso A2",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA703",  denominacion:"Puerta autom 2 ext Acceso A",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA704",  denominacion:"Puerta autom 3 ext Acceso A",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA706",  denominacion:"Puerta autom 1 int Acceso A",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA707",  denominacion:"Puerta autom 2 int Acceso A",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. V ─── */
  { equipo:"PPA733",  denominacion:"Puerta automatica ext nacional - checkpoint", ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA917",  denominacion:"Puerta Automática Nacional Interna check",   ubicacion:"AEP-ED5-NIVEL0-UBITEC233", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA958",  denominacion:"Puerta auto ingreso sala VIP PB",            ubicacion:"AEP-ED5-NIVEL0-UBITEC153", fabricante:"Manusa", serie:"",       modelo:"Visio 127" },
  { equipo:"PPA999",  denominacion:"Puerta automática ext. Inter Plataforma",    ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1005", denominacion:"Puerta Auto Internacional Plataforma",       ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. IV — Acceso Norte ─── */
  { equipo:"PPA673",  denominacion:"Puerta automat ext Acceso Norte 9 Ed IV",    ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA674",  denominacion:"Puerta automat ext Acceso Norte 10 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA675",  denominacion:"Puerta automat ext Acceso Norte 11 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA676",  denominacion:"Puerta automat ext Acceso Norte 12 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA677",  denominacion:"Puerta automat int Acceso Norte 13 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA678",  denominacion:"Puerta automat int Acceso Norte 14 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA679",  denominacion:"Puerta automat int Acceso Norte 15 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA680",  denominacion:"Puerta automat int Acceso Norte 16 Ed IV",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA919",  denominacion:"Puerta Automática Interior",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA920",  denominacion:"Puerta Automática Exterior",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA987",  denominacion:"Puerta Automática Núcleo Norte",             ubicacion:"AEP-ED4-NIVEL0-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — Acceso Sur ─── */
  { equipo:"PPA665",  denominacion:"Puerta automat ext Acceso Sur 1 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA666",  denominacion:"Puerta automat ext Acceso Sur 2 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA667",  denominacion:"Puerta automat ext Acceso Sur 3 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA668",  denominacion:"Puerta automat ext Acceso Sur 4 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA669",  denominacion:"Puerta automat int Acceso Sur 5 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA670",  denominacion:"Puerta automat int Acceso Sur 6 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA671",  denominacion:"Puerta automat int Acceso Sur 7 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA672",  denominacion:"Puerta automat int Acceso Sur 8 Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA921",  denominacion:"Puerta Automática Interior",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA922",  denominacion:"Puerta Automática Exterior",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA986",  denominacion:"Puerta Automática Núcleo Sur",               ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — Arrivals / Otros ─── */
  { equipo:"PPA681",  denominacion:"Puerta automat Salida Arribos Sur 1",        ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA682",  denominacion:"Puerta automat Salida Arribos Sur 2",        ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA683",  denominacion:"Puerta automat Salida Arribos Norte 1",      ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA684",  denominacion:"Puerta automat Salida Arribos Norte 2",      ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA948",  denominacion:"Puerta auto Pasaj. en Tránsito Arr.Nac",    ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. IV — Acceso A1 ─── */
  { equipo:"PPA690",  denominacion:"Puerta autom 1 ext Acceso A1",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA691",  denominacion:"Puerta autom 2 ext Acceso A1",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA692",  denominacion:"Puerta autom 1 int Acceso A1",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA693",  denominacion:"Puerta autom 2 int Acceso A1",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — 6to Piso ─── */
  { equipo:"PPA997",  denominacion:"Puerta Automática 6to Piso Núcleo Norte",    ubicacion:"AEP-ED4-NIVEL6-UBITEC008", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA998",  denominacion:"Puerta Automática 6to Núc.Norte Oficinas",   ubicacion:"AEP-ED4-NIVEL6-UBITEC008", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA1006", denominacion:"Puerta Automática Proveedores Ed IV Sur",    ubicacion:"AEP-ED4-NIVEL2",           fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. III — Estacionamiento ─── */
  { equipo:"PPA685",  denominacion:"Puerta Auto estacionamiento multin 6°",      ubicacion:"AEP-ED3-NIVEL6",           fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA868",  denominacion:"Puerta Auto estacionamiento multin 1°",      ubicacion:"AEP-ED3-NIVEL1",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA869",  denominacion:"Puerta Auto estacionamiento multin 2°",      ubicacion:"AEP-ED3-NIVEL2",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA870",  denominacion:"Puerta Auto estacionamiento multin 3°",      ubicacion:"AEP-ED3-NIVEL3",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA871",  denominacion:"Puerta Auto estacionamiento multin 4°",      ubicacion:"AEP-ED3-NIVEL4",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA872",  denominacion:"Puerta Auto estacionamiento multin 5°",      ubicacion:"AEP-ED3-NIVEL5",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA947",  denominacion:"Puerta auto. Edif. III PB. Hacia Echo",      ubicacion:"AEP-ED3-NIVEL0",           fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. II ─── */
  { equipo:"PPA732",  denominacion:"Puerta automatica salida Puesto ECHO",       ubicacion:"AEP-ED2-NIVEL0-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
];

/* ─── Plan preventivo ───────────────────────────────────── */

const PUERTAS_PLAN = {
  denominacion: "Puertas Automáticas",
  referencia:   "§ 9.2.1.9 — MOEX",
  frecuencias: [
    {
      nombre: "Bimestral",
      color:  "#1a56a4",
      icono:  "📅",
      tareas: [
        { num:  1, texto: "Limpieza y verificación de ruedas excéntricas" },
        { num:  2, texto: "Efectuar control y ajuste de correa de transmisión" },
        { num:  3, texto: "Limpieza y verificación de guías" },
        { num:  4, texto: "Limpieza y verificación de barreras fotoeléctricas" },
        { num:  5, texto: "Limpieza y verificación del elemento de detección" },
        { num:  6, texto: "Calibración de holgura de cerrojo" },
        { num:  7, texto: "Accionar y ajustar sistema antipánico" },
        { num:  8, texto: "Verificar estado de los burletes de cierre" },
        { num:  9, texto: "Lubricar mecanismos" },
      ]
    }
  ]
};

/* ─── Helpers ────────────────────────────────────────────── */
function puertaZona(ubicacion) {
  if (ubicacion.includes("-ED2-")) return "Ed. II";
  if (ubicacion.includes("-ED3-") || ubicacion.match(/ED3-NIVEL/)) return "Ed. III";
  if (ubicacion.includes("-ED4-") || ubicacion.match(/ED4-NIVEL/)) return "Ed. IV";
  if (ubicacion.includes("-ED5-") || ubicacion.match(/ED5-NIVEL/)) return "Ed. V";
  if (ubicacion.includes("-ED6-") || ubicacion.match(/ED6-NIVEL/)) return "Ed. VI";
  if (ubicacion.includes("-ED7-") || ubicacion.match(/ED7-NIVEL/)) return "Ed. VII";
  if (ubicacion.includes("-LAA-") || ubicacion.includes("LAA"))    return "LAA / Pasarelas";
  return "General";
}

function puertaFabLabel(fab) {
  return fab || "Sin datos";
}

const PUERTA_FAB_COLORS = {
  "Manusa": "#1a56a4",
  "Audoor": "#0891b2",
  "":       "#6b7280",
};

const PUERTA_ZONA_COLORS = {
  "LAA / Pasarelas": "#1a56a4",
  "Ed. VII":         "#7c3aed",
  "Ed. VI":          "#0891b2",
  "Ed. V":           "#059669",
  "Ed. IV":          "#d97706",
  "Ed. III":         "#92400e",
  "Ed. II":          "#dc2626",
  "General":         "#6b7280",
};
