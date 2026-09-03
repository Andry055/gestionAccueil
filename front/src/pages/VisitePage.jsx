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
    return () => { off('visite:created', refresh); off('visite:terminated', refresh); };
  }, [on, off, fetchVisites]);

  const filteredVisites = useMemo(() => {
    let result = visites;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter((v) =>
        v.nom?.toLowerCase().includes(t) || v.prenom?.toLowerCase().includes(t) ||
        v.nom_lieu?.toLowerCase().includes(t) || v.nom_agent?.toLowerCase().includes(t) || v.motif?.toLowerCase().includes(t)
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
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: 'var(--gradient-blue)' }}>
                <History className="w-5 h-5" />
              </div>
              <h1 className="page-title" style={{ fontSize: '2rem' }}>Historique des visites</h1>
            </div>
            <p className="page-subtitle" style={{ marginLeft: '52px' }}>Consultez l&apos;historique complet des visites</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${connected ? 'badge badge--green' : 'badge badge--amber'}`}>
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {connected ? 'Temps réel' : 'Hors ligne'}
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
              <button onClick={() => {
                const isLieu = typeVisite === 'lieu';
                const hdrs = isLieu ? ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif'] : ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Personne'];
                const rows = filteredVisites.map(v => isLieu ? [v.id_visitelieu, v.nom, v.prenom, v.date, v.heure_arrivee, v.heure_depart || '-', v.nom_lieu, v.motif || '-'] : [v.id_visitepersonne, v.nom, v.prenom, v.date_p, v.heure_arrivee, v.heure_depart || '-', v.nom_agent]);
                exportToPDF({ title: `Historique des visites`, headers: hdrs, rows, fileName: `visites_${isLieu ? 'service' : 'personne'}` });
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-all">
                <FileText size={14} /> PDF
              </button>
              <button onClick={() => {
                const isLieu = typeVisite === 'lieu';
                const hdrs = isLieu ? ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Service', 'Motif'] : ['N°', 'Visiteur', 'Prénom', 'Date', 'Arrivée', 'Départ', 'Personne'];
                const rows = filteredVisites.map(v => isLieu ? [v.id_visitelieu, v.nom, v.prenom, v.date, v.heure_arrivee, v.heure_depart || '-', v.nom_lieu, v.motif || '-'] : [v.id_visitepersonne, v.nom, v.prenom, v.date_p, v.heure_arrivee, v.heure_depart || '-', v.nom_agent]);
                exportToCSV({ headers: hdrs, rows, fileName: `visites_${isLieu ? 'service' : 'personne'}` });
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
                <Download size={14} /> CSV
              </button>
              <button onClick={() => { setTypeVisite('lieu'); setPageCourante(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${typeVisite === 'lieu' ? 'bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-400)] text-white shadow-[var(--shadow-blue)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-secondary)]'}`}>
                <Building2 size={16} /> Par service
              </button>
              <button onClick={() => { setTypeVisite('personne'); setPageCourante(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${typeVisite === 'personne' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-secondary)]'}`}>
                <User size={16} /> Par personne
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══ Filters ══════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface" style={{ padding: '16px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary-500)] transition-colors" />
              <input type="text" placeholder="Rechercher un visiteur, service..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPageCourante(1); }} className="input-field" style={{ paddingLeft: '36px' }} />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary-500)] transition-colors" />
              <input type="date" value={dateDebut} onChange={(e) => { setDateDebut(e.target.value); setPageCourante(1); }} className="input-field" style={{ paddingLeft: '36px' }} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetFilters} className="btn-secondary" style={{ justifyContent: 'center' }}>
              <RotateCcw size={16} /> Réinitialiser
            </motion.button>
          </div>
        </motion.div>

        {/* ═══ Table ════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface">
          {chargement ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="loading-spinner" />
                <p className="text-sm text-[var(--text-secondary)]">Chargement des visites...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={h} onClick={() => handleSort(headerKeys[i])} className="cursor-pointer hover:text-[var(--primary-500)] transition-colors whitespace-nowrap group">
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
                        <motion.tr layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: idx * 0.03 }} key={v.id_visitelieu || v.id_visitepersonne || idx}>
                          <td>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-50)] text-xs font-bold text-[var(--primary-500)]">
                              {v.id_visitelieu || v.id_visitepersonne || idx + 1}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                {(v.nom?.[0] || '?').toUpperCase()}
                              </div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{v.nom} {v.prenom}</p>
                            </div>
                          </td>
                          <td className="text-sm text-[var(--text-secondary)]">{formatDate(v.date || v.date_p)}</td>
                          <td>
                            <span className="badge badge--green">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {formatHeure(v.heure_arrivee)}
                            </span>
                          </td>
                          <td>
                            {v.heure_depart ? (
                              <span className="text-sm text-[var(--text-muted)]">{formatHeure(v.heure_depart)}</span>
                            ) : (
                              <span className="badge badge--amber">En cours</span>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              {typeVisite === 'lieu' ? <Building2 size={14} className="text-[var(--primary-500)]" /> : <User size={14} className="text-violet-500" />}
                              <span className="text-sm text-[var(--text-secondary)]">{typeVisite === 'lieu' ? v.nom_lieu : v.nom_agent}</span>
                            </div>
                          </td>
                          <td className="max-w-[180px]">
                            <p className="text-sm text-[var(--text-secondary)] truncate" title={v.motif}>{v.motif || '-'}</p>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginatedVisites.length === 0 && (
                      <tr>
                        <td colSpan={headers.length} className="text-center py-20">
                          <div className="flex flex-col items-center gap-3">
                            <History className="w-12 h-12 text-[var(--border-light)]" />
                            <p className="text-[var(--text-muted)]">Aucune visite trouvée</p>
                            <button onClick={resetFilters} className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-700)] underline">Réinitialiser les filtres</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-muted)] bg-[var(--bg-card-secondary)]/30">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Page <span className="font-semibold text-[var(--primary-500)]">{pageCourante}</span> sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.max(1, p - 1))} disabled={pageCourante === 1} className="pagination-btn"><ChevronLeft size={18} /></motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, pageCourante - 3), pageCourante + 2).map(page => (
                      <motion.button key={page} whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(page)} className={`pagination-btn ${page === pageCourante ? 'active' : ''}`}>{page}</motion.button>
                    ))}
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.min(totalPages, p + 1))} disabled={pageCourante === totalPages} className="pagination-btn"><ChevronRight size={18} /></motion.button>
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
