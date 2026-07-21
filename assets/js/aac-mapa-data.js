/* ─── Mapa interactivo de Equipos de Aire — AEP ─────────────
   Puntos ubicados sobre los planos (plano de techo + plano de
   sector abastecido) de cada edificio. Coordenadas x/y en
   porcentaje relativo a la imagen del plano. */

const AAC_MAPA_DATA = {
  '7': {
    label: 'Edificio 7',
    imagen: 'assets/img/aac-mapa-ed7.jpg',
    puntos: [
      /* Plano de techo — unidades individuales */
      { x: 24.50, y: 25.23, nombre: 'B1',   equipos: ['AAC9429'] },
      { x: 26.43, y: 25.27, nombre: 'B2',   equipos: ['AAC9428'] },
      { x: 29.21, y: 25.27, nombre: 'B6-2', equipos: ['AAC9427'] },
      { x: 30.87, y: 25.39, nombre: 'B6-1', equipos: ['AAC9426'] },
      { x: 33.14, y: 25.30, nombre: 'B5-2', equipos: ['AAC9425'] },
      { x: 34.73, y: 25.23, nombre: 'B5-1', equipos: ['AAC9424'] },
      { x: 22.70, y: 28.69, nombre: 'W1',   equipos: ['AAC9431'] },
      { x: 22.95, y: 30.95, nombre: 'W2',   equipos: ['AAC9430'] },

      /* Plano de sector abastecido — zonas (agrupan las unidades de arriba) */
      { x: 23.62, y: 57.48, nombre: 'Arribos inter. público (RFT B1-B2)',       equipos: ['AAC9429', 'AAC9428'] },
      { x: 25.69, y: 68.99, nombre: 'Arribos inter. — Lado Río (W2)',          equipos: ['AAC9430'] },
      { x: 31.90, y: 74.10, nombre: 'Box Migraciones (RFT B6-1 B6-2)',          equipos: ['AAC9426', 'AAC9427'] },
      { x: 25.18, y: 78.85, nombre: 'Arribos inter. — Lado Pista (W1)',        equipos: ['AAC9431'] },
      { x: 42.72, y: 68.99, nombre: 'Arribos aduana (RFT B5-1 B5-2)',           equipos: ['AAC9424', 'AAC9425'] },
    ],
  },

  /* Edificio 5 y Edificio 6 comparten el mismo plano (incluye Planta Baja,
     Primer Piso y Planta Alta — techo), por eso ambos usan la misma imagen
     completa — cada uno muestra sólo sus propios RTF, ubicados en la franja
     de "Planta Alta" del plano. */
  '5': {
    label: 'Edificio 5',
    imagen: 'assets/img/aac-mapa-ed5-ed6.jpg',
    puntos: [
      /* Núcleo 1 - Terraza */
      { x: 39.39, y: 79.31, nombre: '1Y',  equipos: ['AAC3480'] },
      { x: 40.04, y: 79.26, nombre: '9A',  equipos: ['AAC2273'] },
      { x: 41.34, y: 79.29, nombre: '9C',  equipos: ['AAC2274'] },
      { x: 42.04, y: 79.37, nombre: '1C',  equipos: ['AAC2271'] },
      { x: 39.50, y: 80.50, nombre: '2Y',  equipos: ['AAC3481'] },
      { x: 40.33, y: 80.60, nombre: '9B',  equipos: ['AAC3835'] },
      { x: 41.30, y: 80.57, nombre: '13A', equipos: ['AAC3478'] },
      { x: 41.95, y: 80.63, nombre: '2A',  equipos: ['AAC2272'] },
      { x: 39.42, y: 81.90, nombre: '3Y',  equipos: ['AAC3482'] },
      { x: 40.01, y: 81.76, nombre: '12A', equipos: ['AAC3477'] },
      { x: 40.97, y: 81.85, nombre: '13B', equipos: ['AAC3479'] },
      { x: 39.84, y: 84.52, nombre: '11C', equipos: ['AAC3838'] },
      { x: 40.51, y: 84.55, nombre: '11B', equipos: ['AAC3837'] },
      { x: 42.05, y: 84.59, nombre: '4B',  equipos: ['AAC3834'] },
      { x: 40.54, y: 85.81, nombre: '11A', equipos: ['AAC3836'] },
      { x: 41.88, y: 85.67, nombre: '3B',  equipos: ['AAC2065'] },
      /* Núcleo 2 - Terraza */
      { x: 53.86, y: 80.66, nombre: '1A',  equipos: ['AAC2261'] },
      { x: 53.85, y: 81.97, nombre: '1B',  equipos: ['AAC2262'] },
      { x: 54.65, y: 81.97, nombre: '2B',  equipos: ['AAC2263'] },
      { x: 55.45, y: 82.00, nombre: '2C',  equipos: ['AAC3832'] },
      { x: 54.69, y: 84.93, nombre: '4A',  equipos: ['AAC3833'] },
    ],
  },
  '6': {
    label: 'Edificio 6',
    imagen: 'assets/img/aac-mapa-ed5-ed6.jpg',
    puntos: [
      /* Sector UTA 5 */
      { x: 60.32, y: 80.57, nombre: '5C', equipos: ['AAC2266'] },
      { x: 61.15, y: 80.57, nombre: '5D', equipos: ['AAC2267'] },
      { x: 62.01, y: 80.57, nombre: '5A', equipos: ['AAC2264'] },
      { x: 62.84, y: 80.57, nombre: '5B', equipos: ['AAC2265'] },
      { x: 60.30, y: 81.58, nombre: '7A', equipos: ['AAC2717'] },
      { x: 61.16, y: 81.58, nombre: '7B', equipos: ['AAC2718'] },
      { x: 61.99, y: 81.58, nombre: '8A', equipos: ['AAC2719'] },
      { x: 62.85, y: 81.58, nombre: '8B', equipos: ['AAC2720'] },
      /* Núcleo 3 - Terraza */
      { x: 64.15, y: 87.07, nombre: '6E', equipos: ['AAC2070'] },
      { x: 64.99, y: 87.04, nombre: '6D', equipos: ['AAC2069'] },
      { x: 65.83, y: 87.07, nombre: '6C', equipos: ['AAC2068'] },
      { x: 66.67, y: 87.06, nombre: '6B', equipos: ['AAC2067'] },
      { x: 57.33, y: 87.04, nombre: '6A', equipos: ['AAC2066'] },
      { x: 69.97, y: 83.40, nombre: 'A6', equipos: ['AAC2077'] },
      { x: 69.97, y: 84.10, nombre: 'A5', equipos: ['AAC2076'] },
      { x: 69.87, y: 84.79, nombre: 'G6', equipos: ['AAC2734'] },
      { x: 69.87, y: 85.42, nombre: 'G7', equipos: ['AAC2735'] },
      { x: 67.86, y: 86.40, nombre: 'G8', equipos: ['AAC2075'] },
      { x: 68.58, y: 86.43, nombre: 'G5', equipos: ['AAC2074'] },
      { x: 69.34, y: 86.41, nombre: 'G4', equipos: ['AAC2073'] },
      { x: 70.06, y: 86.43, nombre: 'G3', equipos: ['AAC2072'] },
    ],
  },

  /* Edificio 4: el plano trae "Roof Top N°1 y 2 - Trane" sobre UTA 15/16/17/18
     y "Roof Top N°1/N°2 - LG" en Planta Baja, pero esos equipos no están
     cargados en el sistema (no tienen AAC asociado) — se omiten. Se mapean
     las 17 UTA, que sí están todas en la base y correctamente rotuladas. */
  '4': {
    label: 'Edificio 4',
    imagen: 'assets/img/aac-mapa-ed4.jpg',
    puntos: [
      /* Planta Alta */
      { x: 36.62, y: 27.06, nombre: 'UTA 8',  equipos: ['AAC2139'] },
      { x: 53.19, y: 27.27, nombre: 'UTA 9',  equipos: ['AAC2141'] },
      { x: 69.81, y: 26.89, nombre: 'UTA 10', equipos: ['AAC2143'] },
      { x: 37.41, y: 30.84, nombre: 'UTA 11', equipos: ['AAC2138'] },
      { x: 53.45, y: 32.48, nombre: 'UTA 12', equipos: ['AAC2140'] },
      { x: 69.72, y: 30.50, nombre: 'UTA 13', equipos: ['AAC2142'] },
      { x: 76.07, y: 35.21, nombre: 'UTA 14 (Sala VIP)', equipos: ['AAC2137'] },
      { x: 40.29, y: 43.92, nombre: 'UTA 5',  equipos: ['AAC2133'] },
      { x: 55.73, y: 43.92, nombre: 'UTA 6',  equipos: ['AAC2134'] },
      { x: 72.56, y: 43.92, nombre: 'UTA 7',  equipos: ['AAC2135'] },
      { x: 75.84, y: 39.43, nombre: 'UTA 20', equipos: ['AAC2136'] },
      /* Planta Baja */
      { x: 43.92, y: 80.45, nombre: 'UTA 1-A', equipos: ['AAC2131'] },
      { x: 57.29, y: 80.36, nombre: 'UTA 1-B', equipos: ['AAC2132'] },
      { x: 47.35, y: 86.05, nombre: 'UTA 2-A', equipos: ['AAC2128'] },
      { x: 54.69, y: 86.50, nombre: 'UTA 2-B', equipos: ['AAC2129'] },
      { x: 36.38, y: 88.74, nombre: 'UTA 3',   equipos: ['AAC2127'] },
      { x: 71.42, y: 88.96, nombre: 'UTA 4',   equipos: ['AAC2130'] },
    ],
  },
};
