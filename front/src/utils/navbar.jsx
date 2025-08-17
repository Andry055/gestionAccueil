import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useDarkMode } from "./DarkModeContext";
import { useAuth } from "../AuthContext";// Assurez-vous que le chemin est correct

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Debug: affiche les données utilisateur dans la console
  console.log("Current user:", user);

  const navBg = darkMode ? "bg-gray-900 text-white" : "bg-blue-300 text-gray-900";
  const linkActive = darkMode
    ? "p-2 text-amber-300 border-b-4 border-amber-300"
    : "p-2 text-blue-950 border-b-4 border-blue-950";
  const linkInactive = darkMode
    ? "p-2 hover:text-amber-300 hover:border-b-4 hover:border-amber-300"
    : "p-2 hover:text-blue-950 hover:border-b-4 hover:border-blue-950";

  const links = [
    { path: "/home", label: "Accueil" },
    { path: "/visiteur", label: "Visiteur" },
    { path: "/service", label: "Service" },
    { path: "/about", label: "À propos" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full shadow-md z-50 ${navBg} transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo + titre */}
        <div className="flex items-center">
          <img src="/logo-mtefop.png" alt="logo" className="h-10 w-auto" />
          <p className={`pl-2 italic text-2xl ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
            Gestion des Visiteurs
          </p>
        </div>

        {/* Bouton menu mobile */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-xl items-center">
          {links.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? linkActive : linkInactive)}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {/* Bouton mode sombre/clair */}
          <button
            onClick={toggleDarkMode}
            className={`ml-4 px-3 py-1 rounded-md text-sm transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            {darkMode ? "☀️ Clair" : "🌙 Sombre"}
          </button>

          {/* Profil + déconnexion */}
          {user ? (
            <div
              className={`flex items-center ml-4 rounded-lg p-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              <p className="text-gray-100 px-3">{user.username}</p>
              <button onClick={handleLogout} className="p-1 rounded hover:bg-amber-500 transition-colors">
                <LogOut className="w-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="ml-4 text-gray-100">Non connecté</div>
          )}
        </ul>
      </div>

      {/* Menu mobile déroulant */}
      <div
        className={`md:hidden flex flex-col px-4 pt-2 pb-4 space-y-3 text-lg overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px]" : "max-h-0"
        } ${darkMode ? "bg-gray-900 text-white" : "bg-blue-300 text-gray-900"}`}
      >
        {links.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `font-bold ${darkMode ? "text-amber-300" : "text-blue-950"}`
                : darkMode
                ? "text-white hover:text-amber-300"
                : "text-gray-900 hover:text-blue-950"
            }
          >
            {label}
          </NavLink>
        ))}

        {/* Profil + darkmode + déconnexion en mobile */}
        <div className="pt-4 border-t border-gray-500 flex flex-col space-y-3">
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-2 rounded-md text-sm transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            {darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>

          {user ? (
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              <p className="text-gray-100">{user.username}</p>
              <button onClick={handleLogout} className="p-1 rounded hover:bg-amber-500 transition-colors">
                <LogOut className="w-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-100">Non connecté</div>
          )}
        </div>
      </div>
    </nav>
  );
}