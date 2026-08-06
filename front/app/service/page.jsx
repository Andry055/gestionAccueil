'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AuthGuard from '@/components/AuthGuard';
import AjoutService from '@/components/AjoutService';
import ListeService from '@/components/ListeService';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Building2 } from 'lucide-react';

function ServiceContent() {
  const { darkMode } = useDarkMode();
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filters, setFilters] = useState({ id: '', nom: '', porte: '', etage: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [listeOpen, setListeOpen] = useState(null);
  const itemsParPage = 20;

  useEffect(() => { fetchServices(); }, []);
  const fetchServices = () => { setChargement(true); api.get('/service/listeService').then((res) => setServices(res.data?.data || [])).catch(console.error).finally(() => setChargement(false)); };

  const filteredServices = useMemo(() => services.filter((s) =>
    (filters.id === '' || s.id_lieu?.toString().includes(filters.id)) &&
    (filters.nom === '' || s.nom_lieu?.toLowerCase().includes(filters.nom.toLowerCase())) &&
    (filters.porte === '' || s.porte?.toString().includes(filters.porte)) &&
    (filters.etage === '' || s.etage?.toString().includes(filters.etage))), [services, filters]);

  const sortedServices = useMemo(() => {
    if (!sortConfig.key) return filteredServices;
    return [...filteredServices].sort((a, b) => {
      let aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase(); if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1; if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1; return 0;
    });
  }, [filteredServices, sortConfig]);

  const totalPages = Math.ceil(sortedServices.length / itemsParPage);
  const paginated = sortedServices.slice((pageCourante - 1) * itemsParPage, pageCourante * itemsParPage);
  const handleSort = (key) => setSortConfig((p) => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));

  const bg = darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';
  const cardBg = darkMode ? 'bg-slate-800/90 border-slate-700/50 shadow-xl shadow-black/20' : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50';
  const textColor = darkMode ? 'text-white' : 'text-slate-900';
  const mutedText = darkMode ? 'text-slate-300' : 'text-slate-600';
  const border = darkMode ? 'border-slate-700/50' : 'border-slate-200/60';
  const inputBg = darkMode ? 'bg-slate-700/50' : 'bg-slate-50/80';

  return (
    <div className={`min-h-screen ${bg} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${textColor}`}>Services</h1>
              <p className={`text-sm ${mutedText}`}>Gérez les services de l&apos;organisation</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAjoutOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg shadow-purple-500/30"
          >
            <Plus size={20} /> Nouveau service
          </motion.button>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardBg} rounded-2xl border backdrop-blur-xl p-4 mb-6`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom du service' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${mutedText} group-focus-within:text-purple-500`} />
                <input
                  type="text" placeholder={f.placeholder}
                  value={filters[f.key]}
                  onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPageCourante(1); }}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tableau */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBg} rounded-2xl border backdrop-blur-xl overflow-hidden`}
        >
          {chargement ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p className={`text-sm ${mutedText}`}>Chargement des services...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${border} bg-gradient-to-r from-transparent via-purple-500/5 to-transparent`}>
                      {[{ label: 'ID', key: 'id_lieu' }, { label: 'Nom', key: 'nom_lieu' }, { label: 'Porte', key: 'porte' }, { label: 'Étage', key: 'etage' }, { label: 'Actions', key: null }].map((h) => (
                        <th
                          key={h.label}
                          onClick={() => h.key && handleSort(h.key)}
                          className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${mutedText} ${h.key ? 'cursor-pointer hover:text-purple-600 dark:hover:text-purple-400' : ''} transition-colors`}
                        >
                          <div className="flex items-center gap-1.5">
                            {h.label}
                            {h.key && <ArrowUpDown size={12} className="opacity-50" />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginated.map((s, idx) => (
                        <motion.tr
                          key={s.id_lieu}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`border-b ${border} hover:bg-gradient-to-r hover:from-purple-500/5 hover:via-transparent hover:to-transparent dark:hover:from-purple-500/10 transition-all duration-200`}
                        >
                          <td className={`px-4 py-3.5 font-mono font-medium ${textColor}`}>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-violet-500/10 dark:from-purple-500/20 dark:to-violet-500/20 text-xs font-bold">
                              {s.id_lieu}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                <Building2 size={14} />
                              </div>
                              <span className={`font-medium ${textColor}`}>{s.nom_lieu}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 text-xs font-medium border border-violet-200 dark:border-violet-500/20">
                              Porte {s.porte || '-'}
                            </span>
                          </td>
                          <td className={`px-4 py-3.5 ${mutedText}`}>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              Étage {s.etage || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setListeOpen(s.id_lieu)}
                              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/15 transition-all"
                              title="Voir visiteurs"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginated.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <Building2 size={40} className="text-slate-300 dark:text-slate-600" />
                            <p className={`text-sm ${mutedText}`}>Aucun service trouvé</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-6 py-4 border-t ${border} bg-gradient-to-r from-transparent via-purple-500/5 to-transparent`}>
                  <p className={`text-sm ${mutedText}`}>
                    Page <span className="font-semibold text-purple-600 dark:text-purple-400">{pageCourante}</span> sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
                      disabled={pageCourante === 1}
                      className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-slate-700/50 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={18} />
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, pageCourante - 3), pageCourante + 2)
                      .map(page => (
                        <motion.button
                          key={page}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPageCourante(page)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === pageCourante
                              ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25 scale-110'
                              : 'hover:bg-white/20 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante((p) => Math.min(totalPages, p + 1))}
                      disabled={pageCourante === totalPages}
                      className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-slate-700/50 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
      <AjoutService open={ajoutOpen} onClose={() => setAjoutOpen(false)} onSuccess={fetchServices} />
      <ListeService serviceId={listeOpen} onClose={() => setListeOpen(null)} />
    </div>
  );
}

export default function ServicePage() { return <AuthGuard><ServiceContent /></AuthGuard>; }
