'use client';

import React, { useState, useMemo } from 'react';
import { RAW_DATA } from '@/lib/data';
import { 
  Users, 
  Globe, 
  AlertCircle, 
  MessageSquare, 
  TrendingUp,
  LayoutDashboard,
  Fingerprint,
  Languages,
  ShieldAlert,
  Share2,
  RefreshCcw,
  ChevronRight,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  School,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';

type TabType = 'general' | 'lengua' | 'discriminacion' | 'uni';

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#BA7517', '#D4537E', '#639922', '#E24B4A', '#888780', '#534AB7'];

export default function Dashboard() {
  const [anio, setAnio] = useState('all');
  const [genero, setGenero] = useState('all');
  const [pueblo, setPueblo] = useState('all');
  const [rol, setRol] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showModal, setShowModal] = useState(false);

  // Multipliers for each dimension
  const multipliers = useMemo(() => ({
    anio: anio === 'all' ? 1 : (anio === '2024' ? 220/648 : (anio === '2025' ? 288/648 : 140/648)),
    genero: genero === 'all' ? 1 : (genero === 'Hombre' ? 371/648 : 277/648),
    pueblo: pueblo === 'all' ? 1 : (pueblo === 'Si' ? 200/648 : 439/648),
    rol: rol === 'all' ? 1 : (rol === 'Estudiante' ? 622/648 : 25/648)
  }), [anio, genero, pueblo, rol]);

  // Total scaling factor (global)
  const factor = useMemo(() => {
    return multipliers.anio * multipliers.genero * multipliers.pueblo * multipliers.rol;
  }, [multipliers]);

  // Factor excluding a specific dimension (for dimension-aware charts)
  const getFactorExcluding = (dim: keyof typeof multipliers) => {
    let f = 1;
    Object.entries(multipliers).forEach(([key, val]) => {
      if (key !== dim) f *= val;
    });
    return f;
  };

  // Memoized stats based on factor
  const stats = useMemo(() => {
    const total = Math.max(1, Math.round(648 * factor));
    const puebloCount = Math.round(200 * factor);
    const discCount = Math.round(114 * factor);
    const quechuaCount = Math.round(135 * factor);
    const orgullosoCount = Math.round(648 * 0.91 * factor);
    const serviciosCount = Math.round(505 * factor);

    return { 
      total, 
      pueblo: puebloCount, 
      disc: discCount, 
      quechua: quechuaCount, 
      orgulloso: orgullosoCount, 
      servicios: serviciosCount,
      puebloPct: total > 0 ? Math.round((puebloCount / total) * 100) : 0,
      discPct: total > 0 ? Math.round((discCount / total) * 100) : 0
    };
  }, [factor]);

  const resetFilters = () => {
    setAnio('all');
    setGenero('all');
    setPueblo('all');
    setRol('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-900 leading-tight">EduEtnica</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Dashboard v3.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem 
            icon={<Fingerprint size={20} />} 
            label="Datos Generales" 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')} 
          />
          <NavItem 
            icon={<Globe size={20} />} 
            label="Lengua e Identidad" 
            active={activeTab === 'lengua'} 
            onClick={() => setActiveTab('lengua')} 
          />
          <NavItem 
            icon={<ShieldAlert size={20} />} 
            label="Discriminación" 
            active={activeTab === 'discriminacion'} 
            onClick={() => setActiveTab('discriminacion')} 
          />
          <NavItem 
            icon={<School size={20} />} 
            label="Universidad" 
            active={activeTab === 'uni'} 
            onClick={() => setActiveTab('uni')} 
          />
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl">
            <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Reporte Multianual</p>
            <p className="text-sm font-medium text-slate-300 mb-4 leading-relaxed">Análisis consolidado 2024-2026.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
              <Download size={14} />
              Exportar CSV
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50 px-6 md:px-10 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-outfit text-slate-900 tracking-tight">Autoidentificación Cultural</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-slate-500 text-sm font-medium">Muestra de {stats.total} respuestas procesadas</p>
              </div>
            </div>
            
            <button onClick={() => setShowModal(true)} className="btn-primary group">
              <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Publicar</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* Filters Bar */}
          <section className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filtros</span>
            </div>
            
            <select value={anio} onChange={(e) => setAnio(e.target.value)} className="input-select border-none bg-transparent hover:bg-slate-50">
              <option value="all">Años: Todos</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            <select value={genero} onChange={(e) => setGenero(e.target.value)} className="input-select border-none bg-transparent hover:bg-slate-50">
              <option value="all">Géneros: Todos</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>

            <select value={pueblo} onChange={(e) => setPueblo(e.target.value)} className="input-select border-none bg-transparent hover:bg-slate-50">
              <option value="all">Pueblo: Todos</option>
              <option value="Si">Si pertenece</option>
              <option value="No">No pertenece</option>
            </select>

            <select value={rol} onChange={(e) => setRol(e.target.value)} className="input-select border-none bg-transparent hover:bg-slate-50">
              <option value="all">Roles: Todos</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Docente">Docente</option>
            </select>

            <button onClick={resetFilters} className="ml-auto flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">
              <RefreshCcw size={14} />
              Limpiar
            </button>
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard icon={<Users size={20} />} label="Total" value={stats.total} sub="Respuestas" color="blue" />
            <KPICard icon={<Globe size={20} />} label="Pueblo" value={stats.pueblo} sub={`${stats.puebloPct}% del total`} color="emerald" />
            <KPICard icon={<ShieldAlert size={20} />} label="Disc." value={stats.disc} sub={`${stats.discPct}% incidencia`} color="red" alert />
            <KPICard icon={<Languages size={20} />} label="Quechua" value={stats.quechua} sub="Hablantes" color="purple" />
            <KPICard icon={<Heart size={20} />} label="Orgullo" value={stats.orgulloso} sub="91% Siempre" color="emerald" />
            <KPICard icon={<TrendingUp size={20} />} label="Servicios" value={stats.servicios} sub="Demanda" color="amber" />
          </section>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 pb-20"
            >
              {activeTab === 'general' && <GeneralTab factor={factor} setGenero={setGenero} setAnio={setAnio} getFactorExcluding={getFactorExcluding} activeFilters={{anio, genero}} />}
              {activeTab === 'lengua' && <LenguaTab factor={factor} setPueblo={setPueblo} getFactorExcluding={getFactorExcluding} activeFilters={{pueblo}} />}
              {activeTab === 'discriminacion' && <DiscriminacionTab factor={factor} setAnio={setAnio} getFactorExcluding={getFactorExcluding} activeFilters={{anio}} />}
              {activeTab === 'uni' && <UniTab factor={factor} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modal - Publicar */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl">
              <h2 className="text-3xl font-black font-outfit mb-4">Compartir Resultados</h2>
              <p className="text-slate-500 mb-8">El enlace contiene la configuración actual de filtros y pestañas.</p>
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-2xl mb-8">
                <code className="text-sm font-bold text-slate-800 break-all">https://etnica.univ.edu/dashboard/v3?f={factor.toFixed(2)}</code>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl">Cerrar</button>
                <button className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30">Copiar Link</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-emerald-50 text-emerald-700 shadow-inner' : 'text-slate-400 hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className={active ? 'text-emerald-600' : ''}>{icon}</div>
        <span className={`text-sm font-bold ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      </div>
      {active && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
    </button>
  );
}

function KPICard({ icon, label, value, sub, color, alert }: { icon: React.ReactNode, label: string, value: string | number, sub: string, color: string, alert?: boolean }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500', emerald: 'bg-emerald-500', red: 'bg-red-500', purple: 'bg-purple-500', amber: 'bg-amber-500'
  };
  const textMap: Record<string, string> = {
    blue: 'text-blue-500', emerald: 'text-emerald-500', red: 'text-red-500', purple: 'text-purple-500', amber: 'text-amber-500'
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${colorMap[color]} text-white`}>{icon}</div>
        {alert && <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-black font-outfit ${textMap[color]}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

// Tab Content Components
function GeneralTab({ factor, setGenero, setAnio, getFactorExcluding, activeFilters }: { 
  factor: number, 
  setGenero: (val: string) => void, 
  setAnio: (val: string) => void,
  getFactorExcluding: (dim: any) => number,
  activeFilters: { anio: string, genero: string }
}) {
  const fGen = getFactorExcluding('genero');
  const genData = [
    { name: 'Hombre', value: (activeFilters.genero === 'all' || activeFilters.genero === 'Hombre') ? Math.round(RAW_DATA.genero.Hombre * fGen) : 0 },
    { name: 'Mujer', value: (activeFilters.genero === 'all' || activeFilters.genero === 'Mujer') ? Math.round((RAW_DATA.genero.Mujer + RAW_DATA.genero['Mujer, No indica']) * fGen) : 0 }
  ];

  const fAnio = getFactorExcluding('anio');
  const anioData = Object.entries(RAW_DATA.anios).map(([name, value]) => ({ 
    name, 
    value: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(value * fAnio) : 0 
  }));

  const edadData = Object.entries(RAW_DATA.edad).map(([name, value]) => ({ name, value: Math.round(value * factor) }));
  const dptoData = Object.entries(RAW_DATA.dpto)
    .map(([name, value]) => ({ name, value: Math.round(value * factor) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const onPieClick = (data: any) => {
    if (data && data.name) setGenero(data.name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 card-premium">
        <h3 className="text-lg font-black mb-1">Género</h3>
        <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-wider">Haz clic en una sección para filtrar</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={genData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={8} 
                cornerRadius={4}
                dataKey="value"
                stroke="none"
                onClick={onPieClick}
                className="cursor-pointer focus:outline-none"
              >
                {genData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-8 card-premium">
        <h3 className="text-lg font-black mb-1">Registros por Año</h3>
        <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-wider">Haz clic en una barra para filtrar</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(state) => {
              if (state && state.activeLabel) setAnio(String(state.activeLabel));
            }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(55,138,221,0.05)'}} />
              <Bar dataKey="value" fill="#378ADD" radius={[6, 6, 0, 0]} barSize={40} className="cursor-pointer focus:outline-none" activeBar={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-6">Distribución por Edad</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={edadData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#7F77DD" fill="#7F77DD" fillOpacity={0.1} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-6">Procedencia Geográfica (Principales Departamentos)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {dptoData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-4 group">
              <div className="w-28 text-xs font-bold text-slate-500 truncate group-hover:text-emerald-600 transition-colors">{d.name}</div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(d.value / dptoData[0].value) * 100}%` }} 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" 
                />
              </div>
              <div className="w-10 text-xs font-black text-slate-800 text-right font-outfit">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LenguaTab({ factor, setPueblo, getFactorExcluding, activeFilters }: { 
  factor: number, 
  setPueblo: (val: string) => void,
  getFactorExcluding: (dim: any) => number,
  activeFilters: { pueblo: string }
}) {
  const lenguaData = Object.entries(RAW_DATA.lengua)
    .map(([name, value]) => ({ name, value: Math.round(value * factor) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const fPueblo = getFactorExcluding('pueblo');
  const puebloData = [
    { name: 'Si', value: (activeFilters.pueblo === 'all' || activeFilters.pueblo === 'Si') ? Math.round(RAW_DATA.pueblo.Sí * fPueblo) : 0 },
    { name: 'No', value: (activeFilters.pueblo === 'all' || activeFilters.pueblo === 'No') ? Math.round((RAW_DATA.pueblo.No + RAW_DATA.pueblo['Sí/No']) * fPueblo) : 0 }
  ];

  const puebloTipoData = Object.entries(RAW_DATA.puebloTipo)
    .map(([name, value]) => ({ name, value: Math.round(value * factor) }))
    .sort((a, b) => b.value - a.value);

  const onPieClick = (data: any) => {
    if (data && data.name) setPueblo(data.name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 card-premium">
        <h3 className="text-lg font-black mb-6">Lengua Materna</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lenguaData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#1D9E75" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-6 card-premium">
        <h3 className="text-lg font-black mb-1">¿Pertenece a Pueblo Originario?</h3>
        <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-wider">Haz clic para filtrar</p>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={puebloData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                cornerRadius={4}
                dataKey="value"
                stroke="none"
                onClick={onPieClick}
                className="cursor-pointer focus:outline-none"
              >
                <Cell fill="#1D9E75" />
                <Cell fill="#E24B4A" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-6">Tipo de Pueblo (Quienes pertenecen)</h3>
        <div className="space-y-4">
          {puebloTipoData.map((p, idx) => (
            <div key={p.name} className="flex items-center gap-4 group">
              <div className="w-32 text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">{p.name}</div>
              <div className="flex-1 h-3 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.value / puebloTipoData[0].value) * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.05 }}
                  className="h-full bg-emerald-500" 
                />
              </div>
              <div className="w-8 text-xs font-black font-outfit">{p.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscriminacionTab({ factor, setAnio, getFactorExcluding, activeFilters }: { 
  factor: number, 
  setAnio: (val: string) => void,
  getFactorExcluding: (dim: any) => number,
  activeFilters: { anio: string }
}) {
  const discData = [
    { name: 'No', value: Math.round(RAW_DATA.disc.No * factor) },
    { name: 'Sí', value: Math.round((RAW_DATA.disc.Sí + RAW_DATA.disc['No/Sí']) * factor) }
  ];

  const dg = RAW_DATA.discGen;
  const genData = [
    { name: 'Hombre', sí: Math.round(dg.Hombre.Sí * factor), no: Math.round(dg.Hombre.No * factor) },
    { name: 'Mujer', sí: Math.round(dg.Mujer.Sí * factor), no: Math.round(dg.Mujer.No * factor) }
  ];

  const fAnio = getFactorExcluding('anio');
  const anioData = Object.entries(RAW_DATA.discAnio).map(([name, val]) => ({
    name, 
    sí: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(val.Sí * fAnio) : 0, 
    no: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(val.No * fAnio) : 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 card-premium">
        <h3 className="text-lg font-black mb-6">Incidencia de Discriminación</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={discData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} cornerRadius={4} dataKey="value" stroke="none">
                <Cell fill="#1D9E75" />
                <Cell fill="#E24B4A" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-8 card-premium">
        <h3 className="text-lg font-black mb-6">Discriminación por Género</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="sí" fill="#E24B4A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="no" fill="#1D9E75" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-1">Evolución Anual (Discriminación)</h3>
        <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-wider">Haz clic en un año para filtrar</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(state) => {
              if (state && state.activeLabel) setAnio(String(state.activeLabel));
            }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sí" stackId="a" fill="#E24B4A" className="cursor-pointer focus:outline-none" activeBar={false} />
              <Bar dataKey="no" stackId="a" fill="#1D9E75" radius={[6, 6, 0, 0]} className="cursor-pointer focus:outline-none" activeBar={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function UniTab({ factor }: { factor: number }) {
  const radarData = RAW_DATA.uniQs.map(q => ({
    subject: q.label.length > 15 ? q.label.slice(0, 15) + '...' : q.label,
    A: q.pos,
    fullMark: 100,
  }));

  const barData = RAW_DATA.uniQs.map(q => ({ name: q.label, value: q.pos }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-6">Percepción Universitaria</h3>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Positivo" dataKey="A" stroke="#378ADD" fill="#378ADD" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-12 card-premium">
        <h3 className="text-lg font-black mb-10">Detalle por Pregunta (% Positivo)</h3>
        <div className="space-y-6">
          {barData.map((d, idx) => (
            <div key={d.name} className="flex items-center gap-4 group">
              <div className="w-1/2 text-xs font-bold text-slate-500 leading-tight group-hover:text-blue-600 transition-colors">{d.name}</div>
              <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${d.value}%` }}
                  transition={{ duration: 1, delay: idx * 0.05 }}
                  className="h-full bg-blue-500 rounded-full" 
                />
              </div>
              <div className="w-12 text-sm font-black text-slate-800 text-right font-outfit">{d.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
