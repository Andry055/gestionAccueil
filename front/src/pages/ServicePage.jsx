import { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AjoutService from '@/components/AjoutService';
import ListeService from '@/components/ListeService';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Building2 } from 'lucide-react';

function ServiceContent() {
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filters, setFilters] = useState({ id: '', nom: '', porte: '', etage: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [listeOpen, setListeOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try { await api.post('/service/suprimerService', { id: deleteConfirm.id_lieu }); setDeleteConfirm(null); fetchServices(); } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/25">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: '2rem' }}>Services</h1>
              <p className="page-subtitle">Gérez la liste des services</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAjoutOpen(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Plus size={20} /> Nouveau service
          </motion.button>
        </div>

        {/* ═══ Filters ══════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface" style={{ padding: '16px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-violet-500 transition-colors" />
                <input type="text" placeholder={f.placeholder} value={filters[f.key]} onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPageCourante(1); }} className="input-field" style={{ paddingLeft: '36px' }} />
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
                <p className="text-sm text-[var(--text-secondary)]">Chargement des services...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      {[{ label: 'ID', key: 'id_lieu' }, { label: 'Nom', key: 'nom_lieu' }, { label: 'Porte', key: 'porte' }, { label: 'Étage', key: 'etage' }, { label: 'Actions', key: null }].map((h) => (
                        <th key={h.label} onClick={() => h.key && handleSort(h.key)} className={`${h.key ? 'cursor-pointer hover:text-violet-600' : ''} transition-colors`}>
                          <div className="flex items-center gap-1.5">{h.label}{h.key && <ArrowUpDown size={12} className="opacity-50" />}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginated.map((s, idx) => (
                        <motion.tr key={s.id_lieu} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.02 }}>
                          <td>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-xs font-bold text-violet-600">{s.id_lieu}</span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                                <Building2 size={14} />
                              </div>
                              <span className="font-medium text-[var(--text-primary)]">{s.nom_lieu}</span>
                            </div>
                          </td>
                          <td className="text-[var(--text-secondary)]">{s.porte || '-'}</td>
                          <td className="text-[var(--text-secondary)]">{s.etage || '-'}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setListeOpen(s.id_lieu)} className="p-2 rounded-lg text-violet-600 hover:bg-violet-50 transition-all" title="Voir visiteurs"><Eye size={16} /></motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setDeleteConfirm(s)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all" title="Supprimer"><Trash2 size={16} /></motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginated.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-16"><div className="flex flex-col items-center gap-3"><Building2 size={40} className="text-[var(--border-light)]" /><p className="text-sm text-[var(--text-secondary)]">Aucun service trouvé</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-muted)] bg-[var(--bg-card-secondary)]/30">
                  <p className="text-sm text-[var(--text-secondary)]">Page <span className="font-semibold text-violet-600">{pageCourante}</span> sur {totalPages}</p>
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

      <AjoutService open={ajoutOpen} onClose={() => setAjoutOpen(false)} onSuccess={fetchServices} />
      <ListeService serviceId={listeOpen} onClose={() => setListeOpen(null)} />
      <ConfirmModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} title="Supprimer le service" message={`Êtes-vous sûr de vouloir supprimer le service « ${deleteConfirm?.nom_lieu || ''} » ? Cette action est irréversible.`} confirmLabel="Supprimer" loading={deleteLoading} />
    </div>
  );
}

export default function ServicePage() {
  return <AuthGuard><ServiceContent /></AuthGuard>;
}
