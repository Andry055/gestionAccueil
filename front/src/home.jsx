import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { UserIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from "./DarkModeContext";
import AjoutVisiteur from "./AjoutVisiteur";

export default function Home() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);

  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgMain}`}>
      <main className={`pt-24 px-6 md:px-20 space-y-10 ${textPrimary}`}>
        <section>
          <h1 className="text-4xl font-extrabold mb-2">Accueil</h1>
          <p className={`text-lg max-w-3xl ${textSecondary}`}>
            Bienvenue dans le système de gestion des visiteurs. Suivez les statistiques, ajoutez des visiteurs, et consultez les services disponibles.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
          <div className={`grid grid-cols-1 gap-6 px-7 border-l-4 ${darkMode ? "border-gray-500" : "border-gray-800"}`}>
            <button onClick={() => setOpenAjout(true)} className="hover:scale-105 transition-transform w-full">
              <div className={`rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full
                ${darkMode ? "bg-gray-700" : "bg-blue-200"}`}>
                <UserIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-xl font-medium`}>Nouveau visiteur</p>
              </div>
            </button>

            <Link to="/service" className="hover:scale-105 transition-transform">
              <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full`}>
                <Cog6ToothIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-xl font-medium`}>Voir les services</p>
              </div>
            </Link>

            <Link to="/stats" className="hover:scale-105 transition-transform">
              <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full`}>
                <ChartBarIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-xl font-medium`}>Statistiques détaillées</p>
              </div>
            </Link>
          </div>

          {/* Compteurs */}
          <div className={`border-4 rounded-xl shadow-xl p-6 space-y-6
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            <h2 className="text-2xl font-semibold text-center">Aujourd'hui</h2>
            <div className={`rounded-lg p-4 shadow-md text-center
              ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
              <p className={`text-gray-600 ${darkMode ? "dark:text-gray-400" : ""}`}>Nombre de Visiteurs</p>
              <p className={`text-4xl font-bold ${darkMode ? "text-amber-300" : "text-blue-800"}`}>34</p>
            </div>
            <div className={`rounded-lg p-4 shadow-md text-center
              ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
              <p className={`text-gray-600 ${darkMode ? "dark:text-gray-400" : ""}`}>Services visités</p>
              <p className={`text-4xl font-bold ${darkMode ? "text-amber-300" : "text-blue-800"}`}>9</p>
            </div>
          </div>

          {/* Graphique simplifié */}
          <div className={`border-4 rounded-xl shadow-xl p-6
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            <h2 className="text-xl font-bold mb-4">Visites sur la semaine</h2>
            <div className="grid grid-cols-7 items-end gap-4 h-48 px-2">
              {[
                ["Lun", "20%"],
                ["Mar", "20%"],
                ["Mer", "70%"],
                ["Jeu", "60%"],
                ["Ven", "60%"],
                ["Sam", "10%"],
                ["Dim", "50%"],
              ].map(([day, height]) => (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className={`w-5 rounded-t border-t-4 transition-all duration-300 ${
                      darkMode
                        ? "bg-amber-400 border-amber-500"
                        : "bg-indigo-300 border-indigo-600"
                    }`}
                    style={{ height }}
                  />
                  <p className={`text-xs mt-1 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>{day}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pop-up AjoutVisiteur */}
        <AjoutVisiteur open={openAjout} onClose={() => setOpenAjout(false)} />
      </main>
    </div>
  );
}
