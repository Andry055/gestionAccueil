import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import VisiteListPopup from "./listeVisite";
import { NotebookText, Edit2, UserPlus2 } from "lucide-react";
import AjoutVisiteur from "./AjoutVisiteur";
import { useDarkMode } from "./DarkModeContext";

const utilisateursInitiaux = [
  { id: 1, nom: "Andry", prenom: "Nirina", cin: "2010245124536", dateAjout: "2025-07-20" },
  { id: 2, nom: "Mialy", prenom: "Lionnel", cin: "20105114250", dateAjout: "2025-07-21" },
  { id: 3, nom: "Feno", prenom: "Grey", cin: "102410231546", dateAjout: "2025-07-22" },
];

export default function Visiteur() {
  const { darkMode } = useDarkMode();
  const today = new Date().toISOString().split("T")[0];

  const [utilisateurs, setUtilisateurs] = useState(utilisateursInitiaux);
  const [filters, setFilters] = useState({ id: "", nom: "", prenom: "", cin: "" });
  const [searchValues, setSearchValues] = useState({ id: "", nom: "", prenom: "", cin: "" });
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState(utilisateurs);
  const [openVisite, setOpenVisite] = useState(false);
  const [openAjout, setOpenAjout] = useState(false);

  const visites = [
    { id: 1, date: "2025-07-10", heureArr: "8:55", heureSor: "10:55", service: "DRFP", motif: "Réunion", chefService: "Mr TOVONIAINA Hasa" },
    { id: 2, date: "2025-07-12", heureArr: "9:00", heureSor: "10:50", service: "DTFP", motif: "Dépôt de dossier", chefService: "Mme RAMANATSOA Lala" },
    { id: 3, date: "2025-07-15", heureArr: "10:20", heureSor: "11:55", service: "DRFP", motif: "Entretien", chefService: "Mr LAZANIRINA Manana" },
  ];

  // Recherche avec debounce
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
        (filters.cin === "" || user.cin.toLowerCase().includes(filters.cin.toLowerCase()))
      );
    });
    setFilteredUtilisateurs(result);
  }, [filters, utilisateurs]);

  const handleChange = (e) => setSearchValues({ ...searchValues, [e.target.name]: e.target.value });

  const handleReset = () => {
    setSearchValues({ id: "", nom: "", prenom: "", cin: "" });
    setFilters({ id: "", nom: "", prenom: "", cin: "" });
  };

  // Compteur "Nouveau"
  const nouveauxVisiteurs = utilisateurs.filter(u => u.dateAjout === today).length;

  // Style
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-blue-200 text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  // Ajout visiteur
  const handleAjoutVisiteur = (newVisiteur) => {
    const newId = utilisateurs.length + 1;
    const newUser = { ...newVisiteur, id: newId, dateAjout: today };
    setUtilisateurs([...utilisateurs, newUser]);
    setOpenAjout(false);
  };

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Visiteurs</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">

        {/* Filtres */}
        <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 border-blue-200 ${cardBg}`}>
          <h2 className="text-2xl font-semibold text-center">Filtres</h2>

          <div className="flex flex-col space-y-2 mt-4">
            {["id", "nom", "prenom", "cin"].map((field) => (
              <label key={field} className="flex flex-col font-medium capitalize">
                {field}
                <input
                  type={field === "id" ? "number" : "text"}
                  name={field}
                  value={searchValues[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className={`mt-1 p-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
                  }`}
                />
              </label>
            ))}
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau + Statistiques */}
        <section className={`rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh] border-4 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Liste des visiteurs</h2>

            <div className="flex flex-wrap items-center gap-4">

              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg}`}>
                <p className="font-medium px-1">Total :</p>
                <p className="text-2xl font-bold">{filteredUtilisateurs.length}</p>
              </div>

              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg}`}>
                <p className="font-medium px-1">Nouveau :</p>
                <p className="text-2xl font-bold">{nouveauxVisiteurs}</p>
              </div>

              <button onClick={() => setOpenAjout(true)}>
                <div className="flex shadow-xl justify-center items-center bg-green-600 rounded-2xl w-32 h-12 hover:scale-105 transition-transform p-2">
                  <b><p className="text-white pr-2">Ajout</p></b>
                  <UserPlus2 className="w-8 text-white" />
                </div>
              </button>

            </div>
          </div>

          <table className="w-full min-w-[600px] border-collapse table-auto">
            <thead className={`${tableHead} sticky top-0 z-10`}>
              <tr>
                {["ID", "Nom", "Prénom", "CIN", "Visite", "Modifier"].map((heading) => (
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
                  <td colSpan={6} className="text-center py-10 text-gray-500">
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
                    <td className="px-6 py-1 border-b whitespace-nowrap">
                      <button onClick={() => setOpenVisite(true)}>
                        <div className="grid place-items-center bg-orange-400 rounded-2xl w-12 h-12">
                          <NotebookText className="w-8 text-white" />
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-1 border-b whitespace-nowrap">
                      <div className="grid place-items-center bg-blue-600 rounded-2xl w-12 h-12">
                        <Edit2 className="w-8 text-white" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <AjoutVisiteur open={openAjout} onClose={() => setOpenAjout(false)} onAdd={handleAjoutVisiteur} />
          <VisiteListPopup open={openVisite} onClose={() => setOpenVisite(false)} visites={visites} />
        </section>
      </div>
    </div>
  );
}
