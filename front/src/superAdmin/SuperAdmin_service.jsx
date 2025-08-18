import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Eye, Edit2, RotateCcw, UserPlus2 } from "lucide-react";
import AjoutService from "./ajoutService";
import { useDarkMode } from "../utils/DarkModeContext";
import axios from "axios";
import ListeService from "../service/listeService";
import { Doughnut } from "react-chartjs-2";
import UpdateService from "../service/UpdateService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SuperAdminService() {
  const { darkMode } = useDarkMode();
  const [openAjout, setOpenAjout] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [search, setSearch] = useState("");
  const [topServices, setTopServices] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [serviceToUpdate, setServiceToUpdate] = useState(null);
  const [refresh, setRefresh] = useState(0);

  // Définition des classes de style
  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-4 py-1.5 border rounded-full font-medium
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm
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

  const chargerServices = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/service/listeService`);
      if (response.data?.data && Array.isArray(response.data.data)) {
        setServices(response.data.data);
        setTotalServices(response.data.data.length);
      }
    } catch (err) {
      console.error("Erreur chargement services:", err);
    }
  }, []);

  const chargerTopServices = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/service/topServices`);
      const validatedData = response.data.data.map(item => ({
        nom_lieu: item.nom_lieu || "Inconnu",
        visites: Number(item.visites) || 0
      }));
      if (response.data?.data && Array.isArray(response.data.data)) {
        const total = validatedData.reduce(
          (sum, service) => sum + service.visites, 
          0
        );
        setTopServices(validatedData);
        setTotalVisits(total);
      }
    } catch (err) {
      console.error("Erreur chargement top services:", err);
      setTopServices([]);
      setTotalVisits(0);
    }
  }, []);

  useEffect(() => {
    chargerServices();
    chargerTopServices();
  }, [chargerServices, chargerTopServices, refresh]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      return (
        String(service.id_lieu).includes(search) ||
        service.nom_lieu.toLowerCase().includes(search.toLowerCase()) ||
        String(service.porte).includes(search) ||
        String(service.etage).includes(search)
      );
    });
  }, [services, search]);

  const handleReset = () => setSearch("");
  const handleRefresh = () => setRefresh(prev => prev + 1);

  // Configuration du graphique en cercle
  const chartData = {
    labels: topServices.map(service => service.nom_lieu),
    datasets: [
      {
        label: "Visites",
        data: topServices.map(service => service.visites),
        backgroundColor: topServices.map((_, index) => 
          darkMode 
            ? `hsl(${index * 360 / topServices.length}, 70%, 50%)`
            : `hsl(${index * 360 / topServices.length}, 70%, 40%)`
        ),
        borderColor: darkMode ? 'rgba(200, 200, 200, 0.8)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#fff' : '#333',
          font: {
            size: 12
          },
          padding: 10
        }
      },
      title: {
        display: true,
        text: 'Visites par service',
        color: darkMode ? '#fff' : '#333',
        font: { size: 12 },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalVisits) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Styles conditionnels
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-700 border-blue-300";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-500" : "bg-white text-black border-gray-300";
  const statCardBg = darkMode ? "bg-gray-700 text-white" : "bg-indigo-100 text-indigo-800";

  return (
    <div className={`min-h-screen pt-20 px-4 md:px-8 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-bold mb-5 ml-2 md:ml-4">Services</h1>

      <div className="flex flex-col gap-5 max-w-7xl px-4 mx-auto pb-8">
        {/* Première ligne : Statistiques et Graphique */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Section Statistiques */}
          <section className={`rounded-lg shadow-md p-4 border-2 ${cardBg} w-full md:w-1/3`}>
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className={`p-3 rounded-md ${statCardBg} shadow-sm`}>
                <h3 className="text-base font-medium">Services</h3>
                <p className="text-xl font-bold">{totalServices}</p>
              </div>
              <div className={`p-3 rounded-md ${statCardBg} shadow-sm`}>
                <h3 className="text-base font-medium">Visites</h3>
                <p className="text-xl font-bold">{totalVisits}</p>
              </div>
              <div className={`p-3 rounded-md ${statCardBg} shadow-sm`}>
                <h3 className="text-base font-medium">Top service</h3>
                <p className="text-lg font-semibold">
                  {topServices[0]?.nom_lieu || "N/A"} 
                  <span className="block text-sm">{topServices[0]?.visites || 0}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section Graphique */}
          <section className={`rounded-lg shadow-md p-4 border-2 ${cardBg} w-full md:w-2/3`}>
            <div className="h-64">
              {topServices.length > 0 ? (
                <Doughnut data={chartData} options={chartOptions} />
              ) : (
                <p className="text-center py-8 text-sm">Chargement des données...</p>
              )}
            </div>
          </section>
        </div>

        {/* Deuxième ligne : Tableau des services */}
        <section
          className={`rounded-lg shadow-md p-4 md:p-5 overflow-y-auto max-h-[70vh] border-2 ${cardBg}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">Liste des services</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Bouton Rafraîchir */}
              <button
                onClick={handleRefresh}
                className={`${buttonBaseClasses} ${buttonVariants.green}`}
                aria-label="Rafraîchir les données"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Rafraîchir
              </button>

              {/* Bouton Voir tous */}
              <button
                onClick={handleReset}
                className={`${buttonBaseClasses} ${buttonVariants.neutral}`}
                aria-label="Voir tous les services"
              >
                Voir tous
                <span className="ml-1 text-lg font-bold">→</span>
              </button>

              {/* Bouton Ajout */}
              <button
                onClick={() => setOpenAjout(true)}
                className={`${buttonBaseClasses} ${buttonVariants.primary}`}
                aria-label="Ajouter un service"
              >
                <UserPlus2 className="w-4 h-4 mr-1" />
                Ajout
              </button>
            </div>
          </div>

          {/* Recherche */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-1.5 rounded-md border-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm ${inputBg}`}
            />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 150px)" }}>
            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={`${tableHead} sticky top-0 z-10`}>
                <tr>
                  {["ID", "Nom", "Porte", "Étage", "Actions", "Modifier"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-sm text-gray-500">
                      Aucun service trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr
                    key={`service-${service.id_lieu}`}
                    className={`${tableRowHover} transition-colors cursor-pointer`}
                  >
                      <td className="px-4 py-2 border-b text-sm whitespace-nowrap">{service.id_lieu}</td>
                      <td className="px-4 py-2 border-b text-sm whitespace-nowrap">{service.nom_lieu}</td>
                      <td className="px-4 py-2 border-b text-sm whitespace-nowrap">{service.porte}</td>
                      <td className="px-4 py-2 border-b text-sm whitespace-nowrap">{service.etage}</td>
                      <td className="px-4 py-1 border-b whitespace-nowrap">
                        <button
                          onClick={() => setSelectedServiceId(service.id_lieu)}
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full border transition duration-300 text-xs ${buttonVariants.yellow}`}
                          aria-label={`Voir ${service.nom_lieu}`}
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="px-4 py-1 border-b whitespace-nowrap">
                      <button
                          onClick={() => setServiceToUpdate(service)}
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full border transition duration-300 text-xs ${buttonVariants.blue}`}
                          aria-label={`Modifier ${service.nom_lieu}`}
                        >
                          <Edit2 className="w-3 h-3" />
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

      <AjoutService 
        open={openAjout} 
        onClose={() => setOpenAjout(false)} 
        onSuccess={() => {
          setRefresh(prev => prev + 1);
          setOpenAjout(false);
        }}
      />
      
      {selectedServiceId && (
        <ListeService 
          serviceId={selectedServiceId} 
          onClose={() => setSelectedServiceId(null)} 
        />
      )}
      
      {serviceToUpdate && (
        <UpdateService
          service={serviceToUpdate}
          onClose={() => setServiceToUpdate(null)}
          onSuccess={() => {
            setRefresh(prev => prev + 1);
            setServiceToUpdate(null);
          }}
        />
      )}
    </div>
  );
}