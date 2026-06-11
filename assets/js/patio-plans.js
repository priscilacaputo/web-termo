/* Patio de Valijas - Planes de Mantenimiento (Sistema BHS) */

const PATIO_PLANS = {
  cintas: {
    id: 'cintas-bhs',
    nombre: 'Cintas Transportadoras (BF)',
    tipo: 'Patio de Valijas',
    icon: '🎀',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección visual de la cinta y estructura',
          'Verificar ausencia de objetos extraños',
          'Controlar tensión de la cinta',
          'Verificar alineación de rodillos'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de estructura',
          'Verificar estado de rodamientos',
          'Chequear motor y transmisión',
          'Revisar sistemas de seguridad',
          'Lubricación de puntos de articulación',
          'Medir consumo eléctrico (3 fases)'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección exhaustiva de rodillos y poleas',
          'Verificar integridad de estructura portante',
          'Control de posibles fugas hidráulicas',
          'Revisión de sistemas de freno',
          'Prueba de parada de emergencia',
          'Verificar guardias de protección',
          'Limpieza y lubricación de cadenas'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Reemplazo de cinta si presenta desgaste',
          'Revisión completa de componentes mecánicos',
          'Análisis de vibraciones',
          'Verificación de aislación eléctrica',
          'Calibración de sensores',
          'Repintura de estructuras oxidadas',
          'Certificación de seguridad'
        ]
      }
    ]
  },

  curvas: {
    id: 'curvas-bhs',
    nombre: 'Cintas Curvas (BC)',
    tipo: 'Patio de Valijas',
    icon: '🎀',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección visual de cinta y estructura',
          'Verificar funcionamiento de curva',
          'Controlar tensión uniforme',
          'Revisar ausencia de desalineaciones'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza de la estructura de curva',
          'Verificar estado de rodamientos directrices',
          'Chequear motor y variador de velocidad',
          'Revisar sistemas de seguridad perimetral',
          'Lubricación de puntos críticos',
          'Medición de consumo eléctrico',
          'Control de inclinación de la curva'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección de rodillos directrices',
          'Verificar alineación de la curva',
          'Control de fricción de la cinta',
          'Revisión de guardias y protecciones',
          'Prueba de sistemas de freno',
          'Verificar funcionamiento de sensores',
          'Limpieza profunda de poleas'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Reemplazo de cinta si es necesario',
          'Revisión estructural completa',
          'Verificación de ángulos de curvatura',
          'Análisis vibratorio de la curva',
          'Pruebas de carga máxima',
          'Inspección de soldaduras',
          'Certificación de funcionamiento seguro'
        ]
      }
    ]
  },

  desviadores: {
    id: 'desviadores-bhs',
    nombre: 'Brazos Desviadores (VB)',
    tipo: 'Patio de Valijas',
    icon: '🎯',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección visual del brazo',
          'Verificar movimiento suave',
          'Controlar tensión de la cinta',
          'Revisar alineación con la cinta principal'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza de brazo desviador',
          'Verificar cilindro neumático/hidráulico',
          'Chequear válvulas de control',
          'Revisar sensores de posición',
          'Lubricación de articulaciones',
          'Medición de presión (si aplica)',
          'Control de alineación'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección exhaustiva del brazo',
          'Verificar integridad estructural',
          'Control de fugas en cilindros',
          'Revisión de válvulas solenoides',
          'Prueba de movimiento completo',
          'Verificar guardias de seguridad',
          'Limpieza profunda y lubricación'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del sistema de accionamiento',
          'Reemplazo de sellos si es necesario',
          'Calibración de sensores',
          'Análisis de fuerzas de accionamiento',
          'Inspección de soldaduras',
          'Pruebas de precisión de desviación',
          'Verificación de tiempos de respuesta'
        ]
      }
    ]
  },

  scanner: {
    id: 'scanner-bhs',
    nombre: 'Scanner y Lector de Códigos',
    tipo: 'Patio de Valijas',
    icon: '📡',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Limpieza de lente del scanner',
          'Verificación de lecturas',
          'Test de códigos de prueba',
          'Revisión de conexiones'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Inspección completa del equipo',
          'Calibración del scanner',
          'Verificación de base de datos de códigos',
          'Revisión de cables y conectores',
          'Test de confiabilidad de lectura',
          'Limpieza profunda de óptica'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Análisis de tasa de errores de lectura',
          'Verificación de velocidad de procesamiento',
          'Revisión de software del scanner',
          'Calibración fina de óptica',
          'Test con códigos dañados',
          'Verificación de iluminación LED'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del sistema óptico',
          'Actualización de firmware si disponible',
          'Análisis estadístico de lecturas',
          'Reemplazo de LED si es necesario',
          'Verificación de óptica interna',
          'Pruebas de confiabilidad exhaustivas',
          'Documentación de rendimiento'
        ]
      }
    ]
  },

  rodillos: {
    id: 'rodillos-bhs',
    nombre: 'Camas de Rodillos (GR)',
    tipo: 'Patio de Valijas',
    icon: '⚙️',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección visual de rodillos',
          'Verificar rotación libre',
          'Revisar ausencia de detritus',
          'Control de alineación'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza de cama de rodillos',
          'Verificar estado de rodamientos',
          'Chequear alineación de todos los rodillos',
          'Revisar ausencia de corrosión',
          'Lubricación de rodamientos',
          'Control de presión (si aplica)'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección individual de cada rodillo',
          'Verificar velocidad de rotación',
          'Control de juego en rodamientos',
          'Revisión de integridad de estructura',
          'Limpieza profunda',
          'Lubricación completa'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Reemplazo de rodillos desgastados',
          'Inspección de eje de soporte',
          'Verificación de chumaceras',
          'Análisis de vibración',
          'Repintura de estructura',
          'Calibración de sensores de carga',
          'Certificación de funcionamiento'
        ]
      }
    ]
  }
};
