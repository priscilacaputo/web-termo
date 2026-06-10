const BOMBAS_DATA = [
  { equipo:"MBO001",  denominacion:"Bomba Sumergible de achique Lugones Mete",     dimension:"",                  ubicacion:"AEP-LAA",                    fabricante:"",                          modelo:"",                         ubi_desc:"Lado Aire"                              },
  { equipo:"MBO002",  denominacion:"Bomba Sumergible de achique Cata Lugones",      dimension:"",                  ubicacion:"AEP-LAA",                    fabricante:"",                          modelo:"",                         ubi_desc:"Lado Aire"                              },
  { equipo:"MBO1144", denominacion:"Bomba Jockey N°1 red contra Incendio",          dimension:"",                  ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"Grundfos",                  modelo:"CR5-24 A-FGJ-A-EHQQE",     ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1145", denominacion:"Bomba Jockey N°2 red contra Incendio",          dimension:"",                  ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"Grundfos",                  modelo:"CR5-24 A-FGJ-A-EHQQE",     ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1146", denominacion:"Motobomba red contra Incendio N°1",             dimension:"266 HP / 2100 RPM", ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"CLARKE (DP6H-UFAA70)",      modelo:"Peerless (8AEF17W)",        ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1147", denominacion:"Motobomba red contra Incendio N°2",             dimension:"266 HP / 2100 RPM", ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"CLARKE (DP6H-UFAA70)",      modelo:"Peerless (8AEF17W)",        ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1151", denominacion:"Bomba Centrífuga de agua potable",              dimension:"",                  ubicacion:"AEP-LAA-UBI225",             fabricante:"Esimet",                    modelo:"",                         ubi_desc:"Taller Mantenimiento Jefes"             },
  { equipo:"MBO1152", denominacion:"Bomba Centrífuga de agua potable",              dimension:"",                  ubicacion:"AEP-LAA-UBI225",             fabricante:"Motorarg",                  modelo:"",                         ubi_desc:"Taller Mantenimiento Jefes"             },
  { equipo:"MBO1153", denominacion:"Bomba Centrífuga Agua Fría N°1",                dimension:"",                  ubicacion:"AEP-ED6-NIVEL7-UBITEC009",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Núcleo AA N°3"                          },
  { equipo:"MBO1154", denominacion:"Bomba Centrífuga Agua Fría N°2",                dimension:"",                  ubicacion:"AEP-ED6-NIVEL7-UBITEC009",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Núcleo AA N°3"                          },
  { equipo:"MBO1155", denominacion:"Bomba Centrífuga Agua Calefa N°1 Ed IV",        dimension:"",                  ubicacion:"AEP-ED4-NIVEL7-UBITEC000",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Terraza Edificio 4"                     },
  { equipo:"MBO1156", denominacion:"Bomba Centrífuga Agua Calefa N°2 Ed IV",        dimension:"",                  ubicacion:"AEP-ED4-NIVEL7-UBITEC000",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Terraza Edificio 4"                     },
  { equipo:"MBO1157", denominacion:"Bomba Centrífuga Agua Calefa N°3 Ed IV",        dimension:"",                  ubicacion:"AEP-ED4-NIVEL7-UBITEC000",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Terraza Edificio 4"                     },
  { equipo:"MBO1158", denominacion:"Bomba Centrífuga Agua Calefa N°4 Ed IV",        dimension:"",                  ubicacion:"AEP-ED4-NIVEL7-UBITEC000",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Terraza Edificio 4"                     },
  { equipo:"MBO1159", denominacion:"Bomba Centrífuga Presurización N°1 Ed IV",      dimension:"",                  ubicacion:"AEP-ED3-NIVEL0-UBITEC006",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Sala de Bomba (Grupo Generador)"        },
  { equipo:"MBO1160", denominacion:"Bomba Centrífuga Presurización N°2 Ed IV",      dimension:"",                  ubicacion:"AEP-ED3-NIVEL0-UBITEC006",   fabricante:"Tromba",                    modelo:"",                         ubi_desc:"Sala de Bomba (Grupo Generador)"        },
  { equipo:"MBO1161", denominacion:"Bomba Sumergible Cloacal N°1",                  dimension:"3,1 KW / 6,8A TRIF.",ubicacion:"AEP-ED7-NIVEL0-UBITEC009",  fabricante:"Flygt",                     modelo:"3102",                     ubi_desc:"Vialidad Exterior"                      },
  { equipo:"MBO1162", denominacion:"Bomba Sumergible Cloacal N°2",                  dimension:"3,1 KW / 6,8A TRIF.",ubicacion:"AEP-ED7-NIVEL0-UBITEC009",  fabricante:"Flygt",                     modelo:"3102",                     ubi_desc:"Vialidad Exterior"                      },
  { equipo:"MBO1163", denominacion:"Bomba Sumergible Cloacal N°3",                  dimension:"3,1 KW / 6,8A TRIF.",ubicacion:"AEP-ED7-NIVEL0-UBITEC009",  fabricante:"Flygt",                     modelo:"3102",                     ubi_desc:"Vialidad Exterior"                      },
  { equipo:"MBO1164", denominacion:"Bomba Sumergible Cloacal Vertical Texelrio",    dimension:"",                  ubicacion:"AEP-ED8-NIVEL0-UBITEC020",   fabricante:"",                          modelo:"",                         ubi_desc:"Texel Rio"                              },
  { equipo:"MBO1165", denominacion:"Bomba Sumergible Cloacal N°1 - Mantenim.",      dimension:"",                  ubicacion:"AEP-LAA-UBI225",             fabricante:"",                          modelo:"",                         ubi_desc:"Taller Mantenimiento Jefes"             },
  { equipo:"MBO1166", denominacion:"Bomba Sumergible Cloacal N°2 - Mantenim.",      dimension:"",                  ubicacion:"AEP-LAA-UBI225",             fabricante:"",                          modelo:"",                         ubi_desc:"Taller Mantenimiento Jefes"             },
  { equipo:"MBO1354", denominacion:"Bomba Multietapa Vertical N°1 - Agua Pot.",     dimension:"15 KW / 28A TRIF.", ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"Grundfos",                  modelo:"CRE64-22AFAEHQQE",         ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1355", denominacion:"Bomba Multietapa Vertical N°2 - Agua Pot.",     dimension:"15 KW / 28A TRIF.", ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"Grundfos",                  modelo:"CRE64-22AFAEHQQE",         ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1356", denominacion:"Bomba Multietapa Vertical N°3 - Agua Pot.",     dimension:"15 KW / 28A TRIF.", ubicacion:"AEP-ED2-NIVEL0-UBITEC089",   fabricante:"Grundfos",                  modelo:"CRE64-22AFAEHQQE",         ubi_desc:"Sala de Bombas"                         },
  { equipo:"MBO1426", denominacion:"Bomba Jockey red contra Incendio",              dimension:"",                  ubicacion:"AEP-ESR-UBITE7-UBITEC001",   fabricante:"Grundfos",                  modelo:"MG90LE2-24FT115-H3",        ubi_desc:"Sala Motobombas"                        },
  { equipo:"MBO1427", denominacion:"Motobomba red contra Incendio N°1",             dimension:"80 HP / 2900 RPM",  ubicacion:"AEP-ESR-UBITE7-UBITEC001",   fabricante:"CLARKE (JU6H-UF24)",        modelo:"Grundfos DNF80-25",         ubi_desc:"Sala Motobombas"                        },
  { equipo:"MBO1428", denominacion:"Motobomba red contra Incendio N°2",             dimension:"80 HP / 2900 RPM",  ubicacion:"AEP-ESR-UBITE7-UBITEC001",   fabricante:"CLARKE (JU6H-UF24)",        modelo:"Grundfos DNF80-25",         ubi_desc:"Sala Motobombas"                        },
  { equipo:"MBO1429", denominacion:"Bomba Agua Potable N",                          dimension:"",                  ubicacion:"AEP-ESR-UBITE7-UBITEC001",   fabricante:"Grundfos",                  modelo:"CMBE-10-54 IUCDEG",        ubi_desc:"Sala Motobombas"                        },
  { equipo:"MBO1430", denominacion:"Bomba Agua Potable S",                          dimension:"",                  ubicacion:"AEP-ESR-UBITE7-UBITEC001",   fabricante:"Grundfos",                  modelo:"CMBE-10-54 IUCDEG",        ubi_desc:"Sala Motobombas"                        },
  { equipo:"MBO1431", denominacion:"Bomba Cloacal N°1",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"AP50B.50.11.A1.V",          ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1432", denominacion:"Bomba Cloacal N°2",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"AP50B.50.11.A1.V",          ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1433", denominacion:"Bomba Cloacal N°3",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE6",             fabricante:"Grundfos",                  modelo:"AP50B.50.15.3.V",           ubi_desc:"Nivel -2 (Sector Centro Sur)"           },
  { equipo:"MBO1434", denominacion:"Bomba Cloacal N°4",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE6",             fabricante:"Grundfos",                  modelo:"AP50B.50.15.3.V",           ubi_desc:"Nivel -2 (Sector Centro Sur)"           },
  { equipo:"MBO1435", denominacion:"Bomba Cloacal N°5",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE8-UBITEC005",   fabricante:"Grundfos",                  modelo:"AP50B.50.11.A1.V",          ubi_desc:"Sala de Bombas Norte"                   },
  { equipo:"MBO1436", denominacion:"Bomba Cloacal N°6",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE8-UBITEC005",   fabricante:"Grundfos",                  modelo:"AP50B.50.11.A1.V",          ubi_desc:"Sala de Bombas Norte"                   },
  { equipo:"MBO1437", denominacion:"Bomba Pluvial N°1",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1438", denominacion:"Bomba Pluvial N°2",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1439", denominacion:"Bomba Pluvial N°3",                             dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB006",   fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Pluviales Pozo 2 Centro Sur PK"         },
  { equipo:"MBO1440", denominacion:"Bomba Pluvial N°4",                             dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB006",   fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Pluviales Pozo 2 Centro Sur PK"         },
  { equipo:"MBO1441", denominacion:"Bomba Pluvial N°5",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE6",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Centro Sur)"           },
  { equipo:"MBO1442", denominacion:"Bomba Pluvial N°6",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE6",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Centro Sur)"           },
  { equipo:"MBO1443", denominacion:"Bomba Pluvial N°7",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE8",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Norte)"                },
  { equipo:"MBO1444", denominacion:"Bomba Pluvial N°8",                             dimension:"",                  ubicacion:"AEP-ESR-UBITE8",             fabricante:"Grundfos",                  modelo:"AP12.40.06.A1",             ubi_desc:"Nivel -2 (Sector Norte)"                },
  { equipo:"MBO1445", denominacion:"Bomba Pluvial Rampa N°1",                       dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"SE1.50.65.30.2.50D.B",      ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1446", denominacion:"Bomba Pluvial Rampa N°2",                       dimension:"",                  ubicacion:"AEP-ESR-UBITE5",             fabricante:"Grundfos",                  modelo:"SE1.50.65.30.2.50D.B",      ubi_desc:"Nivel -2 (Sector Sur)"                  },
  { equipo:"MBO1447", denominacion:"Bomba Pluvial Rampa N°3",                       dimension:"",                  ubicacion:"AEP-ESR-UBITE7",             fabricante:"Grundfos",                  modelo:"SE1.50.65.30.2.50D.B",      ubi_desc:"Nivel -2 (Sector Centro Norte)"         },
  { equipo:"MBO1448", denominacion:"Bomba Pluvial Rampa N°4",                       dimension:"",                  ubicacion:"AEP-ESR-UBITE7",             fabricante:"Grundfos",                  modelo:"SE1.50.65.30.2.50D.B",      ubi_desc:"Nivel -2 (Sector Centro Norte)"         },
  { equipo:"MBO1449", denominacion:"Bomba Depresora de Napa 1",                     dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB011",   fabricante:"Grundfos",                  modelo:"SP 7-15",                   ubi_desc:"Bombas Depresoras Napas PKR"            },
  { equipo:"MBO1450", denominacion:"Bomba Depresora de Napa 2",                     dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB011",   fabricante:"Grundfos",                  modelo:"SP 7-15",                   ubi_desc:"Bombas Depresoras Napas PKR"            },
  { equipo:"MBO1451", denominacion:"Bomba Depresora de Napa 3",                     dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB011",   fabricante:"Grundfos",                  modelo:"SP 7-15",                   ubi_desc:"Bombas Depresoras Napas PKR"            },
  { equipo:"MBO1452", denominacion:"Bomba Depresora de Napa 4",                     dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB011",   fabricante:"Grundfos",                  modelo:"SP 7-15",                   ubi_desc:"Bombas Depresoras Napas PKR"            },
  { equipo:"MBO1453", denominacion:"Bomba Depresora de Napa 5",                     dimension:"",                  ubicacion:"AEP-PKR-EMBOMB-EMBOMB011",   fabricante:"Grundfos",                  modelo:"SP 7-15",                   ubi_desc:"Bombas Depresoras Napas PKR"            },
  { equipo:"MBO1462", denominacion:"Bomba Cloacal N°1 Lado Pista",                  dimension:"2700 RPM / 4A TRIF.",ubicacion:"AEP-ED1-NIVEL0-UBITEC008",  fabricante:"Grundfos",                  modelo:"SEG.40.15.2.50B",           ubi_desc:"Vialidad Exterior Ed 1"                 },
  { equipo:"MBO1463", denominacion:"Bomba Cloacal N°2 Lado Río",                    dimension:"2700 RPM / 4A TRIF.",ubicacion:"AEP-ED1-NIVEL0-UBITEC008",  fabricante:"Grundfos",                  modelo:"SEG.40.15.2.50B",           ubi_desc:"Vialidad Exterior Ed 1"                 },
];

/* Tipo de bomba según denominación */
function bombaTipo(denominacion) {
  const d = denominacion.toLowerCase();
  if (/incendio|jockey|motobomba/.test(d))   return "incendio";
  if (/cloacal/.test(d))                     return "cloacal";
  if (/pluvial|rampa|napa|depresora/.test(d))return "pluvial";
  if (/achique/.test(d))                     return "achique";
  return "agua";
}

const TIPO_COLORS_BOM = {
  incendio: "#dc2626",
  cloacal:  "#7c3aed",
  pluvial:  "#0891b2",
  achique:  "#f59e0b",
  agua:     "#1a56a4",
};

const TIPO_LABELS_BOM = {
  incendio: "Incendio",
  cloacal:  "Cloacal",
  pluvial:  "Pluvial / Napa",
  achique:  "Achique",
  agua:     "Agua",
};

/* ─────────────────────────────────────────────────────────
   TAREAS COMPARTIDAS — Motobombas (reutilizadas en Ed.III y PKR)
   ───────────────────────────────────────────────────────── */
const _semestralMoto = [
  "Limpiar los FILTROS DE AGUA del sistema de refrigeración",
  "Comprobar los dispositivos de seguridad y las alarmas",
  "Verificar la ausencia de combustible en el escape",
  "Verificar sección flexible del escape",
  "Verificar el estado de la aislación del sistema de gases de escapes",
  "Prueba de arranque de bombas de achique de la sala — prueba de peras",
  "Limpiar soportes sucios en el motor diésel",
  "Limpieza general (pisos, etc.)",
  "Prueba de funcionamiento manual: verificar todos los medios de arranque manual que permita el sistema",
  "Simular sobrevelocidad desde tablero de comando de motor",
];

const _inspeccionAnualMoto = [
  "Verificar la alineación paralela y angular de la bomba y del impulsor (corregir cualquier desalineación)",
  "Verificar aislación de cables y conductores para detectar agrietamiento (sin abrir el controlador energizado)",
  "Verificar respiradero del cárter del motor",
  "Verificar el sistema de escape, estado de soportes y trampa de drenaje de condensado",
  "Verificar grietas en conexiones y mangueras flexibles",
  "Verificar en el tanque de combustible: ventilaciones, tuberías de rebose, válvulas y correcta posición",
  "Verificar corrosión en placas de circuitos impresos del controlador",
  "Verificar el movimiento u holgura longitudinal de los ejes con la bomba en funcionamiento",
  "Verificar conexiones de cableado de energía y controles: firmeza, sulfatación y fogoneo",
  "Verificar que los medios de arranque estén intactos y bien sujetos",
];

const _mantenimientoAnualMoto = [
  "Reemplazar aceite lubricante del motor anualmente o después de 50 horas de funcionamiento",
  "Reemplazar filtros de combustible, aire y aceite anualmente o después de 50 horas de funcionamiento",
  "Reemplazar el líquido refrigerante cada 2 años en motobombas con radiador (si corresponde)",
  "Limpiar / Reemplazar los filtros del agua circulante",
  "Verificar ánodo de sacrificio del sistema de refrigeración por agua (si posee)",
  "Lubricar acoplamiento de la bomba, manchón, transmisión cardánica, crucetas",
  "Lubricar cojinetes de la bomba",
  "Verificar tensión y estado de correas",
  "Verificar purgadores automáticos",
  "Verificar el correcto funcionamiento del intercambiador de calor del sistema de refrigeración",
  "Verificar funcionamiento de la válvula de alivio",
  "Verificar baterías: (A) gravedad específica, estado y tasa de carga; (B) eliminar corrosión de terminales; (C) voltaje de arranque > 9V en sistema de 12V / 18V en sistema de 24V; (D) usar solo agua destilada",
  "Verificar los sistemas activos de mantenimiento de combustible diésel (si posee)",
  "Verificar presencia de agua y materiales extraños en tanque de combustible — realizar limpieza interior",
  "Medir contrapresión en turbo de motor",
  "Verificar precisión de manómetros y sensores de presión (dentro del 5% de calibración; sino reemplazar/recalibrar)",
  "Eliminar y pintar partes oxidadas del motor",
  "Revisión general de elementos mecánicos: puertas, soportes, cerraduras, etc.",
  "Coordinar y verificar funcionamiento con alimentación de emergencia",
];

const _pruebaComponentesMoto = [
  "Probar el módulo de control electrónico (MCE)",
  "Simular / Probar condiciones de alarma de bomba contra incendios y observar funcionamiento correcto de indicadores",
  "Probar el tanque de combustible: interruptor de flotador",
  "Probar equipos relacionados con las condiciones ambientales del cuarto de bombas (calefacción, ventilación, iluminación)",
  "Verificar señal de supervisión para temperatura del agua de refrigeración alta",
];

const _bienalMoto = [
  "Verificar datos de nueva batería — comparar con la que se retira",
  "Verificar nivel de electrolito; medir tensión",
  "Retirar batería antigua (desconectar primero el borne negativo)",
  "Instalar nueva batería (conectar primero el borne positivo)",
  "Verificar ajuste de bornes",
  "Medir tensión de salida del cargador de flote de baterías (REF: entre 25 y 26 V)",
  "Recorrida funcional del sistema de arranque",
  "Colocar etiqueta con la fecha de instalación",
  "Puesta en marcha — 15 minutos",
  "Limpieza general del equipo y áreas circundantes",
  "Verificar y asegurar posición en AUTOMÁTICO o REMOTO de llave selectora",
];

/* ─────────────────────────────────────────────────────────
   BOMBAS_PLANES
   ───────────────────────────────────────────────────────── */
const BOMBAS_PLANES = [

  /* ── 1. Motobomba Ed. III ─────────────────────────────── */
  {
    id: "motobomba-ed3",
    denominacion: "Motobomba red contra Incendio — Edificio III",
    equipos: ["MBO1146","MBO1147"],
    frecuencias: [
      {
        id: "semanal", label: "SEMANAL", sublabel: "NFPA 25 / IRAM 3546", color: "#dc2626",
        grupos: [
          { nombre: "Sala de Bombas — Inspección previa", tareas: [
            "Verificar temperatura de sala > 4°C en bombas con calentador de motor — registrar [____] °C",
            "Verificar que las rejillas de ventilación funcionan correctamente",
            "Verificar que el piso no presenta excesiva cantidad de agua",
          ]},
          { nombre: "Sistema de Bombeo — Inspección", tareas: [
            "Verificar válvulas de succión y de descarga totalmente abiertas",
            "Verificar integridad de cañerías de drenaje, presurizadas y de comando — sin fugas",
            "Verificar integridad del manovacuómetro de aspiración y manómetro de impulsión",
            "Registrar presión del manómetro de descarga [____] PSI (REF: 0 a 6 PSI)",
            "Registrar presión del manovacuómetro de succión [____] PSI (REF: 0 a 6 PSI)",
            "Verificar que la presión de descarga sea igual a la presión de succión",
            "Verificar nivel del tanque de agua — lleno o en nivel de diseño [____] % (REF: 100%)",
            "Verificar temperatura del agua ≥ 4°C — registrar [____] °C",
            "Verificar válvulas de prueba de flujo cerradas, válvula de manguera cerrada, línea sin agua",
          ]},
          { nombre: "Motor Diésel — Inspección", tareas: [
            "Verificar estado general del equipo",
            "Anotar tiempo de funcionamiento del motor [____] Hs",
            "Verificar tanque de combustible ≥ 70% — registrar [____] %",
            "Verificar ausencia de agua en el tanque, sin fugas ni corrosión, batea de contención limpia",
            "Verificar selector del controlador en posición automática",
            "Registrar voltaje de baterías: Batería N°1 [____] V / Batería N°2 [____] V",
            "Verificar corriente de carga de baterías dentro del rango aceptable",
            "Verificar terminales de baterías sin corrosión",
            "Verificar nivel de electrolito en baterías (EPP: GUANTES Y PROTECCIÓN FACIAL)",
            "Inspección general del sistema eléctrico — verificar rozamientos en cables con movimiento",
            "Verificar luces piloto de baterías encendidas (luces de falla apagadas)",
            "Verificar que todas las luces piloto de alarma están apagadas",
            "Verificar nivel de aceite del cárter dentro del rango aceptable — registrar [____] %",
            "Verificar que el precalentador de cárter funciona correctamente",
            "Verificar nivel de agua de refrigeración dentro del rango aceptable [____] %",
            "Verificar estado de mangueras flexibles y conexiones",
          ]},
          { nombre: "Prueba — Registro previo al arranque", tareas: [
            "Tomar lectura del controlador: presión actual [____] PSI / más alta registrada [____] PSI / más baja registrada [____] PSI — identificar y registrar anormalidades",
          ]},
          { nombre: "Prueba a Caudal 0 — 30 minutos", tareas: [
            "Verificar automatismo: abrir válvula de drenaje para encender el motor",
            "Registrar presión de arranque desde transductor o manómetro [____] PSI (REF: 113 PSI MBO1146 / 99 PSI MBO1147)",
            "Registrar presión de succión — manovacuómetro [____] PSI (REF: 0 PSI)",
            "Registrar presión de descarga — manómetro [____] PSI (REF: 200 PSI MBO1146 / 186 PSI MBO1147)",
            "Registrar lectura del transductor/interruptor de presión [____] PSI — comparar con manómetro de descarga",
            "Verificar ajuste del prensaestopas (una gota por segundo)",
            "Verificar ausencia de ruidos o vibraciones inusuales",
            "Inspeccionar cajas de empaquetaduras, cojinetes o carcasas — detectar sobrecalentamiento (< 80°C)",
          ]},
          { nombre: "Motor Diésel — Prueba en Marcha", tareas: [
            "Registrar tiempo de arranque del motor [____] seg",
            "Registrar tiempo en alcanzar velocidad de régimen (REF: 2100 RPM) [____] seg",
            "Registrar tacómetro [____] RPM / temperatura agua [____] °C / presión aceite [____] PSI",
            "Registrar presión en tubería de refrigeración [____] PSI (REF: 30–60 PSI)",
            "Verificar flujo de agua de refrigeración del intercambiador de calor",
            "Verificar ausencia de fugas en el escape",
            "Verificar los dispositivos de control de alarmas",
            "Verificar monitoreo de bomba funcionando desde ONYXWORKS",
          ]},
          { nombre: "Notificación OT", tareas: [
            "Reportar novedades halladas durante el mantenimiento y prueba a caudal 0%",
            "Completar puntos de medida semanales en MBO1146/MBO1147: Hs de funcionamiento, RPM, pres. y nivel de aceite, temp./pres./nivel de agua de refrig., nivel de tanque de comb., tensiones de baterías",
            "Datos de sala: temperatura de sala; nivel y temperatura del tanque de agua; pres. de succión y descarga (apagada); pres. más alta y más baja del controlador; pres. de arranque/succión/descarga a caudal 0%",
          ]},
        ]
      },
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "NFPA 25 / IRAM 3546", color: "#1a56a4",
        grupos: [{ nombre: "Tareas Semestrales", tareas: _semestralMoto }]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX — NFPA 25 / IRAM 3546", color: "#10b981",
        grupos: [
          { nombre: "Inspección Anual", tareas: _inspeccionAnualMoto },
          { nombre: "Mantenimiento Anual", tareas: _mantenimientoAnualMoto },
          { nombre: "Prueba Anual de Componentes", tareas: _pruebaComponentesMoto },
          { nombre: "Prueba Anual con Flujo", tareas: [
            "Entregar al mantenedor externo el formulario de prueba anual (NFPA 25) para completar durante la prueba de flujo y firmar por el responsable de la empresa. Comprende: motobomba e instalación; personas presentes; estado del cableado eléctrico; prueba de flujo anual; válvula de alivio; prueba del controlador; tanque de almacenamiento; evaluación de pruebas; comentarios; gráfica de curvas de rendimiento (0%, 25%, 50%, 75%, 100%, 125% y 150% del caudal)",
            "Adjuntar a la OT remito de servicio del mantenedor y notificar: número de remito; novedades halladas; completar puntos de medida anuales en MBO1146 o MBO1147 (valores de presión en curva de rendimiento de RPM netas ajustadas a diferentes caudales)",
          ]},
        ]
      },
      {
        id: "bienal", label: "BIENAL", sublabel: "Reemplazo de baterías", color: "#7c3aed",
        grupos: [{ nombre: "Reemplazo de Baterías", tareas: _bienalMoto }]
      },
    ]
  },

  /* ── 2. Motobomba Parking Río ─────────────────────────── */
  {
    id: "motobomba-pkr",
    denominacion: "Motobomba red contra Incendio — Parking Río",
    equipos: ["MBO1427","MBO1428"],
    frecuencias: [
      {
        id: "semanal", label: "SEMANAL", sublabel: "NFPA 25 / IRAM 3546", color: "#dc2626",
        grupos: [
          { nombre: "Sala de Bombas — Inspección previa", tareas: [
            "Verificar temperatura de sala > 4°C en bombas con calentador de motor — registrar [____] °C",
            "Verificar que las rejillas de ventilación funcionan correctamente",
            "Verificar que el piso no presenta excesiva cantidad de agua",
          ]},
          { nombre: "Sistema de Bombeo — Inspección", tareas: [
            "Verificar válvulas de succión y de descarga totalmente abiertas",
            "Verificar integridad de cañerías de drenaje, presurizadas y de comando — sin fugas",
            "Verificar integridad del manovacuómetro de aspiración y manómetro de impulsión",
            "Registrar presión del manómetro de descarga [____] PSI (REF: 0 a 6 PSI)",
            "Registrar presión del manovacuómetro de succión [____] PSI (REF: 0 a 6 PSI)",
            "Verificar que la presión de descarga sea igual a la presión de succión",
            "Verificar nivel del tanque de agua — lleno o en nivel de diseño [____] % (REF: 100%)",
            "Verificar temperatura del agua ≥ 4°C — registrar [____] °C",
            "Verificar válvulas de prueba de flujo cerradas, válvula de manguera cerrada, línea sin agua",
          ]},
          { nombre: "Motor Diésel — Inspección", tareas: [
            "Verificar estado general del equipo",
            "Anotar tiempo de funcionamiento del motor [____] Hs",
            "Verificar tanque de combustible ≥ 70% — registrar [____] %",
            "Verificar ausencia de agua en el tanque, sin fugas ni corrosión, batea de contención limpia",
            "Verificar selector del controlador en posición automática",
            "Registrar voltaje de baterías: Batería N°1 [____] V / Batería N°2 [____] V",
            "Verificar corriente de carga de baterías dentro del rango aceptable",
            "Verificar terminales de baterías sin corrosión",
            "Verificar nivel de electrolito en baterías (EPP: GUANTES Y PROTECCIÓN FACIAL)",
            "Inspección general del sistema eléctrico — verificar rozamientos en cables con movimiento",
            "Verificar luces piloto de baterías encendidas (luces de falla apagadas)",
            "Verificar que todas las luces piloto de alarma están apagadas",
            "Verificar nivel de aceite del cárter dentro del rango aceptable — registrar [____] %",
            "Verificar que el precalentador de cárter funciona correctamente",
            "Verificar nivel de agua de refrigeración dentro del rango aceptable [____] %",
            "Verificar estado de mangueras flexibles y conexiones",
          ]},
          { nombre: "Prueba — Registro previo al arranque", tareas: [
            "Tomar lectura del controlador: presión actual [____] PSI / más alta registrada [____] PSI / más baja registrada [____] PSI — identificar y registrar anormalidades",
          ]},
          { nombre: "Prueba a Caudal 0 — 30 minutos", tareas: [
            "Verificar automatismo: abrir válvula de drenaje para encender el motor",
            "Registrar presión de arranque desde transductor o manómetro [____] PSI (REF: 103,3 PSI MBO1427/MBO1428)",
            "Registrar presión de succión — manovacuómetro [____] PSI (REF: 0 PSI)",
            "Registrar presión de descarga — manómetro [____] PSI (REF: 112,3 PSI MBO1427/MBO1428)",
            "Registrar lectura del transductor/interruptor de presión [____] PSI — comparar con manómetro de descarga",
            "Verificar ajuste del prensaestopas (una gota por segundo)",
            "Verificar ausencia de ruidos o vibraciones inusuales",
            "Inspeccionar cajas de empaquetaduras, cojinetes o carcasas — detectar sobrecalentamiento (< 80°C)",
          ]},
          { nombre: "Motor Diésel — Prueba en Marcha", tareas: [
            "Registrar tiempo de arranque del motor [____] seg",
            "Registrar tiempo en alcanzar velocidad de régimen (REF: 2900 RPM) [____] seg",
            "Registrar tacómetro [____] RPM / temperatura agua [____] °C / presión aceite [____] PSI",
            "Registrar presión en tubería de refrigeración [____] PSI (REF: 30–60 PSI)",
            "Verificar flujo de agua de refrigeración del intercambiador de calor",
            "Verificar ausencia de fugas en el escape",
            "Verificar los dispositivos de control de alarmas",
            "Verificar monitoreo de bomba funcionando desde ONYXWORKS",
          ]},
          { nombre: "Notificación OT", tareas: [
            "Reportar novedades halladas durante el mantenimiento y prueba a caudal 0%",
            "Completar puntos de medida semanales en MBO1427/MBO1428: Hs de funcionamiento, RPM, pres. y nivel de aceite, temp./pres./nivel de agua de refrig., nivel de tanque de comb., tensiones de baterías",
            "Datos de sala: temperatura de sala; nivel y temperatura del tanque de agua; pres. de succión y descarga (apagada); pres. más alta y más baja del controlador; pres. de arranque/succión/descarga a caudal 0%",
          ]},
        ]
      },
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "NFPA 25 / IRAM 3546", color: "#1a56a4",
        grupos: [{ nombre: "Tareas Semestrales", tareas: _semestralMoto }]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX — NFPA 25 / IRAM 3546", color: "#10b981",
        grupos: [
          { nombre: "Inspección Anual", tareas: _inspeccionAnualMoto },
          { nombre: "Mantenimiento Anual", tareas: [
            ..._mantenimientoAnualMoto.slice(0, 7),
            "Engrasar los rodamientos del motor, si es necesario (VERIFICAR TIPO DE RODAMIENTO)",
            ..._mantenimientoAnualMoto.slice(7),
          ]},
          { nombre: "Prueba Anual de Componentes", tareas: _pruebaComponentesMoto },
          { nombre: "Prueba Anual con Flujo", tareas: [
            "Entregar al mantenedor externo el formulario de prueba anual (NFPA 25) para completar durante la prueba de flujo y firmar por el responsable de la empresa. Comprende: motobomba e instalación; personas presentes; estado del cableado eléctrico; prueba de flujo anual; válvula de alivio; prueba del controlador; tanque de almacenamiento; evaluación de pruebas; comentarios; gráfica de curvas de rendimiento (0%, 25%, 50%, 75%, 100%, 125% y 150% del caudal)",
            "Adjuntar a la OT remito de servicio del mantenedor y notificar: número de remito; novedades halladas; completar puntos de medida anuales en MBO1427 o MBO1428 (valores de presión en curva de rendimiento de RPM netas ajustadas a diferentes caudales)",
          ]},
        ]
      },
      {
        id: "bienal", label: "BIENAL", sublabel: "Reemplazo de baterías", color: "#7c3aed",
        grupos: [{ nombre: "Reemplazo de Baterías", tareas: _bienalMoto }]
      },
    ]
  },

  /* ── 3. Bomba Jockey ──────────────────────────────────── */
  {
    id: "jockey",
    denominacion: "Bomba Jockey — Red contra Incendio",
    equipos: ["MBO1144","MBO1145","MBO1426"],
    frecuencias: [
      {
        id: "bimestral", label: "BIMESTRAL", sublabel: "MOEX", color: "#f59e0b",
        grupos: [{ nombre: "Tareas Bimestrales", tareas: [
          "Verificar la presión en el manómetro — registrar presión actual, de arranque y de parada",
          "Verificar estado de los manómetros y presostatos",
          "Verificar estado y limpieza del pulmón hidráulico",
          "Verificar estado y operación del tablero de comando",
          "Controlar funcionamiento mecánico del conjunto motor-bomba — detectar ruidos y vibraciones anormales",
          "Control del sistema de arranque",
          "Medir valores de consumo por fase y contrastar con valores de chapa",
          "Verificar que no haya pérdidas en la empaquetadura / sello mecánico",
          "Coordinar prueba de funcionamiento con alimentación de emergencia",
        ]}]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [
          { nombre: "Con Motor Detenido", tareas: [
            "Hacer ensayo de aislación eléctrica de bobinado de motor",
            "Verificar estado del tablero de comandos: desenergizar, ajustar bornes, controlar sulfato/óxido, limpiar y ajustar",
            "Girar la bomba en forma manual y verificar su giro sin freno",
            "Verificar alineación de todo el conjunto (si aplica)",
            "Realizar cambio de aceite (si aplica)",
            "Realizar limpieza completa del equipo",
          ]},
          { nombre: "Con Motor en Marcha", tareas: [
            "Controlar funcionamiento mecánico del conjunto motor-bomba — detectar ruidos y vibraciones anormales",
            "Control del sistema de arranque",
            "Medir valores de consumo por fase y contrastar con valores de chapa",
            "Verificar que no haya pérdidas en la empaquetadura / sello mecánico",
            "Adjuntar a OT remito de servicio del mantenedor e indicar número de remito y novedades halladas",
          ]},
        ]
      },
    ]
  },

  /* ── 4. Bombas Centrífugas con Acoplamiento ───────────── */
  {
    id: "centrif-acoplamiento",
    denominacion: "Bombas Centrífugas con Acoplamiento",
    equipos: ["MBO1153","MBO1154","MBO1155","MBO1156","MBO1157","MBO1158","MBO1159","MBO1160"],
    frecuencias: [
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX", color: "#1a56a4",
        grupos: [{ nombre: "Tareas Semestrales", tareas: [
          "Controlar presiones (no deben ser inferiores al 20% del nominal)",
          "Medir y registrar corriente del motor Fase L1 (no > 10% por encima de la nominal)",
          "Medir y registrar corriente del motor Fase L2 (no > 10% por encima de la nominal)",
          "Medir y registrar corriente del motor Fase L3 (no > 10% por encima de la nominal)",
          "Controlar comportamiento de la bomba en funcionamiento: ruido, vibraciones, temperatura de los cojinetes",
          "Controlar comportamiento del motor en funcionamiento: ruido, vibraciones, temperatura de los rodamientos",
          "Controlar estado de la caja de rodamientos (pérdidas de aceite o grasa) — chequear nivel de aceite",
          "Controlar que no exista excesiva pérdida por los sellos mecánicos y/o prensa-estopa",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [{ nombre: "Tareas Anuales", tareas: [
          "Desacoplar conjunto conductor-conducido",
          "Poner en funcionamiento el motor en vacío — controlar funcionamiento mecánico, ruido y vibraciones",
          "Realizar un megado del motor",
          "Girar la bomba en forma manual y verificar su giro sin freno",
          "De producirse apertura para cambio de rodamiento: abrir todo el conjunto impulsor y verificar estado y desgastes",
          "Alinear todo el conjunto",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
    ]
  },

  /* ── 5. Bombas Centrífugas Monobloque ─────────────────── */
  {
    id: "centrif-monobloque",
    denominacion: "Bombas Centrífugas Monobloque",
    equipos: ["MBO1151","MBO1152","MBO1429","MBO1430"],
    frecuencias: [
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX", color: "#1a56a4",
        grupos: [{ nombre: "Tareas Semestrales", tareas: [
          "Controlar presiones (no deben ser inferiores al 20% del nominal)",
          "Medir y registrar corriente del motor Fase L1 (no > 10% por encima de la nominal)",
          "Medir y registrar corriente del motor Fase L2 (no > 10% por encima de la nominal)",
          "Medir y registrar corriente del motor Fase L3 (no > 10% por encima de la nominal)",
          "Controlar comportamiento de la bomba en funcionamiento: ruido, vibraciones, temperatura de los cojinetes",
          "Controlar comportamiento del motor en funcionamiento: ruido, vibraciones, temperatura de los rodamientos",
          "Controlar que no exista excesiva pérdida por los sellos mecánicos y/o prensa-estopa",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [{ nombre: "Tareas Anuales", tareas: [
          "Realizar un megado del motor",
          "De producirse apertura para cambio de rodamiento: abrir todo el conjunto impulsor y verificar estado y desgastes",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
    ]
  },

  /* ── 6. Bombas Multietapa Verticales ──────────────────── */
  {
    id: "multietapa",
    denominacion: "Bombas Multietapa Verticales",
    equipos: ["MBO1354","MBO1355","MBO1356"],
    frecuencias: [
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX", color: "#1a56a4",
        grupos: [{ nombre: "Tareas Semestrales", tareas: [
          "Controlar las presiones (no deben ser inferiores al 20% del nominal)",
          "Medir y registrar al arranque y luego de 10 min de marcha la corriente Fase L1 (no > 10% nominal)",
          "Medir y registrar al arranque y luego de 10 min de marcha la corriente Fase L2 (no > 10% nominal)",
          "Medir y registrar al arranque y luego de 10 min de marcha la corriente Fase L3 (no > 10% nominal)",
          "Controlar comportamiento de la bomba en funcionamiento: ruido, vibraciones, temperatura de rodamientos",
          "Verificar estado de acoplamiento",
          "Controlar que no exista pérdida por el sello mecánico",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [{ nombre: "Tareas Anuales", tareas: [
          "Realizar limpieza completa del equipo",
          "Verificar estado y realizar control general de la bulonería del equipo",
          "De producirse apertura para cambio de rodamientos: abrir todo el conjunto y verificar estado y desgastes",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
    ]
  },

  /* ── 7. Bombas Sumergibles ────────────────────────────── */
  {
    id: "sumergible",
    denominacion: "Bombas Sumergibles (Cloacales, Pluviales, Achique y Napa)",
    equipos: [
      "MBO001","MBO002",
      "MBO1161","MBO1162","MBO1163","MBO1164","MBO1165","MBO1166",
      "MBO1431","MBO1432","MBO1433","MBO1434","MBO1435","MBO1436",
      "MBO1437","MBO1438","MBO1439","MBO1440","MBO1441","MBO1442",
      "MBO1443","MBO1444","MBO1445","MBO1446","MBO1447","MBO1448",
      "MBO1449","MBO1450","MBO1451","MBO1452","MBO1453",
      "MBO1462","MBO1463",
    ],
    frecuencias: [
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX", color: "#1a56a4",
        grupos: [
          { nombre: "Tareas Semestrales", tareas: [
            "Realizar prueba de operación con todas las válvulas abiertas",
            "Controlar comportamiento de la bomba en funcionamiento: ruido y vibraciones",
            "Medir y registrar corriente del motor Fase L1 (no > 5% por encima de la nominal)",
            "Medir y registrar corriente del motor Fase L2 (no > 5% por encima de la nominal)",
            "Medir y registrar corriente del motor Fase L3 (no > 5% por encima de la nominal)",
            "Verificar que no existan pérdidas de agua en la cañería u otros accesorios",
            "Verificar integridad del cableado eléctrico",
            "Operación de maniobra de válvulas para controlar su funcionamiento (equipo apagado; luego habilitar equipo y válvulas)",
            "Realizar limpieza del equipo y sector — verificar que no queden residuos en el lugar de trabajo",
            "En caso de encontrar alguna anomalía, informar al Supervisor",
          ]},
          { nombre: "Si el líquido de bombeo contiene sedimentos (arena, barro espeso)", tareas: [
            "Desacoplar la bomba de la cañería de impulsión",
            "Revisar el impulsor de la bomba (desgaste)",
            "Verificar posible desgaste del cuerpo de bomba",
            "Verificar el nivel y existencia de pérdidas de aceite (si posee)",
          ]},
        ]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [{ nombre: "Tareas Anuales", tareas: [
          "Controlar ajuste de bornes en el conexionado/bornera del equipo: verificar sin sulfato/óxido, limpiar y ajustar (desenergizar el tablero previamente)",
          "En caso de encontrar alguna anomalía, informar al Supervisor",
        ]}]
      },
    ]
  },

];

/* ─── Lookup O(1): equipo → plan id ──────────────────── */
const BOMBA_A_PLAN = Object.fromEntries(
  BOMBAS_PLANES.flatMap(p => p.equipos.map(eq => [eq, p.id]))
);
