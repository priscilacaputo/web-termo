/* Otros Sistemas - Planes de Mantenimiento */

const OTROS_SISTEMAS_PLANS = {
  balanzas_plataforma: {
    id: 'balanzas-plataforma',
    nombre: 'Balanzas de Plataforma (Check-in)',
    tipo: 'Check-in',
    icon: '⚖️',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Verificación exterior de roturas',
          'Verificación de estado de cables, conexión entre balanza y display',
          'Cable de alimentación',
          'Control funcionamiento display (Si/No, Cero, Tara)',
          'Verificar tensión de fuentes de alimentación eléctrica',
          'Verificar cantidad y calidad de tensión de alimentación a placa electrónica',
          'Control de repetibilidad de peso: verificar valor de cinco pesadas consecutivas',
          'Dejar estabilizar entre cada una',
          'Controlar nivel de plataforma',
          'Controlar juego libre lateral de plataforma con mostradores',
          'Limpieza de entorno y equipo',
          'Chequear existencia y estado de etiqueta de codificado',
          'En caso de anomalía, realizar el correctivo con su correspondiente OT'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar la verificación periódica (VPE) a través de empresa auditada por INTI',
          'Según Resolución SCI 611/19',
          'Los ensayos según Resolución ex SC y NEI 2307/80',
          'Errores de Indicación',
          'Desvíos entre resultados',
          'Excentricidad',
          'Fidelidad',
          'Movilidad',
          'Efecto máximo del dispositivo de puesta a cero',
          'Ensayos supervisados por el INTI',
          'Entregar acta de verificación periódica elaborada por INTI',
          'Entregar Certificado de Verificación Periódica (VPE) emitido por INTI'
        ]
      }
    ]
  },

  tanques_combustible: {
    id: 'tanques-combustible',
    nombre: 'Tanques de Combustible (Grupos Generadores/Motobombas)',
    tipo: 'Almacenamiento de Combustible',
    icon: '⛽',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Verificar limpieza y estado externo',
          'Registrar cantidad actual de combustible en litros',
          'Verificar posibles pérdidas',
          'Anotar fecha de último cambio de combustible',
          'Purgar el tanque'
        ]
      }
    ]
  },

  batanes_combustible: {
    id: 'batanes-combustible',
    nombre: 'Batanes de Combustible',
    tipo: 'Almacenamiento de Combustible',
    icon: '🛢️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Inspeccionar la cisterna y chasis buscando signos de corrosión',
          'Si resultara positivo notificar y tomar una acción correctiva',
          'Verificar que las señales de seguridad estén en buen estado',
          'Capacidad de carga, capacidad máxima, peligro combustible',
          'Riesgo explosivo y nomenclatura del combustible según ONU',
          'De lo contrario proceder a recambiar',
          'Verificar estado de las cadenas de seguridad',
          'Verificar estado del indicador de nivel',
          'Verificar funcionamiento de la bomba de combustible',
          'Verificar vibraciones y ruidos en rodamientos',
          'Verificar estado del sello mecánico de la bomba',
          'Verificar estado de cables y pinzas de alimentación',
          'Verificar estado del filtro del conjunto surtidor',
          'Verificar presencia y estado del balde de arena',
          'Verificar funcionamiento de luces de stop, giro, balizas y posición',
          'Inspección del cableado y conexiones',
          'Comprobar funcionamiento del crique en lanza',
          'Lubricar partes móviles de ser necesario',
          'Verificar estado de paragolpes y guardabarros',
          'Inspeccionar estado del eje macizo',
          'Verificar estado de los rodamientos cónicos',
          'Verificar estado y funcionamiento del conjunto de freno inercial',
          'Controlar existencia y estado de las tuercas de fijación de la llanta',
          'Verificar estado de todo el conjunto elástico de suspensión',
          'Inspeccionar estado de neumáticos (banda de rodadura, hombro y flanco)',
          'Verificar profundidad del dibujo no sea inferior a 1,6 mm',
          'Verificar estado de la cubierta de auxilio y su soporte',
          'Verificar estado de accesorios de cisterna (boca de carga, inspección)',
          'Inspeccionar interior del tanque retirando la boca de inspección',
          'Verificar presencia de corrosión, combustible degradado',
          'Presencia de condensado, en caso afirmativo proceder a limpieza'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Verificar presencia de corrosión externa',
          'Si presenta signos incipientes o cambios notables que afecten la identificación',
          'Efectuar control de espesores si es necesario',
          'Verificar si presenta abolladuras, rayones o globos',
          'Realizar ensayos no destructivos si es necesario',
          'Verificar si se encuentra en buen estado la marca del nivel de llenado',
          'Si está conectado o funciona correctamente el sensor de sobrellenado',
          'Verificar si es correcto el montaje de la cisterna sobre el chasis',
          'Verificar si posee bulones y/o abrazaderas de fijación del sistema de amortiguación',
          'Verificar si posee bocas de carga, si cuenta con protección antivuelco',
          'Verificar el material tiene el mismo espesor que el tanque',
          'Verificar si la soldadura a la estructura del tanque es de cordones sin repelar',
          'Verificar si la protección antivuelco es eficiente y está en buen estado',
          'Verificar que sea seguro el acceso a las bocas de carga',
          'Verificar que la escalera se encuentra en buenas condiciones',
          'Verificar existencia y material antideslizante en toda el área de circulación',
          'Verificar que la tapa superior de las bocas de inspección impida la salida del producto',
          'Verificar que no deben tener tapas roscadas',
          'Verificar que las válvulas de descarga estén ubicadas en la parte trasera',
          'Verificar si están dispuestas para carga ventral, si son herméticas',
          'Verificar si están en buen estado las juntas y las tapas',
          'Verificar si se encuentran en posición correcta',
          'Verificar si es adecuada la protección estructural contra choques traseros',
          'Verificar si es eficiente la protección estructural contra vuelcos',
          'Verificar que las válvulas de venteo estén colocadas y funcionen correctamente',
          'Verificar que la cisterna posea planchuelas para conectar la descarga estática',
          'Verificar que estén en buen estado',
          'Verificar si la unidad posee cadenas o colas ruteras para descarga estática',
          'Verificar si la instalación eléctrica es resistente a la corrosión, aislada',
          'Verificar si está protegida contra posibles daños físicos',
          'Si las cajas de la instalación son de fundición de aluminio y estancas',
          'Verificar si las conexiones tienen terminales soldados',
          'Verificar si los tornillos cuentan con arandelas planas y de presión',
          'Verificar si los cables de la instalación son del tipo antillamas',
          'Verificar si las uniones son soldadas',
          'Verificar existencia y tipo de matafuegos',
          'Verificar que la unidad disponga de leyendas, peligro inflamable',
          'Verificar que esté indicada la capacidad de cada compartimiento',
          'Verificar que cumpla con las resoluciones SST N°233 y 720',
          'Identificación de Riesgo y N° ONU',
          'Verificar que dispone de la ficha de intervención correspondiente',
          'Entregar protocolo de auditoria con firma del responsable técnico'
        ]
      },
      {
        label: 'Bienal',
        color: '#8b5cf6',
        tareas: [
          'Verificar que las paredes no presenten áreas corroídas, gastadas o con rajaduras',
          'Verificar que las soldaduras internas no presenten fisuras visibles',
          'Verificar que el fondo no presenta áreas corroídas, gastadas o con rajaduras',
          'Verificar que no presente abolladuras importantes',
          'Entregar protocolo de auditoria con firma del responsable técnico'
        ]
      },
      {
        label: 'Quinquenal',
        color: '#a78bfa',
        tareas: [
          'PRUEBA DE ESTANQUEIDAD:',
          'Registrar los valores de presión inicial y final',
          'Registrar el tiempo de duración del ensayo',
          'Efectuar las observaciones que correspondan',
          'Verificación mediante prueba neumática usando Nitrógeno (N2)',
          'Conectada a una de las bocas de descarga',
          'A una presión de 200 gr/cm2',
          'Resultando satisfactoria cuando mantiene la presión',
          'Durante un periodo de 30 min',
          'VERIFICACIÓN DE ESPESORES:',
          'Realizar un entramado del tanque cisterna',
          'Tomar como vista lateral izquierda el correspondiente a la ubicación del conductor',
          'Como (grilla costado derecho) el opuesto',
          'Como vista frontal (grilla anterior) y como posterior (grilla posterior)',
          'Todos los valores de la medición expresados en milímetros (mm)',
          'El auditor debe calibrar el detector de espesores por ultrasonido',
          'Proceder a tomar mediciones conforme a la grilla correspondiente',
          'Consignar todos los valores alcanzados en cada cisterna',
          'Cada reticulado corresponderá a un sector de la envolvente',
          'Determinar si las mediciones efectuadas son satisfactorias',
          'Entregar protocolo de auditoria con firma del responsable técnico'
        ]
      }
    ]
  },

  puertas_automaticas: {
    id: 'puertas-automaticas-otros',
    nombre: 'Puertas Automáticas (Complementario)',
    tipo: 'Otros',
    icon: '🚪',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza y verificación de ruedas excéntricas',
          'Efectuar control y ajuste de correa de transmisión',
          'Limpieza y verificación de guías',
          'Limpieza y verificación de barreras fotoeléctricas',
          'Limpieza y verificación del elemento de detección',
          'Calibración de holgura de cerrojo',
          'Accionar y ajustar sistema antipánico',
          'Verificar estado de los burletes de cierre',
          'Lubricar mecanismos'
        ]
      }
    ]
  },

  regulacion_gas: {
    id: 'regulacion-gas',
    nombre: 'Planta de Regulación Secundaria de Gas (Subestación)',
    tipo: 'Otros',
    icon: '🔌',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Inspección visual de puertas, portones, cámaras',
          'Equipos de ventilación (si posee) y líneas de control/sensores',
          'Verificar ausencia de pérdidas de gas mediante detector portátil',
          'Si existiese alguna detección positiva comprobar con solución jabonosa',
          'Tener la ubicación exacta de la pérdida',
          'Proceder a su reparación',
          'Verificar ausencia de corrosión en estructuras y cañerías',
          'Repintar de ser necesario',
          'Verificar existencia y estado de esquemas informativos de la instalación',
          'Alternar ramal de trabajo, en caso de que existiese',
          'Verificar correcta posición de válvulas de bloqueo de entrada, salida',
          'Instrumentación y by-pass',
          'Verificar estado y funcionamiento de manómetros, reguladora de gas',
          'Medidor, dispositivos de alivio y dispositivos de seguridad',
          'Verificar que la presión del manómetro aguas debajo del regulador',
          'Se encuentre dentro del rango adecuado'
        ]
      },
      {
        label: 'Quinquenal',
        color: '#8b5cf6',
        tareas: [
          'Reemplazo de partes blandas de la reguladora (Sellos dinámicos y diafragma)',
          'Limpieza y/o reemplazo de elementos filtrantes',
          'Verificar el funcionamiento de la reguladora',
          'Comprobar lectura de manómetro aguas abajo luego de la intervención'
        ]
      }
    ]
  }
};
