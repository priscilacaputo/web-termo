/* ─── ESTRATEGIAS_SAP — estrategias de mantenimiento (IP11) ───
   Fuente: EXPORT.XLSX (hojas Data + Paquetes). Cada estrategia programa
   TODOS sus paquetes solapados; el paquete más corto (minDias) es el
   intervalo base. diasSet = ciclos de todos los paquetes en días.
   Regenerar con scratchpad/gen_estrategias.py. */

const ESTRATEGIAS_SAP = {
 "AAESD": {
  "denom": "Estrategia AA2000 DIA SEM QUIN",
  "unidad": "D",
  "paquetes": [
   {
    "breve": "1",
    "dias": 1
   },
   {
    "breve": "7",
    "dias": 7
   },
   {
    "breve": "14",
    "dias": 14
   }
  ],
  "minDias": 1,
  "diasSet": [
   1,
   7,
   14
  ],
  "planesQueLaUsan": 1
 },
 "AAEST": {
  "denom": "Estrategia AA2000 SEM y QUIN",
  "unidad": "D",
  "paquetes": [
   {
    "breve": "7",
    "dias": 7
   },
   {
    "breve": "14",
    "dias": 14
   }
  ],
  "minDias": 7,
  "diasSet": [
   7,
   14
  ],
  "planesQueLaUsan": 4
 },
 "AASCT": {
  "denom": "Estrategia AA2000",
  "unidad": "D",
  "paquetes": [
   {
    "breve": "7",
    "dias": 7
   },
   {
    "breve": "15",
    "dias": 15
   },
   {
    "breve": "1M",
    "dias": 30
   },
   {
    "breve": "2M",
    "dias": 60
   },
   {
    "breve": "3M",
    "dias": 90
   },
   {
    "breve": "4M",
    "dias": 120
   },
   {
    "breve": "6M",
    "dias": 180
   },
   {
    "breve": "1A",
    "dias": 365
   },
   {
    "breve": "2A",
    "dias": 730
   },
   {
    "breve": "3A",
    "dias": 1095
   },
   {
    "breve": "4A",
    "dias": 1460
   }
  ],
  "minDias": 7,
  "diasSet": [
   7,
   15,
   30,
   60,
   90,
   120,
   180,
   365,
   730,
   1095,
   1460
  ],
  "planesQueLaUsan": 46
 },
 "AASDF": {
  "denom": "Estrategia AA2000 día fijo",
  "unidad": "MON",
  "paquetes": [
   {
    "breve": "1M",
    "dias": 30
   },
   {
    "breve": "2M",
    "dias": 60
   },
   {
    "breve": "3M",
    "dias": 90
   },
   {
    "breve": "4M",
    "dias": 120
   },
   {
    "breve": "6M",
    "dias": 180
   },
   {
    "breve": "1A",
    "dias": 365
   },
   {
    "breve": "2A",
    "dias": 730
   },
   {
    "breve": "3A",
    "dias": 1095
   },
   {
    "breve": "4A",
    "dias": 1460
   },
   {
    "breve": "5A",
    "dias": 1825
   },
   {
    "breve": "6A",
    "dias": 2190
   },
   {
    "breve": "7A",
    "dias": 2555
   },
   {
    "breve": "8A",
    "dias": 2920
   }
  ],
  "minDias": 30,
  "diasSet": [
   30,
   60,
   90,
   120,
   180,
   365,
   730,
   1095,
   1460,
   1825,
   2190,
   2555,
   2920
  ],
  "planesQueLaUsan": 999
 },
 "AATCA": {
  "denom": "Estrategia TCA",
  "unidad": "D",
  "paquetes": [
   {
    "breve": "7",
    "dias": 7
   },
   {
    "breve": "15",
    "dias": 15
   },
   {
    "breve": "1M",
    "dias": 30
   },
   {
    "breve": "45",
    "dias": 45
   },
   {
    "breve": "2M",
    "dias": 60
   },
   {
    "breve": "3M",
    "dias": 90
   },
   {
    "breve": "4M",
    "dias": 120
   },
   {
    "breve": "5M",
    "dias": 150
   },
   {
    "breve": "6M",
    "dias": 180
   },
   {
    "breve": "1A",
    "dias": 365
   },
   {
    "breve": "2A",
    "dias": 730
   },
   {
    "breve": "3A",
    "dias": 1095
   },
   {
    "breve": "4A",
    "dias": 1460
   },
   {
    "breve": "5A",
    "dias": 1825
   }
  ],
  "minDias": 7,
  "diasSet": [
   7,
   15,
   30,
   45,
   60,
   90,
   120,
   150,
   180,
   365,
   730,
   1095,
   1460,
   1825
  ],
  "planesQueLaUsan": 0
 },
 "ECON": {
  "denom": "Estrategia consumo de energía",
  "unidad": "KWH",
  "paquetes": [
   {
    "breve": "10",
    "dias": 10
   },
   {
    "breve": "20",
    "dias": 20
   },
   {
    "breve": "60",
    "dias": 60
   }
  ],
  "minDias": 10,
  "diasSet": [
   10,
   20,
   60
  ],
  "planesQueLaUsan": 0
 },
 "EEDF": {
  "denom": "Programación exacta-dia fijado",
  "unidad": "MON",
  "paquetes": [
   {
    "breve": "1M",
    "dias": 30
   },
   {
    "breve": "2M",
    "dias": 60
   },
   {
    "breve": "3M",
    "dias": 90
   },
   {
    "breve": "12",
    "dias": 365
   }
  ],
  "minDias": 30,
  "diasSet": [
   30,
   60,
   90,
   365
  ],
  "planesQueLaUsan": 0
 },
 "ESTHS": {
  "denom": "Estrategia TCA  x HS",
  "unidad": "HRA",
  "paquetes": [
   {
    "breve": "3H",
    "dias": null
   },
   {
    "breve": "4H",
    "dias": null
   }
  ],
  "minDias": null,
  "diasSet": [],
  "planesQueLaUsan": 0
 },
 "PLMKM": {
  "denom": "Estrategia  KM",
  "unidad": "KM",
  "paquetes": [
   {
    "breve": "5K",
    "dias": null
   },
   {
    "breve": "10",
    "dias": 10
   },
   {
    "breve": "50",
    "dias": 50
   },
   {
    "breve": "12",
    "dias": 12
   }
  ],
  "minDias": 10,
  "diasSet": [
   10,
   12,
   50
  ],
  "planesQueLaUsan": 0
 },
 "TAGHS": {
  "denom": "Estrategia HS TAG",
  "unidad": "HRA",
  "paquetes": [
   {
    "breve": "2H",
    "dias": null
   },
   {
    "breve": "5H",
    "dias": null
   },
   {
    "breve": "1H",
    "dias": null
   },
   {
    "breve": "9H",
    "dias": null
   }
  ],
  "minDias": null,
  "diasSet": [],
  "planesQueLaUsan": 0
 },
 "UYDIA": {
  "denom": "UY Diarios CDA 5 Días",
  "unidad": "DÍA",
  "paquetes": [
   {
    "breve": "1D",
    "dias": null
   }
  ],
  "minDias": null,
  "diasSet": [],
  "planesQueLaUsan": 0
 }
};
