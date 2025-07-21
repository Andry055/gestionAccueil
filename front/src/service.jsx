import React, { useState } from "react";
import Navbar from "./navbar";
import { Eye, Edit2 } from "lucide-react";
import { Search, UserPlus2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AjoutService from "./ajoutService";

export default function Service() {

  const [openAjout, setOpenAjout]=useState(false);
  const services = [
    { id: 1, nom: "avancement", porte: 6, etage: "2", visites: 120 },
    { id: 2, nom: "reclassement", porte: 201, etage: "2", visites: 90 },
    { id: 3, nom: "Bonification", porte: 100, etage: "1", visites: 150 },
    { id: 4, nom: "Integration", porte: 50, etage: "3", visites: 80 },
    { id: 5, nom: "Nomination", porte: 75, etage: "3", visites: 60 },
    { id: 6, nom: "Archive", porte: 85, etage: "3", visites: 130 },
    { id: 7, nom: "DAG", porte: 15, etage: "4", visites: 110 },
    { id: 8, nom: "DG", porte: 5, etage: "2", visites: 140 },
    { id: 9, nom: "Cabinet", porte: 1, etage: "2", visites: 50 },
    { id: 10, nom: "DCR", porte: 45, etage: "6", visites: 70 },
  ];

  const topServices = [...services]
    .sort((a, b) => b.visites - a.visites)
    .slice(0, 10);

  // 🔍 Recherche
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 md:px-10">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tableau des services */}
        <section className="bg-white rounded-xl border-blue-300 border-4 shadow-lg flex-1 overflow-hidden max-h-[80vh] relative">
          <div className="sticky top-0 bg-white z-20 px-6 pt-4 pb-5 md:px-8 md:pt-6 md:pb-3 border-b border-blue-200">
            <h2 className="text-2xl font-semibold text-indigo-700">Liste des Services</h2>

            {/* Champ de recherche */}
            <div className="flex mt-4">
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-1 mr-30 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button onClick={()=>setOpenAjout(true)}>
                <div className="flex shadow-xl justify-center items-center bg-green-600 rounded-2xl w-32 h-12 hover:scale-105 transition-transform p-2">
                  <b><p className="text-white pr-2">Ajout</p></b>
                  <UserPlus2 className="w-8 text-white" />
                </div>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(80vh-130px)]">
            <table className="m-0 w-full min-w-[600px] border-collapse table-auto text-gray-700">
              <thead className=" bg-indigo-100 top-0 z-0">
                <tr>
                  {["ID", "Service", "Porte", "Etage", "Voir detaille", "Modifier"].map((heading) => (
                    <th
                      key={heading}
                      className="sticky top-0 bg-blue-100 z-10 px-6 py-5 border-b border-gray-300 text-left font-medium text-indigo-700 whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 border-b whitespace-nowrap bg-blue-50">{service.id}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.nom}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.porte}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{service.etage}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">
                        <button className="flex items-center text-blue-500 hover:text-blue-700 transition">
                          <Eye size={18} className="mr-1" />
                          Voir
                        </button>
                      </td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">
                        <button className="flex items-center text-green-500 hover:text-green-700 transition">
                          <Edit2 size={18} className="mr-1" />
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Aucun service trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Graphique des services les plus visités */}
        <section className="bg-white rounded-xl border-green-300 border-4 shadow-lg p-6 md:p-8 w-full lg:w-1/3 h-[400px]">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Top 10 des Services les plus visités</h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topServices}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nom" type="category" />
              <Tooltip />
              <Bar dataKey="visites" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
          <AjoutService open={openAjout} onClose={() => setOpenAjout(false)}/>
        </section>
      </div>
    </div>
  );
}
