import React from "react";
import { useDarkMode } from "../utils/DarkModeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StatistiquesSuperAdmin() {
  const { darkMode } = useDarkMode();

  const data = [
    { name: "Jan", visiteurs: 240 },
    { name: "Fév", visiteurs: 130 },
    { name: "Mar", visiteurs: 180 },
    { name: "Avr", visiteurs: 90 },
    { name: "Mai", visiteurs: 230 },
    { name: "Juin", visiteurs: 300 },
    { name: "Juil", visiteurs: 270 },
  ];

  return (
    <div
      className={`min-h-screen pt-24 px-6 md:px-20 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8">Statistiques Globales</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Visiteurs par mois</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis dataKey="name" stroke={darkMode ? "#ddd" : "#333"} />
            <YAxis stroke={darkMode ? "#ddd" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                borderColor: darkMode ? "#555" : "#ccc",
              }}
              labelStyle={{ color: darkMode ? "#fff" : "#000" }}
            />
            <Bar dataKey="visiteurs" fill={darkMode ? "#fbbf24" : "#3b82f6"} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
