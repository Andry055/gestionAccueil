import React, { useState, useEffect, useMemo } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";

export default function Visite() {
  const { darkMode } = useDarkMode();

  // États
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [visites, setVisites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [typeVisite, setTypeVisite] = useState("lieu"); // 'lieu' ou 'personne'

  // Formatage des dates et heures
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

  // Chargement des données
  useEffect(() => {
    const chargeVisites = async () => {
      setChargement(true);
      try {
        const endpoint = typeVisite === "lieu" 
          ? "http://localhost:5000/visite/listeVisite" 
          : "http://localhost:5000/visite/listeVisitePersonne";
        
        const reponse = await axios.get(endpoint);
        
        if (reponse.data && reponse.data.data && Array.isArray(reponse.data.data)) {
          setVisites(reponse.data.data);
          setErreur(null);
        } else {
          throw new Error("Format de données inattendu");
        }
      } catch (err) {
        console.error("Erreur API:", err);
        setErreur(err.response?.data?.error || err.message || "Erreur serveur");
        setVisites([]);
      } finally {
        setChargement(false);
      }
    };

    chargeVisites();
  }, [typeVisite]);

  // Filtrage des visites
  const filteredVisites = useMemo(() => {
    return visites.filter(v => {
      // Filtre par recherche textuelle
      const matchesSearch = 
        search === "" ||
        (v.nom && v.nom.toLowerCase().includes(search.toLowerCase())) ||
        (v.prenom && v.prenom.toLowerCase().includes(search.toLowerCase())) ||
        (v.nom_lieu && v.nom_lieu.toLowerCase().includes(search.toLowerCase())) ||
        (v.nom_agent && v.nom_agent.toLowerCase().includes(search.toLowerCase())) ||
        (v.motif && v.motif.toLowerCase().includes(search.toLowerCase()));

      // Filtre par date
      const dateField = typeVisite === "lieu" ? v.date : v.date_p;
      const matchesDate = 
        dateDebut === "" || 
        (dateField && new Date(dateField) >= new Date(dateDebut));

      return matchesSearch && matchesDate;
    });
  }, [visites, search, dateDebut, typeVisite]);

  // Style
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const tableBorder = darkMode ? "border-gray-600" : "border-gray-200";
  const activeTabStyle = darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white";
  const inactiveTabStyle = darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  // Reset
  const handleReset = () => {
    setSearch("");
    setDateDebut("");
  };

  // Colonnes du tableau en fonction du type de visite
  const getTableHeaders = () => {
    if (typeVisite === "lieu") {
      return ["ID", "Nom", "Prénom", "Date", "Heure Arrivée", "Heure Sortie", "Service", "Motif", "Actions"];
    } else {
      return ["ID", "Nom", "Prénom", "Date", "Heure Arrivée", "Heure Sortie", "Agent", "Actions"];
    }
  };

  // Affichage des données de la ligne en fonction du type de visite
  const renderTableRow = (v) => {
    if (typeVisite === "lieu") {
      return (
        <>
          <td className="px-4 py-3">{v.id_visitelieu}</td>
          <td className="px-4 py-3 font-medium">{v.nom || "-"}</td>
          <td className="px-4 py-3">{v.prenom || "-"}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatDate(v.date)}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_arrivee)}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_depart) || "-"}</td>
          <td className="px-4 py-3">{v.nom_lieu}</td>
          <td className="px-4 py-3">{v.motif}</td>
        </>
      );
    } else {
      return (
        <>
          <td className="px-4 py-3">{v.id_visitepersonne}</td>
          <td className="px-4 py-3 font-medium">{v.nom || "-"}</td>
          <td className="px-4 py-3">{v.prenom || "-"}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatDate(v.date_p)}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_arrivee)}</td>
          <td className="px-4 py-3 whitespace-nowrap">{formatHeure(v.heure_depart) || "-"}</td>
          <td className="px-4 py-3">{v.nom_agent}</td>
        </>
      );
    }
  };

  return (
    <div className={`min-h-screen pt-23 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Historique des visites</h1>

      <div className="max-w-7xl px-8 mx-auto pb-10">
        {/* Menu de sélection du type de visite */}
        <div className="flex mb-5">
          <button
            onClick={() => setTypeVisite("lieu")}
            className={`px-4 py-2 rounded-l-lg font-medium ${typeVisite === "lieu" ? activeTabStyle : inactiveTabStyle}`}
          >
            Visites de lieu
          </button>
          <button
            onClick={() => setTypeVisite("personne")}
            className={`px-4 py-2 rounded-r-lg font-medium ${typeVisite === "personne" ? activeTabStyle : inactiveTabStyle}`}
          >
            Visites de personne
          </button>
        </div>

        {/* Filtres */}
        <div className={`rounded-xl md:p-6 p-4 mb-5 ${cardBg}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Recherche */}
            <input
              type="text"
              placeholder={typeVisite === "lieu" ? "Nom, service ou motif..." : "Nom, agent..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full md:w-1/3 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
              }`}
            />

            {/* Date début */}
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className={`w-full md:w-1/4 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
              }`}
            />

            {/* Bouton Reset */}
            <button
              onClick={handleReset}
              className={`w-full md:w-auto px-4 py-2 rounded-md border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Tableau */}
        <section className={`rounded-xl shadow-lg p-6 md:p-8 overflow-y-auto max-h-[75vh] border-4 ${
          darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {typeVisite === "lieu" ? "Liste des visites de lieu" : "Liste des visites de personne"}
            </h2>
            <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg}`}>
              <p className="font-medium px-1">Total :</p>
              <p className="text-2xl font-bold">{filteredVisites.length}</p>
            </div>
          </div>

          {chargement ? (
            <div className="text-center py-10">Chargement en cours...</div>
          ) : erreur ? (
            <div className="text-center py-10 text-red-500">{erreur}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={`${tableHead} sticky top-0 z-10`}>
                  <tr>
                    {getTableHeaders().map((heading) => (
                      <th
                        key={heading}
                        className={`px-4 py-3 text-left font-medium whitespace-nowrap border-b ${tableBorder}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVisites.length === 0 ? (
                    <tr>
                      <td colSpan={getTableHeaders().length} className="text-center py-10 text-gray-500">
                        Aucune visite trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredVisites.map((v) => (
                      <tr 
                        key={typeVisite === "lieu" ? v.id_visitelieu : v.id_visitepersonne} 
                        className={`${tableRowHover} transition-colors border-b ${tableBorder}`}
                      >
                        {renderTableRow(v)}
                        <td className="px-4 py-3">
                          <button className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                            <PencilSquareIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}