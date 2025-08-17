import React, { useEffect, useState } from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import { useAuth } from "../AuthContext";
import axios from "axios";

export default function AjoutVisiteur({ open, onClose }) {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const [visitType, setVisitType] = useState(null);
  const [searchService, setSearchService] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    nomAgent: user?.username || 'Système',
    nomPersonne: "",
    motif: "",
    nomService: "",
  });

  const [servicesList, setServicesList] = useState([]);


  useEffect(() => {
    const chargerServices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/service/listeService`);
        setServicesList(response.data.data || []);
      } catch (err) {
        console.error("Erreur chargement services:", err);
        setServicesList([]);
      }
    };
    chargerServices();
  }, []);

  const filteredServices = servicesList.filter(service =>
    service?.nom_lieu?.toLowerCase()?.includes(searchService.toLowerCase().trim())
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectService = (serviceName) => {
    setFormData({
      ...formData,
      nomService: serviceName
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = formData.personneVisite 
        ? "http://localhost:5000/visite/visitePersonne" 
        : "http://localhost:5000/visite/ajoutVisite";

      const completeData = {
        ...formData
      };

      console.log("Visite Persone ",completeData);
      const response = await axios.post(endpoint, completeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(true);
      setFormData({
        nom: "",
        prenom: "",
        cin: "",
        nomAgent: user?.username || 'Système',
        personneVisite: "",
        motif: "",
        nomService: "",
      });
      
      setTimeout(() => {
        onClose(response.data); // Ferme le modal après succès
        setSuccess(false); // Réinitialise l'état de succès
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
    
  };

  if (!open) return null;

  const inputClass = `w-full p-2 border rounded-md focus:outline-none focus:ring-2 
    ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400" 
               : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"}`;

  const buttonBaseClass = `px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 flex-1`;

  const tableHeadClass = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHoverClass = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`p-8 rounded-xl shadow-lg w-full max-w-5xl transition-all duration-300
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Ajouter un visiteur</h2>

        {error && (
          <div className={`mb-4 p-3 rounded-md ${
            darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
          }`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`mb-4 p-3 rounded-md ${
            darkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"
          }`}>
            Visite enregistrée avec succès!
          </div>
        )}

        {!visitType ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Type de visite :</h3>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setVisitType('person')}
                className={`${buttonBaseClass} ${
                  darkMode ? "bg-amber-600 hover:bg-amber-700" 
                           : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Visiter une personne
              </button>
              
              <button
                type="button"
                onClick={() => setVisitType('service')}
                className={`${buttonBaseClass} ${
                  darkMode ? "bg-purple-600 hover:bg-purple-700" 
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
                darkMode ? "bg-gray-600 hover:bg-gray-500" 
                         : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
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
                    <input
                      type="text"
                      name="motif"
                      value={formData.motif}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      placeholder="Entrez le motif de la visite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Service visité :</label>
                    <input
                      type="text"
                      name="service"
                      value={formData.nomService}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      placeholder="Sélectionnez un service à droite"
                      readOnly
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setVisitType(null);
                    setSearchService("");
                  }}
                  className={`px-4 py-2 rounded-md ${
                    darkMode ? "bg-gray-600 hover:bg-gray-500" 
                             : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Retour
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md ${
                    darkMode ? "bg-amber-500 hover:bg-amber-600" 
                             : "bg-blue-500 hover:bg-blue-600 text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Enregistrement..." : "Ajouter"}
                </button>
              </div>
            </form>

            {visitType === 'service' && (
              <div className="flex-1">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className={inputClass}
                  />
                </div>
                
                <div className="overflow-y-auto max-h-96 border rounded-lg">
                  <table className="w-full border-collapse">
                    <thead className={tableHeadClass}>
                      <tr>
                        <th className="px-4 py-2 text-left">Service</th>
                        <th className="px-4 py-2 text-left">Étage</th>
                        <th className="px-4 py-2 text-left">Porte</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr 
                          key={`service-${service.id_lieu}`}
                          className={`${tableRowHoverClass} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <td className="px-4 py-2">{service.nom_lieu}</td>
                          <td className="px-4 py-2">{service.etage}</td>
                          <td className="px-4 py-2">{service.porte}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => handleSelectService(service.nom_lieu)}
                              className={`px-3 py-1 rounded text-sm ${
                                darkMode ? "bg-blue-600 hover:bg-blue-700" 
                                         : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                            >
                              Sélectionner
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}