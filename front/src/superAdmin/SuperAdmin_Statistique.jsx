import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../utils/DarkModeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function StatistiquesSuperAdmin() {
  const { darkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('month');
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([
    { name: 'Lundi', visiteurs: 120, visites: 180 },
    { name: 'Mardi', visiteurs: 150, visites: 160 },
    { name: 'Mercredi', visiteurs: 60, visites:70 },
    { name: 'Jeudi', visiteurs: 100, visites: 160 },
    { name: 'Vendredi', visiteurs: 150, visites: 210 },
  ]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState(null);
  const [weeklyError, setWeeklyError] = useState(null);
  const [dailyError, setDailyError] = useState(null);

  // Données locales simulées pour les visites
  const localVisitsData = {
    month: [
      { mois: 'Janvier', visites: 3500 },
      { mois: 'Février', visites: 4200 },
      { mois: 'Mars', visites: 3800 },
      { mois: 'Avril', visites: 4100 },
      { mois: 'Mai', visites: 4500 },
      { mois: 'Juin', visites: 3900 },
    ],
    week: [
      { semaine: 'Semaine 1', visites: 850 },
      { semaine: 'Semaine 2', visites: 920 },
      { semaine: 'Semaine 3', visites: 780 },
      { semaine: 'Semaine 4', visites: 950 },
    ]
  };

  // Fetch monthly data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setMonthlyLoading(true);
        const response = await axios.get('http://localhost:5000/visite/chartMois');
        const formattedData = response.data.data.map((item, index) => ({
          name: item.mois,
          visiteurs: parseInt(item.nombre_visites),
          visites: localVisitsData.month[index]?.visites || 0
        }));
        setMonthlyData(formattedData);
        setMonthlyLoading(false);
      } catch (err) {
        setMonthlyError(err.message);
        setMonthlyLoading(false);
        console.error("Erreur lors de la récupération des données mensuelles:", err);
      }
    };

    fetchMonthlyData();
  }, []);

  // Fetch weekly data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setWeeklyLoading(true);
        const response = await axios.get('http://localhost:5000/visite/chartSemaine');
        const formattedData = response.data.data.map((item, index) => ({
          name: item.semaine,
          visiteurs: parseInt(item.nombre_visites),
          visites: localVisitsData.week[index]?.visites || 0
        }));
        setWeeklyData(formattedData);
        setWeeklyLoading(false);
      } catch (err) {
        setWeeklyError(err.message);
        setWeeklyLoading(false);
        console.error("Erreur lors de la récupération des données hebdomadaires:", err);
      }
    };

    fetchWeeklyData();
  }, []);

  const currentData = timeRange === 'month' 
    ? monthlyData 
    : timeRange === 'week' 
      ? weeklyData 
      : dailyData;
      
  const currentLoading = timeRange === 'month' 
    ? monthlyLoading 
    : timeRange === 'week' 
      ? weeklyLoading 
      : dailyLoading;
      
  const currentError = timeRange === 'month' 
    ? monthlyError 
    : timeRange === 'week' 
      ? weeklyError 
      : dailyError;
      
  const chartTitle = timeRange === 'month' 
    ? "Statistiques par mois" 
    : timeRange === 'week' 
      ? "Statistiques par semaine" 
      : "Statistiques par jour (Lundi-Vendredi)";

  if (currentLoading) {
    return (
      <div className={`min-h-screen pt-24 px-6 md:px-20 flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Chargement des données {timeRange === 'month' ? 'mensuelles' : timeRange === 'week' ? 'hebdomadaires' : 'journalières'}...</p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className={`min-h-screen pt-24 px-6 md:px-20 flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}>
        <div className={`p-6 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <p className="text-red-500">Erreur: {currentError}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded-lg ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-24 px-6 md:px-20 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl  mb-5">Statistiques Globales</h1>

      <div className={`rounded-xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-1xl font-semibold">{chartTitle}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'day'
                  ? darkMode
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Journalier
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'week'
                  ? darkMode
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Hebdomadaire
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'month'
                  ? darkMode
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Mensuel
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={currentData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? "#444" : "#eee"} 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke={darkMode ? "#ddd" : "#666"} 
              tickMargin={10}
            />
            <YAxis 
              stroke={darkMode ? "#ddd" : "#666"} 
              tickMargin={10}
              tickFormatter={(value) => new Intl.NumberFormat('fr').format(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                borderColor: darkMode ? "#555" : "#ddd",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ 
                color: darkMode ? "#fff" : "#000",
                padding: "0.25rem 0",
              }}
              labelStyle={{ 
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: darkMode ? "#fbbf24" : "#3b82f6",
              }}
              formatter={(value, name) => [
                new Intl.NumberFormat('fr').format(value), 
                name === 'visiteurs' ? 'Visiteurs uniques' : 'Nombre de visites'
              ]}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value) => value === 'visiteurs' ? 'Visiteurs uniques' : 'Nombre de visites'}
            />
            <Line
              type="monotone"
              dataKey="visiteurs"
              name="visiteurs"
              stroke={darkMode ? "#fbbf24" : "#3b82f6"}
              strokeWidth={3}
              dot={{
                fill: darkMode ? "#fbbf24" : "#3b82f6",
                strokeWidth: 2,
                r: 5,
                stroke: darkMode ? "#333" : "#fff",
              }}
              activeDot={{
                r: 8,
                stroke: darkMode ? "#fbbf24" : "#3b82f6",
                strokeWidth: 2,
                fill: darkMode ? "#333" : "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="visites"
              name="visites"
              stroke={darkMode ? "#10b981" : "#ef4444"}
              strokeWidth={3}
              dot={{
                fill: darkMode ? "#10b981" : "#ef4444",
                strokeWidth: 2,
                r: 5,
                stroke: darkMode ? "#333" : "#fff",
              }}
              activeDot={{
                r: 8,
                stroke: darkMode ? "#10b981" : "#ef4444",
                strokeWidth: 2,
                fill: darkMode ? "#333" : "#fff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
        darkMode ? "text-gray-100" : "text-gray-900"
      }`}>
        <div className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h3 className="text-lg font-semibold mb-2">Visiteurs uniques totaux</h3>
          <p className="text-3xl font-bold text-blue-500 dark:text-yellow-500">
            {currentData.reduce((sum, item) => sum + item.visiteurs, 0).toLocaleString('fr')}
          </p>
        </div>
        <div className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h3 className="text-lg font-semibold mb-2">Visites totales</h3>
          <p className="text-3xl font-bold text-green-500 dark:text-green-400">
            {currentData.reduce((sum, item) => sum + item.visites, 0).toLocaleString('fr')}
          </p>
        </div>
        <div className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h3 className="text-lg font-semibold mb-2">Ratio visites/visiteurs</h3>
          <p className="text-3xl font-bold text-purple-500 dark:text-purple-400">
            {(currentData.reduce((sum, item) => sum + item.visites, 0) / 
              currentData.reduce((sum, item) => sum + item.visiteurs, 1)).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}