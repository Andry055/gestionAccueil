import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { 
  UserIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  PencilIcon, 
  XMarkIcon, 
  CheckIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDarkMode } from '../utils/DarkModeContext';
import AjoutVisiteur from '../visiteur/ajoutvisiteur';

// Composant Popup pour la sélection de service
const ServiceSelectionPopup = ({ 
  services, 
  searchTerm, 
  onSearchChange, 
  onSelect, 
  onClose, 
  darkMode 
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const filteredServices = services.filter(service =>
    service.nom_lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div 
        ref={popupRef}
        className={`relative w-full max-w-md max-h-96 overflow-hidden rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className={`p-4 border-b ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Sélectionner un service</h3>
            <button 
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                darkMode ? 'hover:bg-white' : 'hover:bg-gray-300'
              }`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full p-2 pl-9 rounded border text-sm ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            <MagnifyingGlassIcon className={`absolute left-2.5 top-2.5 h-4 w-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>
        <div className="overflow-y-auto max-h-64">
          {filteredServices.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.map(service => (
                <li
                  key={service.id_lieu}
                  className={`p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors`}
                  onClick={() => onSelect(service)}
                >
                  <span className="block truncate">{service.nom_lieu}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Aucun service trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [showServicePopup, setShowServicePopup] = useState(false);
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
      nom_agent: visite.nom_agent || '',
      heure_arrivee: visite.heure_arrivee || ''
    });
    setShowServicePopup(false);
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
    setShowServicePopup(false);
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
    setShowServicePopup(false);
    setServiceSearchTerm("");
  };

  const handleServiceFieldClick = () => {
    setShowServicePopup(true);
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
      setShowServicePopup(false);
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
  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-blue-200 text-blue-800";
  const tableRowHover = darkMode ? "hover:bg-gray-800" : "hover:bg-indigo-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900";

  const buttonBaseClasses = `
    inline-flex items-center justify-center px-3 py-1.5 rounded-md border font-medium
    transition duration-200 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
    text-sm
  `;

  const buttonVariants = {
    yellow: darkMode
      ? "border-yellow-500 bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500"
      : "border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
    green: darkMode
      ? "border-green-500 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
      : "border-green-500 bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    blue: darkMode
      ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
      : "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    red: darkMode
      ? "border-red-500 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      : "border-red-500 bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    gray: darkMode
      ? "border-gray-500 bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
      : "border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgMain}`}>
      <main className={`pt-20 px-4 sm:px-6 lg:px-8 space-y-8 ${textPrimary}`}>
        
        {/* Titre + compteur */}
        <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Accueil</h1>
            <p className={`text-base ${textSecondary}`}>
              Bienvenue dans le système de gestion des visiteurs. Suivez les statistiques, ajoutez des visiteurs, et consultez les services disponibles.
            </p>

            {/* Menu de navigation */}
            <div className="flex gap-2 mt-6 border-b-1 border-gray-500">
              <button 
                className={`px-4 py-2 rounded-t-md font-medium transition-all duration-200 
                  ${mode === "visiteurs" 
                    ? darkMode 
                      ? "bg-blue-700 text-white border-b-2 border-blue-400" 
                      : "bg-blue-500 text-white border-b-2 border-blue-400" 
                    : darkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setMode("visiteurs")}
              >
                Visiteurs en cours
              </button>
              <button 
                className={`px-4 py-2 rounded-t-md font-medium transition-all duration-200
                  ${mode === "services" 
                    ? darkMode 
                      ? "bg-blue-700 text-white border-b-2 border-blue-400" 
                      : "bg-blue-600 text-white border-b-2 border-blue-400" 
                    : darkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setMode("services")}
              >
                Services (Nb visiteurs)
              </button>
            </div>
          </div>

          {/* Compteurs */}
          <div className={`border-2 border-gray-400 rounded-lg shadow-sm p-4 min-w-[240px]
            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Aujourd'hui</h2>
              <button 
                onClick={refreshVisites}
                className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                title="Rafraîchir"
              >
                <ArrowPathIcon className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-md p-2 text-center  ${darkMode ? "bg-gray-700" : "bg-blue-50 border-y-2 border-gray-500"}`}>
                <p className="text-xs font-medium">Visiteurs</p>
                <p className="text-xl font-bold">{nbVisiteur}</p>
              </div>
              
              <div className={`rounded-md p-2 text-center ${darkMode ? "bg-gray-700" : "bg-blue-50 border-y-2 border-gray-500"}`}>
                <p className="text-xs font-medium">Services</p>
                <p className="text-xl font-bold">{nbService}</p>
              </div>

              <div className={`rounded-md p-2 text-center ${darkMode ? "bg-gray-700" : "bg-green-50  border-y-2 border-gray-500"}`}>
                <p className="text-xs font-medium">En cours</p>
                <p className="text-xl font-bold">{nbVisiteEnCours}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tableau dynamique */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start pb-10">
          <div className={`border rounded-lg shadow-sm p-4 overflow-auto
            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-400 border-2 "}`}>
            
            {/* Mode visiteurs */}
            {mode === "visiteurs" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Visiteurs en cours</h2>
                    {/* Sous-menu pour filtrer par type de visite */}
                    <div className="flex gap-2">
                      <button 
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                          ${sousMode === "lieu" 
                            ? darkMode 
                              ? "bg-blue-600 text-white" 
                              : "bg-blue-500 text-white"
                            : darkMode 
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setSousMode("lieu")}
                      >
                        Visite Lieu
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                          ${sousMode === "personne" 
                            ? darkMode 
                              ? "bg-blue-700 text-white" 
                              : "bg-blue-600 text-white"
                            : darkMode 
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setSousMode("personne")}
                      >
                        Visite Personne
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder={`Rechercher ${sousMode === "lieu" ? "service, nom..." : "personne, nom..."}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-8 pr-3 py-2 rounded-md border-1 border-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${borderColor}`}
                      />
                      <MagnifyingGlassIcon className={`absolute left-2 top-2.5 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    </div>
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`${buttonBaseClasses} ${buttonVariants.gray}`}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className={`${tableHead}`}>
                        <tr>
                          {["ID", "Nom", "Prénom", 
                            sousMode === "lieu" ? "Service" : "Personne visitée", 
                            "Heure Arrivée", "Actions"].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {visitesAAfficher.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-sm text-gray-500">
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
                                <td className="px-4 py-3 text-sm">
                                  {sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne}
                                </td>
                                
                                {/* Nom */}
                                <td className="px-4 py-3 text-sm">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        className={`w-full p-1.5 rounded border text-sm ${inputBg} ${borderColor} focus:ring-2 focus:ring-blue-500`}
                                      />
                                    ) : (
                                      <span className="block truncate max-w-[120px]">{v.nom}</span>
                                    )}
                                  </td>

                                  {/* Prénom */}
                                  <td className="px-4 py-3 text-sm">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        className={`w-full p-1.5 rounded border text-sm ${inputBg} ${borderColor} focus:ring-2 focus:ring-blue-500`}
                                      />
                                    ) : (
                                      <span className="block truncate max-w-[120px]">{v.prenom}</span>
                                    )}
                                  </td>
                                
                                {/* Service ou Personne */}
                                  <td className="px-4 py-3 text-sm">
                                    {isEditing && sousMode === "lieu" ? (
                                      <div className="relative">
                                        <div 
                                          className={`cursor-pointer p-1.5 rounded border text-sm ${inputBg} ${borderColor} flex items-center justify-between`}
                                          onClick={handleServiceFieldClick}
                                        >
                                          <span className="truncate max-w-[180px]">{formData.nom_lieu || "Sélectionner un service"}</span>
                                          <svg className={`h-4 w-4 ml-1 transition-transform ${showServicePopup ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    ) : isEditing && sousMode === "personne" ? (
                                      <input
                                        type="text"
                                        name="nom_agent"
                                        value={formData.nom_agent}
                                        onChange={handleInputChange}
                                        className={`w-full p-1.5 rounded border text-sm ${inputBg} ${borderColor} focus:ring-2 focus:ring-blue-500`}
                                      />
                                    ) : (
                                      <span className="block truncate max-w-[180px]">
                                        {sousMode === "lieu" ? v.nom_lieu : v.nom_agent}
                                      </span>
                                    )}
                                  </td>
                                
                                {/* Heure Arrivée */}
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                    {formatHeure(v.heure_arrivee)}
                                </td>
                                
                                {/* Actions */}
                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                  <div className="flex gap-1">
                                    {isEditing ? (
                                      <>
                                       <button
                                          onClick={handleSubmitEdit}
                                          className={`${buttonBaseClasses} ${buttonVariants.green} px-2 py-1`}
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
                                          className={`${buttonBaseClasses} ${buttonVariants.red} px-2 py-1`}
                                          aria-label="Annuler modification"
                                        >
                                          <XMarkIcon className="w-4 h-4" />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => terminerVisite(sousMode === "lieu" ? v.id_visitelieu : v.id_visitepersonne)}
                                          className={`${buttonBaseClasses} ${buttonVariants.green} px-3 py-1`}
                                          aria-label={`Terminer visite de ${v.prenom} ${v.nom}`}
                                        >
                                          Terminer
                                        </button>
                                        <button
                                          onClick={() => handleEditClick(v) }
                                          className={`${buttonBaseClasses} ${buttonVariants.blue} px-2 py-1`}
                                          aria-label={`Modifier ${v.prenom} ${v.nom}`}
                                        >
                                          <PencilIcon className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Mode services */}
            {mode === "services" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Services - Nombre de visiteurs</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={refreshVisites}
                      className={`${buttonBaseClasses} ${buttonVariants.gray}`}
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      Rafraîchir
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className={`${tableHead}`}>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Service</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre de visiteurs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {servicesWithVisitors.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-sm text-gray-500">
                            Aucun service visité aujourd'hui.
                          </td>
                        </tr>
                      ) : (
                        servicesWithVisitors.map((service) => (
                          <tr
                            key={service.nom_lieu}
                            className={`${tableRowHover} transition-colors`}
                          >
                            <td className="px-4 py-3 text-sm">
                              <span className="truncate block max-w-[200px]">{service.nom_lieu}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {service.nombre_visiteurs}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                </div>
              </>
            )}
          </div>

          {/* Boutons latéraux - Version compacte */}
          <div className="space-y-4 w-[250px]">
            <button 
              onClick={() => setOpenAjout(true)} 
              className={`w-full rounded-lg shadow-sm p-3 flex items-center gap-3 border text-sm font-medium
                ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200" : "bg-white border-gray-200 hover:bg-blue-50 text-gray-800"}`}
            >
              <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <UserIcon className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-blue-600"}`} />
              </div>
              <span>Nouveau visiteur</span>
            </button>

            <Link 
              to="/service" 
              className={`w-full rounded-lg shadow-sm p-3 flex items-center gap-3 border text-sm font-medium
                ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200" : "bg-white border-gray-200 hover:bg-blue-50 text-gray-800"}`}
            >
              <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <Cog6ToothIcon className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-blue-600"}`} />
              </div>
              <span>Voir services</span>
            </Link>

            <Link 
              to="/visite" 
              className={`w-full rounded-lg shadow-sm p-3 flex items-center gap-3 border text-sm font-medium
                ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200" : "bg-white border-gray-200 hover:bg-blue-50 text-gray-800"}`}
            >
              <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                <DocumentTextIcon className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-blue-600"}`} />
              </div>
              <span>Historique</span>
            </Link>
          </div>
        </section>

        {/* Popup de sélection de service */}
        {showServicePopup && (
          <ServiceSelectionPopup
            services={servicesList}
            searchTerm={serviceSearchTerm}
            onSearchChange={setServiceSearchTerm}
            onSelect={handleServiceSelect}
            onClose={() => setShowServicePopup(false)}
            darkMode={darkMode}
          />
        )}

        <AjoutVisiteur 
          open={openAjout} 
          onClose={() => {
            setOpenAjout(false);
            refreshVisites();
            }} 
        />
      </main>
    </div>
  );
}