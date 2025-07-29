import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { UserIcon, DocumentTextIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../utils/DarkModeContext';
import AjoutVisiteur from '../visiteur/ajoutvisiteur';

export default function Home() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Liste de visites
  const [visites, setVisites] = useState([
    { id: 1, nom: "Andry", prenom: "Nirina", service: "DRFP", heureArr: "08:30", heureSor: "" },
    { id: 2, nom: "Mialy", prenom: "Lionnel", service: "DTFP", heureArr: "09:15", heureSor: "" },
    { id: 3, nom: "Feno", prenom: "Grey", service: "DRFP", heureArr: "10:20", heureSor: "" },
    { id: 3, nom: "Feno", prenom: "Grey", service: "DRFP", heureArr: "10:20", heureSor: "" },
    { id: 3, nom: "Feno", prenom: "Grey", service: "DRFP", heureArr: "10:20", heureSor: "" },
    { id: 3, nom: "Feno", prenom: "Grey", service: "DRFP", heureArr: "10:20", heureSor: "" },
  ]);

  // Filtrer seulement les visites en cours + recherche
  const visitesEnCours = visites.filter(
    (v) => !v.heureSor &&
      (v.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       v.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       v.service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Terminer visite
  const terminerVisite = (id) => {
    const heureSor = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisites(visites.map((v) => (v.id === id ? { ...v, heureSor } : v)));
  };

  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgMain}`}>
      <main className={`pt-24 px-6 md:px-20 space-y-10 ${textPrimary}`}>
        
        {/* Titre + compteur */}
        <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mr-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-2">Accueil</h1>
            <p className={`text-lg ${textSecondary}`}>
              Bienvenue dans le système de gestion des visiteurs. Suivez les statistiques, ajoutez des visiteurs, et consultez les services disponibles.
            </p>
          </div>

          {/* Compteurs */}
          <div className={`border-4 rounded-xl shadow-xl px-3 py-4 min-w-[250px]
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            <h2 className="text-lg font-semibold text-center mb-3">Aujourd'hui</h2>
            
            <div className="flex justify-center gap-3">
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className={`text-xs text-gray-600 ${darkMode ? "dark:text-gray-400" : ""}`}>Visiteurs</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-blue-800"}`}>34</p>
              </div>
              
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className={`text-xs text-gray-600 ${darkMode ? "dark:text-gray-400" : ""}`}>Services</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-blue-800"}`}>9</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tableau + boutons */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-10">
          
          {/* Tableau visiteurs en cours */}
          <div className={`border-4 rounded-xl shadow-xl p-6 overflow-auto lg:col-span-2
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold text-center md:text-left">Visiteurs en cours</h2>

              {/* Recherche */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
                  }`}
                />
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Tableau */}
            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={`${tableHead} sticky top-0`}>
                <tr>
                  <th className="px-4 py-2 border-b text-left text-base">Nom</th>
                  <th className="px-4 py-2 border-b text-left text-base">Prénom</th>
                  <th className="px-4 py-2 border-b text-left text-base">Service</th>
                  <th className="px-4 py-2 border-b text-left text-base">Heure Arrivée</th>
                  <th className="px-4 py-2 border-b text-center text-base">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitesEnCours.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 text-base">
                      Aucun visiteur en cours.
                    </td>
                  </tr>
                ) : (
                  visitesEnCours.map((v) => (
                    <tr key={v.id} className={`${tableRowHover} transition-colors`}>
                      <td className="px-4 py-2 border-b">{v.nom}</td>
                      <td className="px-4 py-2 border-b">{v.prenom}</td>
                      <td className="px-4 py-2 border-b">{v.service}</td>
                      <td className="px-4 py-2 border-b">{v.heureArr}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <button
                          onClick={() => terminerVisite(v.id)}
                          className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Visite terminée
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Boutons */}
          <div className="space-y-6">
            <div className={`grid grid-cols-1 gap-6 px-2`}>
              <button onClick={() => setOpenAjout(true)} className="hover:scale-105 transition-transform w-full">
                <div className={`rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full
                  ${darkMode ? "bg-gray-700" : "bg-blue-200"}`}>
                  <UserIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Nouveau visiteur</p>
                </div>
              </button>

              <Link to="/service" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full`}>
                  <Cog6ToothIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Voir les services</p>
                </div>
              </Link>

              <Link to="/visite" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full`}>
                  <DocumentTextIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Historique de visite</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <AjoutVisiteur open={openAjout} onClose={() => setOpenAjout(false)} />
      </main>
    </div>
  );
}
