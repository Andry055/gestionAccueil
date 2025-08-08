import React, { useState, useEffect } from "react";
import VisiteListPopup from "./listeVisite";
import { NotebookText, Edit2, UserPlus2 } from "lucide-react";
import AjoutVisiteur from "./ajoutvisiteur";
import AjoutVisite from "./ajoutVisite";
import { useDarkMode } from "../utils/DarkModeContext";

const utilisateursInitiaux = [
  { 
    id: 1, 
    nom: "Andry", 
    prenom: "Nirina", 
    cin: "2010245124536", 
    dateAjout: "2025-07-20",
    agentAccueil: "Rakoto Jean" 
  },
  { 
    id: 2, 
    nom: "Mialy", 
    prenom: "Lionnel", 
    cin: "20105114250", 
    dateAjout: "2025-07-21",
    agentAccueil: "Rasoa Marie" 
  },
  { 
    id: 3, 
    nom: "Feno", 
    prenom: "Grey", 
    cin: "102410231546", 
    dateAjout: "2025-07-22",
    agentAccueil: "Randria Paul" 
  },
];

export default function Visiteur() {
  const { darkMode } = useDarkMode();
  const today = new Date().toISOString().split("T")[0];

  const [utilisateurs, setUtilisateurs] = useState(utilisateursInitiaux);
  const [filters, setFilters] = useState({ id: "", nom: "", prenom: "", cin: "", agentAccueil: "" });
  const [searchValues, setSearchValues] = useState({ id: "", nom: "", prenom: "", cin: "", agentAccueil: "" });
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState(utilisateurs);
  const [openVisite, setOpenVisite] = useState(false);
  const [openAjout, setOpenAjout] = useState(false);
  const [openAjoutVisite, setOpenAjoutVisite] = useState(false);
  const [currentVisiteur, setCurrentVisiteur] = useState(null);

  const [visites, setVisites] = useState([
    { id: 1, visiteurId: 1, date: "2025-07-10", service: "DRFP", motif: "Réunion", personneVisite: "Mr. Rakoto" },
    { id: 2, visiteurId: 2, date: "2025-07-12", service: "DTFP", motif: "Dépôt de dossier", personneVisite: "Mme. Rasoa" },
    { id: 3, visiteurId: 3, date: "2025-07-15", service: "DRFP", motif: "Entretien", personneVisite: "Mr. Randria" },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setFilters(searchValues), 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

  useEffect(() => {
    const result = utilisateurs.filter((user) => {
      return (
        (filters.id === "" || user.id === Number(filters.id)) &&
        (filters.nom === "" || user.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
        (filters.prenom === "" || user.prenom.toLowerCase().includes(filters.prenom.toLowerCase())) &&
        (filters.cin === "" || user.cin.toLowerCase().includes(filters.cin.toLowerCase())) &&
        (filters.agentAccueil === "" || user.agentAccueil.toLowerCase().includes(filters.agentAccueil.toLowerCase()))
      );
    });
    setFilteredUtilisateurs(result);
  }, [filters, utilisateurs]);

  const handleChange = (e) => setSearchValues({ ...searchValues, [e.target.name]: e.target.value });

  const handleReset = () => {
    setSearchValues({ id: "", nom: "", prenom: "", cin: "", agentAccueil: "" });
    setFilters({ id: "", nom: "", prenom: "", cin: "", agentAccueil: "" });
  };

  const handleAjoutVisiteur = (newVisiteur) => {
    const newId = utilisateurs.length > 0 ? utilisateurs[utilisateurs.length - 1].id + 1 : 1;
    const newUser = { 
      ...newVisiteur, 
      id: newId, 
      dateAjout: today,
      agentAccueil: newVisiteur.agentAccueil || "Non spécifié"
    };
    setUtilisateurs([...utilisateurs, newUser]);
    setOpenAjout(false);
  };

  const handleAddVisite = (newVisite) => {
    const visiteWithVisitor = {
      ...newVisite,
      visiteurId: currentVisiteur.id,
      visiteurNom: `${currentVisiteur.prenom} ${currentVisiteur.nom}`
    };
    setVisites([...visites, visiteWithVisitor]);
    setOpenAjoutVisite(false);
  };

  const nouveauxVisiteurs = utilisateurs.filter(u => u.dateAjout === today).length;

  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-blue-200 text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-5 py-2 border rounded-full font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-4 focus:ring-indigo-300
  `;

  const buttonVariants = {
    primary: darkMode
      ? "border-indigo-500 text-indigo-400 hover:text-white hover:bg-indigo-600 focus:ring-indigo-500"
      : "border-indigo-600 text-indigo-700 hover:text-white hover:bg-indigo-600 focus:ring-indigo-300",
    neutral: darkMode
      ? "border-gray-500 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-500"
      : "border-gray-400 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-gray-300",
  };

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Visiteurs</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">

        {/* Filtres */}
        <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 border-blue-200 ${cardBg}`}>
          <h2 className="text-2xl font-semibold text-center mb-6">Filtres</h2>

          <div className="flex flex-col space-y-4">
            {["id", "nom", "cin", "agentAccueil"].map((field) => (
              <label key={field} className="flex flex-col font-medium capitalize">
                {field === "agentAccueil" ? "Agent d'accueil" : field}
                <input
                  type={field === "id" ? "number" : "text"}
                  name={field}
                  value={searchValues[field]}
                  onChange={handleChange}
                  placeholder={`Rechercher par ${field === "agentAccueil" ? "agent d'accueil" : field}`}
                  className={`mt-2 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </label>
            ))}
            <button
              onClick={handleReset}
              className={`${buttonBaseClasses} ${buttonVariants.neutral} mt-4 w-full text-center`}
              aria-label="Réinitialiser les filtres"
            >
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau + Statistiques */}
        <section
          className={`rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh] border-4
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Liste des visiteurs</h2>

            <div className="flex flex-wrap items-center gap-4">

              {/* Statistiques */}
              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg} shadow-md`}>
                <p className="font-medium px-2">Total :</p>
                <p className="text-2xl font-bold">{filteredUtilisateurs.length}</p>
              </div>

              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg} shadow-md`}>
                <p className="font-medium px-2">Nouveau :</p>
                <p className="text-2xl font-bold">{nouveauxVisiteurs}</p>
              </div>

              {/* Bouton Voir tous */}
              <button
                onClick={() => {
                  setFilters({ id: "", nom: "", cin: "", agentAccueil: "" });
                  setSearchValues({ id: "", nom: "", cin: "", agentAccueil: "" });
                }}
                className={`${buttonBaseClasses} ${buttonVariants.neutral} shadow-sm`}
                aria-label="Voir tous les visiteurs"
              >
                Voir tous
                <span className="ml-2 text-xl font-bold">→</span>
              </button>

              {/* Bouton Ajout */}
              <button
                onClick={() => setOpenAjout(true)}
                className={`${buttonBaseClasses} ${buttonVariants.primary} shadow-lg`}
                aria-label="Ajouter un visiteur"
              >
                <UserPlus2 className="w-5 h-5 mr-2" />
                Ajout
              </button>

            </div>
          </div>

          <table className="w-full min-w-[600px] border-collapse table-auto">
            <thead className={`${tableHead} sticky top-0 z-10`}>
              <tr>
                {["ID", "Nom", "Prénom", "CIN", "Agent d'accueil", "Actions", "Modifier"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUtilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Aucun visiteur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUtilisateurs.map((user) => (
                  <tr
                    key={user.id}
                    className={`${tableRowHover} transition-colors cursor-pointer`}
                  >
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.nom}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.prenom}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.cin}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.agentAccueil}</td>
                    <td className="px-6 py-1 border-b whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setCurrentVisiteur(user);
                          setOpenVisite(true);
                        }}
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full
                          border transition duration-300
                          ${
                            darkMode
                              ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-gray-900"
                              : "border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white"
                          }`}
                        aria-label={`Voir visite de ${user.prenom} ${user.nom}`}
                      >
                        <NotebookText className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentVisiteur(user);
                          setOpenAjoutVisite(true);
                        }}
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full
                          border transition duration-300
                          ${
                            darkMode
                              ? "border-green-400 text-green-300 hover:bg-green-400 hover:text-gray-900"
                              : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                          }`}
                        aria-label={`Ajouter visite pour ${user.prenom} ${user.nom}`}
                      >
                        <UserPlus2 className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-1 border-b whitespace-nowrap">
                      <button
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full
                          border transition duration-300
                          ${
                            darkMode
                              ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
                              : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                          }`}
                        aria-label={`Modifier ${user.prenom} ${user.nom}`}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <AjoutVisiteur 
            open={openAjout} 
            onClose={() => setOpenAjout(false)} 
            onAdd={handleAjoutVisiteur} 
            withAgentAccueil
          />
          
          <VisiteListPopup 
            open={openVisite} 
            onClose={() => setOpenVisite(false)} 
            visites={visites.filter(v => v.visiteurId === currentVisiteur?.id)} 
          />
          
          <AjoutVisite
            open={openAjoutVisite}
            onClose={() => setOpenAjoutVisite(false)}
            onAdd={handleAddVisite}
          />
        </section>
      </div>
    </div>
  );
}