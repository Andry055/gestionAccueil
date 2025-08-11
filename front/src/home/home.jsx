import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { UserIcon, DocumentTextIcon, Cog6ToothIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from '../utils/DarkModeContext';
import AjoutVisiteur from '../visiteur/ajoutvisiteur';

export default function Home() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("visiteurs"); // visiteurs | services

  // Liste des visites
  const [visites, setVisites] = useState([
    { id: 1, nom: "Andry", prenom: "Nirina", service: "DRFP", heureArr: "08:30", heureSor: "" },
    { id: 2, nom: "Mialy", prenom: "Lionnel", service: "DTFP", heureArr: "09:15", heureSor: "" },
    { id: 3, nom: "Feno", prenom: "Grey", service: "DRFP", heureArr: "10:20", heureSor: "" }
  ]);

  // Filtrer les visites en cours
  const visitesEnCours = visites.filter(
    (v) => !v.heureSor &&
      (v.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       v.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       v.service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Regrouper par service
  const services = visites.reduce((acc, v) => {
    if (!acc[v.service]) acc[v.service] = 0;
    acc[v.service]++;
    return acc;
  }, {});

  const terminerVisite = (id) => {
    const heureSor = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisites(visites.map((v) => (v.id === id ? { ...v, heureSor } : v)));
  };

  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-3 py-1 rounded-full border font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-opacity-50
  `;

  const buttonVariants = {
    yellow: darkMode
      ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-gray-900"
      : "border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white",
    green: darkMode
      ? "border-green-400 text-green-300 hover:bg-green-400 hover:text-gray-900"
      : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white",
    blue: darkMode
      ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
      : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
  };

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

            {/* ---- Petit menu amélioré ---- */}
            <div className="flex gap-2 mt-6 border-b-2 border-gray-300">
              <button 
                className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-300 
                  ${mode === "visiteurs" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setMode("visiteurs")}
              >
                Visiteurs en cours
              </button>
              <button 
                className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-300
                  ${mode === "services" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setMode("services")}
              >
                Services (Nb visiteurs)
              </button>
            </div>
          </div>

          {/* Compteurs */}
          <div className={`border-4 rounded-xl shadow-xl px-3 py-4 min-w-[200px]
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            <h2 className="text-lg font-semibold text-center mb-3">Aujourd'hui</h2>
            
            <div className="flex justify-center gap-3">
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className="text-xs">Visiteurs</p>
                <p className="text-2xl font-bold">{visites.length}</p>
              </div>
              
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className="text-xs">Services</p>
                <p className="text-2xl font-bold">{Object.keys(services).length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tableau dynamique */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-10">
          <div className={`border-4 rounded-xl shadow-xl p-6 overflow-auto lg:col-span-2
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            {/* ---- Mode visiteurs ---- */}
            {mode === "visiteurs" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <h2 className="text-2xl font-bold">Visiteurs en cours</h2>
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
                      className={`${buttonBaseClasses} ${buttonVariants.blue} px-4 py-2`}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                <table className="w-full min-w-[600px] border-collapse table-auto">
                  <thead className={`${tableHead} sticky top-0 z-10`}>
                    <tr>
                      {["ID", "Nom", "Prénom", "Service", "Heure Arrivée", "Actions"].map((heading) => (
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
                    {visitesEnCours.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500">
                          Aucun visiteur en cours.
                        </td>
                      </tr>
                    ) : (
                      visitesEnCours.map((v) => (
                        <tr
                          key={v.id}
                          className={`${tableRowHover} transition-colors cursor-pointer`}
                        >
                          <td className="px-6 py-4 border-b whitespace-nowrap">{v.id}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap">{v.nom}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap">{v.prenom}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap">{v.service}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap">{v.heureArr}</td>
                          <td className="px-6 py-1 border-b whitespace-nowrap space-x-2">
                            <button
                              onClick={() => terminerVisite(v.id)}
                              className={`${buttonBaseClasses} ${buttonVariants.green}`}
                              aria-label={`Terminer visite de ${v.prenom} ${v.nom}`}
                            >
                              Terminer
                            </button>
                            <button
                              className={`${buttonBaseClasses} ${buttonVariants.blue}`}
                              aria-label={`Modifier ${v.prenom} ${v.nom}`}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {/* ---- Mode services ---- */}
            {mode === "services" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Services - Nombre de visiteurs</h2>
                <table className="w-full min-w-[600px] border-collapse table-auto">
                  <thead className={`${tableHead} sticky top-0 z-10`}>
                    <tr>
                      {["Service", "Nombre de visiteurs", "Actions"].map((heading) => (
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
                    {Object.keys(services).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-500">
                          Aucun service aujourd'hui.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(services).map(([service, nb]) => (
                        <tr
                          key={service}
                          className={`${tableRowHover} transition-colors cursor-pointer`}
                        >
                          <td className="px-6 py-4 border-b whitespace-nowrap">{service}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap text-center">{nb}</td>
                          <td className="px-6 py-1 border-b whitespace-nowrap space-x-2">
                            <button
                              className={`${buttonBaseClasses} ${buttonVariants.yellow}`}
                              aria-label={`Voir détails pour ${service}`}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Boutons latéraux */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 px-2">
              <button onClick={() => setOpenAjout(true)} className="hover:scale-105 transition-transform w-full">
                <div className={`rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full
                  ${darkMode ? "bg-gray-700" : "bg-blue-200"}`}>
                  <UserIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Nouveau visiteur</p>
                </div>
              </button>

              <Link to="/service" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full`}>
                  <Cog6ToothIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Voir les services</p>
                </div>
              </Link>

              <Link to="/visite" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full`}>
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