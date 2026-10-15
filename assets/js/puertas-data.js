/* ─── Puertas Automáticas — AEP ─────────────────────────── */

const PUERTAS_DATA = [

  /* ── LAA / Pasarelas ─── */
  { equipo:"PPA652",  denominacion:"PPA plataf.acc. remoto manga puente 4", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI002", modelo:"Visio 125" },
  { equipo:"PPA653",  denominacion:"PPA plataf.acc. remoto manga puente 5", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI003", modelo:"Visio 125" },
  { equipo:"PPA654",  denominacion:"PPA plataf.acc. remoto manga puente 6", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI004", modelo:"Visio 125" },
  { equipo:"PPA655",  denominacion:"PPA plataf.acc. remoto manga puente 7", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"PFI005", modelo:"Visio 125" },
  { equipo:"PPA656",  denominacion:"PPA plataf.acc. remoto manga puente 8", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC006", modelo:"Visio 125" },
  { equipo:"PPA664",  denominacion:"Puerta automatica Intermedia Manga 3", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"" },
  { equipo:"PPA911",  denominacion:"Puerta Automática Posicion 3 Norte", tipo:"Automática",         ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"Visio 125" },
  { equipo:"PPA912",  denominacion:"Puerta Automática Posicion 3 Sur", tipo:"Automática",           ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC001", modelo:"Visio 125" },
  { equipo:"PPA913",  denominacion:"Puerta Automática Posicion 9", tipo:"Automática",               ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC007", modelo:"Visio 125" },
  { equipo:"PPA914",  denominacion:"Puerta Automática Posicion 10", tipo:"Automática",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC008", modelo:"Visio 125" },
  { equipo:"PPA915",  denominacion:"Puerta Automática Posicion 11", tipo:"Automática",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC009", modelo:"Visio 125" },
  { equipo:"PPA916",  denominacion:"Puerta Automática Posicion 12", tipo:"Automática",              ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"NUC010", modelo:"Visio 125" },
  { equipo:"PPA988",  denominacion:"Puerta Automática intermedia Manga 5", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA990",  denominacion:"Puerta Automática intermedia Manga 6", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA991",  denominacion:"Puerta Automática intermedia Manga 7", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA992",  denominacion:"Puerta Automática intermedia Manga 8", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA993",  denominacion:"Puerta Automática intermedia Manga 9", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA994",  denominacion:"Puerta Automática intermedia Manga 10", tipo:"Automática",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA995",  denominacion:"Puerta Automática intermedia Manga 11", tipo:"Automática",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA996",  denominacion:"Puerta Automática intermedia Manga 12", tipo:"Automática",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA1001", denominacion:"Puerta Automática intermedia Manga 4", tipo:"Automática",       ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1002", denominacion:"PPA plataf.acc. remoto manga puente 9", tipo:"PPA plataforma",      ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1003", denominacion:"PPA plataf.acc. remoto manga puente 11", tipo:"PPA plataforma",     ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1004", denominacion:"PPA plataf.acc. remoto manga puente 12", tipo:"PPA plataforma",     ubicacion:"AEP-LAA-UBI017-UBITEC001", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. VII — Internacional ─── */
  { equipo:"PPA1000", denominacion:"Puerta Automática Arribos Internacional", tipo:"Automática",    ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA943",  denominacion:"Puerta Automática Interior Sur", tipo:"Automática",             ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA944",  denominacion:"Puerta Automática Interior Norte", tipo:"Automática",           ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA945",  denominacion:"Puerta Automática Exterior Sur", tipo:"Automática",             ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA946",  denominacion:"Puerta Automática Exterior Norte", tipo:"Automática",           ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA956",  denominacion:"Puerta auto arribos inter plataforma", tipo:"PPA plataforma",       ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA957",  denominacion:"Puerta auto arribo inter salida aduana", tipo:"Automática",     ubicacion:"AEP-ED7-NIVEL0-UBITEC041", fabricante:"Manusa", serie:"",       modelo:"Visio 126" },

  /* ── Ed. VI ─── */
  { equipo:"PPA694",  denominacion:"Puerta autom 1 ext Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA695",  denominacion:"Puerta autom 2 ext Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA696",  denominacion:"Puerta autom 3 ext Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA697",  denominacion:"Puerta autom 4 ext Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA698",  denominacion:"Puerta autom 1 int Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA699",  denominacion:"Puerta autom 2 int Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA700",  denominacion:"Puerta autom 3 int Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA701",  denominacion:"Puerta autom 4 int Acceso A2", tipo:"Automática",               ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA703",  denominacion:"Puerta autom 2 ext Acceso A", tipo:"Automática",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA704",  denominacion:"Puerta autom 3 ext Acceso A", tipo:"Automática",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA706",  denominacion:"Puerta autom 1 int Acceso A", tipo:"Automática",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA707",  denominacion:"Puerta autom 2 int Acceso A", tipo:"Automática",                ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. V ─── */
  { equipo:"PPA733",  denominacion:"Puerta automatica ext nacional - checkpoint", tipo:"Automática", ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA917",  denominacion:"Puerta Automática Nacional Interna check", tipo:"Automática",   ubicacion:"AEP-ED5-NIVEL0-UBITEC233", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA958",  denominacion:"Puerta auto ingreso sala VIP PB", tipo:"Automática",            ubicacion:"AEP-ED5-NIVEL0-UBITEC153", fabricante:"Manusa", serie:"",       modelo:"Visio 127" },
  { equipo:"PPA999",  denominacion:"Puerta automática ext. Inter Plataforma", tipo:"PPA plataforma",    ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },
  { equipo:"PPA1005", denominacion:"Puerta Auto Internacional Plataforma", tipo:"PPA plataforma",       ubicacion:"AEP-ED5-NIVEL0-UBITEC234", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. IV — Acceso Norte ─── */
  { equipo:"PPA673",  denominacion:"Puerta automat ext Acceso Norte 9 Ed IV", tipo:"Automática",    ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA674",  denominacion:"Puerta automat ext Acceso Norte 10 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA675",  denominacion:"Puerta automat ext Acceso Norte 11 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA676",  denominacion:"Puerta automat ext Acceso Norte 12 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA677",  denominacion:"Puerta automat int Acceso Norte 13 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA678",  denominacion:"Puerta automat int Acceso Norte 14 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA679",  denominacion:"Puerta automat int Acceso Norte 15 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA680",  denominacion:"Puerta automat int Acceso Norte 16 Ed IV", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA919",  denominacion:"Puerta Automática Interior", tipo:"Automática",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA920",  denominacion:"Puerta Automática Exterior", tipo:"Automática",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC012", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA987",  denominacion:"Puerta Automática Núcleo Norte", tipo:"Automática",             ubicacion:"AEP-ED4-NIVEL0-UBITEC001", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — Acceso Sur ─── */
  { equipo:"PPA665",  denominacion:"Puerta automat ext Acceso Sur 1 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA666",  denominacion:"Puerta automat ext Acceso Sur 2 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA667",  denominacion:"Puerta automat ext Acceso Sur 3 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA668",  denominacion:"Puerta automat ext Acceso Sur 4 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA669",  denominacion:"Puerta automat int Acceso Sur 5 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA670",  denominacion:"Puerta automat int Acceso Sur 6 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA671",  denominacion:"Puerta automat int Acceso Sur 7 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA672",  denominacion:"Puerta automat int Acceso Sur 8 Ed IV", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA921",  denominacion:"Puerta Automática Interior", tipo:"Automática",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA922",  denominacion:"Puerta Automática Exterior", tipo:"Automática",                 ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA986",  denominacion:"Puerta Automática Núcleo Sur", tipo:"Automática",               ubicacion:"AEP-ED4-NIVEL0-UBITEC013", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — Arrivals / Otros ─── */
  { equipo:"PPA681",  denominacion:"Puerta automat Salida Arribos Sur 1", tipo:"Automática",        ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA682",  denominacion:"Puerta automat Salida Arribos Sur 2", tipo:"Automática",        ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA683",  denominacion:"Puerta automat Salida Arribos Norte 1", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA684",  denominacion:"Puerta automat Salida Arribos Norte 2", tipo:"Automática",      ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA948",  denominacion:"Puerta auto Pasaj. en Tránsito Arr.Nac", tipo:"Automática",    ubicacion:"AEP-ED4-NIVEL0-UBITEC137", fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. IV — Acceso A1 ─── */
  { equipo:"PPA690",  denominacion:"Puerta autom 1 ext Acceso A1", tipo:"Automática",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA691",  denominacion:"Puerta autom 2 ext Acceso A1", tipo:"Automática",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA692",  denominacion:"Puerta autom 1 int Acceso A1", tipo:"Automática",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA693",  denominacion:"Puerta autom 2 int Acceso A1", tipo:"Automática",               ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },

  /* ── Ed. IV — 6to Piso ─── */
  { equipo:"PPA997",  denominacion:"Puerta Automática 6to Piso Núcleo Norte", tipo:"Automática",    ubicacion:"AEP-ED4-NIVEL6-UBITEC008", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA998",  denominacion:"Puerta Automática 6to Núc.Norte Oficinas", tipo:"Automática",   ubicacion:"AEP-ED4-NIVEL6-UBITEC008", fabricante:"Manusa", serie:"",       modelo:"Visio 125" },
  { equipo:"PPA1006", denominacion:"Puerta Automática Proveedores Ed IV Sur", tipo:"Automática",    ubicacion:"AEP-ED4-NIVEL2",           fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. III — Estacionamiento ─── */
  { equipo:"PPA685",  denominacion:"Puerta Auto estacionamiento multin 6°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL6",           fabricante:"Manusa", serie:"",       modelo:"" },
  { equipo:"PPA868",  denominacion:"Puerta Auto estacionamiento multin 1°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL1",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA869",  denominacion:"Puerta Auto estacionamiento multin 2°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL2",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA870",  denominacion:"Puerta Auto estacionamiento multin 3°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL3",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA871",  denominacion:"Puerta Auto estacionamiento multin 4°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL4",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA872",  denominacion:"Puerta Auto estacionamiento multin 5°", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL5",           fabricante:"Audoor", serie:"",       modelo:"" },
  { equipo:"PPA947",  denominacion:"Puerta auto. Edif. III PB. Hacia Echo", tipo:"Automática",      ubicacion:"AEP-ED3-NIVEL0",           fabricante:"",       serie:"",       modelo:"" },

  /* ── Ed. II ─── */
  { equipo:"PPA732",  denominacion:"Puerta automatica salida Puesto ECHO", tipo:"Automática",       ubicacion:"AEP-ED2-NIVEL0-UBITEC001", fabricante:"",       serie:"",       modelo:"" },
];

/* ─── Observaciones del Informe Técnico de Mantenimiento PPA ───
   Relevamiento en campo (Informe_Tecnico_Mantenimiento_PPA.pdf, oct-2026).
   Solo equipos con falla/observación; el resto figura "-" en el informe. */
const PUERTAS_OBS_FECHA = "Informe técnico PPA · oct-2026";
const PUERTAS_OBS = {
  PPA685: "Rozan los paños.",
  PPA732: "Display no enciende. Paños desalineados.",
  PPA694: "Cambiar guía superior.",
  PPA695: "Cambiar guía superior.",
  PPA696: "Cambiar guía superior.",
  PPA697: "Correa cortada y base de la tapa se cae al intentar abrir el cajón.",
  PPA703: "Falta zócalo de guías inferior.",
  PPA704: "Falta perfil central del paño móvil.",
  PPA707: "Sin identificación. No cierra.",
  PPA666: "Correa rota.",
  PPA667: "Penalizada. Fuente Visio retirada para reparar.",
  PPA668: "Paño móvil caído.",
  PPA671: "Rueda excéntrica rota.",
  PPA674: "Roce entre paños fijo y móvil. Falta perfil central.",
  PPA675: "Cambiar guía superior.",
  PPA677: "Cambiar guía superior. Falta tornillo regulador de altura del carro.",
  PPA678: "Cambiar guía superior.",
  PPA679: "Cambiar guía superior y todas las ruedas.",
  PPA680: "Falta perfil central de paño móvil."
};

/* ─── Especificaciones técnicas relevadas (mismo informe) ─── */
const PUERTAS_ESP = (() => {
  const g = {
    bravoMulti: "Electrónica Bravo / Correa cerrada con grampas dentadas y agujeros / Carros con ruedas planas grandes / Guía plana",
    echo:       "Electrónica ELK-C101 (Optima +) / Guía curva / Carros con ruedas en V / Correa sin agujeros y grampas de chapa",
    visioCerr:  "Electrónica Visio / Guía curva / Correa cerrada sin agujeros y grampas de chapa / Carros con ruedas en V",
    visioAbier: "Electrónica Visio / Guía curva / Carros con ruedas en V / Correa abierta sin agujeros y grampas de chapa",
    patio:      "Electrónica Visio / Correa sin agujeros y mordazas de chapa / Carros con ruedas en V / Guía curva",
    optima:     "Electrónica ÓPTIMA + / Guía curva / Carros con ruedas en V / Correa cerrada sin agujeros y grampas plásticas",
    bravoNac:   "Electrónica Bravo / Guía plana / Carros de ruedas grandes / Ruedas planas / Correa cerrada con agujeros y mordazas dentadas",
    visioNac:   "Electrónica Visio / Guía plana / Carros con ruedas planas grandes / Correa cerrada con agujeros y mordazas dentadas"
  };
  const m = { PPA685: g.bravoMulti, PPA732: g.echo, PPA693: g.optima,
              PPA667: "Fuente Visio (se retiró para reparar)", PPA680: g.visioNac };
  const put = (txt, ids) => ids.forEach(n => { m["PPA" + n] = txt; });
  put(g.visioCerr,  [943, 944, 945, 946, 690, 691, 692, 703, 704, 706, 707]);
  put(g.visioAbier, [947, 921, 922, 919, 920]);
  put(g.patio,      [694, 695, 696, 697, 698, 699, 700, 701]);
  put(g.bravoNac,   [665, 666, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679]);
  return m;
})();

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
