/* Medios de Elevación - Planes de Mantenimiento */

const MEDIOS_ELEVACION_PLANS = {
  ascensores_montacargas: {
    id: 'ascensores-montacargas',
    nombre: 'Ascensores / Montacargas Electromecánicos',
    tipo: 'Medios de Elevación',
    icon: '🛗',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'SALA DE MAQUINAS:',
          'Vibraciones y ruidos en la marcha',
          'Control maniobra de grupo',
          'Limpieza y orden de sala de maquinas',
          'Limpieza tableros de control',
          'Limpieza / funcionamiento Máquina/motor/motogen',
          'Limpieza / funcionamiento regulador',
          'Pérdida de aceite en máquinas',
          'Limpieza / funcionamiento Ventilador motor',
          'Verificar Funcionamiento de freno',
          'Verificar Agua / aceite en freno y filtraciones',
          'CABINA:',
          'Verificar conexión a tierra',
          'Limpieza de techo de cabina',
          'Funcionamiento iluminación y cielorraso',
          'Condición luz permanente y emergencia',
          'Funcionamiento ventilación de cabina',
          'Funcionamiento indicador de posición',
          'Prueba de alarmas de cabina',
          'Funcionamiento intercomunicadores',
          'Condición operador de puertas',
          'PASADIZO:',
          'Engrase de poleas en general',
          'Funcionamiento de puerta exterior',
          'Cerradura / contactos puerta exterior',
          'Condición de contactos eléctricos',
          'Amarre y tensión cables de tracción',
          'Corte llave seguridad de foso',
          'Condiciones Guiad. Cabina / contrapeso',
          'FOSO:',
          'Limpieza y condición gral. de foso',
          'Funcionamiento paragolpes hidráulico',
          'Condiciones fijación de paragolpes',
          'Lubricación de mecanismos en gral',
          'Limpieza poleas tensora / desvío'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'SALA DE MAQUINAS:',
          'Registro desgaste de poleas',
          'Registro Desgaste de cables',
          'Registro desgaste de escobillas',
          'PASADIZO:',
          'Limpieza de guías',
          'Conducto / Cable viajero',
          'Funcionamiento y lubricación del accionamiento de llaves límites',
          'FOSO:',
          'Limpieza y prueba de paracaídas',
          'Contr. Amarre cable viajero',
          'Amarre cables / cadena comp'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'SALA DE MAQUINAS:',
          'Mantenimiento de freno',
          'Incendio / grupo electrógeno',
          'Marcas de nivel en cables',
          'Marca sentido de giro en motor',
          'PASADIZO:',
          'Funcionamiento apert. emerg. puerta ext',
          'FOSO:',
          'Distancia compensación / piso',
          'Distancia contrapeso / paragolpes',
          'Distancia polea tensora / piso'
        ]
      }
    ]
  },

  escaleras_mecanicas: {
    id: 'escaleras-mecanicas',
    nombre: 'Escaleras Mecánicas / Caminos Rodantes',
    tipo: 'Medios de Elevación',
    icon: '🪜',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'GENERAL:',
          'Condición de funcionamiento: ruido, vibración',
          'Filtraciones de agua',
          'Funcionamiento dispositivos Parada de emergencia',
          'Verificar estado de limpieza exterior',
          'Velocidad del pasamanos respecto al escalón',
          'Tornillos de fijación, tapas, zócalos laterales',
          'Limpieza sala de máquinas superior e inferior',
          'SALA DE MÁQUINAS:',
          'Limpieza de máquina de propulsión',
          'Limpieza de tablero de control',
          'Funcionamiento correcto del tablero de control',
          'Lubricación de cadenas, engranajes y rodamientos',
          'Puesta a tierra',
          'Funcionamiento de freno',
          'EMBARQUE:',
          'Estado de los peines',
          'Iluminación de escalones sup. e inf. pasamanos',
          'Carteles de advertencia',
          'ESCALÓN:',
          'Huelgo entre escalón y zócalo'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'SALA DE MAQUINAS:',
          'Solo ext. Limpieza y lubricación manual cadena tractora',
          'Solo ext. Lubricación en perno de cadena tractora'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'GENERAL:',
          'Funcionamiento dispositivo de seguridad',
          'SALA DE MÁQUINAS:',
          'Tensión cadena principal',
          'Tensión cadena escalones',
          'Tensión cadena pasamanos',
          'Mantenimiento del freno',
          'Nivel de aceite máquina y lubricadores',
          'EMBARQUE:',
          'Luz entre escalones y peine'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Funcionamiento de rueda de los escalones',
          'Condición ruedas tractoras de los pasamanos',
          'Condición guías de pasamanos',
          'Limpieza y ajuste de guías de escalones',
          'Desgaste de pasamanos'
        ]
      }
    ]
  }
};
