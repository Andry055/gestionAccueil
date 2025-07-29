import React, { useState } from "react";
import { Eye, Edit2 } from "lucide-react";
import { UserPlus2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AjoutService from "./ajoutService";
import { useDarkMode } from "../utils/DarkModeContext"; // Import contexte darkMode

export default function Service() {

  const { darkMode } = useDarkMode(); // Récupérer l'état sombre/clair

  const [openAjout, setOpenAjout] = useState(false);
  
  const services = [
    { id: 1, nom: "Avancement", porte: 6, etage: "2", visites: 120 },
    { id: 2, nom: "Reclassement", porte: 201, etage: "2", visites: 90 },
    { id: 3, nom: "Bonification", porte: 100, etage: "1", visites: 150 },
    { id: 4, nom: "Integration", porte: 50, etage: "3", visites: 80 },
    { id: 5, nom: "Nomination", porte: 75, etage: "3", visites: 60 },
    { id: 6, nom: "Archive", porte: 85, etage: "3", visites: 130 },
    { id: 7, nom: "DAG", porte: 15, etage: "4", visites: 110 },
    { id: 8, nom: "DG", porte: 5, etage: "2", visites: 140 },
    { id: 9, nom: "Cabinet", porte: 1, etage: "2", visites: 50 },
    { id: 10, nom: "DCR", porte: 45, etage: "6", visites: 70 },
  ];

  const topServices = [...services].sort((a, b) => b.visites - a.visites).slice(0, 10);

  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.nom.toLowerCase().includes(search.toLowerCase())
  );

  // Styles conditionnels
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white border-blue-300";
  const chartCardBg = darkMode ? "bg-gray-800 text-gray-100 border-green-600" : "bg-white border-green-300";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";
  const inputBg = darkMode ? "bg-gray-700 text-white border-gray-500" : "bg-white text-black border-gray-300";

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Tableau des services */}
        <section className={`rounded-xl shadow-lg flex-1 overflow-hidden max-h-[80vh] border-4 ${cardBg}`}>
          <div className={`sticky top-0 z-20 px-6 pt-4 pb-5 md:px-8 md:pt-6 md:pb-3 border-b ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-200"}`}>
            <h2 className="text-2xl font-semibold">Liste des Services</h2>

            {/* Recherche */}
            <div className="flex mt-4 gap-4">
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full p-2 rounded-md border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${inputBg}`}
              />
              <button onClick={() => setOpenAjout(true)}>
                <div className="flex shadow-xl justify-center items-center bg-green-600 rounded-2xl w-32 h-12 hover:scale-105 transition-transform p-2">
                  <b><p className="text-white pr-2">Ajout</p></b>
                  <UserPlus2 className="w-8 text-white" />
                </div>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(80vh-130px)]">
            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={tableHead}>
                <tr>
                  {["ID", "Service", "Porte", "Étage", "Détail", "Modifier"].map((heading) => (
                    <th key={heading} className="sticky top-0 px-6 py-5 border-b text-left font-medium whitespace-nowrap">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className={`${tableRowHover} transition-colors cursor-pointer`}>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.id}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.nom}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.porte}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.etage}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">
                        <button className="flex items-center text-blue-400 hover:text-blue-600 transition">
                          <Eye size={18} className="mr-1" />
                          Voir
                        </button>
                      </td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">
                        <button className="flex items-center text-green-400 hover:text-green-600 transition">
                          <Edit2 size={18} className="mr-1" />
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      Aucun service trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Graphique */}
        <section className={`rounded-xl shadow-lg p-6 md:p-8 w-full lg:w-1/3 h-[400px] border-4 ${chartCardBg}`}>
          <h2 className="text-xl font-semibold mb-4">Top 10 des Services les plus visités</h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topServices}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
              <XAxis type="number" stroke={darkMode ? "#ccc" : "#333"} />
              <YAxis dataKey="nom" type="category" stroke={darkMode ? "#ccc" : "#333"} />
              <Tooltip contentStyle={{ background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }} />
              <Bar dataKey="visites" fill={darkMode ? "#FBBF24" : "#4CAF50"} />
            </BarChart>
          </ResponsiveContainer>

          <AjoutService open={openAjout} onClose={() => setOpenAjout(false)} />
        </section>

      </div>
    </div>
  );
}
