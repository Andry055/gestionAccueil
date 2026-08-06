'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AuthGuard from '@/components/AuthGuard';
import AjoutService from '@/components/AjoutService';
import ListeService from '@/components/ListeService';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Plus, Eye, Loader2, Building2, TrendingUp } from 'lucide-react';

function SuperAdminServiceContent() {
  const { darkMode } = useDarkMode();
  const [services, setServices] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [filters, setFilters] = useState({ id: '', nom: '', porte: '', etage: '' });
  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [listeOpen, setListeOpen] = useState(null);

  useEffect(() => { fetchServices(); fetchTopServices(); }, []);
  const fetchServices = () => { api.get('/service/listeService').then((res) => setServices(res.data?.data || [])).catch(console.error).finally(() => setLoading(false)); };
  const fetchTopServices = () => { api.get('/service/topServices').then((res) => setTopServices(res.data?.data || [])).catch(console.error).finally(() => setChartLoading(false)); };

  const filteredServices = useMemo(() => services.filter((s) =>
    (filters.id === '' || s.id_lieu?.toString().includes(filters.id)) &&
    (filters.nom === '' || s.nom_lieu?.toLowerCase().includes(filters.nom.toLowerCase())) &&
    (filters.porte === '' || s.porte?.toString().includes(filters.porte)) &&
    (filters.etage === '' || s.etage?.toString().includes(filters.etage))), [services, filters]);

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div><h1 className={`text-3xl font-bold ${textColor}`}>Gestion des services</h1><p className={mutedText}>Supervisez et gérez tous les services</p></div>
          <button onClick={() => setAjoutOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/25"><Plus size={20} /> Ajouter un service</button>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} p-6 mb-6`}>
          <div className="flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-purple-600" /><h2 className={`text-lg font-semibold ${textColor}`}>Top services visités</h2></div>
          {chartLoading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topServices}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="nom_lieu" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'), borderRadius: '12px', color: darkMode ? '#f3f4f6' : '#111827' }} />
                <Bar dataKey="visites" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} p-4 mb-6`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder={f.placeholder} value={filters[f.key]} onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))} className={`w-full pl-9 pr-3 py-2 rounded-lg border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-purple-500`} /></div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} overflow-hidden`}>
          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className={`border-b ${border}`}>{['ID', 'Nom', 'Porte', 'Étage', 'Actions'].map((h) => (<th key={h} className={`px-4 py-3 text-left font-medium ${mutedText}`}>{h}</th>))}</tr></thead>
                <tbody>
                  {filteredServices.map((s) => (
                    <tr key={s.id_lieu} className={`border-b ${border} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                      <td className="px-4 py-3 font-medium">{s.id_lieu}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 size={16} className="text-purple-500" />{s.nom_lieu}</div></td>
                      <td className="px-4 py-3">{s.porte}</td>
                      <td className="px-4 py-3">{s.etage}</td>
                      <td className="px-4 py-3"><button onClick={() => setListeOpen(s.id_lieu)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Voir visiteurs"><Eye size={16} /></button></td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun service trouvé</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <AjoutService open={ajoutOpen} onClose={() => setAjoutOpen(false)} onSuccess={fetchServices} />
      <ListeService serviceId={listeOpen} onClose={() => setListeOpen(null)} />
    </div>
  );
}

export default function SuperAdminServicePage() { return <AuthGuard><SuperAdminServiceContent /></AuthGuard>; }
