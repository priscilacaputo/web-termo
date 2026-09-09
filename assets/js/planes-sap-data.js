/* ─── PLANES_SAP_RESUMEN — IP24 (alcance TER + MEC) ───
   Fuente: IP24.xlsx filtrado por grupo planificación TER + MEC (este portal es
   exclusivo de Termomecánica/Mecánica) + IP16 sin filtrar solo como contexto.
   La periodicidad REAL sale de la mediana de días entre tomas programadas
   consecutivas de cada posición. Sigue faltando el objeto técnico por plan.
   Regenerar con scratchpad/gen_planes2.py desde el próximo export. */

const PLANES_SAP_RESUMEN = {
  "fuente": "IP24.xlsx (grupos planificación TER + MEC) + contexto IP16",
  "alcance": "TER + MEC — este portal es exclusivo de Termomecánica y Mecánica",
  "planes": 1049,
  "tomasProgramadas": 10542,
  "ip16TodoAep": 60610,
  "ip16TodoAepActivos": 32010,
  "cumplimiento": {
    "tomasVencidas": 4871,
    "sinOrden": 10,
    "posSinProxima": 10,
    "posConVencidaSinOrden": 6
  },
  "porPeriodicidadReal": [
    {
      "k": "Bimestral",
      "n": 361
    },
    {
      "k": "Mensual",
      "n": 243
    },
    {
      "k": "Trimestral",
      "n": 217
    },
    {
      "k": "Semestral",
      "n": 154
    },
    {
      "k": "(sin fechas suf.)",
      "n": 35
    },
    {
      "k": "Anual",
      "n": 28
    },
    {
      "k": "Semanal",
      "n": 5
    },
    {
      "k": "Cuatrimestral",
      "n": 4
    },
    {
      "k": "otro (~246d)",
      "n": 1
    },
    {
      "k": "otro (~273d)",
      "n": 1
    }
  ],
  "porFamilia": [
    {
      "k": "Aire acondicionado",
      "n": 388
    },
    {
      "k": "Patio de valijas (BHS)",
      "n": 313
    },
    {
      "k": "Puertas automáticas",
      "n": 79
    },
    {
      "k": "Balanzas",
      "n": 45
    },
    {
      "k": "Cortinas de aire",
      "n": 36
    },
    {
      "k": "Bombas",
      "n": 32
    },
    {
      "k": "Ascensores",
      "n": 30
    },
    {
      "k": "Persianas de gatera",
      "n": 30
    },
    {
      "k": "Flota vehicular",
      "n": 27
    },
    {
      "k": "Válvulas",
      "n": 22
    },
    {
      "k": "Extractores",
      "n": 19
    },
    {
      "k": "Mangas de embarque",
      "n": 10
    },
    {
      "k": "Escaleras mecánicas",
      "n": 8
    },
    {
      "k": "Tanques / cisternas",
      "n": 6
    },
    {
      "k": "Compresores",
      "n": 2
    },
    {
      "k": "Termomecánica (general)",
      "n": 2
    }
  ],
  "porEstrategia": [
    {
      "k": "AASDF",
      "n": 998
    },
    {
      "k": "AASCT",
      "n": 46
    },
    {
      "k": "AAEST",
      "n": 4
    },
    {
      "k": "AAESD",
      "n": 1
    }
  ],
  "sinFechasSuficientes": 35,
  "desajusteTotal": 2,
  "seEjecutaMenosSeguido": {
    "n": 2,
    "top": [
      {
        "pos": "52104",
        "plan": "11016",
        "desc": "Preventivo semestral tanque de agua",
        "familia": "Tanques / cisternas",
        "declara": "6M",
        "realDias": 367,
        "realBucket": "Anual"
      },
      {
        "pos": "52499",
        "plan": "16776",
        "desc": "MP 1M Ascensores Fujitec",
        "familia": "Ascensores",
        "declara": "1M",
        "realDias": 365,
        "realBucket": "Anual"
      }
    ]
  },
  "periodoUnicoNoCoincide": {
    "n": 0,
    "top": []
  },
  "posSinProxima": [
    {
      "pos": "71768",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71770",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71772",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71774",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71776",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71778",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71780",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71782",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71784",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    },
    {
      "pos": "71786",
      "desc": "MP 1A Balanza VanderLande",
      "familia": "Balanzas",
      "ultimaEjec": "2026-09-05"
    }
  ],
  "faltaParaCerrar": [
    "Objeto técnico / equipo por posición de plan (para cruzar equipos sin plan / planes sin equipo).",
    "Ciclo + unidad de la estrategia (paquetes) para validar contra el intervalo real."
  ]
};
