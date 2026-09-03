import { useState, useEffect, useMemo, useCallback } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AddUserModal from '@/components/AddUserModal';
import UpdateUserModal from '@/components/UpdateUserModal';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, UserPlus, Edit2, Trash2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

function GestionComptesContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAjout, setOpenAjout] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({ nom_accueil: '', prenom_accueil: '', role: 'admin', tel: '', password: '', confirmPassword: '' });
  const [filters, setFilters] = useState({ id: '', nom_accueil: '', prenom_accueil: '', role: '', tel: '' });
  const [searchValues, setSearchValues] = useState({ id: '', nom_accueil: '', prenom_accueil: '', role: '', tel: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('/service/listeUsers'); setUsers(res.data?.data || []); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { const t = setTimeout(() => setFilters({ ...searchValues }), 500); return () => clearTimeout(t); }, [searchValues]);

  const filteredUsers = useMemo(() => users.filter((u) =>
    (filters.id === '' || u.id?.toString().includes(filters.id)) &&
    (filters.nom_accueil === '' || u.nom_accueil?.toLowerCase().includes(filters.nom_accueil.toLowerCase())) &&
    (filters.prenom_accueil === '' || u.prenom_accueil?.toLowerCase().includes(filters.prenom_accueil.toLowerCase())) &&
    (filters.role === '' || u.role?.toLowerCase().includes(filters.role.toLowerCase())) &&
    (filters.tel === '' || u.tel?.includes(filters.tel))), [users, filters]);

  const handleDelete = async (id) => { try { await api.delete('/service/deleteUser/' + id); setOpenDeleteConfirm(null); fetchUsers(); } catch (err) { console.error(err); } };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container">

        {/* ═══ Header ═══════════════════════════════ */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Gestion des comptes</h1>
            <p className="page-subtitle">Gérez les utilisateurs de l&apos;application</p>
          </div>
          <button onClick={() => setOpenAjout(true)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <UserPlus size={18} /> Ajouter un utilisateur
          </button>
        </div>

        {/* ═══ Filters ══════════════════════════════ */}
        <div className="surface" style={{ padding: '16px', marginBottom: '24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom_accueil', placeholder: 'Nom' }, { key: 'prenom_accueil', placeholder: 'Prénom' }, { key: 'role', placeholder: 'Rôle' }, { key: 'tel', placeholder: 'Téléphone' }].map((f) => (
              <div key={f.key} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input type="text" placeholder={f.placeholder} value={searchValues[f.key]} onChange={(e) => setSearchValues((p) => ({ ...p, [f.key]: e.target.value }))} className="input-field" style={{ paddingLeft: '36px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Table ════════════════════════════════ */}
        <div className="surface">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    {['ID', 'Nom', 'Prénom', 'Rôle', 'Téléphone', 'Actions'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="font-medium text-[var(--text-primary)]">{u.id}</td>
                      <td className="text-[var(--text-secondary)]">{u.nom_accueil}</td>
                      <td className="text-[var(--text-secondary)]">{u.prenom_accueil}</td>
                      <td>
                        <span className={`badge ${u.role === 'superadmin' ? 'badge--purple' : u.role === 'admin' ? 'badge--blue' : 'badge--green'}`}>{u.role}</span>
                      </td>
                      <td className="text-[var(--text-secondary)]">{u.tel}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setCurrentUser(u); setOpenUpdate(true); }} className="p-2 rounded-lg text-[var(--primary-500)] hover:bg-[var(--primary-50)]" title="Modifier"><Edit2 size={16} /></button>
                          <button onClick={() => setOpenDeleteConfirm(u)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-[var(--text-muted)]">Aucun utilisateur trouvé</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddUserModal isOpen={openAjout} onClose={() => setOpenAjout(false)} onAddUser={() => { setOpenAjout(false); fetchUsers(); }} newUser={newUser} setNewUser={setNewUser} />
      <UpdateUserModal isOpen={openUpdate} onClose={() => setOpenUpdate(false)} onUpdateUser={() => { setOpenUpdate(false); fetchUsers(); }} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <ConfirmModal open={!!openDeleteConfirm} onClose={() => setOpenDeleteConfirm(null)} onConfirm={() => handleDelete(openDeleteConfirm.id)} title="Supprimer l'utilisateur" message={`Êtes-vous sûr de vouloir supprimer l'utilisateur « ${openDeleteConfirm?.nom_accueil} ${openDeleteConfirm?.prenom_accueil} » ? Cette action est irréversible.`} confirmLabel="Supprimer" />
    </div>
  );
}

export default function GestionComptesPage() {
  return <AuthGuard><GestionComptesContent /></AuthGuard>;
}
