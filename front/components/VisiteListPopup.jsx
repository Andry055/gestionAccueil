'use client';
import { useState, useEffect, useMemo } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { X, ArrowUpDown, Loader2, Calendar } from 'lucide-react';

export default function VisiteListPopup({ open, id_visiteur, onClose }) {
  const { darkMode } = useDarkMode();
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => { if (open && id_visiteur) { setLoading(true); api.get('/visite/visiteParId/' + id_visiteur).then((res) => setVisites(res.data?.data || [])).catch(() => {}).finally(() => setLoading(false)); } }, [open, id_visiteur]);

  const sortedVisites = useMemo(() => {
    if (!sortConfig.key) return visites;
    return [...visites].sort((a, b) => {
      let aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase(); if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1; if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1; return 0;
    });
  }, [visites, sortConfig]);

  const handleSort = (key) => setSortConfig((p) => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '-';
  const formatHeure = (h) => { if (!h) return '-'; const p = h.split(':'); return p.length >= 2 ? p[0] + ':' + p[1] : h; };

  if (!open) return null;
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-blue-600" /><h3 className={`text-lg font-semibold ${textColor}`}>Historique des visites</h3></div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : sortedVisites.length === 0 ? <div className="text-center py-12 text-gray-400">Aucune visite enregistrée.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className={`border-b ${border}`}>{['Date', 'Heure arrivée', 'Heure départ', 'Motif', 'Service visité'].map((h) => (
                  <th key={h} onClick={() => handleSort(h === 'Date' ? 'date_visite' : h === 'Heure arrivée' ? 'heure_arrivee' : h === 'Heure départ' ? 'heure_depart' : h === 'Motif' ? 'motif' : 'nom_lieu')} className={`px-4 py-3 text-left font-medium ${mutedText} cursor-pointer hover:text-gray-700 dark:hover:text-gray-300`}><div className="flex items-center gap-1">{h}<ArrowUpDown size={14} /></div></th>
                ))}</tr></thead>
                <tbody>{sortedVisites.map((v, idx) => (
                  <tr key={idx} className={`border-b ${border} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(v.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_arrivee)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_depart)}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{v.motif}</td>
                    <td className="px-4 py-3">{v.nom_lieu || v.personne_visite}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
        <div className={`px-4 py-3 border-t ${border} flex justify-end`}><button onClick={onClose} className={`px-6 py-2 rounded-xl border ${border} font-medium text-sm transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Fermer</button></div>
      </motion.div>
    </div>
  );
}
