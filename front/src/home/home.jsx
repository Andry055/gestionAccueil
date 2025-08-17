import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { 
  UserIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  PencilIcon, 
  XMarkIcon, 
  CheckIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useDarkMode } from '../utils/DarkModeContext';
import AjoutVisiteur from '../visiteur/ajoutvisiteur';

export default function Home() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("visiteurs");
  const [sousMode, setSousMode] = useState("lieu");

  const [nbVisiteur, setNbVisiteur] = useState(0);
  const [nbVisiteEnCours, setNbVisiteEnCours] = useState(0);
  const [nbService, setNbService] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [visitesLieu, setVisitesLieu] = useState([]);
  const [visitesPersonne, setVisitesPersonne] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [servicesWithVisitors, setServicesWithVisitors] = useState([]);

  // État pour la modification
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nom_lieu: '',
    nom_agent: '',
    heure_arrivee: ''
  });
  const [showServiceSearch, setShowServiceSearch] = useState(false);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");

  // Charger les statistiques
  useEffect(() => {
    const chargeStat = async () => {
      try {
        const [resVisiteurs, resVisitesEnCours, resServices] = await Promise.all([
          axios.get('http://localhost:5000/visite/nombreVisiteurs'),
          axios.get('http://localhost:5000/visite/nombreVisiteEncours'),
          axios.get('http://localhost:5000/service/nombreServiceVisite')
        ]);
        
        setNbVisiteEnCours(resVisitesEnCours.data.nbVisite || 0);
        setNbVisiteur(resVisiteurs.data.nbVisite || 0);
        setNbService(resServices.data.nblieu || 0);
      } catch(err) {
        console.error(err);
        setNbVisiteEnCours(0);
        setNbVisiteur(0);
        setNbService(0);
      }
    };

    chargeStat();
    const intervalId = setInterval(chargeStat, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Charger la liste des services
  useEffect(() => {
    const chargerServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/service/listeService');
        setServicesList(response.data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err);
      }
    };
    chargerServices();
  }, []);

  // Charger les visites
  useEffect(() => {
    const chargerVisites = async () => {
      try {
        setLoading(true);
        const [resLieu, resPersonne] = await Promise.all([
          axios.get('http://localhost:5000/visite/listeVisiteNotLieu'),
          axios.get('http://localhost:5000/visite/listeVisiteNotPersonne')
        ]);
        
        if (resLieu.data?.visite) setVisitesLieu(resLieu.data.visite);
        if (resPersonne.data?.visite) setVisitesPersonne(resPersonne.data.visite);
        
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    chargerVisites();
  }, []);

  // Filtrer les visites en cours
  const filtrerVisites = (visites) => {
    return visites.filter(v => 
      !v.heureSor && (
        v.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sousMode === "lieu" 
          ? v.nom_lieu?.toLowerCase().includes(searchTerm.toLowerCase())
          : v.nom_agent?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  };

  const visitesAAfficher = sousMode === "lieu" 
    ? filtrerVisites(visitesLieu) 
    : filtrerVisites(visitesPersonne);

  // Filtrer les services
  const filteredServices = servicesList.filter(service =>
    service.nom_lieu.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Formater l'heure
  const formatHeure = (heure) => {
    if (!heure) return '';
    if (typeof heure === 'string') {
      return heure.split(':').slice(0, 2).join(':');
    }
    const date = new Date(heure);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Terminer une visite
  const terminerVisite = async (id) => {
    try {
      const url = sousMode === "lieu" 
        ? `http://localhost:5000/visite/visiteTerminer/${id}`
        : `http://localhost:5000/visite/visitePersonneTerminer/${id}`;
      
      await axios.put(url);

      await refreshVisites();
      
      if (sousMode === "lieu") {
        setVisitesLieu(visitesLieu.filter(v => v.id_visitelieu !== id));
      } else {
        setVisitesPersonne(visitesPersonne.filter(v => v.id_visitepersonne !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de la terminaison de la visite");
      refreshVisites();
    }
  };

  // Gestion de la modification
  const handleEditClick = (visite) => {
    setEditingId(sousMode === "lieu" ? visite.id_visitelieu : visite.id_visitepersonne);
    setFormData({
      nom: visite.nom || '',
      prenom: visite.prenom || '',
      nom_lieu: visite.nom_lieu || '',
      nom_agent: visite.nom_agent || ''
    });
    setShowServiceSearch(false);
    setServiceSearchTerm("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      nom: '',
      prenom: '',
      nom_lieu: '',
      nom_agent: '',
      heure_arrivee: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({
      ...prev,
      nom_lieu: service.nom_lieu
    }));
    setShowServiceSearch(false);
  };

  const handleSubmitEdit = async () => {
    try {
      setUpdating(true);
      const id = editingId;
      
      let url, requestData;
  
      if (sousMode === "lieu") {
        url = `http://localhost:5000/visite/accueil/updateVisiteLieu/${id}`;
        requestData = {
          nom: formData.nom,
          prenom: formData.prenom,
          nomLieu: formData.nom_lieu
        };
      } else {
        url = `http://localhost:5000/visite/accueil/updateVisitePersonne/${id}`;
        requestData = {
          nom: formData.nom,
          prenom: formData.prenom,
          personneVisite: formData.nom_agent
        };
      }
  
      await axios.put(url, requestData);
      
      // Mettre à jour l'état local en fonction du sous-mode
      if (sousMode === "lieu") {
        setVisitesLieu(visitesLieu.map(v => 
          v.id_visitelieu === editingId ? { 
            ...v, 
            nom: formData.nom,
            prenom: formData.prenom,
            nom_lieu: formData.nom_lieu
          } : v
        ));
      } else {
        setVisitesPersonne(visitesPersonne.map(v => 
          v.id_visitepersonne === editingId ? { 
            ...v, 
            nom: formData.nom,
            prenom: formData.prenom,
            nom_agent: formData.nom_agent
          } : v
        ));
      }
      
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setUpdating(false);
    }
  };

  const fetchServicesWithVisitors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/service/listeServiceVisiteur');
      setServicesWithVisitors(response.data.lieu || []);
    } catch (err) {
      console.error("Erreur lors du chargement des services avec visiteurs:", err);
      setServicesWithVisitors([]);
    }
  };

  useEffect(() => {
    fetchServicesWithVisitors();
  }, []);

  const refreshVisites = async () => {
    try {
      setLoading(true);
      
      // Récupération en parallèle de toutes les données nécessaires
      const [
        resLieu, 
        resPersonne,
        resNbVisiteurs,
        resNbVisitesEnCours,
        resNbServices
      ] = await Promise.all([
        axios.get('http://localhost:5000/visite/listeVisiteNotLieu'),
        axios.get('http://localhost:5000/visite/listeVisiteNotPersonne'),
        axios.get('http://localhost:5000/visite/nombreVisiteurs'),
        axios.get('http://localhost:5000/visite/nombreVisiteEncours'),
        axios.get('http://localhost:5000/service/nombreServiceVisite')
      ]);
  
      // Mise à jour des listes de visites
      setVisitesLieu(resLieu.data?.visite || []);
      setVisitesPersonne(resPersonne.data?.visite || []);
  
      // Mise à jour de toutes les statistiques
      setNbVisiteur(resNbVisiteurs.data.nbVisite || 0);
      setNbVisiteEnCours(resNbVisitesEnCours.data.nbVisite || 0);
      setNbService(resNbServices.data.nblieu || 0);
  
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
      setError("Erreur lors de la mise à jour des données");
    } finally {
      setLoading(false);
    }
    fetchServicesWithVisitors();
  };
  

  // Styles
  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-300";

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-3 py-1 rounded-full border font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-opacity-50
  `;

  const buttonVariants = {
    yellow: darkMode
      ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-gray-900"
      : "border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white",
    green: darkMode
      ? "border-green-400 text-green-300 hover:bg-green-400 hover:text-gray-900"
      : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white",
    blue: darkMode
      ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
      : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white",
    red: darkMode
      ? "border-red-400 text-red-300 hover:bg-red-400 hover:text-gray-900"
      : "border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgMain}`}>
      <main className={`pt-24 px-6 md:px-20 space-y-10 ${textPrimary}`}>
        
        {/* Titre + compteur */}
        <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mr-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-2">Accueil</h1>
            <p className={`text-lg ${textSecondary}`}>
              Bienvenue dans le système de gestion des visiteurs. Suivez les statistiques, ajoutez des visiteurs, et consultez les services disponibles.
            </p>

            {/* Menu de navigation */}
            <div className="flex gap-2 mt-6 border-b-2 border-gray-300">
              <button 
                className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-300 
                  ${mode === "visiteurs" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setMode("visiteurs")}
              >
                Visiteurs en cours
              </button>
              <button 
                className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-300
                  ${mode === "services" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setMode("services")}
              >
                Services (Nb visiteurs)
              </button>
            </div>
          </div>

          {/* Compteurs */}
          <div className={`border-4 rounded-xl shadow-xl px-3 py-4 min-w-[200px]
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            <h2 className="text-lg font-semibold text-center mb-3">Aujourd'hui</h2>
            
            <div className="flex justify-center gap-3">
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className="text-xs">Visiteurs</p>
                <p className="text-2xl font-bold">{nbVisiteur}</p>
              </div>
              
              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <p className="text-xs">Services visité</p>
                <p className="text-2xl font-bold">{nbService}</p>
              </div>

              <div className={`rounded-lg p-2 shadow-md text-center w-24
                ${darkMode ? "bg-gray-700" : "bg-green-100"}`}>
                <p className="text-xs">Visite en cours</p>
                <p className="text-2xl font-bold">{nbVisiteEnCours}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tableau dynamique */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-10">
          <div className={`border-4 rounded-xl shadow-xl p-6 overflow-auto lg:col-span-2
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            
            {/* Mode visiteurs */}
            {mode === "visiteurs" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Visiteurs en cours</h2>
                    {/* Sous-menu pour filtrer par type de visite */}
                    <div className="flex gap-2 mt-2">
                      <button 
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                          ${sousMode === "lieu" 
                            ? darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                            : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => setSousMode("lieu")}
                      >
                        Visite Lieu
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                          ${sousMode === "personne" 
                            ? darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                            : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => setSousMode("personne")}
                      >
                        Visite Personne
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Rechercher ${sousMode === "lieu" ? "service, nom..." : "personne, nom..."}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"
                      }`}
                    />
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`${buttonBaseClasses} ${buttonVariants.blue} px-4 py-2`}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-10">Chargement en cours...</div>
                ) : error ? (
                  <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                  <table className="w-full min-w-[600px] border-collapse table-auto">
                    <thead className={`${tableHead} sticky top-0 z-10`}>
                      <tr>
                        {["ID", "Nom", "Prénom", 
                          sousMode === "lieu" ? "Service" : "Personne visitée", 
                          "Heure Arrivée", "Actions"].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visitesAAfficher.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-gray-500">
                            {searchTerm 
                              ? "Aucun résultat correspondant à votre recherche"
                              : `Aucun visiteur en ${sousMode === "lieu" ? "lieu" : "personne"} actuellement`}
                          </td>
                        </tr>
                      ) : (
                        visitesAAfficher.map((v) => {
                          const isEditing = editingId === (sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne);
                          return (
                            <tr
                              key={sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne}
                              className={`${tableRowHover} transition-colors`}
                            >
                              <td className="px-6 py-4 border-b whitespace-nowrap">
                                {sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne}
                              </td>
                              
                              {/* Nom */}
                              <td className="px-6 py-4 border-b whitespace-nowrap relative">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      name="nom"
                                      value={formData.nom}
                                      onChange={handleInputChange}
                                      className={`w-full p-2 rounded border transition-all duration-300
                                        ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}
                                        focus:w-[180%] focus:z-50 focus:shadow-lg focus:p-3 focus:border-blue-400
                                        focus:absolute focus:left-0 focus:top-1/2 focus:-translate-y-1/2`}
                                    />
                                  ) : (
                                    <span className="block">{v.nom}</span>
                                  )}
                                </td>

                                {/* Prénom */}
                                <td className="px-6 py-4 border-b whitespace-nowrap relative">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      name="prenom"
                                      value={formData.prenom}
                                      onChange={handleInputChange}
                                      className={`w-full p-2 rounded border transition-all duration-300
                                        ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}
                                        focus:w-[180%] focus:z-50 focus:shadow-lg focus:p-3 focus:border-blue-400
                                        focus:absolute focus:left-0 focus:top-1/2 focus:-translate-y-1/2`}
                                    />
                                  ) : (
                                    <span className="block">{v.prenom}</span>
                                  )}
                                </td>
                              
                              {/* Service ou Personne */}
                              <td className="px-6 py-4 border-b whitespace-nowrap relative">
                                {isEditing && sousMode === "lieu" ? (
                                  <div className="relative">
                                    <div 
                                      className={`cursor-pointer p-1 border rounded ${
                                        darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                                      }`}
                                      onClick={() => setShowServiceSearch(!showServiceSearch)}
                                    >
                                      {formData.nom_lieu || "Sélectionner un service"}
                                    </div>
                                    
                                    {showServiceSearch && (
                                      <div className={`absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md shadow-lg ${
                                        darkMode ? "bg-gray-800" : "bg-white"
                                      }`}>
                                        <div className={`p-2 border-b ${
                                          darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
                                        }`}>
                                          <div className="relative">
                                            <input
                                              type="text"
                                              placeholder="Rechercher un service..."
                                              value={serviceSearchTerm}
                                              onChange={(e) => setServiceSearchTerm(e.target.value)}
                                              className={`w-full p-2 pl-8 rounded border ${
                                                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300"
                                              }`}
                                            />
                                            <MagnifyingGlassIcon className={`absolute left-2 top-3 h-4 w-4 ${
                                              darkMode ? "text-gray-400" : "text-gray-500"
                                            }`} />
                                          </div>
                                        </div>
                                        <div className="divide-y">
                                          {filteredServices.length > 0 ? (
                                            filteredServices.map(service => (
                                              <div
                                                key={service.id_lieu}
                                                className={`p-2 cursor-pointer hover:${
                                                  darkMode ? "bg-gray-700" : "bg-blue-50"
                                                }`}
                                                onClick={() => handleServiceSelect(service)}
                                              >
                                                {service.nom_lieu}
                                              </div>
                                            ))
                                          ) : (
                                            <div className="p-2 text-gray-500">
                                              Aucun service trouvé
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : isEditing && sousMode === "personne" ? (
                                  <input
                                    type="text"
                                    name="nom_agent"
                                    value={formData.nom_agent}
                                    onChange={handleInputChange}
                                    className={`w-full p-1 rounded border ${
                                      darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                                    }`}
                                  />
                                ) : sousMode === "lieu" ? v.nom_lieu : v.nom_agent}
                              </td>
                              
                              {/* Heure Arrivée */}
                              <td className="px-6 py-4 border-b whitespace-nowrap">
                                  {formatHeure(v.heure_arrivee)}
                              </td>
                              
                              {/* Actions */}
                              <td className="px-6 py-1 border-b whitespace-nowrap space-x-2">
                                {isEditing ? (
                                  <>
                                   <button
                                      onClick={handleSubmitEdit}
                                      className={`${buttonBaseClasses} ${buttonVariants.green}`}
                                      aria-label="Valider modification"
                                      disabled={updating}
                                    >
                                      {updating ? (
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                      ) : (
                                        <CheckIcon className="w-4 h-4" />
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className={`${buttonBaseClasses} ${buttonVariants.red}`}
                                      aria-label="Annuler modification"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => terminerVisite(sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne)}
                                      className={`${buttonBaseClasses} ${buttonVariants.green}`}
                                      aria-label={`Terminer visite de ${v.prenom} ${v.nom}`}
                                    >
                                      Terminer
                                    </button>
                                    <button
                                      onClick={() => handleEditClick(v) }
                                      className={`${buttonBaseClasses} ${buttonVariants.blue}`}
                                      aria-label={`Modifier ${v.prenom} ${v.nom}`}
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* Mode services */}
            {mode === "services" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Services - Nombre de visiteurs</h2>
                {/* Dans la partie "Mode services" */}
                <table className="w-full min-w-[600px] border-collapse table-auto">
                  <thead className={`${tableHead} sticky top-0 z-10`}>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap">Service</th>
                      <th className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap">Nombre de visiteurs</th>
                      <th className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesWithVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-500">
                          Aucun service visité aujourd'hui.
                        </td>
                      </tr>
                    ) : (
                      servicesWithVisitors.map((service) => (
                        <tr
                          key={service.nom_lieu}
                          className={`${tableRowHover} transition-colors`}
                        >
                          <td className="px-6 py-4 border-b whitespace-nowrap">{service.nom_lieu}</td>
                          <td className="px-6 py-4 border-b whitespace-nowrap text-center">{service.nombre_visiteurs}</td>
                          <td className="px-6 py-1 border-b whitespace-nowrap space-x-2">
                            <Link 
                              to={`/service/${service.nom_lieu}`}
                              className={`${buttonBaseClasses} ${buttonVariants.blue}`}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Boutons latéraux */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 px-2">
              <button 
                onClick={() => setOpenAjout(true)} 
                className="hover:scale-105 transition-transform w-full"
              >
                <div className={`rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full
                  ${darkMode ? "bg-gray-700" : "bg-blue-200"}`}>
                  <UserIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Nouveau visiteur</p>
                </div>
              </button>

              <Link to="/service" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full`}>
                  <Cog6ToothIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Voir les services</p>
                </div>
              </Link>

              <Link to="/visite" className="hover:scale-105 transition-transform">
                <div className={`${darkMode ? "bg-gray-700" : "bg-blue-200"} rounded-xl shadow-xl p-2 flex flex-col items-center justify-center text-center h-full`}>
                  <DocumentTextIcon className={`h-10 w-10 mb-2 ${darkMode ? "text-amber-300" : "text-black"}`} />
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-lg font-medium`}>Historique de visite</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <AjoutVisiteur 
          open={openAjout} 
          onClose={() => {
            setOpenAjout(false);
            refreshVisites(); // Recharge toutes les données
            }} 
        />
      </main>
    </div>
  );
}