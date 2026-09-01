'use client';
import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Building2 } from 'lucide-react';

export default function AjoutService({ open, onClose, onSuccess }) {
  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({ nom: '', porte: '', etage: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await api.post('/service/ajoutservice', formData); setSuccess(true); setTimeout(() => { setSuccess(false); setFormData({ nom: '', porte: '', etage: '' }); onSuccess?.(); onClose?.(); }, 1500); }
    catch (err) { setError(err.response?.data?.message || "Erreur lors de l'ajout"); }
    finally { setLoading(false); }
  };

  if (!open) return null;
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-blue-600" /><h3 className={`text-lg font-semibold ${textColor}`}>Ajouter un service</h3></div>
          <button onClick={() => { onClose?.(); setFormData({ nom: '', porte: '', etage: '' }); }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
        </div>
        <AnimatePresence>{success && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 py-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Service ajouté !</motion.div>}</AnimatePresence>
        <AnimatePresence>{error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">{error}</motion.div>}</AnimatePresence>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Nom du service *</label><input type="text" value={formData.nom} onChange={(e) => setFormData((p) => ({ ...p, nom: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500 text-sm`} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Porte</label><input type="text" value={formData.porte} onChange={(e) => setFormData((p) => ({ ...p, porte: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500 text-sm`} /></div>
            <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Étage</label><input type="text" value={formData.etage} onChange={(e) => setFormData((p) => ({ ...p, etage: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500 text-sm`} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { onClose?.(); setFormData({ nom: '', porte: '', etage: '' }); }} disabled={loading} className={`flex-1 py-2.5 rounded-xl border ${border} font-medium text-sm transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 size={16} className="animate-spin" /> : null}{loading ? 'Ajout...' : 'Ajouter'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
