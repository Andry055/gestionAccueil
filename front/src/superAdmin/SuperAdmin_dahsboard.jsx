import React, { useState, useEffect, useRef } from 'react';
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
  ExclamationCircleIcon,
  XMarkIcon,
  ArrowDownTrayIcon
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
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export default function SuperAdminDashboard() {
  const { darkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customDateModal, setCustomDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  
  const chartRef = useRef(null);

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
      let params = {};
      
      switch(timeRange) {
        case 'today': endpoint = 'superChartJour'; break;
        case 'week': endpoint = 'superChartSemaine'; break;
        case 'month': endpoint = 'superChartMois'; break;
        case 'custom': 
          endpoint = 'superChartPersonnalise';
          params = { date_debut: startDate, date_fin: endDate };
          break;
        default: endpoint = 'superChartJour';
      }

      const response = await axios.get(`http://localhost:5000/visite/${endpoint}`, { params });
      
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

  // Appliquer les dates personnalisées
  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setError("La date de début doit être antérieure à la date de fin");
        return;
      }
      setTimeRange('custom');
      setCustomDateModal(false);
      fetchChartData();
    } else {
      setError("Veuillez sélectionner les deux dates");
    }
  };

  // Exporter le graphique en image
  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    
    setExporting(true);
    try {
      const dataUrl = await toPng(chartRef.current, { 
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        quality: 1.0 
      });
      
      const link = document.createElement('a');
      link.download = `statistiques-visites-${timeRange}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur lors de l'export:", err);
      setError("Erreur lors de l'exportation");
    } finally {
      setExporting(false);
    }
  };

  // Exporter le graphique en PDF
  const exportChartAsPDF = async () => {
    if (!chartRef.current) return;
    
    setExporting(true);
    try {
      const dataUrl = await toPng(chartRef.current, { 
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        quality: 1.0 
      });
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Ajouter un titre
      pdf.setFontSize(16);
      pdf.text('Statistiques des visites', pdfWidth / 2, 15, { align: 'center' });
      
      // Ajouter la période
      pdf.setFontSize(12);
      pdf.text(`Période: ${getTimeRangeLabel()}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Ajouter l'image du graphique
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth - 40; // marges de 20mm de chaque côté
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 20, 30, imgWidth, imgHeight);
      
      // Ajouter les totaux
      pdf.setFontSize(10);
      pdf.text(`Total des visites: ${totalVisites} | Services visités: ${totalServices}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      // Sauvegarder le PDF
      pdf.save(`statistiques-visites-${timeRange}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
      setError("Erreur lors de l'exportation PDF");
    } finally {
      setExporting(false);
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
  const modalBg = darkMode ? "bg-gray-800" : "bg-white";

  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'today': return "Aujourd'hui";
      case 'week': return "Cette semaine";
      case 'month': return "Ce mois";
      case 'custom': return `Personnalisé (${startDate} au ${endDate})`;
      default: return "";
    }
  };

  const TimeRangeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const options = [
      { value: 'today', label: 'Aujourd\'hui', icon: <ClockIcon className="h-4 w-4" /> },
      { value: 'week', label: 'Cette semaine', icon: <CalendarDaysIcon className="h-4 w-4" /> },
      { value: 'month', label: 'Ce mois', icon: <ChartPieIcon className="h-4 w-4" /> },
      { value: 'custom', label: 'Personnalisé', icon: <CalendarDaysIcon className="h-4 w-4" /> }
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
                  if (option.value === 'custom') {
                    setCustomDateModal(true);
                    setIsOpen(false);
                  } else {
                    setTimeRange(option.value);
                    setIsOpen(false);
                  }
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
                    
                    {/* Bouton d'exportation */}
                    <div className="relative group">
                        <button
                          onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                          disabled={exporting}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border ${borderColor} ${dropdownBg} ${textPrimary} ${exporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Exporter
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                        
                        {/* Menu déroulant pour les options d'exportation */}
                        {isExportDropdownOpen && (
                          <div className={`absolute z-10 mt-1 right-0 w-40 rounded-md shadow-lg ${dropdownBg} border ${borderColor}`}>
                            <button
                              onClick={() => {
                                exportChartAsImage();
                                setIsExportDropdownOpen(false);
                              }}
                              disabled={exporting}
                              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-500 hover:text-white ${textPrimary}`}
                            >
                              <span>En image (PNG)</span>
                            </button>
                            <button
                              onClick={() => {
                                exportChartAsPDF();
                                setIsExportDropdownOpen(false);
                              }}
                              disabled={exporting}
                              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-500 hover:text-white ${textPrimary}`}
                            >
                              <span>En PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
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
                  <div className="h-72" ref={chartRef}>
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

      {/* Modal pour les dates personnalisées */}
      {customDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full p-5 ${modalBg} ${borderColor} border`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>
                Période personnalisée
              </h3>
              <button 
                onClick={() => setCustomDateModal(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full p-2 rounded border ${inputBg} ${borderColor}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full p-2 rounded border ${inputBg} ${borderColor}`}
                />
              </div>
              
              {error && (
                <div className={`p-2 rounded text-sm ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                  {error}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setCustomDateModal(false)}
                className={`px-4 py-2 rounded text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary}`}
              >
                Annuler
              </button>
              <button
                onClick={handleCustomDateApply}
                className="px-4 py-2 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}