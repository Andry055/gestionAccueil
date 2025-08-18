import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, AlertCircle } from 'lucide-react'; // Ajout de AlertCircle ici
import axios from 'axios';
import { useDarkMode } from "../utils/DarkModeContext";

export default function UpdateService({ service, onClose, onUpdate }) {
  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    nom_lieu: '',
    porte: '',
    etage: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  // Styles conditionnels
  const modalBg = darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300";
  const successBg = darkMode ? "bg-green-800/30 border-green-600" : "bg-green-100 border-green-500";
  const errorBg = darkMode ? "bg-red-800/30 border-red-600" : "bg-red-100 border-red-500";
  
  const buttonBase = `
    px-4 py-2 rounded-md font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${darkMode ? "focus:ring-gray-500" : "focus:ring-indigo-500"}
  `;
  const buttonCancel = darkMode 
    ? "bg-gray-600 hover:bg-gray-700 text-gray-100"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const buttonSubmit = darkMode
    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
    : "bg-indigo-600 hover:bg-indigo-700 text-white";

  useEffect(() => {
    if (service) {
      setFormData({
        nom_lieu: service.nom_lieu || '',
        porte: service.porte || '',
        etage: service.etage || ''
      });
    }
    setStatus({ loading: false, error: null, success: false });
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    
    try {
      const { id_lieu } = service;
      await axios.put(`http://localhost:5000/service/updateService/${id_lieu}`, formData);
      
      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setStatus({
        loading: false,
        error: err.response?.data?.message || "Erreur lors de la mise à jour du service",
        success: false
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBg} ${textColor} rounded-xl shadow-xl p-6 w-full max-w-md border-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modifier le service</h2>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode ? "hover:bg-gray-200 text-gray-200" : "hover:bg-gray-800 text-gray-800"}`}
            aria-label="Fermer"
            disabled={status.loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages d'état */}
        {status.error && (
          <div className={`mb-4 p-3 rounded-md border ${errorBg} flex items-center gap-2`}>
            <AlertCircle className="flex-shrink-0" size={18} />
            <span>{status.error}</span>
          </div>
        )}

        {status.success && (
          <div className={`mb-4 p-3 rounded-md border ${successBg} flex items-center gap-2`}>
            <Check className="flex-shrink-0" size={18} />
            <span>Service modifié avec succès!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${textColor}`}>Nom du service</label>
            <input
              type="text"
              name="nom_lieu"
              value={formData.nom_lieu}
              onChange={handleChange}
              className={`w-full p-2 border-2 rounded-md ${inputBg} focus:ring-2 ${darkMode ? "focus:ring-indigo-500" : "focus:ring-indigo-400"}`}
              required
              disabled={status.loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block mb-2 font-medium ${textColor}`}>Porte</label>
              <input
                type="text"
                name="porte"
                value={formData.porte}
                onChange={handleChange}
                className={`w-full p-2 border-2 rounded-md ${inputBg}`}
                disabled={status.loading}
              />
            </div>
            <div>
              <label className={`block mb-2 font-medium ${textColor}`}>Étage</label>
              <input
                type="text"
                name="etage"
                value={formData.etage}
                onChange={handleChange}
                className={`w-full p-2 border-2 rounded-md ${inputBg}`}
                disabled={status.loading}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`${buttonBase} ${buttonCancel}`}
              disabled={status.loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`${buttonBase} ${buttonSubmit} flex items-center gap-2`}
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  En cours...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}