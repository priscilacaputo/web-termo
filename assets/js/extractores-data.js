const EXTRACTORES_DATA = [
  { equipo:"EMO1317", denominacion:"Extractor - Sala Técnica Trafos Núcleo 3",  ubicacion:"AEP-ED6-NIVEL7-UBITEC009", ubi_desc:"Núcleo AA N°3"           },
  { equipo:"EMO140",  denominacion:"Ventilador Nucleo Esc Sur Ed IV",            ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO141",  denominacion:"Ventilador Nucleo Esc Sur-Centro Ed IV",     ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO142",  denominacion:"Ventilador Nucleo Esc Norte-Centro Ed IV",   ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO143",  denominacion:"Ventilador Nucleo Esc Norte Ed IV",          ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO144",  denominacion:"Extractor baño Nucleo Sur Ed IV",            ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO145",  denominacion:"Extractor baño Nucleo Norte Ed IV",          ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO146",  denominacion:"Extractor Nucleo Ascr 1 Ed IV",              ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO147",  denominacion:"Extractor Nucleo Ascr 2 Ed IV",              ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO148",  denominacion:"Extractor Nucleo Ascr 3 Ed IV",              ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO149",  denominacion:"Extractor Nucleo Ascr 4 Ed IV",              ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO150",  denominacion:"Extractor - Sala Técnica Trafos Ed IV",      ubicacion:"AEP-ED4-NIVEL0-UBITEC107", ubi_desc:"Sala de Trafos"           },
  { equipo:"EMO151",  denominacion:"Extractor Baños Arribos Ed IV",              ubicacion:"AEP-ED4-NIVEL7-UBITEC000", ubi_desc:"Terraza Edificio 4"       },
  { equipo:"EMO152",  denominacion:"Ventilador presurización Norte",             ubicacion:"AEP-ED1-NIVEL7",           ubi_desc:"Techo Edificio 1"         },
  { equipo:"EMO153",  denominacion:"Ventilador presurización Sur",               ubicacion:"AEP-ED1-NIVEL7",           ubi_desc:"Techo Edificio 1"         },
  { equipo:"EMO154",  denominacion:"Presurizador Nucleo Esc Torre Ed III",       ubicacion:"AEP-ED3-NIVEL7-UBITEC001", ubi_desc:"Torre de Control"         },
  { equipo:"EMO1569", denominacion:"Extractor - Sala Técnica Set Norte Trafo",   ubicacion:"AEP-LAA-UBI241-UBITEC008", ubi_desc:"Set Norte Media Tensión"  },
  { equipo:"EMO1570", denominacion:"Extractor - Sala Técnica Set Norte Trafo",   ubicacion:"AEP-LAA-UBI241-UBITEC008", ubi_desc:"Set Norte Media Tensión"  },
  { equipo:"EMO1573", denominacion:"Extractor de aire cocina VIP",               ubicacion:"AEP-ED5-NIVEL0-UBITEC234", ubi_desc:"Check Point Plataforma"   },
  { equipo:"EMO1575", denominacion:"Extractor cocina Sala VIP PB",               ubicacion:"AEP-ED5-NIVEL0-UBITEC234", ubi_desc:"Check Point Plataforma"   },
];

/* Tipo según la primera palabra de la denominación */
function extTipo(denominacion) {
  const d = denominacion.toLowerCase();
  if (d.startsWith("presurizador")) return "presurizador";
  if (d.startsWith("ventilador"))   return "ventilador";
  return "extractor";
}

const TIPO_COLORS_EXT = {
  extractor:    "#1a56a4",
  ventilador:   "#0891b2",
  presurizador: "#10b981",
};

const EXTRACTORES_PLANES = [
  {
    id: "extractores-ventiladores",
    denominacion: "Extractores / Ventiladores de Aire",
    equipos: [
      "EMO1317","EMO140","EMO141","EMO142","EMO143",
      "EMO144","EMO145","EMO146","EMO147","EMO148","EMO149",
      "EMO150","EMO151","EMO152","EMO153","EMO154",
      "EMO1569","EMO1570","EMO1573","EMO1575"
    ],
    frecuencias: [
      {
        id: "bimestral-correa",
        label: "BIMESTRAL",
        sublabel: "Transmisión por Correa",
        color: "#1a56a4",
        grupos: [
          { nombre: "Centrífugos y Axiales — Correa", tareas: [
            "Verificar balanceo y estado de turbina (vibraciones)",
            "Verificar estado y tensado de correas",
            "Verificar estado y alineación de poleas",
            "Verificar existencia de ruidos anormales en rodamientos",
            "Verificar estado de puesta a tierra",
            "Lubricar cojinetes",
            "Verificar ajuste de soportes",
            "Realizar limpieza del equipo",
            "Medir y registrar del consumo (A) del motor - Fase L1",
            "Medir y registrar del consumo (A) del motor - Fase L2",
            "Medir y registrar del consumo (A) del motor - Fase L3"
          ]}
        ]
      },
      {
        id: "bimestral-directa",
        label: "BIMESTRAL",
        sublabel: "Transmisión Directa",
        color: "#0891b2",
        grupos: [
          { nombre: "Centrífugos y Axiales — Directa", tareas: [
            "Verificar balanceo y estado de turbina (vibraciones)",
            "Verificar existencia de ruidos anormales en rodamientos",
            "Verificar estado de puesta a tierra",
            "Verificar ajuste de soportes",
            "Realizar limpieza del equipo",
            "Medir y registrar del consumo (A) del motor - Fase L1",
            "Medir y registrar del consumo (A) del motor - Fase L2",
            "Medir y registrar del consumo (A) del motor - Fase L3"
          ]}
        ]
      }
    ]
  }
];

const EXTRACTOR_A_PLAN = Object.fromEntries(
  EXTRACTORES_PLANES.flatMap(p => p.equipos.map(eq => [eq, p.id]))
);

const TIPO_LABELS_EXT = {
  extractor:    "Extractor",
  ventilador:   "Ventilador",
  presurizador: "Presurizador",
};
