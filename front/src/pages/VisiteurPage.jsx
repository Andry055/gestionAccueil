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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visiteurs</h1>
              <p className="text-sm text-gray-500">Gérez la liste des visiteurs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAjoutVisiteurOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/30"
            >
              <Plus size={20} /> Nouveau visiteur
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Agent'];
                const rows = filteredVisiteurs.map(v => [v.id_visiteur, v.nom, v.prenom, v.cin, v.nom_agent || '-']);
                exportToPDF({ title: 'Liste des visiteurs', headers, rows, fileName: 'visiteurs' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm font-medium shadow-md"
            >
              <FileText size={16} /> PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const headers = ['ID', 'Nom', 'Prénom', 'CIN', 'Agent'];
                const rows = filteredVisiteurs.map(v => [v.id_visiteur, v.nom, v.prenom, v.cin, v.nom_agent || '-']);
                exportToCSV({ headers, rows, fileName: 'visiteurs' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-sm font-medium shadow-md"
            >
              <Download size={16} /> CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'prenom', placeholder: 'Prénom' }, { key: 'cin', placeholder: 'CIN' }, { key: 'agent', placeholder: 'Agent' }].map((f) => (
              <div key={f.key} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text" placeholder={f.placeholder}
                  value={filters[f.key]}
                  onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPageCourante(1); }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
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
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-sm text-gray-500">Chargement des visiteurs...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {[{ label: 'ID', key: 'id_visiteur' }, { label: 'Nom', key: 'nom' }, { label: 'Prénom', key: 'prenom' }, { label: 'CIN', key: 'cin' }, { label: 'Agent', key: 'agent' }, { label: 'Actions', key: null }].map((h) => (
                        <th
                          key={h.label}
                          onClick={() => h.key && handleSort(h.key)}
                          className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${h.key ? 'cursor-pointer hover:text-blue-600' : ''} transition-colors`}
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
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200"
                        >
                          <td className="px-4 py-3 font-mono font-medium text-gray-900">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                              {v.id_visiteur}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                {(v.nom?.[0] || '?').toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{v.nom}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{v.prenom}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-100">
                              {v.cin}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{v.nom_agent || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setModifModal({ open: true, visiteur: { ...v } })}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                                title="Modifier"
                              >
                                <Edit2 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setAjoutVisiteOpen(v)}
                                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"
                                title="Ajouter visite"
                              >
                                <FileText size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setListeVisiteOpen(v.id_visiteur)}
                                className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
                                title="Voir visites"
                              >
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
                            <Users size={40} className="text-gray-300" />
                            <p className="text-sm text-gray-500">Aucun visiteur trouvé</p>
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

      {/* Edit modal */}
      <AnimatePresence>
        {modifModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setModifModal({ open: false, visiteur: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200 bg-white backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Edit2 size={18} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Modifier le visiteur</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModifModal({ open: false, visiteur: null })}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="space-y-4">
                {['nom', 'prenom', 'cin'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{field}</label>
                    <input
                      type="text"
                      value={modifModal.visiteur?.[field] || ''}
                      onChange={e => setModifModal(prev => ({ ...prev, visiteur: { ...prev.visiteur, [field]: e.target.value } }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModifModal({ open: false, visiteur: null })}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-medium transition-all text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleModifier}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30"
                >
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
