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
  Heart,
  MousePointer2,
  Info,
  XCircle
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
  Sector
} from 'recharts';

type TabType = 'general' | 'lengua' | 'discriminacion' | 'uni';

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#BA7517', '#D4537E', '#639922', '#E24B4A', '#888780', '#534AB7'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[140px] animate-in fade-in zoom-in duration-200">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-black font-outfit text-slate-900">{payload[0].value}</span>
          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
            {payload[0].payload.percent ? `${payload[0].payload.percent}%` : ''}
          </span>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={6}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function Dashboard() {
  const [anio, setAnio] = useState('all');
  const [genero, setGenero] = useState('all');
  const [pueblo, setPueblo] = useState('all');
  const [rol, setRol] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showModal, setShowModal] = useState(false);

  const multipliers = useMemo(() => ({
    anio: anio === 'all' ? 1 : (anio === '2024' ? 220/648 : (anio === '2025' ? 288/648 : 140/648)),
    genero: genero === 'all' ? 1 : (genero === 'Hombre' ? 371/648 : 277/648),
    pueblo: pueblo === 'all' ? 1 : (pueblo === 'Si' ? 200/648 : 439/648),
    rol: rol === 'all' ? 1 : (rol === 'Estudiante' ? 622/648 : 25/648)
  }), [anio, genero, pueblo, rol]);

  const factor = useMemo(() => {
    return multipliers.anio * multipliers.genero * multipliers.pueblo * multipliers.rol;
  }, [multipliers]);

  const getFactorExcluding = (dim: keyof typeof multipliers) => {
    let f = 1;
    Object.entries(multipliers).forEach(([key, val]) => {
      if (key !== dim) f *= val;
    });
    return f;
  };

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
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-900 leading-tight">EduEtnica</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Premium Analytics</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Fingerprint size={20} />} label="General" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          <NavItem icon={<Globe size={20} />} label="Identidad" active={activeTab === 'lengua'} onClick={() => setActiveTab('lengua')} />
          <NavItem icon={<ShieldAlert size={20} />} label="Discriminación" active={activeTab === 'discriminacion'} onClick={() => setActiveTab('discriminacion')} />
          <NavItem icon={<School size={20} />} label="Universidad" active={activeTab === 'uni'} onClick={() => setActiveTab('uni')} />
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl group cursor-pointer overflow-hidden relative">
            <div className="absolute -right-4 -top-4 bg-emerald-500/20 h-24 w-24 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-all duration-500" />
            <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Multianual 2024-26</p>
            <p className="text-sm font-medium text-slate-300 mb-4 leading-relaxed relative z-10">Consolidado interactivo.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2 relative z-10">
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
        <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50 px-6 md:px-10 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h1 className="text-2xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Análisis Étnico</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Live Data</span>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stats.total} Respuestas</p>
              </div>
            </motion.div>
            
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="btn-primary group h-14 px-8">
              <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Publicar Reporte</span>
            </motion.button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
          <section className="bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 rounded-full text-white">
              <Filter size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filtros Inteligentes</span>
            </div>
            
            <div className="flex flex-wrap gap-2 flex-1">
              <FilterSelect label="Año" value={anio} onChange={setAnio} options={['all', '2024', '2025', '2026']} />
              <FilterSelect label="Género" value={genero} onChange={setGenero} options={['all', 'Hombre', 'Mujer']} />
              <FilterSelect label="Pueblo" value={pueblo} onChange={setPueblo} options={['all', 'Si', 'No']} />
              <FilterSelect label="Rol" value={rol} onChange={setRol} options={['all', 'Estudiante', 'Docente']} />
            </div>

            <button onClick={resetFilters} className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-full group">
              <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Resetear
            </button>
          </section>

          <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard icon={<Users size={20} />} label="Muestra" value={stats.total} sub="Total" color="blue" delay={0} />
            <KPICard icon={<Globe size={20} />} label="Origen" value={stats.pueblo} sub={`${stats.puebloPct}% Pueblo`} color="emerald" delay={0.1} />
            <KPICard icon={<ShieldAlert size={20} />} label="Casos" value={stats.disc} sub={`${stats.discPct}% Disc.`} color="red" alert delay={0.2} />
            <KPICard icon={<Languages size={20} />} label="Lengua" value={stats.quechua} sub="Quechua" color="purple" delay={0.3} />
            <KPICard icon={<Heart size={20} />} label="Identidad" value={stats.orgulloso} sub="Orgullo" color="emerald" delay={0.4} />
            <KPICard icon={<TrendingUp size={20} />} label="Impacto" value={stats.servicios} sub="Demanda" color="amber" delay={0.5} />
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 pb-24"
            >
              {activeTab === 'general' && <GeneralTab factor={factor} setGenero={setGenero} setAnio={setAnio} getFactorExcluding={getFactorExcluding} activeFilters={{anio, genero}} />}
              {activeTab === 'lengua' && <LenguaTab factor={factor} setPueblo={setPueblo} getFactorExcluding={getFactorExcluding} activeFilters={{pueblo}} />}
              {activeTab === 'discriminacion' && <DiscriminacionTab factor={factor} setAnio={setAnio} getFactorExcluding={getFactorExcluding} activeFilters={{anio}} />}
              {activeTab === 'uni' && <UniTab factor={factor} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ y: 50, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 50, scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl border border-slate-100">
              <div className="flex justify-between items-start mb-10">
                <div className="h-16 w-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100">
                  <Share2 size={32} />
                </div>
                <button onClick={() => setShowModal(false)} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>
              <h2 className="text-4xl font-black font-outfit mb-4 text-slate-900">Compartir Dashboard</h2>
              <p className="text-slate-500 mb-10 leading-relaxed">Comparte el estado actual de los filtros con colegas o autoridades universitarias.</p>
              <div className="bg-slate-50 border-2 border-slate-200 p-6 rounded-3xl mb-10 flex items-center justify-between gap-4">
                <code className="text-sm font-bold text-slate-800 truncate">https://etnica.univ.edu/v3?f={factor.toFixed(2)}</code>
                <button className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all">Copiar</button>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all">Generar PDF</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full hover:border-primary transition-all">
      <span className="text-[10px] font-black text-slate-400 uppercase">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer">
        {options.map(opt => <option key={opt} value={opt}>{opt === 'all' ? 'Todos' : opt}</option>)}
      </select>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all group ${active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>
      <div className="flex items-center gap-5">
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
        <span className={`text-sm font-black tracking-tight ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
      </div>
      {active ? <ChevronRight size={18} className="opacity-60" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-slate-400 transition-colors" />}
    </button>
  );
}

function KPICard({ icon, label, value, sub, color, alert, delay }: { icon: React.ReactNode, label: string, value: string | number, sub: string, color: string, alert?: boolean, delay: number }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-600', emerald: 'bg-emerald-600', red: 'bg-red-600', purple: 'bg-purple-600', amber: 'bg-amber-600' };
  const textMap: Record<string, string> = { blue: 'text-blue-600', emerald: 'text-emerald-600', red: 'text-red-600', purple: 'text-purple-600', amber: 'text-amber-600' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
      <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full ${colorMap[color]} opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-150`} />
      <div className="flex items-center justify-between mb-6">
        <div className={`h-12 w-12 rounded-2xl ${colorMap[color]} text-white flex items-center justify-center shadow-lg shadow-inner`}>{icon}</div>
        {alert && <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black font-outfit ${textMap[color]} tracking-tight mb-1`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-500 opacity-60 uppercase tracking-widest">{sub}</p>
    </motion.div>
  );
}

function GeneralTab({ factor, setGenero, setAnio, getFactorExcluding, activeFilters }: { 
  factor: number, setGenero: (v: string) => void, setAnio: (v: string) => void, getFactorExcluding: (d: any) => number, activeFilters: { anio: string, genero: string }
}) {
  const fGen = getFactorExcluding('genero');
  const genData = [
    { name: 'Hombre', value: (activeFilters.genero === 'all' || activeFilters.genero === 'Hombre') ? Math.round(RAW_DATA.genero.Hombre * fGen) : 0, percent: Math.round(371/648*100) },
    { name: 'Mujer', value: (activeFilters.genero === 'all' || activeFilters.genero === 'Mujer') ? Math.round((RAW_DATA.genero.Mujer + RAW_DATA.genero['Mujer, No indica']) * fGen) : 0, percent: Math.round(277/648*100) }
  ];

  const fAnio = getFactorExcluding('anio');
  const anioData = Object.entries(RAW_DATA.anios).map(([name, value]) => ({ 
    name, value: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(value * fAnio) : 0, percent: Math.round(value/648*100)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 card-premium relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-outfit">Distribución Género</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <MousePointer2 size={12} className="text-emerald-500" /> Clic para filtrar
            </p>
          </div>
          {activeFilters.genero !== 'all' && (
            <button onClick={() => setGenero('all')} className="h-8 w-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
              <RefreshCcw size={14} />
            </button>
          )}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={genData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} cornerRadius={10} dataKey="value" stroke="none"
                activeShape={renderActiveShape}
                onClick={(data) => data && data.name && setGenero(data.name)} className="cursor-pointer focus:outline-none"
              >
                {genData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-7 card-premium group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-outfit">Historial de Registros</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Interacción multianual</p>
          </div>
          {activeFilters.anio !== 'all' && (
            <button onClick={() => setAnio('all')} className="h-8 w-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
              <RefreshCcw size={14} />
            </button>
          )}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(s) => s?.activeLabel && setAnio(String(s.activeLabel))}>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(55,138,221,0.05)', radius: 10 }} />
              <Bar 
                dataKey="value" fill="#378ADD" radius={[12, 12, 4, 4]} barSize={50} className="cursor-pointer focus:outline-none" 
                activeBar={{ fill: '#1D9E75', radius: [12, 12, 4, 4] }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-12 card-premium">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm"><Users size={20} /></div>
          <h3 className="text-xl font-black text-slate-900 font-outfit">Curva Demográfica (Edad)</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={Object.entries(RAW_DATA.edad).map(([name, value]) => ({ name, value: Math.round(value * factor) }))}>
              <defs>
                <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7F77DD" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7F77DD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#7F77DD" strokeWidth={4} fillOpacity={1} fill="url(#colorAge)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function LenguaTab({ factor, setPueblo, getFactorExcluding, activeFilters }: { 
  factor: number, setPueblo: (v: string) => void, getFactorExcluding: (d: any) => number, activeFilters: { pueblo: string }
}) {
  const fPueblo = getFactorExcluding('pueblo');
  const puebloData = [
    { name: 'Si', value: (activeFilters.pueblo === 'all' || activeFilters.pueblo === 'Si') ? Math.round(RAW_DATA.pueblo.Sí * fPueblo) : 0, percent: Math.round(200/648*100) },
    { name: 'No', value: (activeFilters.pueblo === 'all' || activeFilters.pueblo === 'No') ? Math.round((RAW_DATA.pueblo.No + RAW_DATA.pueblo['Sí/No']) * fPueblo) : 0, percent: Math.round(448/648*100) }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 card-premium">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 font-outfit">Pueblo Originario</h3>
          {activeFilters.pueblo !== 'all' && (
            <button onClick={() => setPueblo('all')} className="h-8 w-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
              <RefreshCcw size={14} />
            </button>
          )}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={puebloData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} cornerRadius={10} dataKey="value" stroke="none"
                activeShape={renderActiveShape}
                onClick={(data) => data && data.name && setPueblo(data.name)} className="cursor-pointer focus:outline-none"
              >
                <Cell fill="#1D9E75" />
                <Cell fill="#E24B4A" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-7 card-premium">
        <h3 className="text-xl font-black text-slate-900 font-outfit mb-8">Tipos de Pueblo</h3>
        <div className="space-y-6">
          {Object.entries(RAW_DATA.puebloTipo).sort((a,b)=>b[1]-a[1]).map(([name, value], idx) => {
            const v = Math.round(value * factor);
            const total = Math.round(58 * factor);
            return (
              <motion.div key={name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">{name}</span>
                  <span className="text-sm font-black text-slate-900 font-outfit">{v}</span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(v / total) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-100" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DiscriminacionTab({ factor, setAnio, getFactorExcluding, activeFilters }: { 
  factor: number, setAnio: (v: string) => void, getFactorExcluding: (d: any) => number, activeFilters: { anio: string }
}) {
  const fAnio = getFactorExcluding('anio');
  const anioData = Object.entries(RAW_DATA.discAnio).map(([name, val]) => ({
    name, sí: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(val.Sí * fAnio) : 0, no: (activeFilters.anio === 'all' || activeFilters.anio === name) ? Math.round(val.No * fAnio) : 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 card-premium">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">Evolución de Casos de Discriminación</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Análisis histórico comparativo</p>
          </div>
          {activeFilters.anio !== 'all' && (
            <button onClick={() => setAnio('all')} className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-500 transition-all">
              <RefreshCcw size={12} /> Mostrar todos
            </button>
          )}
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(s) => s?.activeLabel && setAnio(String(s.activeLabel))}>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 800 }} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(226,75,74,0.02)', radius: 15 }} />
              <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ paddingBottom: 20 }} />
              <Bar dataKey="sí" name="Reportados" stackId="a" fill="#E24B4A" radius={[0, 0, 0, 0]} barSize={60} className="cursor-pointer" activeBar={{ fill: '#A32D2D' }} />
              <Bar dataKey="no" name="Sin Casos" stackId="a" fill="#1D9E75" radius={[15, 15, 0, 0]} barSize={60} className="cursor-pointer" activeBar={{ fill: '#0F6E56', radius: [15, 15, 0, 0] }} />
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 card-premium p-0 overflow-hidden">
        <div className="p-8 pb-0">
          <h3 className="text-2xl font-black text-slate-900 font-outfit">Percepción Institucional</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Visión Intercultural de la Universidad</p>
        </div>
        <div className="h-[600px] -mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
              <Radar name="Positivo" dataKey="A" stroke="#378ADD" strokeWidth={3} fill="#378ADD" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {RAW_DATA.uniQs.map((q, idx) => (
          <motion.div key={q.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{idx + 1}. Métrica Intercultural</span>
              <span className="text-lg font-black text-blue-600 font-outfit">{q.pos}%</span>
            </div>
            <h4 className="text-sm font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">{q.label}</h4>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <motion.div initial={{ width: 0 }} animate={{ width: `${q.pos}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-blue-500 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
