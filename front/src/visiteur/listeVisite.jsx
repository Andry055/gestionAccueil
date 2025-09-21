import React, { useEffect, useState } from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";

export default function VisiteListPopup({ open, onClose, visites }) {
  const { darkMode } = useDarkMode();
  const [listeVisite, setListVisite] = useState([]);
  const [tri, setTri] = useState({ colonne: null, ordre: 'asc' });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0].replace(/-/g, '/'); // Format YYYY/MM/DD
  };

  const formatHeure = (heureString) => {
    if (!heureString) return "-";
    const [hours, minutes] = heureString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`; // Format HH:MM
  };

  useEffect(() => {
    const chargeListe = async (id) => {
      try {
        const reponse = await axios.get(`http://localhost:5000/visite/visiteParId/${id}`);
        setListVisite(reponse.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    chargeListe(visites.id_visiteur);
  }, [visites.id_visiteur]);

  // Fonction de tri
  const trierVisites = (colonne) => {
    let nouvelOrdre = 'asc';
    
    if (tri.colonne === colonne && tri.ordre === 'asc') {
      nouvelOrdre = 'desc';
    }
    
    setTri({ colonne, ordre: nouvelOrdre });
    
    const visitesTriees = [...listeVisite].sort((a, b) => {
      if (colonne === 'date') {
        return nouvelOrdre === 'asc' 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      } else if (colonne === 'heure_arrivee') {
        return nouvelOrdre === 'asc' 
          ? a.heure_arrivee.localeCompare(b.heure_arrivee) 
          : b.heure_arrivee.localeCompare(a.heure_arrivee);
      } else if (colonne === 'heure_depart') {
        return nouvelOrdre === 'asc' 
          ? (a.heure_depart || '').localeCompare(b.heure_depart || '') 
          : (b.heure_depart || '').localeCompare(a.heure_depart || '');
      } else if (colonne === 'motif') {
        return nouvelOrdre === 'asc' 
          ? a.motif.localeCompare(b.motif) 
          : b.motif.localeCompare(a.motif);
      } else if (colonne === 'nom_lieu') {
        return nouvelOrdre === 'asc' 
          ? a.nom_lieu.localeCompare(b.nom_lieu) 
          : b.nom_lieu.localeCompare(a.nom_lieu);
      }
      return 0;
    });
    
    setListVisite(visitesTriees);
  };

  // Fonction pour obtenir l'indicateur de tri
  const getIndicateurTri = (colonne) => {
    if (tri.colonne !== colonne) return null;
    return tri.ordre === 'asc' ? '↑' : '↓';
  };

  if (!open) return null;

  // Styles dynamiques
  const modalBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const textColor = darkMode ? "text-gray-200" : "text-gray-800";
  const closeButtonColor = darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${modalBg} p-6 rounded-lg w-11/12 max-w-5xl shadow-xl relative border ${borderColor}`}>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 ${closeButtonColor} text-2xl`}
        >
          ✖
        </button>

        <h2 className={`text-xl font-bold mb-4 text-center ${textColor}`}>Liste des visites</h2>
        <div className="flex justify-between px-5">
          <i><p className={`m-5 text-2xl ${textColor}`}>ANDIANIAINA Rivo</p></i>
          <i><p className={`m-5 text-2xl ${textColor}`}>201024512478</p></i>
        </div>

        <table className={`w-full border-collapse table-auto ${textColor}`}>
          <thead className={`${tableHead} sticky top-0 z-10`}>
            <tr>
              {[
                { label: "Date", key: "date" },
                { label: "Heure d'arrivée", key: "heure_arrivee" },
                { label: "Heure de sortie", key: "heure_depart" },
                { label: "Motif", key: "motif" },
                { label: "Service visité", key: "nom_lieu" }
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className={`px-4 py-3 border-b ${borderColor} text-left font-medium whitespace-nowrap cursor-pointer hover:bg-indigo-200`}
                  onClick={() => trierVisites(key)}
                >
                  <div className="flex items-center">
                    {label}
                    <span className="ml-1">{getIndicateurTri(key)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listeVisite.length > 0 ? (
              listeVisite.map((visite, index) => (
                <tr key={index} className={`${tableRowHover} border-b ${borderColor}`}>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(visite.date)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatHeure(visite.heure_arrivee)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatHeure(visite.heure_depart) || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.motif}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{visite.nom_lieu}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={`px-4 py-6 text-center ${textColor}`}>
                  Aucune visite enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}