'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, RotateCcw, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, History, Building2, User } from 'lucide-react';

function VisiteContent() {
  const { darkMode } = useDarkMode();
  const [visites, setVisites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [typeVisite, setTypeVisite] = useState('lieu');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const itemsParPage = 20;

  useEffect(() => { fetchVisites(); }, [typeVisite]);
  
  const fetchVisites = async () => {
    setChargement(true);
    try {
      const endpoint = typeVisite === 'lieu' ? '/visite/listeVisite' : '/visite/listeVisitePersonne';
      const res = await api.get(endpoint);
      setVisites(res.data?.data || []);
    } catch (err) { console.error(err); }
    finally { setChargement(false); }
  };

  const filteredVisites = useMemo(() => {
    let result = visites;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter((v) =>
        v.nom?.toLowerCase().includes(t) ||
        v.prenom?.toLowerCase().includes(t) ||
        v.nom_lieu?.toLowerCase().includes(t) ||
        v.nom_agent?.toLowerCase().includes(t) ||
        v.motif?.toLowerCase().includes(t)
      );
    }
    if (dateDebut) {
      const d = new Date(dateDebut);
      result = result.filter((v) => new Date(v.date || v.date_p) >= d);
    }
    return result;
  }, [visites, searchTerm, dateDebut]);

  const sortedVisites = useMemo(() => {
    if (!sortConfig.key) return filteredVisites;
    return [...filteredVisites].sort((a, b) => {
      let aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredVisites, sortConfig]);

  const totalPages = Math.ceil(sortedVisites.length / itemsParPage);
  const paginatedVisites = sortedVisites.slice((pageCourante - 1) * itemsParPage, pageCourante * itemsParPage);

  const handleSort = (key) => setSortConfig((p) => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const formatHeure = (h) => { if (!h) return '-'; const p = h.split(':'); return p.length >= 2 ? p[0] + ':' + p[1] : h; };
  const resetFilters = () => { setSearchTerm(''); setDateDebut(''); setPageCourante(1); };

  const bg = darkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-slate-50 via-blue-50 to-indigo-50';
  const cardBg = darkMode ? 'bg-gray-800/80 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-white/50';
  const glassBorder = darkMode ? 'border-gray-600/50' : 'border-white/20';

  const headers = typeVisite === 'lieu'
    ? ['N°', 'Visiteur', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif']
    : ['N°', 'Visiteur', 'Date', 'Arrivée', 'Départ', 'Personne', 'Motif'];

  const headerKeys = typeVisite === 'lieu'
    ? ['id_visitelieu', 'nom', 'date', 'heure_arrivee', 'heure_depart', 'nom_lieu', 'motif']
    : ['id_visitepersonne', 'nom', 'date_p', 'heure_arrivee', 'heure_depart', 'nom_agent', 'motif'];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête futuriste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <History className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent`}>
                Historique des visites
              </h1>
            </div>
            <p className={mutedText}>Consultez l&apos;historique complet des visites</p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10">
            <button
              onClick={() => { setTypeVisite('lieu'); setPageCourante(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                typeVisite === 'lieu'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/50'
              }`}
            >
              <Building2 size={16} /> Par service
            </button>
            <button
              onClick={() => { setTypeVisite('personne'); setPageCourante(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                typeVisite === 'personne'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/50'
              }`}
            >
              <User size={16} /> Par personne
            </button>
          </div>
        </motion.div>

        {/* Filtres glassmorphiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl shadow-xl ${cardBg} p-4 mb-6`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text" placeholder="Rechercher un visiteur, service..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPageCourante(1); }}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`}
              />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="date" value={dateDebut}
                onChange={(e) => { setDateDebut(e.target.value); setPageCourante(1); }}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-sm font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all shadow-sm"
            >
              <RotateCcw size={16} /> Réinitialiser
            </motion.button>
          </div>
        </motion.div>

        {/* Tableau glassmorphique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl shadow-xl ${cardBg} overflow-hidden`}
        >
          {chargement ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className={`text-sm ${mutedText}`}>Chargement des visites...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${border} bg-gradient-to-r from-transparent via-white/5 to-transparent`}>
                      {headers.map((h, i) => (
                        <th
                          key={h}
                          onClick={() => handleSort(headerKeys[i])}
                          className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${mutedText} cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap group`}
                        >
                          <div className="flex items-center gap-1.5">
                            {h}
                            <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedVisites.map((v, idx) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: idx * 0.03 }}
                          key={v.id_visitelieu || v.id_visitepersonne || idx}
                          className={`border-b ${border} hover:bg-gradient-to-r hover:from-blue-500/5 hover:via-purple-500/5 hover:to-transparent dark:hover:from-blue-500/10 dark:hover:via-purple-500/10 transition-all duration-200`}
                        >
                          <td className="px-4 py-3.5 text-sm font-mono font-medium">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-xs font-bold">
                              {v.id_visitelieu || v.id_visitepersonne || idx + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {(v.nom?.[0] || '?').toUpperCase()}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${textColor}`}>{v.nom} {v.prenom}</p>
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-3.5 text-sm ${mutedText}`}>{formatDate(v.date || v.date_p)}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {formatHeure(v.heure_arrivee)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {v.heure_depart ? (
                              <span className="text-sm text-gray-400">{formatHeure(v.heure_depart)}</span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                                En cours
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {typeVisite === 'lieu' ? (
                                <Building2 size={14} className="text-blue-500" />
                              ) : (
                                <User size={14} className="text-purple-500" />
                              )}
                              <span className="text-sm">{typeVisite === 'lieu' ? v.nom_lieu : v.nom_agent}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 max-w-[180px]">
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={v.motif}>
                              {v.motif || '-'}
                            </p>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginatedVisites.length === 0 && (
                      <tr>
                        <td colSpan={headers.length} className="text-center py-20">
                          <div className="flex flex-col items-center gap-3">
                            <History className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-400 dark:text-gray-500">Aucune visite trouvée</p>
                            <button onClick={resetFilters} className="text-sm text-blue-500 hover:text-blue-600 underline">
                              Réinitialiser les filtres
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination futuriste */}
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-6 py-4 border-t ${border} bg-gradient-to-r from-transparent via-white/5 to-transparent`}>
                  <p className={`text-sm ${mutedText}`}>
                    Page <span className="font-semibold text-blue-600 dark:text-blue-400">{pageCourante}</span> sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante(p => Math.max(1, p - 1))}
                      disabled={pageCourante === 1}
                      className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-all"
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
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-110'
                              : 'hover:bg-white/20 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante(p => Math.min(totalPages, p + 1))}
                      disabled={pageCourante === totalPages}
                      className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-all"
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
    </div>
  );
}

export default function VisitePage() {
  return <AuthGuard><VisiteContent /></AuthGuard>;
}
