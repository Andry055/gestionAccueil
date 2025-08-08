import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { UserIcon, ChartBarIcon, UsersIcon, ShieldCheckIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useDarkMode } from "../utils/DarkModeContext";
import AjoutVisiteur from "../visiteur/ajoutvisiteur";

export default function SuperAdminDashboard() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [visitesAujourdhui, setVisitesAujourdhui] = useState(0);
  const [servicesVisites, setServicesVisites] = useState([]);

  // Simule les statistiques (à remplacer par ton API plus tard)
  useEffect(() => {
    // Nombre total de visites aujourd’hui
    setVisitesAujourdhui(23);

    // Répartition par service visité
    setServicesVisites([
      { nom: "Service RH", total: 7 },
      { nom: "Informatique", total: 9 },
      { nom: "Direction", total: 4 },
      { nom: "Sécurité", total: 3 },
    ]);
  }, []);

  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgMain}`}>
      <main className={`pt-24 px-6 md:px-20 space-y-10 ${textPrimary}`}>
        {/* Titre */}
        <section>
          <h1 className="text-4xl font-extrabold mb-2">Dashboard Super Admin</h1>
          <p className={`text-lg max-w-3xl ${textSecondary}`}>
            Accédez aux outils d'administration avancée, gérez les utilisateurs, les rôles et les services.
          </p>
        </section>

        {/* Statistiques */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full 
            ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
            <CalendarDaysIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`} />
            <p className="text-2xl font-bold">{visitesAujourdhui}</p>
            <p className={`${textSecondary} text-sm`}>Visites Aujourd’hui</p>
          </div>
          <div className={`rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center h-full 
            ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
            <CalendarDaysIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`} />
            <p className="text-2xl font-bold">14</p>
            <p className={`${textSecondary} text-sm`}>Service Visité Aujourd’hui</p>
          </div>
        </section>
        

        <AjoutVisiteur open={openAjout} onClose={() => setOpenAjout(false)} />
      </main>
    </div>
  );
}
