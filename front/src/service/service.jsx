import React, { useState, useEffect, useMemo } from "react";
import { Eye, Edit2, RotateCcw, UserPlus2, ChevronUp, ChevronDown } from "lucide-react";
import AjoutService from "../superAdmin/ajoutService";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";
import ListeService from "./listeService";

export default function Service() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [services, setService] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [tri, setTri] = useState({ colonne: null, ordre: 'asc' });
  const [pageCourante, setPageCourante] = useState(1);
  const [servicesParPage] = useState(20);

  const [filters, setFilters] = useState({ 
    id: "", 
    nom: "", 
    porte: "", 
    etage: "" 
  });
  const [searchValues, setSearchValues] = useState({ 
    id: "", 
    nom: "", 
    porte: "", 
    etage: "" 
  });

  useEffect(() => {
    const chargerServices = async () => {
      try {
        const reponse = await axios.get(`http://localhost:5000/service/listeService`);
        if (reponse.data && reponse.data.data && Array.isArray(reponse.data.data)) {
          setService(reponse.data.data);
        } else {
          throw new Error("Format de données inattendu");
        }
      } catch (err) {
        console.error("Erreur chargement services:", err);
        setService([]);
      }
    };
    chargerServices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFilters(searchValues), 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

  // Fonction de tri
  const trierServices = (colonne) => {
    let nouvelOrdre = 'asc';
    
    if (tri.colonne === colonne && tri.ordre === 'asc') {
      nouvelOrdre = 'desc';
    }
    
    setTri({ colonne, ordre: nouvelOrdre });
    
    const servicesTries = [...services].sort((a, b) => {
      if (colonne === 'id') {
        return nouvelOrdre === 'asc' ? a.id_lieu - b.id_lieu : b.id_lieu - a.id_lieu;
      } else if (colonne === 'nom') {
        return nouvelOrdre === 'asc' 
          ? (a.nom_lieu || '').localeCompare(b.nom_lieu || '') 
          : (b.nom_lieu || '').localeCompare(a.nom_lieu || '');
      } else if (colonne === 'porte') {
        return nouvelOrdre === 'asc' 
          ? (a.porte || 0) - (b.porte || 0)
          : (b.porte || 0) - (a.porte || 0);
      } else if (colonne === 'etage') {
        return nouvelOrdre === 'asc' 
          ? (a.etage || 0) - (b.etage || 0)
          : (b.etage || 0) - (a.etage || 0);
      }
      return 0;
    });
    
    setService(servicesTries);
  };

  // Fonction pour obtenir l'indicateur de tri
  const getIndicateurTri = (colonne) => {
    if (tri.colonne !== colonne) return null;
    return tri.ordre === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      return (
        (filters.id === "" || String(service.id_lieu).includes(filters.id)) &&
        (filters.nom === "" || service.nom_lieu.toLowerCase().includes(filters.nom.toLowerCase())) &&
        (filters.porte === "" || String(service.porte).includes(filters.porte)) &&
        (filters.etage === "" || String(service.etage).includes(filters.etage))
      );
    });
  }, [services, filters]);

  // Pagination
  const indexDernierService = pageCourante * servicesParPage;
  const indexPremierService = indexDernierService - servicesParPage;
  const servicesCourants = filteredServices.slice(indexPremierService, indexDernierService);
  const totalPages = Math.ceil(filteredServices.length / servicesParPage);

  const paginer = (pageNumber) => setPageCourante(pageNumber);

  const handleChange = (e) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
    setPageCourante(1); // Réinitialiser à la première page lors du filtrage
  };

  const handleReset = () => {
    setSearchValues({ id: "", nom: "", porte: "", etage: "" });
    setFilters({ id: "", nom: "", porte: "", etage: "" });
    setPageCourante(1);
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Toujours afficher la première page
      pageNumbers.push(1);
      
      // Calculer le début et la fin de la plage de pages à afficher
      let startPage = Math.max(2, pageCourante - 1);
      let endPage = Math.min(totalPages - 1, pageCourante + 1);
      
      // Ajuster si on est près du début
      if (pageCourante <= 3) {
        endPage = 4;
      }
      
      // Ajuster si on est près de la fin
      if (pageCourante >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Ajouter les points de suspension si nécessaire
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Ajouter les pages intermédiaires
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Ajouter les points de suspension si nécessaire
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Toujours afficher la dernière page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Styles conditionnels
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-700 border-blue-300";
  const filterCardBg = darkMode ? "bg-gray-800 text-gray-100 border-blue-200" : "bg-blue-200 text-gray-700 border-blue-200";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-500" : "bg-white text-black border-gray-300";
  const pageButtonStyle = darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100";
  const activePageButtonStyle = darkMode ? "bg-indigo-600 text-white" : "bg-indigo-600 text-white";

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-5 py-2 border rounded-full font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-4 focus:ring-indigo-300
  `;

  const buttonVariants = {
    primary: darkMode
      ? "border-indigo-500 text-indigo-400 hover:text-white hover:bg-indigo-600 focus:ring-indigo-500"
      : "border-indigo-600 text-indigo-700 hover:text-white hover:bg-indigo-600 focus:ring-indigo-300",
    neutral: darkMode
      ? "border-gray-500 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-500"
      : "border-gray-400 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-gray-300",
    yellow: darkMode
      ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-gray-900"
      : "border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white",
    green: darkMode
      ? "border-green-400 text-green-300 hover:bg-green-400 hover:text-gray-900"
      : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white",
    blue: darkMode
      ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
      : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
  };

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-3xl font-extrabold mb-2 ml-2 md:ml-6">Services</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">

        {/* Filtres */}
        <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 ${filterCardBg}`}>
          <h2 className="text-2xl font-semibold text-center mb-2">Filtres</h2>

          <div className="flex flex-col space-y-4">
            {["id", "nom", "porte", "etage"].map((field) => (
              <label key={field} className="flex flex-col font-medium capitalize">
                <input
                  type={field === "id" || field === "porte" ? "number" : "text"}
                  name={field}
                  value={searchValues[field]}
                  onChange={handleChange}
                  placeholder={`Filtrer par ${field === "etage" ? "étage" : field === "porte" ? "porte" : field}`}
                  className={`mt-2 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </label>
            ))}
            <button
              onClick={handleReset}
              className={`${buttonBaseClasses} ${buttonVariants.neutral} mt-4 w-full text-center`}
              aria-label="Réinitialiser les filtres"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau des services */}
        <section
          className={`rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh] border-4 ${cardBg}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Liste des services</h2>

            <div className="flex flex-wrap items-center gap-4">
              {/* Bouton Voir tous */}
              <button
                onClick={handleReset}
                className={`${buttonBaseClasses} ${buttonVariants.neutral} shadow-sm`}
                aria-label="Voir tous les services"
              >
                Voir tous
                <span className="ml-2 text-xl font-bold">→</span>
              </button>

              {/* Bouton Ajout */}
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 180px)" }}>
            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={`${tableHead} sticky top-0 z-10`}>
                <tr>
                  {[
                    { label: "ID", key: "id" },
                    { label: "Nom", key: "nom" },
                    { label: "Porte", key: "porte" },
                    { label: "Étage", key: "etage" },
                    { label: "Actions", key: "actions" }
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      className={`px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap ${
                        key !== 'actions' ? 'cursor-pointer hover:bg-indigo-200 dark:hover:bg-gray-600' : ''
                      }`}
                      onClick={() => key !== 'actions' && trierServices(key)}
                    >
                      <div className="flex items-center">
                        {label}
                        {key !== 'actions' && (
                          <span className="ml-1">{getIndicateurTri(key)}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {servicesCourants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Aucun service trouvé.
                    </td>
                  </tr>
                ) : (
                  servicesCourants.map((service) => (
                    <tr
                      key={service.id_lieu}
                      className={`${tableRowHover} transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.id_lieu}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.nom_lieu}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.porte}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.etage}</td>
                      <td className="px-6 py-1 border-b whitespace-nowrap">
                        <button
                          onClick={() => setSelectedServiceId(service.id_lieu)}
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full border transition duration-300 ${buttonVariants.yellow}`}
                          aria-label={`Voir ${service.nom_lieu}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredServices.length > servicesParPage && (
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className={`text-sm mb-4 md:mb-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Affichage des services {indexPremierService + 1} à {Math.min(indexDernierService, filteredServices.length)} sur {filteredServices.length}
              </div>
              
              <nav className="flex items-center space-x-2">
                {/* Bouton Précédent */}
                <button
                  onClick={() => paginer(pageCourante - 1)}
                  disabled={pageCourante === 1}
                  className={`px-3 py-1 rounded-md border ${pageButtonStyle} ${
                    pageCourante === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Précédent
                </button>

                {/* Numéros de page */}
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' && paginer(pageNumber)}
                    className={`px-3 py-1 rounded-md border ${
                      pageNumber === pageCourante 
                        ? activePageButtonStyle 
                        : pageButtonStyle
                    } ${
                      pageNumber === '...' ? 'cursor-default' : ''
                    }`}
                    disabled={pageNumber === '...'}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Bouton Suivant */}
                <button
                  onClick={() => paginer(pageCourante + 1)}
                  disabled={pageCourante === totalPages}
                  className={`px-3 py-1 rounded-md border ${pageButtonStyle} ${
                    pageCourante === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </section>
      </div>

      <AjoutService open={openAjout} onClose={() => setOpenAjout(false)} />
      {selectedServiceId && (
        <ListeService 
          serviceId={selectedServiceId} 
          onClose={() => setSelectedServiceId(null)} 
        />
      )}
    </div>
  );
}