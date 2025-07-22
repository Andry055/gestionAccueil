import React, { useState } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function AjoutService({ open, onClose }) {
  const [formData, setFormData] = useState({
    nom: "",
    porte: "",
    etage: "",
  });

  const { darkMode } = useDarkMode();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Service ajouté :", formData);
    // Ici tu peux envoyer les données vers une API ou les stocker dans un state global

    setFormData({ nom: "", porte: "", etage: "" });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`p-8 rounded-xl shadow-lg w-96 transition-all duration-300
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>

        <h2 className={`text-xl font-bold mb-6 text-center 
          ${darkMode ? "text-amber-400" : "text-indigo-700"}`}>
          Ajouter un Service
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du Service :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 
                ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400" 
                           : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Porte :</label>
            <input
              type="number"
              name="porte"
              value={formData.porte}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 
                ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400" 
                           : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Étage :</label>
            <input
              type="text"
              name="etage"
              value={formData.etage}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 
                ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400" 
                           : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md transition-all 
                ${darkMode ? "bg-gray-600 hover:bg-gray-500 text-white" 
                           : "bg-gray-300 hover:bg-gray-400 text-gray-800"}`}
            >
              Annuler
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded-md transition-all 
                ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-white" 
                           : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
