/* Cintas Transportadoras - Planes de Mantenimiento */

const CINTAS_TRANSPORTADORAS_PLANS = {
  cintas_balanzas: {
    id: 'cintas-balanzas',
    nombre: 'Cintas Balanzas',
    tipo: 'Cintas Transportadoras',
    icon: '⚖️',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Mototambor',
          'Verificar ausencia de ruidos y vibraciones',
          'Verificar estado de mototambor, bastidores, carenados, elementos fijos y móviles',
          'Verificar centrado, tensado y vulcanizado de la banda',
          'Verificar la correcta puesta a tierra del equipo',
          'Verificar estado y ajuste de los elementos de detección',
          'Limpieza total del equipo y sector',
          'Controlar funcionamiento y estado de displays y pulsadores',
          'Control de alojamiento bajo-mostrador, evitar acumulación de papeles',
          'Verificar existencia y estado de oblea INTI',
          'Chequear existencia y estado de etiqueta de codificado'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar la verificación periódica (VPE) a través de empresa auditada por INTI',
          'Ensayos según Resolución ex SC y NEI 2307/80',
          'Errores de Indicación',
          'Desvíos entre resultados',
          'Excentricidad',
          'Fidelidad',
          'Movilidad',
          'Efecto máximo del dispositivo de puesta a cero',
          'Entregar acta de verificación periódica elaborada por INTI',
          'Entregar Certificado de Verificación Periódica (VPE) emitido por INTI'
        ]
      }
    ]
  },

  cintas_inyectoras: {
    id: 'cintas-inyectoras',
    nombre: 'Cintas Inyectoras',
    tipo: 'Cintas Transportadoras',
    icon: '⚖️',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Mototambor',
          'Verificar ausencia de ruidos y vibraciones',
          'Verificar estado de mototambor, bastidores, carenados, elementos fijos y móviles',
          'Verificar centrado, tensado y vulcanizado de la banda',
          'Limpieza de superficie de banda',
          'Verificar la correcta puesta a tierra del equipo',
          'Verificar estado y ajuste de los elementos de detección',
          'Limpieza total del equipo y sector',
          'Verificar estado y funcionamiento de pulsadores de comando',
          'Chequear existencia y estado de etiqueta de codificado'
        ]
      }
    ]
  },

  cintas_tramos_rectos: {
    id: 'cintas-tramos-rectos',
    nombre: 'Cintas Tramos Rectos (Patio de Valijas)',
    tipo: 'Cintas Transportadoras',
    icon: '➡️',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L1',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L2',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L3',
          'Inspección y limpieza de motorreductor, bastidores, carenados',
          'Verificar posibles pérdidas o transpiración de aceite. Control de nivel',
          'Verificar ausencia de ruidos o vibraciones',
          'Verificar estado y funcionamiento de interruptor local',
          'Verificar estado y funcionamiento de parada de emergencia',
          'Verificar estado y funcionamiento de pulsador de rearme',
          'Control de funcionamiento de guiadores de banda',
          'Verificar estado y funcionamiento de pulsadores locales de comando',
          'Verificar centrado, tensado y vulcanizado de la banda',
          'Verificar funcionamiento y ajuste de los elementos de detección',
          'Chequear existencia y estado de etiqueta de codificado',
          'Verificación/ajuste de elementos de fijación',
          'Limpieza total del equipo y sector'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar mediciones de vibraciones con analizador MA-2070-C en 4 puntos',
          'Medir y registrar velocidad (mm/seg) en Motor Lado Libre',
          'Medir y registrar aceleración (g) en Motor Lado Libre',
          'Medir y registrar velocidad (mm/seg) en Motor Lado Acople',
          'Medir y registrar aceleración (g) en Motor Lado Acople',
          'Medir y registrar velocidad (mm/seg) en Reductor Lado Libre',
          'Medir y registrar aceleración (g) en Reductor Lado Libre',
          'Medir y registrar velocidad (mm/seg) en Reductor Lado Acople',
          'Medir y registrar aceleración (g) en Reductor Lado Acople'
        ]
      }
    ]
  },

  cintas_tramos_curvos: {
    id: 'cintas-tramos-curvos',
    nombre: 'Cintas Tramos Curvos',
    tipo: 'Cintas Transportadoras',
    icon: '🔄',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L1',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L2',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L3',
          'Inspección y limpieza de motorreductor, bastidores, carenados',
          'Verificar posibles pérdidas o transpiración de aceite',
          'Verificar ausencia de ruidos o vibraciones',
          'Verificar estado y funcionamiento de interruptor local',
          'Verificar estado y funcionamiento de parada de emergencia',
          'Verificar centrado, tensado y vulcanizado de la banda',
          'Verificación de estado de guía siliconada',
          'Verificación de correcta posición y estado de holders',
          'Limpieza de rodamientos guía siliconada',
          'Verificación de correcta posición de elevadores de banda',
          'Verificar funcionamiento y ajuste de los elementos de detección',
          'Verificación/ajuste de elementos de fijación',
          'Chequear existencia y estado de etiqueta de codificado',
          'Limpieza total del equipo y sector'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar mediciones de vibraciones con analizador MA-2070-C en 4 puntos',
          'Medir velocidad y aceleración en Motor Lado Libre',
          'Medir velocidad y aceleración en Motor Lado Acople',
          'Medir velocidad y aceleración en Reductor Lado Libre',
          'Medir velocidad y aceleración en Reductor Lado Acople'
        ]
      }
    ]
  },

  brazos_desviadores: {
    id: 'brazos-desviadores-vb',
    nombre: 'Brazos Desviadores (VB)',
    tipo: 'Cintas Transportadoras',
    icon: '🎯',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Verificar presencia de polvo y suciedad en motorreductor',
          'Verificar daños y ruidos inusuales',
          'Verifique el desgaste de la banda',
          'Compruebe la tensión de la correa',
          'Verifique el motorreductor en busca de pérdidas de aceite',
          'Verificar el motorreductor en busca de ruidos extraños'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L1',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L2',
          'Medir y registrar el consumo de corriente del Motorreductor - Fase L3',
          'Comprobar la tensión de la banda',
          'Revisar fijación y funcionamiento de las fotocélulas',
          'Inspección el desgaste de los rodamientos',
          'Verificar las piezas móviles en busca de daños',
          'Comprobar los tapones de ventilación de los motorreductores',
          'Verificar correcta puesta a tierra del equipo',
          'Verificar estado y funcionamiento de paradas de emergencia',
          'Chequear existencia y estado de etiqueta de codificado'
        ]
      }
    ]
  },

  persianas_gateras: {
    id: 'persianas-gateras',
    nombre: 'Persianas de Gateras',
    tipo: 'Cintas Transportadoras',
    icon: '🪟',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar estado de láminas de cortina',
          'Verificar alineación y ajuste de fotocélula y reflectivo',
          'Verificar correcto accionamiento de switch de tope superior e inferior',
          'Subir y bajar cortina en forma manual',
          'Limpieza y lubricación de guías',
          'Ajuste y limpieza de cobertor superior'
        ]
      }
    ]
  },

  cama_rodillos: {
    id: 'cama-rodillos',
    nombre: 'Cama de Rodillos',
    tipo: 'Cintas Transportadoras',
    icon: '⚙️',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Inspección elementos faltantes o deteriorados',
          'Verificar libre giro y estado de los rodamientos de los rodillos',
          'Verificar estado, funcionamiento y ajuste de elementos de detección',
          'Chequear existencia y estado de etiqueta de codificado',
          'Verificación/ajuste de elementos de fijación',
          'Limpieza total del equipo y sector'
        ]
      }
    ]
  },

  cintas_carruseles: {
    id: 'cintas-carruseles',
    nombre: 'Cintas Carruseles',
    tipo: 'Cintas Transportadoras',
    icon: '🎠',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Motorreductor N°1 (todas las fases)',
          'Medir y registrar el consumo de corriente del Motorreductor N°2 (todas las fases)',
          'Verificar estado de placas de goma y protecciones metálicas',
          'Verificar ausencia de pérdidas de aceite en reductor',
          'Ensayo del control de parada de emergencia',
          'Ensayo de parada automática desde el sensor',
          'Verificar estado y tensión de banda de fricción',
          'Verificar estado de componentes (ruedas, resortes)',
          'Verificar altura de cepillos limpiadores de guías',
          'Control de cadena de placas y ruedas de centrado',
          'Verificar ajuste de carros porta placas a cadena de tracción',
          'Permutar funcionamiento grupo motor',
          'Verificar estado y funcionamiento de sensores de hueco',
          'Verificar estado y funcionamiento de pulsadores de arranque y parada',
          'Verificar estado y funcionamiento de señales visuales y sonoras',
          'Control de funcionamiento y estado de cortinas y puertas de gateras',
          'Medición de corriente eléctrica del motor',
          'Control de ajuste de protecciones eléctricas',
          'Ajuste de borneras en tablero y motor',
          'Notificar novedades'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar mediciones de vibraciones con analizador MA-2070-C en 4 puntos de los conjuntos motor-reductor',
          'Medir velocidad y aceleración en Motor N°1 (Lado Libre y Lado Acople)',
          'Medir velocidad y aceleración en Reductor N°1 (Lado Libre y Lado Acople)',
          'Medir velocidad y aceleración en Motor N°2 (Lado Libre y Lado Acople)',
          'Medir velocidad y aceleración en Reductor N°2 (Lado Libre y Lado Acople)'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Medir y registrar el Diámetro de las ruedas apoyo de placas',
          'Medir y registrar el Diámetro del excéntrico sup. parte cilíndrica',
          'Medir y Registrar el Diámetro del excéntrico sup. parte excéntrica',
          'Medir y registrar el Diámetro del excéntrico inf. parte cilíndrica',
          'Medir y Registrar el Diámetro del excéntrico inf. parte excéntrica',
          'Verificar estado de ruedas',
          'Verificar estado de carros portaplacas',
          'Limpieza de espacio ocupado y de tránsito',
          'Limpieza exterior de motorreductores',
          'Limpieza de unidades de presión',
          'Limpieza de elementos de la cadena',
          'Limpieza de correas de transmisión',
          'Limpieza de rodamientos de bolas',
          'Limpieza de placas TT-TF',
          'Limpieza de poleas',
          'Ajustar tornillería',
          'Ajustar elementos de protección de seguridad',
          'Ajustar elementos de accionamiento',
          'Ajustar elementos de prevención',
          'Ajustar elementos de cadena',
          'Ajustar unidades de presión',
          'Ajustar correas de transmisión',
          'Ajustar poleas de accionamiento',
          'Reparar daños en bastidores y carenados',
          'Reparar desperfectos en plataformas, escaleras, barandillas',
          'Eliminar ruidos en elementos móviles',
          'Eliminar rozamientos de elementos móviles con elementos fijos',
          'Eliminar pérdida de lubricante en elementos de accionamiento',
          'Engrasar rodamientos de bolas',
          'Completar depósitos y reductores de aceites o lubricantes',
          'Engrasar guías y elementos móviles',
          'Engrasar tensores',
          'Verificar acuse de alarmas en Pantalla Táctil',
          'Verificar funcionamiento de elementos y mecanismos',
          'Verificar estado de cajas de conexiones',
          'Ajustar elementos de detección',
          'Ajustar conexionado de elementos',
          'Notificar novedades'
        ]
      },
      {
        label: 'Trienal',
        color: '#8b5cf6',
        tareas: [
          'Reemplazar aceite de los motorreductores'
        ]
      }
    ]
  }
};
