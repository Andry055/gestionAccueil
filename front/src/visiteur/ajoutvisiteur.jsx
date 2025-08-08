import React, { useState } from "react";
import { useDarkMode } from "../utils/DarkModeContext";

export default function AjoutVisiteur({ open, onClose }) {
  const { darkMode } = useDarkMode();
  const [visitType, setVisitType] = useState(null); // 'person' ou 'service'

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    personneVisite: "",
    motif: "",
    service: "",
  });

  const motifs = ["Réunion", "Entretien", "Dépôt de dossier", "Visite amicale", "Autre"];
  const services = ["DRFP", "DAFP", "DTFP", "DCR", "DG", "DAG", "Archive"];
  const personnes = ["Mr. Rakoto", "Mme. Rasoa", "Mr. Randria", "Mme. Nirina", "Mr. Jean"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données envoyées :", { ...formData, visitType });
    // Envoyer vers un backend ou API ici...

    setFormData({ 
      nom: "", 
      prenom: "", 
      cin: "", 
      personneVisite: "", 
      motif: "", 
      service: "" 
    });
    setVisitType(null);
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
        
        <h2 className="text-2xl font-bold mb-6 text-center">Ajouter Visiteur</h2>

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
                Visiter une personne
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
                Visiter un service
              </button>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className={`w-full mt-4 px-4 py-2 rounded-md ${
                darkMode 
                  ? "bg-gray-600 hover:bg-gray-500" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Annuler
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prénom :</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CIN :</label>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {visitType === 'person' ? (
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
            ) : (
              <>
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

                <div>
                  <label className="block text-sm font-medium mb-1">Service visité :</label>
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
              </>
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