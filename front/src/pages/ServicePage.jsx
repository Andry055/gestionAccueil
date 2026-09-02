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
    try {
      await api.post('/service/suprimerService', { id: deleteConfirm.id_lieu });
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500">Gérez la liste des services</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAjoutOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 transition-all font-medium shadow-lg shadow-purple-500/30"
          >
            <Plus size={20} /> Nouveau service
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text" placeholder={f.placeholder}
                  value={filters[f.key]}
                  onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPageCourante(1); }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {chargement ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p className="text-sm text-gray-500">Chargement des services...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {[{ label: 'ID', key: 'id_lieu' }, { label: 'Nom', key: 'nom_lieu' }, { label: 'Porte', key: 'porte' }, { label: 'Étage', key: 'etage' }, { label: 'Actions', key: null }].map((h) => (
                        <th
                          key={h.label}
                          onClick={() => h.key && handleSort(h.key)}
                          className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${h.key ? 'cursor-pointer hover:text-purple-600' : ''} transition-colors`}
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
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200"
                        >
                          <td className="px-4 py-3 font-mono font-medium text-gray-900">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-xs font-bold text-purple-600">
                              {s.id_lieu}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                <Building2 size={14} />
                              </div>
                              <span className="font-medium text-gray-900">{s.nom_lieu}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{s.porte || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{s.etage || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setListeOpen(s.id_lieu)}
                                className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
                                title="Voir visiteurs"
                              >
                                <Eye size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeleteConfirm(s)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {paginated.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <Building2 size={40} className="text-gray-300" />
                            <p className="text-sm text-gray-500">Aucun service trouvé</p>
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
                    Page <span className="font-semibold text-purple-600">{pageCourante}</span> sur {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.max(1, p - 1))} disabled={pageCourante === 1} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={18} /></motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, pageCourante - 3), pageCourante + 2).map(page => (
                      <motion.button key={page} whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(page)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${page === pageCourante ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'hover:bg-gray-100 text-gray-700'}`}>{page}</motion.button>
                    ))}
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPageCourante(p => Math.min(totalPages, p + 1))} disabled={pageCourante === totalPages} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={18} /></motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <AjoutService open={ajoutOpen} onClose={() => setAjoutOpen(false)} onSuccess={fetchServices} />
      <ListeService serviceId={listeOpen} onClose={() => setListeOpen(null)} />
      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer le service « ${deleteConfirm?.nom_lieu || ''} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleteLoading}
      />
    </div>
  );
}

export default function ServicePage() {
  return <AuthGuard><ServiceContent /></AuthGuard>;
}
