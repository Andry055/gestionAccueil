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
  const [refresh, setRefresh] = useState(0); // Utilisation d'un compteur plutôt qu'un booléen

  // Définition des classes de style
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
  }, [chargerServices, chargerTopServices, refresh]); // refresh est bien dans les dépendances

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
  const handleRefresh = () => setRefresh(prev => prev + 1); // Incrémente le compteur

  // Configuration du graphique en cercle
  const chartData = {
    labels: topServices.map(service => service.nom_lieu),
    datasets: [
      {
        label: "Nombre de visites",
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
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Répartition des visites par service',
        color: darkMode ? '#fff' : '#333',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalVisits) * 100);
            return `${label}: ${value} visites (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
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
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Services</h1>

      <div className="flex flex-col gap-8 max-w-7xl px-6 mx-auto pb-10">
        {/* Première ligne : Statistiques et Graphique */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Section Statistiques */}
          <section className={`rounded-xl shadow-lg p-6 border-4 ${cardBg} w-full md:w-1/3`}>
            <h2 className="text-2xl font-semibold mb-6">Statistiques</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className={`p-4 rounded-lg ${statCardBg} shadow-md`}>
                <h3 className="text-lg font-medium">Total des services</h3>
                <p className="text-3xl font-bold">{totalServices}</p>
              </div>
              <div className={`p-4 rounded-lg ${statCardBg} shadow-md`}>
                <h3 className="text-lg font-medium">Total des visites</h3>
                <p className="text-3xl font-bold">{totalVisits}</p>
              </div>
              <div className={`p-4 rounded-lg ${statCardBg} shadow-md`}>
                <h3 className="text-lg font-medium">Service le plus visité</h3>
                <p className="text-xl font-semibold">
                  {topServices[0]?.nom_lieu || "N/A"} 
                  <span className="block text-lg">{topServices[0]?.visites || 0} visites</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section Graphique */}
          <section className={`rounded-xl shadow-lg p-6 border-4 ${cardBg} w-full md:w-2/3`}>
            <div className="h-96">
              {topServices.length > 0 ? (
                <Doughnut data={chartData} options={chartOptions} />
              ) : (
                <p className="text-center py-10">Chargement des données...</p>
              )}
            </div>
          </section>
        </div>

        {/* Deuxième ligne : Tableau des services */}
        <section
          className={`rounded-xl shadow-lg p-6 md:p-8 overflow-y-auto max-h-[80vh] border-4 ${cardBg}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Liste des services</h2>

            <div className="flex flex-wrap items-center gap-4">
              {/* Bouton Rafraîchir */}
              <button
                onClick={handleRefresh}
                className={`${buttonBaseClasses} ${buttonVariants.green} shadow-sm`}
                aria-label="Rafraîchir les données"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Rafraîchir
              </button>

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
                  {["ID", "Nom", "Porte", "Étage", "Actions", "Modifier"].map((heading) => (
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
                    key={`service-${service.id_lieu}`}
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
                      <td className="px-6 py-1 border-b whitespace-nowrap">
                      <button
                          onClick={() => setServiceToUpdate(service)}
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full border transition duration-300 ${buttonVariants.blue}`}
                          aria-label={`Modifier ${service.nom_lieu}`}
                        >
                          <Edit2 className="w-5 h-5" />
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
          setRefresh(prev => prev + 1); // Incrémente le compteur après ajout
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
            setRefresh(prev => prev + 1); // Incrémente le compteur après mise à jour
            setServiceToUpdate(null);
          }}
        />
      )}
    </div>
  );
}