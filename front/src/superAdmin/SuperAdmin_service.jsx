import React, { useState, useEffect, useMemo } from "react";
import { 
  Eye, 
  RotateCcw,
  BarChart3,
  Filter,
  Search,
  Plus
} from "lucide-react";
import AjoutService from "../superAdmin/ajoutService";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";
import ListeService from "../service/listeService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Service() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [services, setService] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topServicesLoading, setTopServicesLoading] = useState(true);

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
        setLoading(true);
        const reponse = await axios.get(`http://localhost:5000/service/listeService`);
        if (reponse.data && reponse.data.data && Array.isArray(reponse.data.data)) {
          setService(reponse.data.data);
        } else {
          throw new Error("Format de données inattendu");
        }
      } catch (err) {
        console.error("Erreur chargement services:", err);
        setService([]);
      } finally {
        setLoading(false);
      }
    };

    const chargerTopServices = async () => {
      try {
        setTopServicesLoading(true);
        const reponse = await axios.get(`http://localhost:5000/service/topServices`);
        if (reponse.data && reponse.data.data && Array.isArray(reponse.data.data)) {
          // Formater les données pour l'histogramme
          const chartData = reponse.data.data.map(service => ({
            name: service.nom_lieu,
            shortName: service.nom_lieu.length > 15 
              ? service.nom_lieu.substring(0, 12) + '...' 
              : service.nom_lieu,
            visites: parseInt(service.visites),
            id: service.nom_lieu
          }));
          setChartData(chartData);
        } else {
          throw new Error("Format de données inattendu pour les top services");
        }
      } catch (err) {
        console.error("Erreur chargement top services:", err);
        setChartData([]);
      } finally {
        setTopServicesLoading(false);
      }
    };

    chargerServices();
    chargerTopServices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFilters(searchValues), 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

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

  const handleChange = (e) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setSearchValues({ id: "", nom: "", porte: "", etage: "" });
    setFilters({ id: "", nom: "", porte: "", etage: "" });
  };

  // Styles conditionnels
  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-100";
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const filterCardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300";

  const buttonBaseClasses = `
    inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium
    transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500
  `;

  const buttonVariants = {
    primary: darkMode
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: darkMode
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300",
    outline: darkMode
      ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  // Composant Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {payload[0].payload.name}
          </p>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Visites: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen pt-20 px-4 transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>Gestion des Services</h1>
          <p className={`text-sm ${textSecondary}`}>
            Gérez et consultez tous les services de l'organisation
          </p>
        </div>

        {/* Nouvelle disposition: Filtres en haut, tableau et graphique côte à côte */}
        <div className="flex flex-col gap-6">
          {/* Section Filtres */}
          <div className={`rounded-xl shadow-md border ${filterCardBg} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${textPrimary} flex items-center gap-2`}>
                <Filter className="h-5 w-5 text-indigo-500" />
                Filtres
              </h2>
              <button
                onClick={handleReset}
                className={`text-xs ${buttonVariants.outline} px-3 py-1`}
              >
                Réinitialiser
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["id", "nom", "porte", "etage"].map((field) => (
                <div key={field}>
                  <label className={`text-sm font-medium ${textPrimary} block mb-1`}>
                    {field === "etage" ? "Étage" : field === "porte" ? "Porte" : field === "nom" ? "Nom" : "ID"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={field === "id" || field === "porte" ? "number" : "text"}
                      name={field}
                      value={searchValues[field]}
                      onChange={handleChange}
                      placeholder={`Rechercher...`}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border text-sm ${inputBg}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section principale: Tableau et Graphique côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tableau des services (2/3 de largeur) */}
            <div className="lg:col-span-2">
              <div className={`rounded-xl shadow-md border ${cardBg} p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <h2 className={`text-lg font-semibold ${textPrimary}`}>
                    Liste des Services ({filteredServices.length})
                  </h2>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className={`${buttonBaseClasses} ${buttonVariants.secondary} text-sm`}
                    >
                      Voir tous
                    </button>
                    <button
                      onClick={() => setOpenAjout(true)}
                      className={`${buttonBaseClasses} ${buttonVariants.primary} text-sm flex items-center gap-2`}
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${tableHead}`}>
                      <tr>
                        {["ID", "Nom", "Porte", "Étage", "Actions"].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            Chargement des services...
                          </td>
                        </tr>
                      ) : filteredServices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            Aucun service trouvé.
                          </td>
                        </tr>
                      ) : (
                        filteredServices.map((service) => (
                          <tr
                            key={service.id_lieu}
                            className={`${tableRowHover} transition-colors`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {service.id_lieu}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {service.nom_lieu}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {service.porte}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {service.etage}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setSelectedServiceId(service.id_lieu)}
                                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'} transition-colors`}
                                title="Voir les détails"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Graphique (1/3 de largeur) */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl shadow-md border ${cardBg} p-5 h-full`}>
                <h2 className={`text-lg font-semibold ${textPrimary} flex items-center gap-2 mb-4`}>
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  Top Services Visités
                </h2>
                
                {topServicesLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Aucune donnée de visites disponible
                  </div>
                ) : (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                          <XAxis 
                            dataKey="shortName" 
                            stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                            fontSize={12}
                            tick={{ angle: -45, textAnchor: 'end' }}
                            height={60}
                          />
                          <YAxis 
                            stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                            fontSize={12}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="visites" 
                            fill="#6366F1" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                        <p className={`text-xs ${textSecondary}`}>Services total</p>
                        <p className={`text-xl font-bold mt-1 ${textPrimary}`}>{services.length}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                        <p className={`text-xs ${textSecondary}`}>Services populaires</p>
                        <p className={`text-xl font-bold mt-1 ${textPrimary}`}>{chartData.length}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
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