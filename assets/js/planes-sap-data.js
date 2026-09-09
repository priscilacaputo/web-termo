/* ─── PLANES_SAP_RESUMEN — Resumen del export IP16 ───
   Fuente: EXPORT_20260909160722.xlsx (IP16 · lista de planes, layout mínimo)
   El export vino con layout mínimo (número de plan, texto, estrategia,
   status): NO trae el equipo/objeto técnico ni el ciclo, así que sirve para
   el panorama de planes pero NO cierra "asignación a equipo" ni "periodicidad".
   Regenerar desde el próximo export. */

const PLANES_SAP_RESUMEN = {
  "fuente": "EXPORT_20260909160722.xlsx (IP16 · lista de planes, layout mínimo)",
  "total": 60610,
  "activos": 32010,
  "baja": 28600,
  "otros": 0,
  "textosDistintosActivos": 7022,
  "porStatus": [
    {
      "k": "ABIE",
      "n": 32010
    },
    {
      "k": "PTBO NOAC",
      "n": 25417
    },
    {
      "k": "ABIE NOAC",
      "n": 2873
    },
    {
      "k": "PTBO",
      "n": 310
    }
  ],
  "porEstrategiaActivos": [
    {
      "k": "AASDF",
      "n": 29612
    },
    {
      "k": "AAESD",
      "n": 1072
    },
    {
      "k": "AASCT",
      "n": 741
    },
    {
      "k": "AATCA",
      "n": 506
    },
    {
      "k": "AAEST",
      "n": 49
    },
    {
      "k": "UYDIA",
      "n": 25
    },
    {
      "k": "TAGHS",
      "n": 5
    }
  ],
  "porPeriodoActivos": [
    {
      "k": "(MP sin período en el texto)",
      "n": 11421
    },
    {
      "k": "(sin prefijo MP/PD/IP)",
      "n": 5884
    },
    {
      "k": "1A",
      "n": 3764
    },
    {
      "k": "1M",
      "n": 1736
    },
    {
      "k": "6M",
      "n": 1278
    },
    {
      "k": "3M",
      "n": 1238
    },
    {
      "k": "2M",
      "n": 1065
    },
    {
      "k": "4M",
      "n": 745
    },
    {
      "k": "1M-6M-1A",
      "n": 463
    },
    {
      "k": "2M-6M",
      "n": 459
    },
    {
      "k": "ANUAL",
      "n": 417
    },
    {
      "k": "7D",
      "n": 380
    },
    {
      "k": "1M-3M-1A",
      "n": 378
    },
    {
      "k": "1M-3M-6M",
      "n": 243
    },
    {
      "k": "6M-1A",
      "n": 237
    },
    {
      "k": "MENSUAL",
      "n": 193
    },
    {
      "k": "TRIMESTRAL",
      "n": 190
    },
    {
      "k": "1M-6M",
      "n": 144
    },
    {
      "k": "2A",
      "n": 144
    },
    {
      "k": "3M-1A",
      "n": 143
    },
    {
      "k": "1D",
      "n": 139
    },
    {
      "k": "5A",
      "n": 132
    },
    {
      "k": "2M-6M-1A",
      "n": 129
    },
    {
      "k": "14D",
      "n": 101
    },
    {
      "k": "1M-1A",
      "n": 98
    },
    {
      "k": "3A",
      "n": 81
    },
    {
      "k": "3M-1A-2A",
      "n": 78
    },
    {
      "k": "SEMESTRAL",
      "n": 68
    },
    {
      "k": "4M-1A",
      "n": 63
    },
    {
      "k": "1M-2M-6M",
      "n": 63
    },
    {
      "k": "2M-1A-3A",
      "n": 55
    },
    {
      "k": "1M-4M-1A",
      "n": 54
    },
    {
      "k": "BIMESTRAL",
      "n": 52
    },
    {
      "k": "2M-1A",
      "n": 51
    },
    {
      "k": "CUATRIMESTRAL",
      "n": 36
    },
    {
      "k": "3M-6M",
      "n": 30
    },
    {
      "k": "3M-1A-3A",
      "n": 29
    },
    {
      "k": "1M-6M-3A",
      "n": 23
    },
    {
      "k": "4A",
      "n": 23
    },
    {
      "k": "1M-3M",
      "n": 21
    },
    {
      "k": "3M-1A-5A",
      "n": 20
    },
    {
      "k": "2M-3A",
      "n": 19
    },
    {
      "k": "SEMANAL",
      "n": 16
    },
    {
      "k": "4M-1A-4A",
      "n": 16
    },
    {
      "k": "1M-4M",
      "n": 11
    },
    {
      "k": "1M-2M-3M",
      "n": 11
    },
    {
      "k": "2M-5A",
      "n": 10
    },
    {
      "k": "2M-4M-1A",
      "n": 10
    },
    {
      "k": "3M-2A",
      "n": 8
    },
    {
      "k": "1M-4M-6M",
      "n": 8
    },
    {
      "k": "4M-1A-2A",
      "n": 4
    },
    {
      "k": "3M-5A",
      "n": 4
    },
    {
      "k": "1M-6M-5A",
      "n": 4
    },
    {
      "k": "DIARIO",
      "n": 3
    },
    {
      "k": "1M-2M-4M",
      "n": 3
    },
    {
      "k": "1M-3A-1A",
      "n": 2
    },
    {
      "k": "6M-1A-2A",
      "n": 2
    },
    {
      "k": "3M-6M-1A",
      "n": 2
    },
    {
      "k": "1M-1A-5A",
      "n": 2
    },
    {
      "k": "6M-2A",
      "n": 2
    },
    {
      "k": "QUINCENAL",
      "n": 1
    },
    {
      "k": "1M-1A-2A",
      "n": 1
    },
    {
      "k": "4M-6M-1A",
      "n": 1
    },
    {
      "k": "3M-6M-3A",
      "n": 1
    },
    {
      "k": "15D",
      "n": 1
    }
  ],
  "topDuplicadosActivos": [
    {
      "txt": "pd comp. de instalaciones res 900",
      "n": 837
    },
    {
      "txt": "pd comprobación de instalaciones res 900",
      "n": 788
    },
    {
      "txt": "predictivo tableros",
      "n": 773
    },
    {
      "txt": "preventivo tableros de baja",
      "n": 704
    },
    {
      "txt": "mp 1a tbt seccional",
      "n": 431
    },
    {
      "txt": "mp 4m tbt seccional",
      "n": 421
    },
    {
      "txt": "mp 1a tbt seccional moex",
      "n": 395
    },
    {
      "txt": "mp tbt",
      "n": 318
    },
    {
      "txt": "pd tableros",
      "n": 283
    },
    {
      "txt": "pd 1a termografía tableros",
      "n": 277
    },
    {
      "txt": "mp 6m 1a splits general",
      "n": 275
    },
    {
      "txt": "medición de continuidad res900",
      "n": 262
    },
    {
      "txt": "pd 1a termografia",
      "n": 216
    },
    {
      "txt": "pd 1a comp. de instalaciones res 900",
      "n": 203
    },
    {
      "txt": "pd 1a termografia tableros",
      "n": 187
    },
    {
      "txt": "pd termografia anual tbt",
      "n": 184
    },
    {
      "txt": "iluminación de plataforma moex",
      "n": 183
    },
    {
      "txt": "mp tableros",
      "n": 173
    },
    {
      "txt": "mp tableros bms",
      "n": 172
    },
    {
      "txt": "inspeccion de sanitarios",
      "n": 160
    },
    {
      "txt": "mp tableros bt",
      "n": 157
    },
    {
      "txt": "mp bombas centrífugas",
      "n": 155
    },
    {
      "txt": "ip 2m estanterias",
      "n": 150
    },
    {
      "txt": "mp calibración interna balanza check in",
      "n": 146
    },
    {
      "txt": "mp columna de iluminación parking",
      "n": 144
    }
  ],
  "faltan": [
    "Objeto técnico / equipo / ubicación técnica por plan (para asignación a equipo)",
    "Ciclo + unidad del plan, o la estrategia expandida en paquetes (para periodicidad)",
    "Hoja de ruta y fechas de última / próxima ejecución (IP24 / IP30)"
  ]
};
