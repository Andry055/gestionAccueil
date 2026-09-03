import { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Eye, Plus, X, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, FileText, Users, Download } from 'lucide-react';
import AjoutVisiteur from '@/components/AjoutVisiteur';
import AjoutVisite from '@/components/AjoutVisite';
import VisiteListPopup from '@/components/VisiteListPopup';
import { exportToPDF, exportToCSV } from '@/utils/exportPDF';

function VisiteurContent() {
  const [visiteurs, setVisiteurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modifModal, setModifModal] = useState({ open: false, visiteur: null });
  const [ajoutVisiteurOpen, setAjoutVisiteurOpen] = useState(false);
  const [ajoutVisiteOpen, setAjoutVisiteOpen] = useState(null);
  const [listeVisiteOpen, setListeVisiteOpen] = useState(null);
  const [filters, setFilters] = useState({ id: '', nom: '', prenom: '', cin: '', agent: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const itemsParPage = 20;

  useEffect(() => { fetchVisiteurs(); }, []);
  const fetchVisiteurs = async () => {
    setChargement(true);
    try { const res = await api.get('/visite/listeVisiteur'); setVisiteurs(res.data?.data || []); } catch (err) { console.error(err); }
    finally { setChargement(false); }
  };

  const filteredVisiteurs = useMemo(() => visiteurs.filter((v) =>
    (filters.id === '' || v.id_visiteur?.toString().includes(filters.id)) &&
    (filters.nom === '' || v.nom?.toLowerCase().includes(filters.nom.toLowerCase())) &&
    (filters.prenom === '' || v.prenom?.toLowerCase().includes(filters.prenom.toLowerCase())) &&
    (filters.cin === '' || v.cin?.includes(filters.cin)) &&
    (filters.agent === '' || v.nom_agent?.toLowerCase().includes(filters.agent.toLowerCase()))
  ), [visiteurs, filters]);

  const sortedVisiteurs = useMemo(() => {
    if (!sortConfig.key) return filteredVisiteurs;
    return [...filteredVisiteurs].sort((a, b) => {
      let aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredVisiteurs, sortConfig]);

  const totalPages = Math.ceil(sortedVisiteurs.length / itemsParPage);
  const paginatedVisiteurs = sortedVisiteurs.slice((pageCourante - 1) * itemsParPage, pageCourante * itemsParPage);

  const handleSort = (key) => setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const handleModifier = async () => {
    const v = modifModal.visiteur;
    if (!v) return;
    try { await api.put('/visite/updateVisiteur/' + v.id_visiteur, { nom: v.nom, prenom: v.prenom, cin: v.cin }); setModifModal({ open: false, visiteur: null }); fetchVisiteurs(); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: 'var(--gradient-blue)' }}>
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: '2rem' }}>Visiteurs</h1>
              <p className="page-subtitle">Gérez la liste des visiteurs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAjoutVisiteurOpen(true)} className="btn-primary">
              <Plus size={18} /> Nouveau visiteur
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
              const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Agent'];
              const rows = filteredVisiteurs.map(v => [v.id_visiteur, v.nom, v.prenom, v.cin, v.nom_agent || '-']);
              exportToPDF({ title: 'Liste des visiteurs', headers, rows, fileName: 'visiteurs' });
            }} className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
              <FileText size={16} /> PDF
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
              const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Agent'];
              const rows = filteredVisiteurs.map(v => [v.id_visiteur, v.nom, v.prenom, v.cin, v.nom_agent || '-']);
              exportToCSV({ headers, rows, fileName: 'visiteurs' });
            }} className="btn-secondary" style={{ color: '#059669', borderColor: '#d1fae5' }}>
              <Download size={16} /> CSV
            </motion.button>
          </div>
        </div>

        {/* ═══ Filters ══════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface" style={{ padding: '16px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'prenom', placeholder: 'Prénom' }, { key: 'cin', placeholder: 'CIN' }, { key: 'agent', placeholder: 'Agent' }].map((f) => (
              <div key={f.key} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary-500)] transition-colors" />
                <input
                  type="text" placeholder={f.placeholder}
                  value={filters[f.key]}
                  onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPageCourante(1); }}
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══ Table ════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface">
          {chargement ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="loading-spinner" />
                <p className="text-sm text-[var(--text-secondary)]">Chargement des visiteurs...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      {[{ label: 'ID', key: 'id_visiteur' }, { label: 'Nom', key: 'nom' }, { label: 'Prénom', key: 'prenom' }, { label: 'CIN', key: 'cin' }, { label: 'Agent', key: 'agent' }, { label: 'Actions', key: null }].map((h) => (
                        <th
                          key={h.label}
                          onClick={() => h.key && handleSort(h.key)}
                          className={`${h.key ? 'cursor-pointer hover:text-[var(--primary-500)]' : ''} transition-colors`}
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
                      {paginatedVisiteurs.map((v, idx) => (
                        <motion.tr
                          key={v.id_visiteur}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                        >
                          <td>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-50)] text-xs font-bold text-[var(--primary-500)]">
                              {v.id_visiteur}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                                {(v.nom?.[0] || '?').toUpperCase()}
                              </div>
                              <span className="font-medium text-[var(--text-primary)]">{v.nom}</span>
                            </div>
                          </td>
                          <td className="text-[var(--text-secondary)]">{v.prenom}</td>
                          <td>
                            <span className="badge badge--blue" style={{ fontFamily: 'monospace' }}>
                              {v.cin}
                            </span>
                          </td>
                          <td className="text-[var(--text-secondary)]">{v.nom_agent || '-'}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setModifModal({ open: true, visiteur: { ...v } })} className="p-2 rounded-lg text-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-all" title="Modifier">
                                <Edit2 size={16} />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setAjoutVisiteOpen(v)} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all" title="Ajouter visite">
                                <FileText size={16} />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setListeVisiteOpen(v.id_visiteur)} className="p-2 rounded-lg text-violet-600 hover:bg-violet-50 transition-all" title="Voir visites">
                                <Eye size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginatedVisiteurs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <Users size={40} className="text-[var(--border-light)]" />
                            <p className="text-sm text-[var(--text-secondary)]">Aucun visiteur trouvé</p>
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
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.max(1, p - 1))} disabled={pageCourante === 1} className="pagination-btn" disabled={pageCourante === 1}>
                      <ChevronLeft size={18} />
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, pageCourante - 3), pageCourante + 2)
                      .map(page => (
                        <motion.button key={page} whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(page)} className={`pagination-btn ${page === pageCourante ? 'active' : ''}`}>
                          {page}
                        </motion.button>
                      ))}
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.min(totalPages, p + 1))} disabled={pageCourante === totalPages} className="pagination-btn">
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* ═══ Edit modal ════════════════════════════ */}
      <AnimatePresence>
        {modifModal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setModifModal({ open: false, visiteur: null })}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-[var(--radius-xl)] shadow-2xl p-6 border border-[var(--border-light)] bg-white backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: 'var(--gradient-blue)' }}>
                    <Edit2 size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Modifier le visiteur</h3>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setModifModal({ open: false, visiteur: null })} className="p-2 rounded-xl hover:bg-[var(--bg-card-secondary)] transition-all">
                  <X size={20} className="text-[var(--text-muted)]" />
                </motion.button>
              </div>
              <div className="space-y-4">
                {['nom', 'prenom', 'cin'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 capitalize">{field}</label>
                    <input type="text" value={modifModal.visiteur?.[field] || ''} onChange={e => setModifModal(prev => ({ ...prev, visiteur: { ...prev.visiteur, [field]: e.target.value } }))} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModifModal({ open: false, visiteur: null })} className="btn-secondary flex-1" style={{ justifyContent: 'center' }}>
                  Annuler
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleModifier} className="btn-primary flex-1" style={{ justifyContent: 'center' }}>
                  Enregistrer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AjoutVisiteur open={ajoutVisiteurOpen} onClose={() => setAjoutVisiteurOpen(false)} onSuccess={fetchVisiteurs} />
      <AjoutVisite open={ajoutVisiteOpen !== null} visiteur={ajoutVisiteOpen} onClose={() => setAjoutVisiteOpen(null)} onSuccess={fetchVisiteurs} />
      <VisiteListPopup open={listeVisiteOpen !== null} id_visiteur={listeVisiteOpen} onClose={() => setListeVisiteOpen(null)} />
    </div>
  );
}

export default function VisiteurPage() {
  return <AuthGuard><VisiteurContent /></AuthGuard>;
}
