import React, { useState, useEffect,useMemo } from "react";
import { Eye, Edit2, RotateCcw, UserPlus2 } from "lucide-react";
import AjoutService from "../superAdmin/ajoutService";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";
import ListeService from "./listeService";

export default function Service() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  
  const [services,  setService]=useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);



  const [search, setSearch] = useState("");
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

const filteredServices = useMemo(() => {
    console.log("Liste :", services);
    return services.filter(service => {
      return (
        (filters.id === "" || String(service.id_lieu).includes(filters.id)) &&
        (filters.nom === "" || service.nom_lieu.toLowerCase().includes(filters.nom.toLowerCase())) &&
        (filters.porte === "" || String(service.porte).includes(filters.porte)) &&
        (filters.etage === "" || String(service.etage).includes(filters.etage))
      );
    });
  }, [services, filters]);

  const handleChange = (e) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setSearch("");
    setSearchValues({ id: "", nom: "", porte: "", etage: "" });
    setFilters({ id: "", nom: "", porte: "", etage: "" });
  };

  // Styles conditionnels
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-700 border-blue-300";
  const filterCardBg = darkMode ? "bg-gray-800 text-gray-100 border-blue-200" : "bg-blue-200 text-gray-700 border-blue-200";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-500" : "bg-white text-black border-gray-300";

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
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Services</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">

        {/* Filtres */}
        <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 ${filterCardBg}`}>
          <h2 className="text-2xl font-semibold text-center mb-6">Filtres</h2>

          <div className="flex flex-col space-y-4">
            {["id", "nom", "porte", "etage"].map((field) => (
              <label key={field} className="flex flex-col font-medium capitalize">
                {field === "etage" ? "Étage" : field === "porte" ? "Porte" : field}
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
              <button
                onClick={() => setOpenAjout(true)}
                className={`${buttonBaseClasses} ${buttonVariants.primary} shadow-lg`}
                aria-label="Ajouter un service"
              >
                <UserPlus2 className="w-5 h-5 mr-2" />
                Ajout
              </button>
            </div>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-2 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${inputBg}`}
            />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 180px)" }}>
            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={`${tableHead} sticky top-0 z-10`}>
                <tr>
                  {["ID", "Nom", "Porte", "Étage", "Actions"].map((heading) => (
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
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Aucun service trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr
                      key={service.id}
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