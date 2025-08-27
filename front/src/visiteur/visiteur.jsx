import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import VisiteListPopup from "./listeVisite";
import { NotebookText, Edit2, UserPlus2, Search, RefreshCw, X, History } from "lucide-react";
import AjoutVisiteur from "./ajoutvisiteur";
import AjoutVisite from "./ajoutVisite";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";

export default function Visiteur() {
  const { darkMode } = useDarkMode();
  const navigate= useNavigate();


  // États
  const [visites, setVisites] = useState([]);
  const [openVisite, setOpenVisite] = useState(false);
  const [openAjout, setOpenAjout] = useState(false);
  const [openAjoutVisite, setOpenAjoutVisite] = useState(false);
  const [visiteurActuel, setVisiteurActuel] = useState({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [openModification, setOpenModification] = useState(false);
  const [filtres, setFiltres] = useState({
    id: "",
    nom: "",
    prenom: "",
    cin: "",
    agent: ""
  });

  // Chargement des visiteurs
  useEffect(() => {
    const chargerVisiteurs = async () => {
      setChargement(true);
      try {
        const reponse = await axios.get(`http://localhost:5000/visite/listeVisiteur`);
        
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
    chargerVisiteurs();
  }, []);

  // Modification d'un visiteur
  const mettreAJourVisiteur = async () => {
    setChargement(true);
    try {
      const id = visiteurActuel.id_visiteur;
      const response = await axios.put(
        `http://localhost:5000/visite/updateVisiteur/${id}`,
        {
          nom: visiteurActuel.nom,
          prenom: visiteurActuel.prenom,
          cin: visiteurActuel.cin
        }
      );
      
      if (response.data.message === "Visiteur mise à jour avec succès") {
        // Rafraîchir la liste des visiteurs
        const reponse = await axios.get(`http://localhost:5000/visite/listeVisiteur`);
        setVisites(reponse.data.data);
        setOpenModification(false);
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setErreur(err.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setChargement(false);
    }
  };

  // Filtrage des visiteurs
  const visiteursFiltres = useMemo(() => {
    return visites.filter(visiteur => {
      return (
        (filtres.id === "" || String(visiteur.id_visiteur).includes(filtres.id)) &&
        (filtres.nom === "" || visiteur.nom.toLowerCase().includes(filtres.nom.toLowerCase())) &&
        (filtres.prenom === "" || visiteur.prenom.toLowerCase().includes(filtres.prenom.toLowerCase())) &&
        (filtres.cin === "" || visiteur.cin.toLowerCase().includes(filtres.cin.toLowerCase())) &&
        (filtres.agent === "" || (visiteur.nom_agent && visiteur.nom_agent.toLowerCase().includes(filtres.agent.toLowerCase())))
      );
    });
  }, [visites, filtres]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltres(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFiltres({
      id: "",
      nom: "",
      prenom: "",
      cin: "",
      agent: ""
    });
  };

  const hasActiveFilters = Object.values(filtres).some(val => val !== "");

  // Styles
  const styles = {
    bgMain: darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900",
    cardBg: darkMode ? "bg-gray-800/80 border-gray-700" : "bg-blue-200 border-gray-400",
    tableHead: darkMode ? "bg-gray-800 text-gray-300" : "bg-blue-200 text-blue-800 ",
    tableRowHover: darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50",
    borderColor: darkMode ? "border-gray-700" : "border-gray-400",
    inputBg: darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900",
    boutonPrimaire: darkMode 
      ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700" 
      : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700",
    boutonSecondaire: darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
    statCard: darkMode 
      ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" 
      : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
  };

  if (chargement) {
    return (
      <div className={`min-h-screen pt-24 px-4 md:px-10 flex items-center justify-center ${styles.bgMain}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-500 mb-4"></div>
          <div className="text-xl">Chargement des données...</div>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className={`min-h-screen pt-24 px-4 md:px-10 flex flex-col items-center justify-center ${styles.bgMain}`}>
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">Erreur</div>
          <div className="mb-6">{erreur}</div>
          <button 
            onClick={() => window.location.reload()}
            className={`px-6 py-2 rounded-lg ${styles.boutonPrimaire} transition-all hover:scale-105`}
          >
            <RefreshCw className="inline mr-2" size={18} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 ${styles.bgMain}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b-1 border-gray-400 pb-2">
          <h1 className="text-3xl font-bold mb-2">Gestion des Visiteurs</h1>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <p className={darkMode ?" text-gray-100 dark:text-gray-200" :  " text-gray-600 dark:text-gray-700"}>
              {visiteursFiltres.length} {visiteursFiltres.length > 1 ? 'visiteurs trouvés' : 'visiteur trouvé'}
              {hasActiveFilters && (
                <span className="ml-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
                  Filtres actifs
                </span>
              )}
            </p>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${styles.boutonSecondaire} text-sm`}
                >
                  <X size={16} />
                  Réinitialiser
                </button>
              )}
              <button
                onClick={() => navigate('/visite')} // À adapter selon votre routeur
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${styles.boutonSecondaire} transition-all hover:scale-105`}
              >
                <History size={18} />
                Historique de Visite
              </button>
              <button
                onClick={() => setOpenAjout(true)}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 ${styles.boutonPrimaire} transition-all hover:scale-105`}
              >
                <UserPlus2 size={18} />
                Ajouter un visiteur
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Section filtres à gauche */}
          <div className="lg:w-1/4">
            <div className={`p-6 rounded-xl border ${styles.borderColor} ${styles.cardBg} sticky top-24`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search size={20} />
                Filtres
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="id"
                    value={filtres.id}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Filtrer par ID"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="nom"
                    value={filtres.nom}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Filtrer par nom"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="prenom"
                    value={filtres.prenom}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Filtrer par prénom"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="cin"
                    value={filtres.cin}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Filtrer par CIN"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="agent"
                    value={filtres.agent}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Filtrer par agent"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${styles.boutonSecondaire} mt-4`}
                  >
                    <X size={16} />
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section principale avec tableau à droite */}
          <div className="lg:w-3/4">
            <div className={`rounded-xl border-2 ${styles.borderColor} overflow-hidden`}>
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="w-full min-w-max">
                    <thead className={`${styles.tableHead} sticky top-0 z-10`}>
                      <tr>
                        <th className="px-6 py-4 text-left font-medium">ID</th>
                        <th className="px-6 py-4 text-left font-medium">Nom</th>
                        <th className="px-6 py-4 text-left font-medium">Prénom</th>
                        <th className="px-6 py-4 text-left font-medium">CIN</th>
                        <th className="px-6 py-4 text-left font-medium">Agent</th>
                        <th className="px-6 py-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {visiteursFiltres.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="text-gray-400 mb-2" size={32} />
                              <p className="text-gray-500">
                                {visites.length === 0 
                                  ? "Aucun visiteur enregistré" 
                                  : "Aucun résultat correspondant aux filtres"}
                              </p>
                              {hasActiveFilters && (
                                <button
                                  onClick={resetFilters}
                                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  Réinitialiser les filtres
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        visiteursFiltres.map((visiteur) => (
                          <tr 
                            key={visiteur.id_visiteur} 
                            className={`${styles.tableRowHover} transition-colors`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{visiteur.id_visiteur}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{visiteur.nom}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{visiteur.prenom}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono">{visiteur.cin}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{visiteur.nom_agent || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setVisiteurActuel(visiteur);
                                    setOpenVisite(true);
                                  }}
                                  className={`p-2 rounded-lg ${darkMode ? "text-yellow-400 hover:bg-yellow-400/20" : "text-yellow-600 hover:bg-yellow-100"}`}
                                  title="Voir les visites"
                                >
                                  <NotebookText size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setVisiteurActuel(visiteur);
                                    setOpenAjoutVisite(true);
                                  }}
                                  className={`p-2 rounded-lg ${darkMode ? "text-green-400 hover:bg-green-400/20" : "text-green-600 hover:bg-green-100"}`}
                                  title="Ajouter une visite"
                                >
                                  <UserPlus2 size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setVisiteurActuel(visiteur);
                                    setOpenModification(true);
                                  }}
                                  className={`p-2 rounded-lg ${darkMode ? "text-blue-400 hover:bg-blue-400/20" : "text-blue-600 hover:bg-blue-100"}`}
                                  title="Modifier"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AjoutVisiteur 
        open={openAjout} 
        onClose={() => setOpenAjout(false)} 
        onSuccess={() => window.location.reload()}
      />
      
      <VisiteListPopup 
        open={openVisite} 
        onClose={() => setOpenVisite(false)} 
        visites={visiteurActuel}
      />
      
      <AjoutVisite
        open={openAjoutVisite}
        onClose={() => setOpenAjoutVisite(false)}
        visiteur={visiteurActuel}
      />

      {/* Modal de modification */}
      {openModification && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/80' : 'bg-black/50'}`}>
          <div className={`w-full max-w-md rounded-xl p-6 ${styles.cardBg}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier le visiteur</h2>
              <button 
                onClick={() => setOpenModification(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={visiteurActuel.nom || ''}
                  onChange={(e) => setVisiteurActuel({...visiteurActuel, nom: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  value={visiteurActuel.prenom || ''}
                  onChange={(e) => setVisiteurActuel({...visiteurActuel, prenom: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CIN</label>
                <input
                  type="text"
                  value={visiteurActuel.cin || ''}
                  onChange={(e) => setVisiteurActuel({...visiteurActuel, cin: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${styles.inputBg}`}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModification(false)}
                className={`px-4 py-2 rounded-lg ${styles.boutonSecondaire}`}
              >
                Annuler
              </button>
              <button
                onClick={mettreAJourVisiteur}
                disabled={chargement}
                className={`px-4 py-2 rounded-lg ${styles.boutonPrimaire} ${chargement ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {chargement ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}