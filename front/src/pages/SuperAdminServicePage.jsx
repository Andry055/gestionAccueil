import { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AjoutService from '@/components/AjoutService';
import ListeService from '@/components/ListeService';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Plus, Eye, Trash2, Loader2, Building2, TrendingUp } from 'lucide-react';

function SuperAdminServiceContent() {
  const [services, setServices] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [filters, setFilters] = useState({ id: '', nom: '', porte: '', etage: '' });
  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [listeOpen, setListeOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchServices(); fetchTopServices(); }, []);
  const fetchServices = () => { api.get('/service/listeService').then((res) => setServices(res.data?.data || [])).catch(console.error).finally(() => setLoading(false)); };
  const fetchTopServices = () => { api.get('/service/topServices').then((res) => setTopServices(res.data?.data || [])).catch(console.error).finally(() => setChartLoading(false)); };

  const filteredServices = useMemo(() => services.filter((s) =>
    (filters.id === '' || s.id_lieu?.toString().includes(filters.id)) &&
    (filters.nom === '' || s.nom_lieu?.toLowerCase().includes(filters.nom.toLowerCase())) &&
    (filters.porte === '' || s.porte?.toString().includes(filters.porte)) &&
    (filters.etage === '' || s.etage?.toString().includes(filters.etage))), [services, filters]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await api.post('/service/suprimerService', { id: deleteConfirm.id_lieu });
      setDeleteConfirm(null);
      fetchServices();
      fetchTopServices();
    } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div><h1 className="text-3xl font-bold text-gray-900">Gestion des services</h1><p className="text-gray-500">Supervisez et gérez tous les services</p></div>
          <button onClick={() => setAjoutOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/25"><Plus size={20} /> Ajouter un service</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-purple-600" /><h2 className="text-lg font-semibold text-gray-900">Top services visités</h2></div>
          {chartLoading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topServices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nom_lieu" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }} />
                <Bar dataKey="visites" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder={f.placeholder} value={filters[f.key]} onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))} className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-purple-500" /></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 bg-gray-50/50">{['ID', 'Nom', 'Porte', 'Étage', 'Actions'].map((h) => (<th key={h} className="px-4 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">{h}</th>))}</tr></thead>
                <tbody>
                  {filteredServices.map((s) => (
                    <tr key={s.id_lieu} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.id_lieu}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 size={16} className="text-purple-500" /><span className="text-gray-900">{s.nom_lieu}</span></div></td>
                      <td className="px-4 py-3 text-gray-700">{s.porte}</td>
                      <td className="px-4 py-3 text-gray-700">{s.etage}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setListeOpen(s.id_lieu)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="Voir visiteurs"><Eye size={16} /></button>
                          <button onClick={() => setDeleteConfirm(s)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                      </td>
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
      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer le service « ${deleteConfirm?.nom_lieu || ''} » ? Cette action est irréversible et supprimera toutes les visites associées.`}
        confirmLabel="Supprimer"
        loading={deleteLoading}
      />
    </div>
  );
}

export default function SuperAdminServicePage() { return <AuthGuard><SuperAdminServiceContent /></AuthGuard>; }
