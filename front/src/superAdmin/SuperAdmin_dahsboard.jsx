import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ChartPieIcon,
  ClockIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useDarkMode } from "../utils/DarkModeContext";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip
} from 'recharts';
import axios from 'axios';

export default function SuperAdminDashboard() {
  const { darkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calcul des totaux
  const totalVisites = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalServices = chartData.length;

  // Couleurs pour le graphique
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  // Récupère les données
  const fetchChartData = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      
      switch(timeRange) {
        case 'today': endpoint = 'superChartJour'; break;
        case 'week': endpoint = 'superChartSemaine'; break;
        case 'month': endpoint = 'superChartMois'; break;
        default: endpoint = 'superChartJour';
      }

      const response = await axios.get(`http://localhost:5000/visite/${endpoint}`);
      
      if (response.data.message.includes("reussi")) {
        const formattedData = response.data.data.map(item => ({
          name: item.nom,
          value: parseInt(item.nombre_visites)
        }));
        setChartData(formattedData);
      }

      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de chargement des données");
      setChartData([
        { name: "Ressources Humaines", value: 15 },
        { name: "Comptabilité", value: 8 },
        { name: "Informatique", value: 5 },
        { name: "Marketing", value: 12 },
        { name: "Direction", value: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtre les données
  const filteredData = searchTerm 
    ? chartData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : chartData;

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  // Styles dynamiques
  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const highlightColor = darkMode ? "text-indigo-400" : "text-indigo-600";
  const counterBg = darkMode ? "bg-gray-700" : "bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300";
  const dropdownBg = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200";

  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'today': return "Aujourd'hui";
      case 'week': return "Cette semaine";
      case 'month': return "Ce mois";
      default: return "";
    }
  };

  const TimeRangeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const options = [
      { value: 'today', label: 'Aujourd\'hui', icon: <ClockIcon className="h-4 w-4" /> },
      { value: 'week', label: 'Cette semaine', icon: <CalendarDaysIcon className="h-4 w-4" /> },
      { value: 'month', label: 'Ce mois', icon: <ChartPieIcon className="h-4 w-4" /> }
    ];

    const selectedOption = options.find(opt => opt.value === timeRange);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border ${borderColor} ${dropdownBg} ${textPrimary}`}
        >
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${dropdownBg} border ${borderColor}`}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTimeRange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-500 hover:text-white ${
                  timeRange === option.value 
                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                    : textPrimary
                }`}
              >
                {option.icon}
                {option.label}
                {timeRange === option.value && <CheckIcon className="h-4 w-4 ml-auto" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      <main className="pt-16 px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête compact */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className={`text-2xl font-bold mt-7 ${textPrimary} flex items-center gap-2`}>
                <ChartPieIcon className="h-6 w-6 text-indigo-500" />
                Tableau de bord Administrateur
              </h1>
              <p className={`text-xs mt-1 ${textSecondary} flex items-center gap-1`}>
                <FunnelIcon className="h-3 w-3" />
                Statistiques des visites par service et période
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs ${textSecondary}`}>
                <UsersIcon className="h-3 w-3 inline mr-1" />
                Super Admin
              </span>
            </div>
          </div>

          {/* Grille compacte avec moins d'espacement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Colonne de gauche - Compteurs */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4">
                {/* Carte Visites */}
                <div className={`rounded-lg shadow-sm border ${borderColor} ${cardBg} p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium ${textSecondary} flex items-center gap-1`}>
                        <CalendarDaysIcon className="h-3 w-3" />
                        Total des visites
                      </p>
                      {loading ? (
                        <div className="h-6 w-16 bg-gray-400 dark:bg-gray-600 animate-pulse rounded mt-1"></div>
                      ) : (
                        <div className="flex items-end gap-1 mt-1">
                          <p className={`text-xl font-bold ${highlightColor}`}>
                            {totalVisites}
                          </p>
                          <span className={`text-xs ${textSecondary} flex items-center mb-0.5`}>
                            <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-0.5" />
                            +12%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                      <CalendarDaysIcon className={`h-4 w-4 ${highlightColor}`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${textSecondary}`}>
                    {getTimeRangeLabel()} • {totalServices} services
                  </p>
                </div>

                {/* Carte Services */}
                <div className={`rounded-lg shadow-sm border ${borderColor} ${cardBg} p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium ${textSecondary} flex items-center gap-1`}>
                        <BuildingOffice2Icon className="h-3 w-3" />
                        Services visités
                      </p>
                      {loading ? (
                        <div className="h-6 w-16 bg-gray-400 dark:bg-gray-600 animate-pulse rounded mt-1"></div>
                      ) : (
                        <div className="flex items-end gap-1 mt-1">
                          <p className={`text-xl font-bold ${highlightColor}`}>
                            {totalServices}
                          </p>
                          <span className={`text-xs ${textSecondary} flex items-center mb-0.5`}>
                            <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-0.5" />
                            +5%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                      <BuildingOffice2Icon className={`h-4 w-4 ${highlightColor}`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${textSecondary}`}>
                    {getTimeRangeLabel()} • {totalVisites} visites
                  </p>
                </div>

                {/* Section Activité récente compacte */}
                <div className={`rounded-lg shadow-sm border ${borderColor} ${cardBg} p-4`}>
                  <h2 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-1`}>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-indigo-500" />
                    Activité récente
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <p className={`text-xs ${textSecondary}`}>
                        Aujourd'hui
                      </p>
                      <p className={`text-lg font-bold mt-1 ${highlightColor}`}>
                        {timeRange === 'today' ? totalVisites : 'N/A'}
                      </p>
                    </div>
                    <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <p className={`text-xs ${textSecondary}`}>
                        Utilisateurs
                      </p>
                      <p className={`text-lg font-bold mt-1 ${highlightColor}`}>3</p>
                    </div>
                    <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <p className={`text-xs ${textSecondary}`}>
                        Services
                      </p>
                      <p className={`text-lg font-bold mt-1 ${highlightColor}`}>{totalServices}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Graphique principal */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg shadow-sm border ${borderColor} ${cardBg} p-4`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div>
                    <h2 className={`text-lg font-semibold ${textPrimary} flex items-center gap-1`}>
                      <ChartPieIcon className="h-4 w-4 text-indigo-500" />
                      Répartition des visites
                    </h2>
                    <p className={`text-xs ${textSecondary} flex items-center gap-1 mt-0.5`}>
                      <FunnelIcon className="h-3 w-3" />
                      {getTimeRangeLabel()} • {totalServices} services • {totalVisites} visites
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 min-w-[160px]">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className={`h-3 w-3 ${textSecondary}`} />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-7 w-full pr-2 py-1.5 rounded border text-xs ${inputBg} ${borderColor} focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    
                    <TimeRangeDropdown />
                  </div>
                </div>

                {loading ? (
                  <div className="h-72 flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className={`text-xs ${textSecondary}`}>Chargement des données...</p>
                  </div>
                ) : error ? (
                  <div className={`h-72 flex flex-col items-center justify-center gap-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    <ExclamationCircleIcon className="h-8 w-8" />
                    <p className="text-sm">{error}</p>
                    <button 
                      onClick={fetchChartData}
                      className={`mt-1 px-3 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary}`}
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {filteredData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              stroke={darkMode ? '#1F2937' : '#FFFFFF'}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={darkMode ? { 
                            backgroundColor: '#374151',
                            borderColor: '#4B5563',
                            color: '#F3F4F6',
                            borderRadius: '0.375rem',
                            fontSize: '12px'
                          } : { 
                            backgroundColor: '#fff',
                            borderColor: '#e5e7eb',
                            color: '#111827',
                            borderRadius: '0.375rem',
                            fontSize: '12px'
                          }}
                          formatter={(value, name, props) => [
                            `${value} visites`,
                            name
                          ]}
                        />
                        <Legend 
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            color: darkMode ? '#F3F4F6' : '#111827',
                            fontSize: '11px',
                            paddingLeft: '10px'
                          }}
                          iconSize={10}
                          iconType="circle"
                          formatter={(value, entry, index) => (
                            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}