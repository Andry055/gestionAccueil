'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Building2, Clock, Image, FileText, Search, RefreshCw, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

function SuperAdminDashboardContent() {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [stats, setStats] = useState({ totalVisites: 0, totalServices: 0, visitesEnCours: 0 });

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/visite/';
      if (timeRange === 'today') endpoint += 'aujourdhui';
      else if (timeRange === 'week') endpoint += 'semaine';
      else if (timeRange === 'month') endpoint += 'mois';
      else if (timeRange === 'custom') { endpoint += 'custom'; }
      const res = await api.get(endpoint, timeRange === 'custom' ? { params: { start: customStart, end: customEnd } } : {});
      const rawData = res.data?.data || [];
      // Map API data format (nom + nombre_visites) to chart format (nom_lieu + nb_visites)
      const data = rawData.map((item) => ({
        nom_lieu: item.nom || item.nom_lieu || '',
        nb_visites: parseInt(item.nombre_visites || item.visites || item.nb_visites || 0),
      }));
      if (Array.isArray(data)) {
        setChartData(data);
        setStats({ totalVisites: data.reduce((s, i) => s + (i.nb_visites || 0), 0), totalServices: data.length, visitesEnCours: 0 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [timeRange, customStart, customEnd]);

  useEffect(() => { fetchChartData(); }, [fetchChartData]);

  const exportPNG = async () => {
    if (!chartRef.current) return;
    try { const dataUrl = await toPng(chartRef.current, { backgroundColor: darkMode ? '#1f2937' : '#ffffff' }); const link = document.createElement('a'); link.download = 'statistiques.png'; link.href = dataUrl; link.click(); } catch (err) { console.error(err); }
  };

  const exportPDF = async () => {
    if (!chartRef.current) return;
    try { const dataUrl = await toPng(chartRef.current, { backgroundColor: '#ffffff' }); const pdf = new jsPDF('landscape', 'mm', 'a4'); pdf.addImage(dataUrl, 'PNG', 10, 20, 280, 150); pdf.save('statistiques.pdf'); } catch (err) { console.error(err); }
  };

  const filteredData = chartData.filter((d) => d.nom_lieu?.toLowerCase().includes(searchTerm.toLowerCase()));

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div><h1 className={`text-3xl font-bold ${textColor}`}>Tableau de bord Super Admin</h1><p className={mutedText}>Bienvenue, {user?.username}</p></div>
          <div className="flex items-center gap-2">
            <button onClick={exportPNG} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all text-sm font-medium"><Image size={16} /> PNG</button>
            <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm font-medium"><FileText size={16} /> PDF</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[{ value: 'today', label: "Aujourd'hui" }, { value: 'week', label: 'Cette semaine' }, { value: 'month', label: 'Ce mois' }, { value: 'custom', label: 'Personnalisé' }].map((opt) => (
            <button key={opt.value} onClick={() => { setTimeRange(opt.value); if (opt.value === 'custom') setShowCustomDate(true); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${timeRange === opt.value ? 'bg-purple-600 text-white shadow-lg' : cardBg + ' border ' + border + ' hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{opt.label}</button>
          ))}
          <button onClick={fetchChartData} className={`p-2 rounded-xl ${cardBg} border ${border} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}><RefreshCw size={18} /></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[{ label: 'Visites totales', value: stats.totalVisites, icon: Users, color: 'blue' }, { label: 'Services visités', value: stats.totalServices, icon: Building2, color: 'purple' }, { label: 'En cours', value: stats.visitesEnCours, icon: Clock, color: 'green' }].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${cardBg} rounded-2xl p-6 shadow-sm border ${border}`}>
              <div className="flex items-center justify-between">
                <div><p className={`text-sm ${mutedText}`}>{stat.label}</p><p className={`text-3xl font-bold ${textColor} mt-1`}>{stat.value}</p></div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color === 'blue' ? (darkMode ? '#1e3a5f' : '#dbeafe') : stat.color === 'purple' ? (darkMode ? '#3b1f6e' : '#f3e8ff') : (darkMode ? '#1a4731' : '#d1fae5') }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color === 'blue' ? '#2563eb' : stat.color === 'purple' ? '#7c3aed' : '#059669' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${textColor}`}>Répartition des visites par service</h2>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Filtrer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`pl-9 pr-3 py-2 rounded-lg border ${border} bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-500 ${textColor}`} /></div>
          </div>
          <div ref={chartRef} className="w-full">
            {loading ? <div className="flex items-center justify-center py-16"><RefreshCw className="w-8 h-8 animate-spin text-purple-600" /></div> : filteredData.length === 0 ? <div className="text-center py-16 text-gray-400">Aucune donnée disponible</div> : (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={filteredData} dataKey="nb_visites" nameKey="nom_lieu" cx="50%" cy="50%" outerRadius={150} innerRadius={60} paddingAngle={3}>
                      {filteredData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} stroke={darkMode ? '#1f2937' : '#ffffff'} strokeWidth={2} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'), borderRadius: '12px', color: darkMode ? '#f3f4f6' : '#111827' }} />
                    <Legend formatter={(value) => <span style={{ color: darkMode ? '#f3f4f6' : '#111827' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

      {showCustomDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={"w-full max-w-md rounded-2xl shadow-2xl p-6 " + cardBg}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dates personnalisées</h3>
              <button onClick={() => setShowCustomDate(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className={"block text-sm font-medium " + mutedText + " mb-1"}>Date début</label><input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className={"w-full px-4 py-2.5 rounded-xl border " + border + " bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-500 " + textColor} /></div>
              <div><label className={"block text-sm font-medium " + mutedText + " mb-1"}>Date fin</label><input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className={"w-full px-4 py-2.5 rounded-xl border " + border + " bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-500 " + textColor} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCustomDate(false)} className={"flex-1 py-2.5 rounded-xl border " + border + " font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"}>Annuler</button>
              <button onClick={() => { setShowCustomDate(false); setTimeRange('custom'); }} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all">Appliquer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default function SuperAdminDashboardPage() { return <AuthGuard><SuperAdminDashboardContent /></AuthGuard>; }
