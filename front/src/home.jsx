import React from 'react';
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { UserIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="pt-24 px-6 md:px-20 space-y-10">
        {/* Intro */}
        <section>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Accueil</h1>
          <p className="text-gray-700 text-lg max-w-3xl">
            Bienvenue dans le système de gestion des visiteurs. Suivez les statistiques, ajoutez des visiteurs, et consultez les services disponibles.
          </p>
        </section>

        {/* Bloc principal : Liens à gauche, Compteurs au centre, Graphique à droite */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
          {/* Liens vers autres pages (à gauche) */}
          <div className="grid grid-cols-1 gap-6 px-7 border-l-5 border-gray-800">
            <Link to="/visiteur" className="hover:scale-105 transition-transform">
              <div className="bg-blue-200 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full">
                <UserIcon className="h-10 w-10 text-black mb-2" />
                <p className="text-xl font-medium text-gray-800">Nouveau visiteur</p>
              </div>
            </Link>

            <Link to="/service" className="hover:scale-105 transition-transform">
              <div className="bg-blue-200 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full">
                <Cog6ToothIcon className="h-10 w-10 text-black mb-2" />
                <p className="text-xl font-medium text-gray-800">Voir les services</p>
              </div>
            </Link>

            <Link to="/stats" className="hover:scale-105 transition-transform">
              <div className="bg-blue-200 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full">
                <ChartBarIcon className="h-10 w-10 text-black mb-2" />
                <p className="text-xl font-medium text-gray-800">Statistiques détaillées</p>
              </div>
            </Link>
          </div>

          {/* Compteurs (au centre) */}
          <div className="bg-white rounded-xl shadow-xl p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Aujourd'hui</h2>
            <div className="bg-blue-100 rounded-lg p-4 shadow-md text-center">
              <p className="text-gray-600">Nombre de Visiteurs</p>
              <p className="text-4xl font-bold text-blue-800">34</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 shadow-md text-center">
              <p className="text-gray-600">Services visités</p>
              <p className="text-4xl font-bold text-green-800">9</p>
            </div>
          </div>

          {/* Graphique (à droite) */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Visites sur la semaine</h2>
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
                    className="w-5 rounded-t bg-indigo-300 border-t-4 border-indigo-600 transition-all duration-300"
                    style={{ height }}
                  />
                  <p className="text-xs mt-1 text-gray-600 font-semibold">{day}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
