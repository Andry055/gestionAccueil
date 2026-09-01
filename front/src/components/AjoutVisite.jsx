'use client';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { X, Search, User, Loader2, CheckCircle } from 'lucide-react';

export default function AjoutVisite({ open, visiteur, onClose, onSuccess }) {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const [visitType, setVisitType] = useState(null);
  const [formData, setFormData] = useState({ personne_visite: '', id_lieu: '', motif: '' });
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) { api.get('/service/listeService').then((res) => { const data = res.data?.data || []; setServices(data); setFilteredServices(data); }).catch(() => {}); }
  }, [open, user]);
  useEffect(() => { setFilteredServices(services.filter((s) => s.nom_lieu?.toLowerCase().includes(serviceSearch.toLowerCase()) || s.porte?.toString().includes(serviceSearch))); }, [serviceSearch, services]);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const nomAgent = user?.prenom ? `${user.username} ${user.prenom}` : (user?.username || '');
      const data = { id_visiteur: visiteur?.id_visiteur, nom: visiteur?.nom, prenom: visiteur?.prenom, cin: visiteur?.cin, nomAgent, motif: formData.motif };
      if (visitType === 'personne') { data.personneVisite = formData.personne_visite; await api.post('/visite/visitePersonne', data); }
      else { data.nomService = formData.id_lieu; await api.post('/visite/ajoutVisite', data); }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setVisitType(null); setFormData({ personne_visite: '', id_lieu: '', motif: '' }); setServiceSearch(''); onSuccess?.(); onClose?.(); }, 1500);
    } catch (err) { setError(err.response?.data?.message || "Erreur"); }
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <h3 className={`text-lg font-semibold ${textColor}`}>{visitType ? 'Nouvelle visite' : 'Type de visite'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
        </div>
        {visiteur && <div className={`px-4 py-3 border-b ${border} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}><p className={`text-sm ${mutedText}`}>Visiteur : <span className={`font-medium ${textColor}`}>{visiteur.nom} {visiteur.prenom}</span></p><p className={`text-xs ${mutedText}`}>CIN : {visiteur.cin}</p></div>}
        {success && <div className="px-4 py-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Visite enregistrée !</div>}
        {error && <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">{error}</div>}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {!visitType ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setVisitType('personne')} className={`p-6 rounded-xl border-2 ${border} hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-center`}><User size={32} className="mx-auto mb-2 text-blue-600" /><p className={`font-medium ${textColor}`}>Visiter une personne</p></button>
              <button onClick={() => setVisitType('service')} className={`p-6 rounded-xl border-2 ${border} hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-center`}><Search size={32} className="mx-auto mb-2 text-green-600" /><p className={`font-medium ${textColor}`}>Visiter un service</p></button>
            </div>
          ) : (
            <div className="space-y-4">
              <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Motif</label><input type="text" value={formData.motif} onChange={(e) => setFormData((p) => ({ ...p, motif: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500 text-sm`} /></div>
              {visitType === 'personne' ? (
                <div><label className={`block text-sm font-medium ${mutedText} mb-1`}>Personne à visiter *</label><input type="text" value={formData.personne_visite} onChange={(e) => setFormData((p) => ({ ...p, personne_visite: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${border} ${inputBg} ${textColor} outline-none focus:ring-2 focus:ring-blue-500 text-sm`} required /></div>
              ) : (
                <div>
                  <label className={`block text-sm font-medium ${mutedText} mb-1`}>Service *</label>
                  <div className="relative mb-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Rechercher..." value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} className={`w-full pl-9 pr-3 py-2 rounded-lg border ${border} ${inputBg} ${textColor} text-sm outline-none focus:ring-2 focus:ring-blue-500`} /></div>
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border ${border} p-2">
                    {filteredServices.map((s) => (
                      <button key={s.id_lieu} onClick={() => setFormData((p) => ({ ...p, id_lieu: s.nom_lieu }))} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${formData.id_lieu === s.nom_lieu ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <span className="font-medium">{s.nom_lieu}</span><span className="ml-2 text-xs text-gray-400">Porte {s.porte} - Ét. {s.etage}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setVisitType(null); onClose?.(); }} className={`flex-1 py-2.5 rounded-xl border ${border} font-medium text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Annuler</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 size={16} className="animate-spin" /> : null}{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
