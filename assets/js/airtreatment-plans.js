/* Tratamiento de Aire - Planes de Mantenimiento (UTAs, Cortinas, Extractores) */

const AIRTREATMENT_PLANS = {
  uta: {
    id: 'uta',
    nombre: 'Unidades de Tratamiento de Aire (UTAs)',
    tipo: 'Tratamiento de Aire',
    icon: '🌬️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Cambio de filtros de aire',
          'Verificar estado y tensado de correas'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar correcto funcionamiento de manómetros y termómetros',
          'Verificar ausencia de ruidos y vibraciones',
          'Verificar y registrar salto térmico en serpentina',
          'Verificar estado general del material',
          'Verificar ausencia de fugas de agua',
          'Realizar control de funcionamiento de válvula modulante',
          'Verificar funcionamiento del variador de velocidad',
          'Tensado de correas y alineación de poleas',
          'Verificar estado/funcionamiento de turbina y rodamientos',
          'Verificar temperatura y estado de rodamientos',
          'Limpieza de bandeja de condensado'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Tomar temperatura de inyección y caudal de aire antes de hidrolavar',
          'Realizar hidrolavado y peinado de serpentinas',
          'Tomar temperatura de inyección y caudal aire después hidrolavar',
          'Verificar ajuste de puesta a tierra del equipo',
          'Realizar limpieza general y tareas de conservación'
        ]
      }
    ]
  },

  cortina_aire: {
    id: 'cortina-aire',
    nombre: 'Cortinas de Aire',
    tipo: 'Tratamiento de Aire',
    icon: '🌬️',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza de filtros (si posee)',
          'Limpieza interna y externa del gabinete',
          'Control de vibraciones',
          'Verificación estado de rodamientos',
          'Control del desplazamiento axial de turbinas',
          'Verificación y ajuste de borneras del tablero eléctrico',
          'Control y ajuste de bornera de comando',
          'Verificar protecciones y puesta a tierra',
          'Medir y registrar consumo (A) del motor N°1 (3 fases)',
          'Medir y registrar consumo (A) del motor N°2 (3 fases)',
          'Medir y registrar corriente de resistencia de calefacción'
        ]
      }
    ]
  },

  extractor_correa: {
    id: 'extractor-correa',
    nombre: 'Extractores/Ventiladores con Correa',
    tipo: 'Tratamiento de Aire',
    icon: '💨',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar balanceo y estado de turbina (vibraciones)',
          'Verificar estado y tensado de correas',
          'Verificar estado y alineación de poleas',
          'Verificar existencia de ruidos anormales en rodamientos',
          'Verificar estado de puesta a tierra',
          'Lubricar cojinetes',
          'Verificar ajuste de soportes',
          'Realizar limpieza del equipo',
          'Medir y registrar del consumo (A) del motor (3 fases)'
        ]
      }
    ]
  },

  extractor_directo: {
    id: 'extractor-directo',
    nombre: 'Extractores/Ventiladores de Transmisión Directa',
    tipo: 'Tratamiento de Aire',
    icon: '💨',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar balanceo y estado de turbina (vibraciones)',
          'Verificar existencia de ruidos anormales en rodamientos',
          'Verificar estado de puesta a tierra',
          'Verificar ajuste de soportes',
          'Realizar limpieza del equipo',
          'Medir y registrar del consumo (A) del motor (3 fases)'
        ]
      }
    ]
  }
};
