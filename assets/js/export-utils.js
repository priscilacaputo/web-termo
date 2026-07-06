/* ─── Excel Export Utility ───────────────────────────────── */

function exportToExcel(data, columns, filename) {
  if (typeof XLSX === 'undefined') {
    alert('La librería de Excel no está disponible. Verificá tu conexión a internet.');
    return;
  }

  const rows = data.map(item => {
    const row = {};
    columns.forEach(col => {
      const val = item[col.key];
      row[col.header] = (val !== undefined && val !== null) ? val : '';
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = columns.map(col => ({
    wch: Math.max(col.header.length, ...data.map(item => String(item[col.key] || '').length)) + 2
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Equipos');
  XLSX.writeFile(wb, filename + '.xlsx');
}

/* ─── Configuración por sección ─────────────────────────── */

const EXPORT_CONFIGS = [
  {
    btnId: 'mangas-export-btn',
    filename: 'AEP_Mangas_de_Embarque',
    getData: () => MANGAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'pos',          header: 'Posición' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'tipo',         header: 'Tipo / Modelo' },
      { key: 'dimension',    header: 'Dimensión' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'ascensores-export-btn',
    filename: 'AEP_Ascensores',
    getData: () => ASCENSORES_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'tipo',         header: 'Tipo / Modelo' },
      { key: 'dimension',    header: 'Dimensión' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'escaleras-export-btn',
    filename: 'AEP_Escaleras_Mecanicas',
    getData: () => ESCALERAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'tipo',         header: 'Tipo / Modelo' },
      { key: 'dimension',    header: 'Dimensión' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'extractores-export-btn',
    filename: 'AEP_Extractores',
    getData: () => EXTRACTORES_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'persianas-export-btn',
    filename: 'AEP_Persianas_de_Gatera',
    getData: () => PERSIANAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'cortinas-export-btn',
    filename: 'AEP_Cortinas_de_Aire',
    getData: () => CORTINAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'bombas-export-btn',
    filename: 'AEP_Bombas',
    getData: () => BOMBAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'dimension',    header: 'Dimensión / Potencia' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'ubi_desc',     header: 'Sector' },
    ]
  },
  {
    btnId: 'patio-export-btn',
    filename: 'AEP_Patio_de_Valijas_BHS',
    getData: () => PATIO_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'clase',        header: 'Clase' },
      { key: 'kw',           header: 'KW' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'sector',       header: 'Sector' },
    ]
  },
  {
    btnId: 'puertas-export-btn',
    filename: 'AEP_Puertas_Automaticas',
    getData: () => PUERTAS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'serie',        header: 'Serie' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
    ]
  },
  {
    btnId: 'aac-export-btn',
    filename: 'AEP_Equipos_de_Aire_Acondicionado',
    getData: () => AAC_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'tipo',         header: 'Tipo' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'modelo',       header: 'Modelo' },
      { key: 'capacidad',    header: 'Capacidad' },
      { key: 'sector',       header: 'Sector' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
    ]
  },
  {
    btnId: 'ecas-export-btn',
    filename: 'AEP_Incendios_ECAs',
    getData: () => ECAS_DATA,
    columns: [
      { key: 'equipo',    header: 'Equipo' },
      { key: 'tipo',      header: 'Tipo' },
      { key: 'sap',       header: 'Ubicación SAP' },
      { key: 'ubicacion', header: 'Ubicación' },
      { key: 'piso',      header: 'Piso' },
      { key: 'sistema',   header: 'Sistema' },
      { key: 'alimenta',  header: 'Alimenta' },
      { key: 'cadena',    header: 'Cadena' },
    ]
  },
  {
    btnId: 'otros-export-btn',
    filename: 'AEP_Otros_Equipos',
    getData: () => OTROS_DATA,
    columns: [
      { key: 'equipo',       header: 'Equipo' },
      { key: 'denominacion', header: 'Denominación' },
      { key: 'tipo',         header: 'Tipo' },
      { key: 'fabricante',   header: 'Fabricante' },
      { key: 'capacidad',    header: 'Capacidad' },
      { key: 'ubicacion',    header: 'Ubicación SAP' },
      { key: 'local',        header: 'Local / Sector' },
    ]
  },
];

EXPORT_CONFIGS.forEach(cfg => {
  const btn = document.getElementById(cfg.btnId);
  if (!btn) return;
  btn.addEventListener('click', () => exportToExcel(cfg.getData(), cfg.columns, cfg.filename));
});
