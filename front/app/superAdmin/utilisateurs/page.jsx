'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AuthGuard from '@/components/AuthGuard';
import AddUserModal from '@/components/AddUserModal';
import UpdateUserModal from '@/components/UpdateUserModal';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, UserPlus, Edit2, Trash2, Loader2, AlertTriangle } from 'lucide-react';

function GestionComptesContent() {
  const { darkMode } = useDarkMode();
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

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div><h1 className={`text-3xl font-bold ${textColor}`}>Gestion des comptes</h1><p className={mutedText}>Gérez les utilisateurs de l&apos;application</p></div>
          <button onClick={() => setOpenAjout(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/25"><UserPlus size={20} /> Ajouter un utilisateur</button>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} p-4 mb-6`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[{ key: 'id', placeholder: 'ID' }, { key: 'nom_accueil', placeholder: 'Nom' }, { key: 'prenom_accueil', placeholder: 'Prénom' }, { key: 'role', placeholder: 'Rôle' }, { key: 'tel', placeholder: 'Téléphone' }].map((f) => (
              <div key={f.key} className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder={f.placeholder} value={searchValues[f.key]} onChange={(e) => setSearchValues((p) => ({ ...p, [f.key]: e.target.value }))} className={`w-full pl-9 pr-3 py-2 rounded-lg border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-purple-500`} /></div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-sm border ${border} overflow-hidden`}>
          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className={`border-b ${border}`}>{['ID', 'Nom', 'Prénom', 'Rôle', 'Téléphone', 'Actions'].map((h) => (<th key={h} className={`px-4 py-3 text-left font-medium ${mutedText}`}>{h}</th>))}</tr></thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={`border-b ${border} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                      <td className="px-4 py-3 font-medium">{u.id}</td>
                      <td className="px-4 py-3">{u.nom_accueil}</td>
                      <td className="px-4 py-3">{u.prenom_accueil}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : u.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{u.role}</span></td>
                      <td className="px-4 py-3">{u.tel}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setCurrentUser(u); setOpenUpdate(true); }} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Modifier"><Edit2 size={16} /></button>
                          <button onClick={() => setOpenDeleteConfirm(u)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun utilisateur trouvé</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddUserModal isOpen={openAjout} onClose={() => setOpenAjout(false)} onAddUser={() => { setOpenAjout(false); fetchUsers(); }} newUser={newUser} setNewUser={setNewUser} />
      <UpdateUserModal isOpen={openUpdate} onClose={() => setOpenUpdate(false)} onUpdateUser={() => { setOpenUpdate(false); fetchUsers(); }} currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {openDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${cardBg}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" /></div>
              <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Confirmer la suppression</h3>
              <p className={mutedText}>Êtes-vous sûr de vouloir supprimer <strong>{openDeleteConfirm?.nom_accueil} {openDeleteConfirm?.prenom_accueil}</strong> ?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOpenDeleteConfirm(null)} className={`flex-1 py-2.5 rounded-xl border ${border} font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}>Annuler</button>
              <button onClick={() => handleDelete(openDeleteConfirm.id)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GestionComptesPage() {
  return <AuthGuard><GestionComptesContent /></AuthGuard>;
}
