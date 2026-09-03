import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Activity, BarChart3, Loader2, RefreshCw, TrendingUp } from 'lucide-react';

function StatistiquesContent() {
  const [timeRange, setTimeRange] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);

  const dailyData = [
    { name: 'Lun', visites: 45, visiteurs: 38 }, { name: 'Mar', visites: 52, visiteurs: 41 },
    { name: 'Mer', visites: 38, visiteurs: 30 }, { name: 'Jeu', visites: 65, visiteurs: 52 },
    { name: 'Ven', visites: 48, visiteurs: 40 }, { name: 'Sam', visites: 25, visiteurs: 20 },
    { name: 'Dim', visites: 15, visiteurs: 12 },
  ];

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      if (timeRange === 'daily') {
        setChartData(dailyData);
      } else {
        const endpoint = timeRange === 'weekly' ? '/visite/chartSemaine' : '/visite/chartMois';
        const res = await api.get(endpoint);
        const rawData = res.data?.data || [];
        const mapped = rawData.map((item) => ({
          name: item.mois || item.semaine || '',
          visites: parseInt(item.nombre_visites) || 0,
          visiteurs: 0,
        }));
        setChartData(mapped);
      }
    } catch (err) { setError('Erreur lors du chargement'); console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [timeRange]);

  const totalVisits = chartData.reduce((s, d) => s + (d.visites || 0), 0);
  const totalVisitors = chartData.reduce((s, d) => s + (d.visiteurs || 0), 0);
  const ratio = totalVisitors > 0 ? (totalVisits / totalVisitors).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Statistiques</h1>
            <p className="page-subtitle">Analysez les tendances des visites</p>
          </div>
          <button onClick={fetchData} className="btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>

        {/* ═══ Time range ═══════════════════════════ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ value: 'daily', label: 'Journalier' }, { value: 'weekly', label: 'Hebdomadaire' }, { value: 'monthly', label: 'Mensuel' }].map((opt) => (
            <button key={opt.value} onClick={() => setTimeRange(opt.value)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${timeRange === opt.value ? 'bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-400)] text-white shadow-[var(--shadow-blue)]' : 'bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-secondary)]'}`}>{opt.label}</button>
          ))}
        </div>

        {/* ═══ KPI Cards ════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[{ label: 'Visiteurs uniques totaux', value: totalVisitors, icon: Users, variant: 'blue' }, { label: 'Visites totales', value: totalVisits, icon: Activity, variant: 'green' }, { label: 'Ratio visites/visiteurs', value: ratio, icon: TrendingUp, variant: 'purple' }].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="kpi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">{stat.label}</p>
                  <p className="kpi-value">{stat.value}</p>
                </div>
                <div className={`kpi-icon kpi-icon--light`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══ Chart ════════════════════════════════ */}
        <div className="chart-surface">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[var(--primary-500)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Évolution des visites</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="loading-spinner" /></div>
          ) : error ? (
            <div className="text-center py-16"><p className="text-red-500 mb-4">{error}</p><button onClick={fetchData} className="btn-primary">Réessayer</button></div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }} />
                <Legend formatter={(value) => <span style={{ color: '#4b5563' }}>{value}</span>} />
                <Line type="monotone" dataKey="visites" stroke="#1e40af" strokeWidth={3} dot={{ fill: '#1e40af', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Visites" />
                <Line type="monotone" dataKey="visiteurs" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Visiteurs uniques" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StatistiquesPage() { return <AuthGuard><StatistiquesContent /></AuthGuard>; }
