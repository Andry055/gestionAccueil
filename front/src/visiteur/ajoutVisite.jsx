import React, { useState } from "react";
import { X, User, Building } from "lucide-react";
import { useDarkMode } from "../utils/DarkModeContext";

const motifs = ["Réunion", "Entretien", "Dépôt de dossier", "Visite amicale", "Autre"];
const services = ["DRFP", "DAFP", "DTFP", "DCR", "DG", "DAG", "Archive"];

export default function AjoutVisite({ open, onClose, onAdd }) {
  const { darkMode } = useDarkMode();
  const [visitType, setVisitType] = useState(null);
  const [formData, setFormData] = useState({
    service: "",
    motif: "",
    personneVisite: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVisite = {
      ...formData,
      type: visitType,
      id: Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split("T")[0] // Ajout automatique de la date actuelle
    };
    onAdd(newVisite);
    onClose();
  };

  if (!open) return null;

  const inputClass = `w-full p-2 border rounded-md focus:outline-none focus:ring-2 
    ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400" 
               : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"}`;

  const buttonBaseClass = `px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 flex-1`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`p-8 rounded-xl shadow-lg w-96 max-w-full transition-all duration-300
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {!visitType ? "Type de visite" : `Ajouter visite ${visitType === 'person' ? 'personne' : 'service'}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {!visitType ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Type de visite :</h3>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setVisitType('person')}
                className={`${buttonBaseClass} ${
                  darkMode 
                    ? "bg-amber-600 hover:bg-amber-700" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <User className="mr-2 inline" size={18} />
                Personne
              </button>
              
              <button
                type="button"
                onClick={() => setVisitType('service')}
                className={`${buttonBaseClass} ${
                  darkMode 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <Building className="mr-2 inline" size={18} />
                Service
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {visitType === 'service' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Service :</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">-- Choisir un service --</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Motif :</label>
                  <select
                    name="motif"
                    value={formData.motif}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">-- Choisir un motif --</option>
                    {motifs.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Personne visitée :</label>
                <input
                  name="personneVisite"
                  value={formData.personneVisite}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setVisitType(null)}
                className={`px-4 py-2 rounded-md ${
                  darkMode ? "bg-gray-600 hover:bg-gray-500" 
                           : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Retour
              </button>
              
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${
                  darkMode ? "bg-amber-500 hover:bg-amber-600" 
                           : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Ajouter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}