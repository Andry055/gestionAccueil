'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Activity, BarChart3, Loader2, RefreshCw, TrendingUp } from 'lucide-react';

function StatistiquesContent() {
  const { darkMode } = useDarkMode();
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
        // Map API data format (mois/semaine + nombre_visites) to chart format (name + visites + visiteurs)
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

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div><h1 className={`text-3xl font-bold ${textColor}`}>Statistiques</h1><p className={mutedText}>Analysez les tendances des visites</p></div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all text-sm font-medium"><RefreshCw size={16} /> Actualiser</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[{ value: 'daily', label: 'Journalier' }, { value: 'weekly', label: 'Hebdomadaire' }, { value: 'monthly', label: 'Mensuel' }].map((opt) => (
            <button key={opt.value} onClick={() => setTimeRange(opt.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${timeRange === opt.value ? 'bg-purple-600 text-white shadow-lg' : cardBg + ' border ' + border + ' hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{opt.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[{ label: 'Visiteurs uniques totaux', value: totalVisitors, icon: Users, color: 'blue' }, { label: 'Visites totales', value: totalVisits, icon: Activity, color: 'green' }, { label: 'Ratio visites/visiteurs', value: ratio, icon: TrendingUp, color: 'purple' }].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${cardBg} rounded-2xl p-6 shadow-sm border ${border}`}>
              <div className="flex items-center justify-between">
                <div><p className={`text-sm ${mutedText}`}>{stat.label}</p><p className={`text-3xl font-bold ${textColor} mt-1`}>{stat.value}</p></div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color === 'blue' ? (darkMode ? '#1e3a5f' : '#dbeafe') : stat.color === 'green' ? (darkMode ? '#1a4731' : '#d1fae5') : (darkMode ? '#3b1f6e' : '#f3e8ff') }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color === 'blue' ? '#2563eb' : stat.color === 'green' ? '#059669' : '#7c3aed' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} p-6`}>
          <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-purple-600" /><h2 className={`text-lg font-semibold ${textColor}`}>Évolution des visites</h2></div>
          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : error ? <div className="text-center py-16"><p className="text-red-500 mb-4">{error}</p><button onClick={fetchData} className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">Réessayer</button></div> : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'), borderRadius: '12px', color: darkMode ? '#f3f4f6' : '#111827' }} />
                <Legend formatter={(value) => <span style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>{value}</span>} />
                <Line type="monotone" dataKey="visites" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Visites" />
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
