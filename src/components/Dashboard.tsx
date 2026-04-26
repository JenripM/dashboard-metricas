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
  XCircle,
  Zap,
  Target
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
  Sector,
  Curve
} from 'recharts';

type TabType = 'general' | 'lengua' | 'discriminacion' | 'uni';

const COLORS = [
  '#4F46E5', // Indigo Electric
  '#10B981', // Emerald Bright
  '#F43F5E', // Rose Vibrant
  '#8B5CF6', // Violet Deep
  '#F59E0B', // Amber Glow
  '#06B6D4', // Cyan Neon
  '#EC4899', // Pink Punch
  '#84CC16', // Lime Zest
  '#6366F1', // Indigo Soft
  '#14B8A6'  // Teal Modern
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[140px] animate-in fade-in zoom-in duration-200">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label || payload[0].name}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-black font-outfit text-slate-900">{payload[0].value}</span>
          <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
            {payload[0].payload.percent ? `${payload[0].payload.percent}%` : ''}
          </span>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest fill-slate-400">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" className="text-2xl font-black font-outfit fill-slate-900">
        {`${(percent < 1 ? percent * 100 : percent).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={8}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={4} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-[10px] font-bold">{`Val: ${value}`}</text>
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
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <Zap size={24} className="relative z-10 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-900 leading-tight">EduEtnica</h2>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Premium Analytics</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Fingerprint size={20} />} label="General" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          <NavItem icon={<Globe size={20} />} label="Identidad" active={activeTab === 'lengua'} onClick={() => setActiveTab('lengua')} />
          <NavItem icon={<ShieldAlert size={20} />} label="Discriminación" active={activeTab === 'discriminacion'} onClick={() => setActiveTab('discriminacion')} />
          <NavItem icon={<School size={20} />} label="Universidad" active={activeTab === 'uni'} onClick={() => setActiveTab('uni')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-2xl group cursor-pointer overflow-hidden relative border-l-4 border-l-indigo-400">
            <div className="absolute -right-4 -top-4 bg-indigo-500/20 h-24 w-24 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-all duration-500 animate-pulse" />
            <p className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">Reporte Multianual</p>
            <p className="text-sm font-medium text-slate-300 mb-4 leading-relaxed relative z-10">Explora tendencias profundas.</p>
            <button className="w-full bg-white/10 hover:bg-indigo-500 py-3 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2 relative z-10 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95">
              <Download size={14} /> Exportar Reporte
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
        <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50 px-6 md:px-10 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-600 h-1.5 w-6 rounded-full" />
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">Dashboard Interactivo v3</p>
              </div>
              <h1 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 tracking-tighter leading-none">Análisis de Percepción Étnica</h1>
            </motion.div>
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actualizado hoy</p>
                <p className="text-sm font-bold text-slate-900 font-outfit">25 Abr, 2026</p>
              </div>
              <button onClick={() => setShowModal(true)} className="bg-slate-900 hover:bg-indigo-600 text-white flex items-center gap-3 h-14 px-8 rounded-2xl font-black shadow-xl shadow-slate-200 transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Share2 size={18} className="relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Compartir</span>
              </button>
            </motion.div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12">
          <section className="bg-white p-4 rounded-[3rem] border border-slate-200 shadow-2xl shadow-indigo-100/20 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-200">
              <Filter size={18} className="text-white" />
              <span className="text-xs font-black uppercase tracking-widest">Filtros Avanzados</span>
            </div>
            
            <div className="flex flex-wrap gap-3 flex-1">
              <FilterSelect label="Año" value={anio} onChange={setAnio} options={['all', '2024', '2025', '2026']} />
              <FilterSelect label="Género" value={genero} onChange={setGenero} options={['all', 'Hombre', 'Mujer']} />
              <FilterSelect label="Pueblo" value={pueblo} onChange={setPueblo} options={['all', 'Si', 'No']} />
              <FilterSelect label="Rol" value={rol} onChange={setRol} options={['all', 'Estudiante', 'Docente']} />
            </div>

            <button onClick={resetFilters} className="flex items-center gap-2 px-8 py-3 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-full group">
              <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              Limpiar Selección
            </button>
          </section>

          <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <KPICard icon={<Users size={20} />} label="Muestra" value={stats.total} sub="Respuestas" color="blue" delay={0} />
            <KPICard icon={<Globe size={20} />} label="Origen" value={stats.pueblo} sub={`${stats.puebloPct}% Pueblo`} color="emerald" delay={0.1} />
            <KPICard icon={<ShieldAlert size={20} />} label="Alertas" value={stats.disc} sub={`${stats.discPct}% Disc.`} color="red" alert delay={0.2} />
            <KPICard icon={<Languages size={20} />} label="Lengua" value={stats.quechua} sub="Quechua" color="purple" delay={0.3} />
            <KPICard icon={<Heart size={20} />} label="Identidad" value={stats.orgulloso} sub="Orgullo" color="emerald" delay={0.4} />
            <KPICard icon={<TrendingUp size={20} />} label="Demanda" value={stats.servicios} sub="Crecimiento" color="amber" delay={0.5} />
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12 pb-32"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ y: 100, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 100, scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="relative bg-white rounded-[3.5rem] p-16 max-w-2xl w-full shadow-[0_0_100px_-20px_rgba(79,70,229,0.5)] border border-slate-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
              <div className="flex justify-between items-start mb-12">
                <div className="h-20 w-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                  <Share2 size={40} />
                </div>
                <button onClick={() => setShowModal(false)} className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <XCircle size={24} />
                </button>
              </div>
              <h2 className="text-5xl font-black font-outfit mb-6 text-slate-900 tracking-tighter">Comparte tu Visión</h2>
              <p className="text-slate-500 text-lg mb-12 leading-relaxed">Genera un enlace único con los filtros aplicados actualmente para enviárselo a tu equipo.</p>
              <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] mb-12 flex items-center justify-between gap-6 group hover:border-indigo-200 transition-colors">
                <code className="text-sm font-bold text-slate-800 truncate select-all">https://etnica.univ.edu/v3?f={factor.toFixed(2)}&t={activeTab}</code>
                <button className="bg-white border border-slate-200 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all hover:bg-indigo-600 hover:text-white shadow-sm active:scale-95">Copiar URL</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-indigo-600 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-sm uppercase tracking-widest">Descargar PDF</button>
                <button className="bg-slate-900 text-white font-black py-6 rounded-3xl shadow-2xl shadow-slate-300 hover:bg-slate-800 active:scale-95 transition-all text-sm uppercase tracking-widest">Enviar por Email</button>
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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl hover:border-indigo-400 hover:bg-white hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-indigo-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm font-black text-slate-800 outline-none cursor-pointer pr-4 appearance-none">
        {options.map(opt => <option key={opt} value={opt}>{opt === 'all' ? 'Todos' : opt}</option>)}
      </select>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all group relative overflow-hidden ${active ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}>
      <div className="flex items-center gap-6 relative z-10">
        <div className={`transition-all duration-500 ${active ? 'scale-125 rotate-[360deg]' : 'group-hover:scale-110 group-hover:text-indigo-500'}`}>{icon}</div>
        <span className={`text-sm font-black tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      </div>
      {active ? <ChevronRight size={20} className="relative z-10 opacity-60" /> : <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-all duration-300 group-hover:scale-150" />}
      {active && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500" />}
    </button>
  );
}

function KPICard({ icon, label, value, sub, color, alert, delay }: { icon: React.ReactNode, label: string, value: string | number, sub: string, color: string, alert?: boolean, delay: number }) {
  const colorMap: Record<string, string> = { blue: 'bg-indigo-600', emerald: 'bg-emerald-500', red: 'bg-rose-500', purple: 'bg-violet-600', amber: 'bg-amber-500' };
  const textMap: Record<string, string> = { blue: 'text-indigo-600', emerald: 'text-emerald-500', red: 'text-rose-500', purple: 'text-violet-600', amber: 'text-amber-500' };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all group overflow-hidden relative border-b-4 border-b-transparent hover:border-b-indigo-500">
      <div className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full ${colorMap[color]} opacity-0 group-hover:opacity-[0.05] transition-all duration-1000 group-hover:scale-150 blur-3xl`} />
      <div className="flex items-center justify-between mb-8">
        <div className={`h-14 w-14 rounded-2xl ${colorMap[color]} text-white flex items-center justify-center shadow-lg shadow-inner group-hover:rotate-12 transition-transform duration-500`}>{icon}</div>
        {alert && <div className="h-4 w-4 rounded-full bg-rose-500 animate-ping shadow-lg shadow-rose-200" />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className={`text-4xl font-black font-outfit ${textMap[color]} tracking-tighter mb-2`}>{value}</p>
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${colorMap[color]}`} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sub}</p>
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 card-premium relative group">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">Identidad de Género</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <MousePointer2 size={12} className="text-indigo-500 animate-bounce" /> Hover para ver detalles
            </p>
          </div>
          {activeFilters.genero !== 'all' && (
            <button onClick={() => setGenero('all')} className="h-10 w-10 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm border border-slate-100">
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={genData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={8} cornerRadius={12} dataKey="value" stroke="none"
                activeShape={renderActiveShape}
                onClick={(data) => data && data.name && setGenero(data.name)} className="cursor-pointer focus:outline-none"
              >
                {genData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          {genData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-[10px] font-black uppercase text-slate-500">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 card-premium group">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">Volumen de Participación</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Tendencia de respuestas anuales</p>
          </div>
          {activeFilters.anio !== 'all' && (
            <button onClick={() => setAnio('all')} className="h-10 w-10 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm border border-slate-100">
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(s) => s?.activeLabel && setAnio(String(s.activeLabel))}>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 900, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.03)', radius: 15 }} />
              <Bar 
                dataKey="value" fill="#4F46E5" radius={[15, 15, 5, 5]} barSize={60} className="cursor-pointer focus:outline-none" 
                activeBar={{ fill: '#818CF8' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-12 card-premium overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform"><Target size={28} className="animate-pulse" /></div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">Curva Demográfica por Edad</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={12} className="text-amber-500" /> Toca los puntos para interactuar
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={Object.entries(RAW_DATA.edad).map(([name, value]) => ({ name, value: Math.round(value * factor) }))}>
              <defs>
                <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#4F46E5', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4F46E5" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#colorAge)"
                activeDot={{ 
                  r: 10, 
                  fill: '#fff', 
                  stroke: '#4F46E5', 
                  strokeWidth: 4,
                  className: "animate-bounce"
                }}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 card-premium relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black text-slate-900 font-outfit">Pueblo Originario</h3>
          {activeFilters.pueblo !== 'all' && (
            <button onClick={() => setPueblo('all')} className="h-10 w-10 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 shadow-sm">
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={puebloData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} cornerRadius={12} dataKey="value" stroke="none"
                activeShape={renderActiveShape}
                onClick={(data) => data && data.name && setPueblo(data.name)} className="cursor-pointer focus:outline-none"
              >
                <Cell fill="#10B981" />
                <Cell fill="#F43F5E" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-10 mt-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[#10B981] shadow-lg shadow-emerald-100" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Identificado</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[#F43F5E] shadow-lg shadow-rose-100" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">No identificado</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 card-premium">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-6 transition-transform"><Globe size={28} /></div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-outfit">Distribución por Etnias</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Desglose por pueblo específico</p>
          </div>
        </div>
        <div className="space-y-8">
          {Object.entries(RAW_DATA.puebloTipo).sort((a,b)=>b[1]-a[1]).map(([name, value], idx) => {
            const v = Math.round(value * factor);
            const total = Math.round(58 * factor);
            return (
              <motion.div key={name} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="group">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.1em] group-hover:text-emerald-600 transition-colors">{name}</span>
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-50 px-3 py-1 rounded-lg text-sm font-black text-slate-900 font-outfit">{v}</span>
                    <span className="text-[10px] font-bold text-slate-400">{Math.round((v/total)*100)}%</span>
                  </div>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(v / total) * 100}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.div>
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-12 card-premium">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Registro Histórico de Discriminación</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Comparativa Anual SI vs NO</p>
          </div>
          {activeFilters.anio !== 'all' && (
            <button onClick={() => setAnio('all')} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl active:scale-95">
              <RefreshCcw size={14} /> Mostrar todos los años
            </button>
          )}
        </div>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anioData} onClick={(s) => s?.activeLabel && setAnio(String(s.activeLabel))}>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 16, fontWeight: 900, fill: '#1e293b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: 'rgba(244,63,94,0.03)', radius: 20 }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 40 }} />
              <Bar dataKey="sí" name="Casos Reportados" stackId="a" fill="#F43F5E" radius={[0, 0, 0, 0]} barSize={80} className="cursor-pointer" activeBar={{ fill: '#FB7185' }} />
              <Bar dataKey="no" name="Sin Reporte" stackId="a" fill="#10B981" radius={[20, 20, 0, 0]} barSize={80} className="cursor-pointer" activeBar={{ fill: '#34D399' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function UniTab({ factor }: { factor: number }) {
  const radarData = RAW_DATA.uniQs.map(q => ({
    subject: q.label.length > 20 ? q.label.slice(0, 20) + '...' : q.label,
    A: q.pos,
    fullMark: 100,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-12 card-premium p-0 overflow-hidden group">
        <div className="p-12 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <span className="h-2 w-10 bg-indigo-600 rounded-full" />
            <h3 className="text-3xl font-black text-slate-900 font-outfit">Análisis Institucional</h3>
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Percepción de políticas interculturales</p>
        </div>
        <div className="h-[650px] -mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeWidth={3} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569', fontWeight: 900 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
              <Radar name="Índice Positivo" dataKey="A" stroke="#4F46E5" strokeWidth={5} fill="#4F46E5" fillOpacity={0.15} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RAW_DATA.uniQs.map((q, idx) => (
          <motion.div key={q.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700 blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Métrica {idx + 1}</span>
              <span className="text-2xl font-black text-indigo-600 font-outfit">{q.pos}%</span>
            </div>
            <h4 className="text-base font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors relative z-10">{q.label}</h4>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner relative z-10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${q.pos}%` }} transition={{ duration: 2, ease: "backOut" }} className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-100" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
