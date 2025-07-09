import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-300 text-gray-900 shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
        </div>

        {/* Bouton menu hamburger (mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-xl ">
          <li><Link to="/home" className="p-2 hover:text-blue-600">Accueil</Link></li>
          <li><Link to="/visiteur" className="p-2 hover:text-blue-600">Visiteur</Link></li>
          <li><Link to="/service" className="p-2 hover:text-blue-600">Service</Link></li>
          <li><Link to="/ajoutvisiteur" className="p-2 hover:text-blue-600">Ajout</Link></li>
          <li><Link to="/ajoutvisiteur" className="p-2 hover:text-blue-600">Dashboard</Link></li>
          <li><Link to="/about" className="p-2 hover:text-blue-600">À propos</Link></li>
        </ul>
      </div>

      {/* Menu mobile */}
      {open && (
        <ul className="md:hidden flex flex-col px-4 pb-4 space-y-3 text-lg bg-blue-300">
          <li><Link to="/home" onClick={toggleMenu}>Accueil</Link></li>
          <li><Link to="/visiteur" onClick={toggleMenu}>Visiteur</Link></li>
          <li><Link to="/service" onClick={toggleMenu}>Service</Link></li>
          <li><Link to="/ajoutvisiteur" onClick={toggleMenu}>Dashboard</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>À propos</Link></li>
        </ul>
      )}
    </nav>
  );
}
