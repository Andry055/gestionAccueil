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
    try { await api.post('/service/suprimerService', { id: deleteConfirm.id_lieu }); setDeleteConfirm(null); fetchServices(); fetchTopServices(); } catch (err) { console.error(err); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Gestion des services</h1>
            <p className="page-subtitle">Supervisez et gérez tous les services</p>
          </div>
          <button onClick={() => setAjoutOpen(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Plus size={18} /> Ajouter un service
          </button>
        </div>

        {/* ═══ Chart ════════════════════════════════ */}
        <div className="surface" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Top services visités</h2>
          </div>
          {chartLoading ? (
            <div className="flex items-center justify-center py-12"><div className="loading-spinner" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topServices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nom_lieu" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }} />
                <Bar dataKey="visites" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ═══ Filters ══════════════════════════════ */}
        <div className="surface" style={{ padding: '16px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom', placeholder: 'Nom' }, { key: 'porte', placeholder: 'Porte' }, { key: 'etage', placeholder: 'Étage' }].map((f) => (
              <div key={f.key} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input type="text" placeholder={f.placeholder} value={filters[f.key]} onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))} className="input-field" style={{ paddingLeft: '36px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Table ════════════════════════════════ */}
        <div className="surface">
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="loading-spinner" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead><tr>{['ID', 'Nom', 'Porte', 'Étage', 'Actions'].map((h) => (<th key={h}>{h}</th>))}</tr></thead>
                <tbody>
                  {filteredServices.map((s) => (
                    <tr key={s.id_lieu}>
                      <td className="font-medium text-[var(--text-primary)]">{s.id_lieu}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-violet-500" />
                          <span className="text-[var(--text-primary)]">{s.nom_lieu}</span>
                        </div>
                      </td>
                      <td className="text-[var(--text-secondary)]">{s.porte}</td>
                      <td className="text-[var(--text-secondary)]">{s.etage}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setListeOpen(s.id_lieu)} className="p-2 rounded-lg text-[var(--primary-500)] hover:bg-[var(--primary-50)]" title="Voir visiteurs"><Eye size={16} /></button>
                          <button onClick={() => setDeleteConfirm(s)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">Aucun service trouvé</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <AjoutService open={ajoutOpen} onClose={() => setAjoutOpen(false)} onSuccess={fetchServices} />
      <ListeService serviceId={listeOpen} onClose={() => setListeOpen(null)} />
      <ConfirmModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} title="Supprimer le service" message={`Êtes-vous sûr de vouloir supprimer le service « ${deleteConfirm?.nom_lieu || ''} » ? Cette action est irréversible et supprimera toutes les visites associées.`} confirmLabel="Supprimer" loading={deleteLoading} />
    </div>
  );
}

export default function SuperAdminServicePage() { return <AuthGuard><SuperAdminServiceContent /></AuthGuard>; }
