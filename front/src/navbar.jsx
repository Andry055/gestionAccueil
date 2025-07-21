import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-300 text-gray-900 shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo-mtefop.png" alt="logo" className="h-15 w-auto" />
          <p className="text-2xl pl-2 text-gray-800" ><i>Gestion des Visiteurs</i></p>
        </div>

        {/* Bouton menu hamburger (mobile) */}
        <div className="pl-40 md:hidden">
          <button onClick={toggleMenu}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-xl">
          <li>
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-blue-950 border-b-4 border-blue-950"
                  : "p-2 hover:text-blue-950 hover:border-b-4"
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/visiteur"
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-blue-950 border-b-4 border-blue-950"
                  : "p-2 hover:text-blue-950 hover:border-b-4"
              }
            >
              Visiteur
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service"
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-blue-950 border-b-4 border-blue-950"
                  : "p-2 hover:text-blue-950 hover:border-b-4"
              }
            >
              Service
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/statistique"
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-blue-950 border-b-4 border-blue-950"
                  : "p-2 hover:text-blue-950 hover:border-b-4"
              }
            >
              Statistiques
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "p-2 text-blue-950 border-b-4 border-blue-950"
                  : "p-2 hover:text-blue-950 hover:border-b-4"
              }
            >
              À propos
            </NavLink>
          </li>
        </ul>

        {/* User info */}
        <div className="flex rounded-lg bg-gray-800 p-5 justify-between">
          <p className="text-gray-100 px-4">Andry</p>
          <div className="px-2 rounded-4xl hover:bg-amber-500 bg-gray-100">
            <LogOut className="w-5 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <ul className="md:hidden flex flex-col px-4 pb-4 space-y-3 text-lg bg-blue-300">
          <li>
            <NavLink
              to="/home"
              end
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "text-blue-950 font-bold" : ""
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/visiteur"
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "text-blue-950 font-bold" : ""
              }
            >
              Visiteur
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service"
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "text-blue-950 font-bold" : ""
              }
            >
              Service
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ajoutvisiteur"
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "text-blue-950 font-bold" : ""
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "text-blue-950 font-bold" : ""
              }
            >
              À propos
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}
