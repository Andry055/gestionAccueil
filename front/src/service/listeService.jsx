import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useDarkMode } from "../utils/DarkModeContext";

export default function ListeService({ serviceId, onClose }) {
  const { darkMode } = useDarkMode();
  const [visiteurs, setVisiteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Styles conditionnels
  const modalBg = darkMode ? "bg-gray-900 bg-opacity-80" : "bg-black bg-opacity-50";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-700 border-blue-300";
  const headerBg = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-600 text-white";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-200";

  useEffect(() => {
    const fetchVisiteurs = async () => {
      try {
        const id = serviceId;
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/service/listeVisiteur/${id}`);
        setVisiteurs(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des visiteurs:", err);
        setError("Erreur lors du chargement des données");
        setVisiteurs([]);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchVisiteurs();
    }
  }, [serviceId]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${modalBg}`}>
      <div className={`rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 ${cardBg}`}>
        <div className={`flex justify-between items-center p-4 rounded-t-lg ${headerBg}`}>
          <h2 className="text-xl font-bold">Visiteurs du service</h2>
          <button 
            onClick={onClose}
            className="hover:opacity-80 focus:outline-none"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-indigo-400" : "border-indigo-600"}`}></div>
            </div>
          ) : error ? (
            <div className={`text-center py-10 ${darkMode ? "text-red-400" : "text-red-600"}`}>{error}</div>
          ) : visiteurs.length === 0 ? (
            <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Aucun visiteur trouvé pour ce service.
            </div>
          ) : (
            <table className="min-w-full divide-y">
              <thead className={`${tableHead}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${borderColor}`}>Nom</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${borderColor}`}>Prénom</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${borderColor}`}>CIN</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${borderColor}`}>Motif</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${borderColor}`}>
                {visiteurs.map((visiteur) => (
                  <tr key={visiteur.id_visiteur} className={`${tableRowHover}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>{visiteur.nom}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>{visiteur.prenom}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>{visiteur.cin}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>{visiteur.motif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <button
            type="button"
            onClick={onClose}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300"
            } sm:ml-3 sm:w-auto sm:text-sm`}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}