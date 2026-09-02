import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, RotateCcw, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, History, Building2, User, Wifi, WifiOff, FileText, Download } from 'lucide-react';
import { exportToPDF, exportToCSV } from '@/utils/exportPDF';

function VisiteContent() {
  const { connected, on, off } = useSocket();
  const [visites, setVisites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [typeVisite, setTypeVisite] = useState('lieu');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const itemsParPage = 20;

  const fetchVisites = useCallback(async () => {
    try {
      const endpoint = typeVisite === 'lieu' ? '/visite/listeVisite' : '/visite/listeVisitePersonne';
      const res = await api.get(endpoint);
      setVisites(res.data?.data || []);
    } catch (err) { console.error(err); }
    finally { setChargement(false); }
  }, [typeVisite]);

  useEffect(() => { fetchVisites(); }, [fetchVisites]);

  useEffect(() => {
    const refresh = () => fetchVisites();
    on('visite:created', refresh);
    on('visite:terminated', refresh);
    return () => {
      off('visite:created', refresh);
      off('visite:terminated', refresh);
    };
  }, [on, off, fetchVisites]);

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

  const headers = typeVisite === 'lieu'
    ? ['N°', 'Visiteur', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif']
    : ['N°', 'Visiteur', 'Date', 'Arrivée', 'Départ', 'Personne', 'Motif'];

  const headerKeys = typeVisite === 'lieu'
    ? ['id_visitelieu', 'nom', 'date', 'heure_arrivee', 'heure_depart', 'nom_lieu', 'motif']
    : ['id_visitepersonne', 'nom', 'date_p', 'heure_arrivee', 'heure_depart', 'nom_agent', 'motif'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <History className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Historique des visites</h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">Consultez l&apos;historique complet des visites</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
              connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {connected ? 'Temps réel' : 'Hors ligne'}
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-gray-200 shadow-sm">
              <button
                onClick={() => {
                  const isLieu = typeVisite === 'lieu';
                  const hdrs = isLieu ? ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif'] : ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Personne'];
                  const rows = filteredVisites.map(v => isLieu ? [v.id_visitelieu, v.nom, v.prenom, v.date, v.heure_arrivee, v.heure_depart || '-', v.nom_lieu, v.motif || '-'] : [v.id_visitepersonne, v.nom, v.prenom, v.date_p, v.heure_arrivee, v.heure_depart || '-', v.nom_agent]);
                  exportToPDF({ title: `Historique des visites`, headers: hdrs, rows, fileName: `visites_${isLieu ? 'service' : 'personne'}` });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <FileText size={14} /> PDF
              </button>
              <button
                onClick={() => {
                  const isLieu = typeVisite === 'lieu';
                  const hdrs = isLieu ? ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif'] : ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Personne'];
                  const rows = filteredVisites.map(v => isLieu ? [v.id_visitelieu, v.nom, v.prenom, v.date, v.heure_arrivee, v.heure_depart || '-', v.nom_lieu, v.motif || '-'] : [v.id_visitepersonne, v.nom, v.prenom, v.date_p, v.heure_arrivee, v.heure_depart || '-', v.nom_agent]);
                  exportToCSV({ headers: hdrs, rows, fileName: `visites_${isLieu ? 'service' : 'personne'}` });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
              >
                <Download size={14} /> CSV
              </button>
              <button
                onClick={() => { setTypeVisite('lieu'); setPageCourante(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  typeVisite === 'lieu'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 size={16} /> Par service
              </button>
              <button
                onClick={() => { setTypeVisite('personne'); setPageCourante(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  typeVisite === 'personne'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User size={16} /> Par personne
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text" placeholder="Rechercher un visiteur, service..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPageCourante(1); }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="date" value={dateDebut}
                onChange={(e) => { setDateDebut(e.target.value); setPageCourante(1); }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-medium hover:bg-gray-200 transition-all"
            >
              <RotateCcw size={16} /> Réinitialiser
            </motion.button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {chargement ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Chargement des visites...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {headers.map((h, i) => (
                        <th
                          key={h}
                          onClick={() => handleSort(headerKeys[i])}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap group"
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
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200"
                        >
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                              {v.id_visitelieu || v.id_visitepersonne || idx + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {(v.nom?.[0] || '?').toUpperCase()}
                              </div>
                              <p className="text-sm font-medium text-gray-900">{v.nom} {v.prenom}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(v.date || v.date_p)}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {formatHeure(v.heure_arrivee)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {v.heure_depart ? (
                              <span className="text-sm text-gray-400">{formatHeure(v.heure_depart)}</span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                                En cours
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {typeVisite === 'lieu' ? (
                                <Building2 size={14} className="text-blue-500" />
                              ) : (
                                <User size={14} className="text-purple-500" />
                              )}
                              <span className="text-sm text-gray-700">{typeVisite === 'lieu' ? v.nom_lieu : v.nom_agent}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-[180px]">
                            <p className="text-sm text-gray-500 truncate" title={v.motif}>
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
                            <History className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-400">Aucune visite trouvée</p>
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                  <p className="text-sm text-gray-500">
                    Page <span className="font-semibold text-blue-600">{pageCourante}</span> sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante(p => Math.max(1, p - 1))}
                      disabled={pageCourante === 1}
                      className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-all"
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
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPageCourante(p => Math.min(totalPages, p + 1))}
                      disabled={pageCourante === totalPages}
                      className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-all"
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
