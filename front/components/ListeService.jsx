'use client';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { X, Loader2, Users } from 'lucide-react';

export default function ListeService({ serviceId, onClose }) {
  const { darkMode } = useDarkMode();
  const [visiteurs, setVisiteurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (serviceId) { setLoading(true); setError(''); api.get('/service/listeVisiteur/' + serviceId).then((res) => setVisiteurs(res.data?.data || [])).catch((err) => { setError('Erreur'); console.error(err); }).finally(() => setLoading(false)); }
  }, [serviceId]);

  if (!serviceId) return null;
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <div className="flex items-center gap-3"><Users className="w-5 h-5 text-blue-600" /><h3 className={`text-lg font-semibold ${textColor}`}>Visiteurs du service</h3></div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : error ? <div className="text-center py-12 text-red-500">{error}</div> : visiteurs.length === 0 ? <div className="text-center py-12 text-gray-400">Aucun visiteur trouvé</div> : (
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${border}`}>{['Nom', 'Prénom', 'CIN', 'Motif'].map((h) => (<th key={h} className={`px-4 py-3 text-left font-medium ${mutedText}`}>{h}</th>))}</tr></thead>
              <tbody>{visiteurs.map((v, idx) => (<tr key={v.id_visiteur || idx} className={`border-b ${border} hover:bg-gray-50 dark:hover:bg-gray-700/50`}><td className="px-4 py-3 font-medium">{v.nom}</td><td className="px-4 py-3">{v.prenom}</td><td className="px-4 py-3 font-mono text-xs">{v.cin}</td><td className="px-4 py-3 max-w-[200px] truncate">{v.motif}</td></tr>))}</tbody>
            </table>
          )}
        </div>
        <div className={`px-4 py-3 border-t ${border} flex justify-end`}><button onClick={onClose} className={`px-6 py-2 rounded-xl border ${border} font-medium text-sm transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Fermer</button></div>
      </motion.div>
    </div>
  );
}
