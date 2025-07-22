import React from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Bienvenue Super Admin, {user.username}</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Link
          to="/gestion-comptes"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded shadow text-center"
        >
          Gestion des comptes Admin
        </Link>

        <Link
          to="/visiteur"
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded shadow text-center"
        >
          Gérer les visiteurs
        </Link>

        <Link
          to="/service"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded shadow text-center"
        >
          Gérer les services
        </Link>

        <Link
          to="/statistiques-globale"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded shadow text-center"
        >
          Statistiques globales
        </Link>
      </section>
    </div>
  );
}
