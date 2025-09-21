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
  const [tri, setTri] = useState({ colonne: null, ordre: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const [visitesParPage] = useState(20);

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

  // Fonction de tri
  const trierVisites = (colonne) => {
    let nouvelOrdre = 'asc';
    
    if (tri.colonne === colonne && tri.ordre === 'asc') {
      nouvelOrdre = 'desc';
    }
    
    setTri({ colonne, ordre: nouvelOrdre });
    
    const visitesTriees = [...visites].sort((a, b) => {
      if (colonne === 'id') {
        const idA = typeVisite === "lieu" ? a.id_visitelieu : a.id_visitepersonne;
        const idB = typeVisite === "lieu" ? b.id_visitelieu : b.id_visitepersonne;
        return nouvelOrdre === 'asc' ? idA - idB : idB - idA;
      } else if (colonne === 'nom') {
        return nouvelOrdre === 'asc' 
          ? (a.nom || '').localeCompare(b.nom || '') 
          : (b.nom || '').localeCompare(a.nom || '');
      } else if (colonne === 'prenom') {
        return nouvelOrdre === 'asc' 
          ? (a.prenom || '').localeCompare(b.prenom || '') 
          : (b.prenom || '').localeCompare(a.prenom || '');
      } else if (colonne === 'date') {
        const dateA = typeVisite === "lieu" ? a.date : a.date_p;
        const dateB = typeVisite === "lieu" ? b.date : b.date_p;
        return nouvelOrdre === 'asc' 
          ? new Date(dateA) - new Date(dateB) 
          : new Date(dateB) - new Date(dateA);
      } else if (colonne === 'heure_arrivee') {
        return nouvelOrdre === 'asc' 
          ? (a.heure_arrivee || '').localeCompare(b.heure_arrivee || '') 
          : (b.heure_arrivee || '').localeCompare(a.heure_arrivee || '');
      } else if (colonne === 'heure_depart') {
        return nouvelOrdre === 'asc' 
          ? (a.heure_depart || '').localeCompare(b.heure_depart || '') 
          : (b.heure_depart || '').localeCompare(a.heure_depart || '');
      } else if (colonne === 'service') {
        return nouvelOrdre === 'asc' 
          ? (a.nom_lieu || '').localeCompare(b.nom_lieu || '') 
          : (b.nom_lieu || '').localeCompare(a.nom_lieu || '');
      } else if (colonne === 'motif') {
        return nouvelOrdre === 'asc' 
          ? (a.motif || '').localeCompare(b.motif || '') 
          : (b.motif || '').localeCompare(a.motif || '');
      } else if (colonne === 'agent') {
        return nouvelOrdre === 'asc' 
          ? (a.nom_agent || '').localeCompare(b.nom_agent || '') 
          : (b.nom_agent || '').localeCompare(a.nom_agent || '');
      }
      return 0;
    });
    
    setVisites(visitesTriees);
  };

  // Fonction pour obtenir l'indicateur de tri
  const getIndicateurTri = (colonne) => {
    if (tri.colonne !== colonne) return null;
    return tri.ordre === 'asc' ? '↑' : '↓';
  };

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

  // Pagination
  const indexDerniereVisite = pageCourante * visitesParPage;
  const indexPremiereVisite = indexDerniereVisite - visitesParPage;
  const visitesCourantes = filteredVisites.slice(indexPremiereVisite, indexDerniereVisite);
  const totalPages = Math.ceil(filteredVisites.length / visitesParPage);

  const paginer = (pageNumber) => setPageCourante(pageNumber);

  // Style
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const tableBorder = darkMode ? "border-gray-600" : "border-gray-200";
  const activeTabStyle = darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white";
  const inactiveTabStyle = darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const pageButtonStyle = darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100";
  const activePageButtonStyle = darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white";

  // Reset
  const handleReset = () => {
    setSearch("");
    setDateDebut("");
    setPageCourante(1);
  };

  // Colonnes du tableau en fonction du type de visite
  const getTableHeaders = () => {
    if (typeVisite === "lieu") {
      return [
        { label: "ID", key: "id" },
        { label: "Nom", key: "nom" },
        { label: "Prénom", key: "prenom" },
        { label: "Date", key: "date" },
        { label: "Heure Arrivée", key: "heure_arrivee" },
        { label: "Heure Sortie", key: "heure_depart" },
        { label: "Service", key: "service" },
        { label: "Motif", key: "motif" },
        { label: "Actions", key: "actions" }
      ];
    } else {
      return [
        { label: "ID", key: "id" },
        { label: "Nom", key: "nom" },
        { label: "Prénom", key: "prenom" },
        { label: "Date", key: "date" },
        { label: "Heure Arrivée", key: "heure_arrivee" },
        { label: "Heure Sortie", key: "heure_depart" },
        { label: "Agent", key: "agent" },
        { label: "Actions", key: "actions" }
      ];
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

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Toujours afficher la première page
      pageNumbers.push(1);
      
      // Calculer le début et la fin de la plage de pages à afficher
      let startPage = Math.max(2, pageCourante - 1);
      let endPage = Math.min(totalPages - 1, pageCourante + 1);
      
      // Ajuster si on est près du début
      if (pageCourante <= 3) {
        endPage = 4;
      }
      
      // Ajuster si on est près de la fin
      if (pageCourante >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Ajouter les points de suspension si nécessaire
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Ajouter les pages intermédiaires
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Ajouter les points de suspension si nécessaire
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Toujours afficher la dernière page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={`min-h-screen pt-23 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Historique des visites</h1>

      <div className="max-w-7xl px-8 mx-auto pb-10">
        {/* Menu de sélection du type de visite */}
        <div className="flex mb-5">
          <button
            onClick={() => {
              setTypeVisite("lieu");
              setPageCourante(1);
            }}
            className={`px-4 py-2 rounded-l-lg font-medium ${typeVisite === "lieu" ? activeTabStyle : inactiveTabStyle}`}
          >
            Visites de lieu
          </button>
          <button
            onClick={() => {
              setTypeVisite("personne");
              setPageCourante(1);
            }}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPageCourante(1);
              }}
              className={`w-full md:w-1/3 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
              }`}
            />

            {/* Date début */}
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => {
                setDateDebut(e.target.value);
                setPageCourante(1);
              }}
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
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className={`${tableHead} sticky top-0 z-10`}>
                    <tr>
                      {getTableHeaders().map(({ label, key }) => (
                        <th
                          key={key}
                          className={`px-4 py-3 text-left font-medium whitespace-nowrap border-b ${tableBorder} ${
                            key !== 'actions' ? 'cursor-pointer hover:bg-indigo-200' : ''
                          }`}
                          onClick={() => key !== 'actions' && trierVisites(key)}
                        >
                          <div className="flex items-center">
                            {label}
                            {key !== 'actions' && <span className="ml-1">{getIndicateurTri(key)}</span>}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visitesCourantes.length === 0 ? (
                      <tr>
                        <td colSpan={getTableHeaders().length} className="text-center py-10 text-gray-500">
                          Aucune visite trouvée.
                        </td>
                      </tr>
                    ) : (
                      visitesCourantes.map((v) => (
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

              {/* Pagination */}
              {filteredVisites.length > visitesParPage && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-2">
                    {/* Bouton Précédent */}
                    <button
                      onClick={() => paginer(pageCourante - 1)}
                      disabled={pageCourante === 1}
                      className={`px-3 py-1 rounded-md border ${pageButtonStyle} ${
                        pageCourante === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Précédent
                    </button>

                    {/* Numéros de page */}
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNumber === 'number' && paginer(pageNumber)}
                        className={`px-3 py-1 rounded-md border ${
                          pageNumber === pageCourante 
                            ? activePageButtonStyle 
                            : pageButtonStyle
                        } ${
                          pageNumber === '...' ? 'cursor-default' : ''
                        }`}
                        disabled={pageNumber === '...'}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {/* Bouton Suivant */}
                    <button
                      onClick={() => paginer(pageCourante + 1)}
                      disabled={pageCourante === totalPages}
                      className={`px-3 py-1 rounded-md border ${pageButtonStyle} ${
                        pageCourante === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              )}

              {/* Informations sur la pagination */}
              <div className={`text-sm mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Affichage des visites {indexPremiereVisite + 1} à {Math.min(indexDerniereVisite, filteredVisites.length)} sur {filteredVisites.length}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}