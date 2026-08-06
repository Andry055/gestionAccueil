'use client';
import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, UserPlus } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onAddUser, newUser, setNewUser }) {
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrorMessage(''); setSuccessMessage('');
    if (!newUser.nom_accueil || !newUser.prenom_accueil || !newUser.tel || !newUser.password || !newUser.confirmPassword) { setErrorMessage('Veuillez remplir tous les champs'); return; }
    if (newUser.password !== newUser.confirmPassword) { setErrorMessage('Les mots de passe ne correspondent pas'); return; }
    if (newUser.password.length < 6) { setErrorMessage('Minimum 6 caractères'); return; }
    setIsLoading(true);
    try {
      await api.post('/register/register', { nom_accueil: newUser.nom_accueil, prenom_accueil: newUser.prenom_accueil, tel: newUser.tel, password: newUser.password, role: newUser.role });
      setSuccessMessage('Utilisateur ajouté !');
      setNewUser({ nom_accueil: '', prenom_accueil: '', role: 'admin', tel: '', password: '', confirmPassword: '' });
      setTimeout(() => { setSuccessMessage(''); onAddUser?.(); onClose?.(); }, 1500);
    } catch (err) { setErrorMessage(err.response?.data?.message || "Erreur"); }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <div className="flex items-center gap-3"><UserPlus className="w-5 h-5 text-purple-600" /><h3 className={`text-lg font-semibold ${textColor}`}>Ajouter un utilisateur</h3></div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
        </div>
        <AnimatePresence>{successMessage && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 py-3 bg-green-50 dark:bg-green-900/30 text-green-600 text-sm flex items-center gap-2"><CheckCircle size={16} /> {successMessage}</motion.div>}</AnimatePresence>
        <AnimatePresence>{errorMessage && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 text-sm">{errorMessage}</motion.div>}</AnimatePresence>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Nom <span className="text-red-500">*</span></label><input type="text" value={newUser.nom_accueil} onChange={(e) => setNewUser((p) => ({ ...p, nom_accueil: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`} required /></div>
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Prénom <span className="text-red-500">*</span></label><input type="text" value={newUser.prenom_accueil} onChange={(e) => setNewUser((p) => ({ ...p, prenom_accueil: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Rôle</label><select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`}><option value="admin">Admin</option><option value="superadmin">Super Admin</option><option value="agent">Agent</option></select></div>
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Téléphone <span className="text-red-500">*</span></label><input type="tel" value={newUser.tel} onChange={(e) => setNewUser((p) => ({ ...p, tel: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Mot de passe <span className="text-red-500">*</span></label><input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`} required /></div>
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Confirmer <span className="text-red-500">*</span></label><input type="password" value={newUser.confirmPassword} onChange={(e) => setNewUser((p) => ({ ...p, confirmPassword: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-purple-500 text-sm`} required /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading} className={`flex-1 py-2.5 rounded-xl border ${border} font-medium text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Annuler</button>
            <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? <Loader2 size={16} className="animate-spin" /> : null}{isLoading ? 'Ajout...' : 'Ajouter'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
