import React, { useState, useMemo } from 'react';
import { Search, Info, BookOpen, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const PlanEstudios = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  // Definición completa de materias con posiciones en el diagrama
  const materias = {
    // Semestre I
    'CB0100-L': { name: 'Laboratorio de Física I', hours: '0-1-2', credits: 2, type: 'CB', deps: [], pos: { x: 150, y: 50 }, sem: 1 },
    'CB0500-L': { name: 'Laboratorio de Química', hours: '0-1-2', credits: 2, type: 'CB', deps: [], pos: { x: 280, y: 50 }, sem: 1 },
    'CB0200-T': { name: 'Álgebra Superior', hours: '4-0-8', credits: 8, type: 'CB', deps: [], pos: { x: 410, y: 50 }, sem: 1 },
    'CB0000-T': { name: 'Cálculo I', hours: '5-0-10', credits: 10, type: 'CB', deps: [], pos: { x: 540, y: 50 }, sem: 1 },
    'CB0100-T': { name: 'Física I', hours: '4-0-8', credits: 8, type: 'CB', deps: [], pos: { x: 670, y: 50 }, sem: 1 },
    'CS0000-T': { name: 'Inglés I', hours: '3-0-6', credits: 6, type: 'CS', deps: [], pos: { x: 800, y: 50 }, sem: 1 },
    'OC0000-L': { name: 'Lab. de Herramientas Computacionales', hours: '0-2-4', credits: 4, type: 'OC', deps: [], pos: { x: 930, y: 50 }, sem: 1 },
    'CB0500-T': { name: 'Química', hours: '3-0-6', credits: 6, type: 'CB', deps: [], pos: { x: 1060, y: 50 }, sem: 1 },
    'OC0100-T': { name: 'Técnicas de Estudio', hours: '2-0-4', credits: 4, type: 'OC', deps: [], pos: { x: 1190, y: 50 }, sem: 1 },
    
    // Semestre II
    'CB0001-T': { name: 'Cálculo II', hours: '5-0-10', credits: 10, type: 'CB', deps: ['CB0000-T'], pos: { x: 150, y: 180 }, sem: 2 },
    'CB0101-T': { name: 'Física II', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0100-T'], pos: { x: 280, y: 180 }, sem: 2 },
    'CI0100-T': { name: 'Electrónica Analógica I', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CB0200-T'], pos: { x: 410, y: 180 }, sem: 2 },
    'CS0001-T': { name: 'Inglés II', hours: '3-0-6', credits: 6, type: 'CS', deps: ['CS0000-T'], pos: { x: 540, y: 180 }, sem: 2 },
    'CI0100-L': { name: 'Lab. de Electrónica Analógica I', hours: '0-2-4', credits: 4, type: 'CI', deps: [], pos: { x: 670, y: 180 }, sem: 2 },
    'CB0101-L': { name: 'Laboratorio de Física II', hours: '0-1-2', credits: 2, type: 'CB', deps: [], pos: { x: 800, y: 180 }, sem: 2 },
    'CI0000-L': { name: 'Lab. de Programación de Computadoras', hours: '0-2-4', credits: 4, type: 'CI', deps: [], pos: { x: 930, y: 180 }, sem: 2 },
    'IA7000-T': { name: 'Lógica', hours: '3-0-6', credits: 6, type: 'IA', deps: [], pos: { x: 1060, y: 180 }, sem: 2 },
    'CI0000-T': { name: 'Programación de Computadoras', hours: '3-0-6', credits: 6, type: 'CI', deps: ['OC0000-L'], pos: { x: 1190, y: 180 }, sem: 2 },
    
    // Semestre III
    'CB0002-T': { name: 'Cálculo III', hours: '5-0-10', credits: 10, type: 'CB', deps: ['CB0001-T'], pos: { x: 150, y: 310 }, sem: 3 },
    'CB0102-T': { name: 'Teoría Electromagnética I', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0101-T'], pos: { x: 280, y: 310 }, sem: 3 },
    'CB0501-T': { name: 'Termodinámica', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0000-T', 'CB0500-T'], pos: { x: 410, y: 310 }, sem: 3 },
    'CB0300-T': { name: 'Métodos Numéricos', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0200-T', 'CB0000-T'], pos: { x: 540, y: 310 }, sem: 3 },
    'CI0101-T': { name: 'Electrónica Analógica II', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CI0100-T'], pos: { x: 670, y: 310 }, sem: 3 },
    'CS0002-T': { name: 'Inglés III', hours: '3-0-6', credits: 6, type: 'CS', deps: ['CS0001-T'], pos: { x: 800, y: 310 }, sem: 3 },
    'CI0101-L': { name: 'Lab. de Electrónica Analógica II', hours: '0-2-4', credits: 4, type: 'CI', deps: [], pos: { x: 930, y: 310 }, sem: 3 },
    'CB0102-L': { name: 'Lab. de Teoría Electromagnética I', hours: '0-2-4', credits: 4, type: 'CB', deps: [], pos: { x: 1060, y: 310 }, sem: 3 },
    'CB0501-L': { name: 'Laboratorio de Termodinámica', hours: '0-1-2', credits: 2, type: 'CB', deps: [], pos: { x: 1190, y: 310 }, sem: 3 },
    
    // Semestre IV
    'CB0003-T': { name: 'Cálculo IV', hours: '5-0-10', credits: 10, type: 'CB', deps: ['CB0002-T'], pos: { x: 150, y: 440 }, sem: 4 },
    'CI0200-T': { name: 'Circuitos Eléctricos I', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CB0200-T', 'CB0002-T'], pos: { x: 280, y: 440 }, sem: 4 },
    'CI0300-T': { name: 'Electrónica Digital I', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CI0100-T'], pos: { x: 410, y: 440 }, sem: 4 },
    'CS0003-T': { name: 'Inglés IV', hours: '3-0-6', credits: 6, type: 'CS', deps: ['CS0002-T'], pos: { x: 540, y: 440 }, sem: 4 },
    'CI0300-L': { name: 'Lab. de Electrónica Digital I', hours: '0-2-4', credits: 4, type: 'CI', deps: [], pos: { x: 670, y: 440 }, sem: 4 },
    'CI7100-T': { name: 'Estructuras de Datos', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CI0000-T'], pos: { x: 800, y: 440 }, sem: 4 },
    'CI7101-T': { name: 'Ingeniería de Programación', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CI0000-T'], pos: { x: 930, y: 440 }, sem: 4 },
    'CI7000-T': { name: 'Matemáticas Discretas', hours: '4-0-8', credits: 8, type: 'CI', deps: ['IA7000-T'], pos: { x: 1060, y: 440 }, sem: 4 },
    
    // Semestre V
    'CI0400-T': { name: 'Control Analógico I', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CB0003-T'], pos: { x: 150, y: 570 }, sem: 5 },
    'CB7000-T': { name: 'Álgebra Lineal', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0200-T', 'CB0000-T'], pos: { x: 280, y: 570 }, sem: 5 },
    'CB0600-T': { name: 'Probabilidad y Estadística', hours: '4-0-8', credits: 8, type: 'CB', deps: ['CB0200-T', 'CB0001-T'], pos: { x: 410, y: 570 }, sem: 5 },
    'CI7102-T': { name: 'Análisis de Algoritmos', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CI7100-T'], pos: { x: 540, y: 570 }, sem: 5 },
    'IA7300-T': { name: 'Paradigmas de Programación', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CI7101-T'], pos: { x: 670, y: 570 }, sem: 5 },
    'CI0400-L': { name: 'Lab. de Control Analógico I', hours: '0-2-4', credits: 4, type: 'CI', deps: [], pos: { x: 800, y: 570 }, sem: 5 },
    'IA7300-L': { name: 'Lab. de Paradigmas de Programación', hours: '0-3-6', credits: 6, type: 'IA', deps: [], pos: { x: 930, y: 570 }, sem: 5 },
    'CI7001-T': { name: 'Lenguajes Formales y Autómatas', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CI7000-T'], pos: { x: 1060, y: 570 }, sem: 5 },
    
    // Semestre VI
    'IA3100-T': { name: 'Comunicaciones I', hours: '4-0-8', credits: 8, type: 'IA', deps: ['CB0003-T', 'CB0102-T'], pos: { x: 150, y: 700 }, sem: 6 },
    'CI0401-T': { name: 'Control Analógico II', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CI0400-T'], pos: { x: 280, y: 700 }, sem: 6 },
    'IA7200-T': { name: 'Graficación', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CB7000-T', 'CI0000-T'], pos: { x: 410, y: 700 }, sem: 6 },
    'IA7400-T': { name: 'Organización de Computadoras', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CI0300-T'], pos: { x: 540, y: 700 }, sem: 6 },
    'OC0300-T': { name: 'Economía', hours: '3-0-6', credits: 6, type: 'OC', deps: [], pos: { x: 670, y: 700 }, sem: 6 },
    'IA7100-T': { name: 'Compiladores', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CI7001-T'], pos: { x: 800, y: 700 }, sem: 6 },
    
    // Semestre VII
    'IA7800-T': { name: 'Investigación de Operaciones', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CB0001-T', 'CB7000-T'], pos: { x: 150, y: 830 }, sem: 7 },
    'IA7600-T': { name: 'Redes de Computadoras', hours: '4-0-8', credits: 8, type: 'IA', deps: ['CI0000-T', 'CI0300-T'], pos: { x: 280, y: 830 }, sem: 7 },
    'CI7300-T': { name: 'Modelos Probabilistas', hours: '3-0-6', credits: 6, type: 'CI', deps: ['CB0600-T'], pos: { x: 410, y: 830 }, sem: 7 },
    'IA3400-T': { name: 'Control Digital I', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CI0401-T'], pos: { x: 540, y: 830 }, sem: 7 },
    'IA7500-T': { name: 'Bases de Datos', hours: '4-0-8', credits: 8, type: 'IA', deps: ['CI7101-T', 'IA7000-T'], pos: { x: 670, y: 830 }, sem: 7 },
    
    // Semestre VIII
    'CI7002-T': { name: 'Teoría de la Computación', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CI7001-T'], pos: { x: 150, y: 960 }, sem: 8 },
    'OC0400-T': { name: 'Administración', hours: '3-0-6', credits: 6, type: 'OC', deps: [], pos: { x: 280, y: 960 }, sem: 8 },
    'CS0200-T': { name: 'Ética Profesional', hours: '3-0-6', credits: 6, type: 'CS', deps: [], pos: { x: 410, y: 960 }, sem: 8 },
    'CI7200-T': { name: 'Sistemas Operativos', hours: '4-0-8', credits: 8, type: 'CI', deps: ['CI0000-T'], pos: { x: 540, y: 960 }, sem: 8 },
    'CI7200-L': { name: 'Lab. de Sistemas Operativos', hours: '0-5-10', credits: 10, type: 'CI', deps: [], pos: { x: 670, y: 960 }, sem: 8 },
    
    // Semestre IX
    'IA7700-T': { name: 'Inteligencia Artificial', hours: '3-0-6', credits: 6, type: 'IA', deps: ['CI7000-T', 'IA7300-T'], pos: { x: 150, y: 1090 }, sem: 9 },
    'OC0200-T': { name: 'Contabilidad', hours: '3-0-6', credits: 6, type: 'OC', deps: [], pos: { x: 280, y: 1090 }, sem: 9 },
    'CS0100-T': { name: 'Expresión Oral y Escrita', hours: '4-0-8', credits: 8, type: 'CS', deps: [], pos: { x: 410, y: 1090 }, sem: 9 },
    'IA7700-L': { name: 'Lab. de Inteligencia Artificial', hours: '0-3-6', credits: 6, type: 'IA', deps: [], pos: { x: 540, y: 1090 }, sem: 9 },
    
    // Semestre X
    'OC0500-T': { name: 'Seminario de Tesis', hours: '4-0-8', credits: 8, type: 'OC', deps: [], pos: { x: 300, y: 1220 }, sem: 10 }
  };

  const typeColors = {
    CB: { bg: '#ffebee', border: '#f44336', text: '#c62828', name: 'Ciencias Básicas' },
    CI: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32', name: 'Ciencias de la Ingeniería' },
    IA: { bg: '#fff3e0', border: '#ff9800', text: '#e65100', name: 'Ingeniería Aplicada' },
    CS: { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0', name: 'Ciencias Sociales' },
    OC: { bg: '#f3e5f5', border: '#9c27b0', text: '#6a1b9a', name: 'Otros Cursos' }
  };

  // Obtener dependencias de una materia
  const getRelatedCourses = (courseCode) => {
    if (!courseCode) return { dependencies: [], dependents: [] };
    
    const dependencies = materias[courseCode]?.deps || [];
    const dependents = Object.keys(materias).filter(code => 
      materias[code].deps.includes(courseCode)
    );
    
    return { dependencies, dependents };
  };

  // Filtrar materias
  const filteredCourses = useMemo(() => {
    if (!searchTerm) return Object.keys(materias);
    
    return Object.keys(materias).filter(code => {
      const course = materias[code];
      return course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             code.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Renderizar líneas de conexión
  const renderConnections = () => {
    const lines = [];
    const activeCode = hoveredCourse || selectedCourse;
    
    Object.entries(materias).forEach(([code, course]) => {
      course.deps.forEach(depCode => {
        if (!materias[depCode]) return;
        
        const isDependencyActive = activeCode === code || activeCode === depCode;
        const isHighlighted = selectedCourse && 
          (code === selectedCourse || depCode === selectedCourse);
        
        const x1 = materias[depCode].pos.x + 60;
        const y1 = materias[depCode].pos.y + 40;
        const x2 = course.pos.x + 60;
        const y2 = course.pos.y + 40;
        
        // Usar curvas de Bézier para las conexiones
        const midY = (y1 + y2) / 2;
        
        lines.push(
          <path
            key={`${depCode}-${code}`}
            d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
            stroke={isHighlighted ? '#2196f3' : isDependencyActive ? '#ff9800' : '#e0e0e0'}
            strokeWidth={isHighlighted ? 3 : isDependencyActive ? 2 : 1}
            fill="none"
            opacity={activeCode && !isDependencyActive ? 0.2 : 1}
            strokeDasharray={isHighlighted ? '0' : '5,5'}
          />
        );
        
        // Flecha
        const angle = Math.atan2(y2 - midY, x2 - x1);
        const arrowSize = 8;
        lines.push(
          <polygon
            key={`arrow-${depCode}-${code}`}
            points={`0,-${arrowSize/2} ${arrowSize},0 0,${arrowSize/2}`}
            fill={isHighlighted ? '#2196f3' : isDependencyActive ? '#ff9800' : '#e0e0e0'}
            opacity={activeCode && !isDependencyActive ? 0.2 : 1}
            transform={`translate(${x2 - arrowSize},${y2}) rotate(${angle * 180 / Math.PI})`}
          />
        );
      });
    });
    
    return lines;
  };

  // Renderizar materia
  const renderCourse = (code) => {
    const course = materias[code];
    const colors = typeColors[course.type];
    const { dependencies, dependents } = getRelatedCourses(selectedCourse);
    
    const isSelected = selectedCourse === code;
    const isDependency = dependencies.includes(code);
    const isDependent = dependents.includes(code);
    const isVisible = !searchTerm || filteredCourses.includes(code);
    
    if (!isVisible) return null;
    
    return (
      <g
        key={code}
        transform={`translate(${course.pos.x}, ${course.pos.y})`}
        onMouseEnter={() => setHoveredCourse(code)}
        onMouseLeave={() => setHoveredCourse(null)}
        onClick={() => setSelectedCourse(code)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          width="120"
          height="80"
          rx="8"
          fill={colors.bg}
          stroke={isSelected ? '#2196f3' : isDependency ? '#ffeb3b' : isDependent ? '#9c27b0' : colors.border}
          strokeWidth={isSelected ? 4 : 2}
          opacity={selectedCourse && !isSelected && !isDependency && !isDependent ? 0.3 : 1}
          filter={isSelected ? 'url(#shadow)' : ''}
        />
        
        <text
          x="60"
          y="20"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill={colors.text}
        >
          {code}
        </text>
        
        <text
          x="60"
          y="38"
          textAnchor="middle"
          fontSize="9"
          fill="#666"
        >
          {course.name.length > 20 ? course.name.substring(0, 18) + '...' : course.name}
        </text>
        
        <text
          x="10"
          y="65"
          fontSize="8"
          fill="#999"
        >
          {course.hours}
        </text>
        
        <text
          x="110"
          y="65"
          textAnchor="end"
          fontSize="9"
          fontWeight="bold"
          fill={colors.text}
        >
          {course.credits}c
        </text>
        
        {course.deps.length > 0 && (
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="#ff9800"
            opacity="0.8"
          />
        )}
        {course.deps.length > 0 && (
          <text
            x="10"
            y="14"
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="white"
          >
            {course.deps.length}
          </text>
        )}
      </g>
    );
  };

  const selectedCourseData = selectedCourse ? materias[selectedCourse] : null;
  const { dependencies, dependents } = getRelatedCourses(selectedCourse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Plan de Estudios - Ingeniería en Computación
                </h1>
                <p className="text-sm text-slate-600">UNAM - Facultad de Ingeniería</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                title="Restablecer zoom"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar materia por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setSelectedCourse(null);
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Limpiar
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border-2"
                  style={{ backgroundColor: color.bg, borderColor: color.border }}
                ></div>
                <span className="text-sm text-slate-700">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedCourseData && (
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {selectedCourseData.name}
                </h3>
                <p className="text-sm text-slate-600 font-mono mb-3">{selectedCourse}</p>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-500">Semestre</div>
                    <div className="font-semibold text-slate-800">{selectedCourseData.sem}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Tipo</div>
                    <div className="font-semibold text-slate-800">
                      {typeColors[selectedCourseData.type].name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Horas (T-P-C)</div>
                    <div className="font-semibold text-slate-800">{selectedCourseData.hours}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Créditos</div>
                    <div className="font-semibold text-slate-800">{selectedCourseData.credits}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {dependencies.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">
                        Requisitos previos (amarillo):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dependencies.map(dep => (
                          <button
                            key={dep}
                            onClick={() => setSelectedCourse(dep)}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200 transition-colors"
                          >
                            {materias[dep].name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dependents.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 mb-2">
                        Materias que la requieren (morado):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dependents.map(dep => (
                          <button
                            key={dep}
                            onClick={() => setSelectedCourse(dep)}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200 transition-colors"
                          >
                            {materias[dep].name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagram */}
      <div className="overflow-auto p-4" style={{ height: 'calc(100vh - 280px)' }}>
        <svg
          width={1400 * zoom}
          height={1300 * zoom}
          className="mx-auto"
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g transform={`scale(${zoom})`}>
            {/* Semestre labels */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
              <text
                key={`sem-${sem}`}
                x="20"
                y={50 + (sem - 1) * 130 + 40}
                fontSize="24"
                fontWeight="bold"
                fill="#94a3b8"
              >
                {sem}
              </text>
            ))}
            
            {/* Connections */}
            {renderConnections()}
            
            {/* Courses */}
            {Object.keys(materias).map(renderCourse)}
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 p-3">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600 flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          Haz clic en una materia para ver sus dependencias. Usa la rueda del ratón o los botones de zoom para ajustar la vista.
        </div>
      </div>
    </div>
  );
};

export default PlanEstudios;