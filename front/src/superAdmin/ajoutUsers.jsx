import React, { useState } from 'react';
import axios from 'axios';
import { useDarkMode } from '../utils/DarkModeContext';

const AddUserModal = ({ isOpen, onClose, onAddUser, newUser, setNewUser }) => {
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-5 py-2 border rounded-full font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-4 focus:ring-indigo-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const buttonVariants = {
    primary: darkMode
      ? "border-indigo-500 text-indigo-400 hover:text-white hover:bg-indigo-600 focus:ring-indigo-500"
      : "border-indigo-600 text-indigo-700 hover:text-white hover:bg-indigo-600 focus:ring-indigo-300",
    neutral: darkMode
      ? "border-gray-500 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-500"
      : "border-gray-400 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-gray-300"
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation des champs
    if (!newUser.nom_accueil || !newUser.prenom_accueil || !newUser.tel || !newUser.password || !newUser.confirmPassword) {
      setErrorMessage('Tous les champs sont obligatoires');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (newUser.password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        nom: newUser.nom_accueil,
        prenom: newUser.prenom_accueil,
        role: newUser.role,
        tel: newUser.tel,
        password: newUser.password
      };

      const response = await axios.post('http://localhost:5000/register/register', userData);
      
      setSuccessMessage('Utilisateur ajouté avec succès !');
      
      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        setNewUser({
          nom_accueil: '',
          prenom_accueil: '',
          role: 'admin',
          tel: '',
          password: '',
          confirmPassword: ''
        });
        setIsLoading(false);
        if (onAddUser) onAddUser(response.data);
        onClose();
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      
      if (error.response) {
        // Erreur retournée par le serveur
        setErrorMessage(error.response.data.message || "Une erreur est survenue lors de l'ajout");
      } else if (error.request) {
        setErrorMessage("Pas de réponse du serveur");
      } else {
        setErrorMessage("Erreur de configuration de la requête");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-2xl p-6 w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold mb-4">Ajouter un utilisateur</h2>
        
        {/* Messages d'état */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne de gauche */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Nom <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newUser.nom_accueil}
                onChange={(e) => setNewUser({...newUser, nom_accueil: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Prénom <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newUser.prenom_accueil}
                onChange={(e) => setNewUser({...newUser, prenom_accueil: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Rôle <span className="text-red-500">*</span></label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                disabled={isLoading}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Téléphone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={newUser.tel}
                onChange={(e) => setNewUser({...newUser, tel: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                placeholder="034 12 345 67"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Mot de passe <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label className="block font-medium mb-1">Confirmer mot de passe <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className={`${buttonBaseClasses} ${buttonVariants.neutral}`}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className={`${buttonBaseClasses} ${buttonVariants.primary}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                En cours...
              </>
            ) : 'Ajouter'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p><span className="text-red-500">*</span> Champs obligatoires</p>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;