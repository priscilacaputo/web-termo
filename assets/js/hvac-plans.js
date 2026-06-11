/* HVAC - Planes de Mantenimiento (VRF, Roof Tops, Splits, Autocontenidos) */

const HVAC_PLANS = {
  vrf_exterior: {
    id: 'vrf-exterior',
    nombre: 'VRF - Unidades Exteriores',
    tipo: 'HVAC',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificación y ajuste de los controles de seguridad y operación',
          'Limpieza de tableros eléctricos',
          'Ajuste de terminales eléctricos',
          'Verificación de estado de contactos principales de potencia',
          'Verificación del rendimiento del condensador',
          'Verificación del rendimiento del evaporador',
          'Ajustes menores referidos a asegurar la correcta secuencia de arranque y régimen de marcha normal',
          'Verificación de aislación de motores del compresor',
          'Verificación del estado del refrigerante',
          'Verificación de parámetros de funcionamiento',
          'Verificación de Niveles',
          'Control de estanqueidad de la unidad, verificación de posibles perdidas',
          'Revisión de eventos de operación mediante service checker',
          'Control de ruidos y vibraciones',
          'Medición de consumos eléctricos',
          'Verificación funcionamiento y ajuste de dispositivos de protección'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Hidrolavado de serpentinas de condensador',
          'Revisar estado y verificar posibles pérdidas entre uniones de cañerías'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Extracción y análisis de acidez del aceite de los compresores',
          'Medición y registro aislación eléctrica del motor del compresor'
        ]
      }
    ]
  },

  roof_top_bomba: {
    id: 'rooftop-bomba',
    nombre: 'Roof Top (F/C por Bomba)',
    tipo: 'HVAC',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Cambio de filtros de aire',
          'Verificar estado y Tensado de correas',
          'Verificar actuador y persiana de sistema contra incendio'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar alineación de poleas',
          'Verificar estado de turbina y rodamientos',
          'Verificar rodamientos de motores de ventiladores',
          'Controlar funcionamiento de los termostatos',
          'Limpieza de bandeja de condensado',
          'Verificar flujo de aire (350-450 CFM)',
          'Chequear fugas de aceite y refrigerante',
          'Controlar nivel de refrigerante',
          'Verificar ausencia de ruidos y vibraciones',
          'Verificar estado general del material',
          'Controlar estado de revestimiento de paneles',
          'Verificar estado de limpieza de serpentinas',
          'Medir consumo de compresores (todas las fases)',
          'Medir consumo de ventiladores',
          'Puesta en marcha y control de funcionamiento general'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Hidrolavado y peinado de serpentinas',
          'Verificar funcionamiento de calefactores de cárter',
          'Verificar válvulas inversoras según época',
          'Medir presión de trabajo (succión y descarga) circuitos 1-4',
          'Verificación y reapretado de conexiones eléctricas',
          'Control de etapa frío/calor',
          'Limpieza exterior del equipo',
          'Control y ajustes de presostatos y termostatos',
          'Medición de puesta a tierra',
          'Controlar y completar tornillos'
        ]
      }
    ]
  },

  splits: {
    id: 'splits',
    nombre: 'Splits de Salas Técnicas',
    tipo: 'HVAC',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificación de ausencia de ruidos y vibraciones',
          'Limpieza de filtros de aire',
          'Verificar bandeja de condensado y drenajes',
          'Verificar funcionamiento del secuenciador',
          'Verificar sets point de temperatura',
          'Registrar lectura de temperatura',
          'Realizar medición de consumo del compresor (3 fases)',
          'Realizar medición de consumo de ventiladores'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Verificar ausencia fuga de refrigerante',
          'Controlar y registrar presión alta con manifold',
          'Controlar y registrar presión baja con manifold',
          'Verificación y reapretado de conexiones eléctricas',
          'Hidrolavado y peinado de serpentina del condensador',
          'Controlar y completar tornillos',
          'Limpieza exterior del equipo'
        ]
      }
    ]
  },

  autocontenidos: {
    id: 'autocontenidos',
    nombre: 'Autocontenidos de Salas Técnicas',
    tipo: 'HVAC',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Reemplazar los filtros de aire',
          'Verificar funcionamiento del secuenciador',
          'Realizar medición de consumo del compresor (3 fases)',
          'Medir consumo del ventilador del evaporador',
          'Medir consumo del ventilador del condensador',
          'Verificar presiones del refrigerante si hay indicios de fugas',
          'Verificar escurrimiento de agua por drenaje'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Controlar y registrar presión Alta con manifold',
          'Controlar y registrar presión Baja con manifold',
          'Retirar el equipo',
          'Proteger conexiones eléctricas',
          'Hidrolavado de evaporador',
          'Hidrolavado de condensador',
          'Limpieza de rejas de retorno',
          'Limpieza de forzadores internos',
          'Lubricación ejes de forzadores',
          'Reinstalar el equipo',
          'Verificar funcionamiento'
        ]
      }
    ]
  }
};
