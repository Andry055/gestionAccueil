import React from "react";
import Navbar from "./navbar";
import { Eye, Edit2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Service() {
  const services = [
    { id: 1, nom: "DRFP", porte: 6, etage: "2010245124536", visites: 120 },
    { id: 2, nom: "DRHM", porte: 201, etage: "20105114250", visites: 90 },
    { id: 3, nom: "DSI", porte: 100, etage: "102410231546", visites: 150 },
    { id: 4, nom: "DAAF", porte: 50, etage: "203045124536", visites: 80 },
    { id: 5, nom: "DPSI", porte: 75, etage: "203145124536", visites: 60 },
    { id: 6, nom: "DCS", porte: 85, etage: "204145124536", visites: 130 },
    { id: 7, nom: "DAG", porte: 15, etage: "205145124536", visites: 110 },
    { id: 8, nom: "DG", porte: 5, etage: "206145124536", visites: 140 },
    { id: 9, nom: "Cabinet", porte: 1, etage: "207145124536", visites: 50 },
    { id: 10, nom: "DCR", porte: 45, etage: "208145124536", visites: 70 },
  ];

  const topServices = [...services]
    .sort((a, b) => b.visites - a.visites)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 md:px-10">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tableau des services */}
        <section className="bg-white rounded-xl border-blue-300 border-4 shadow-lg flex-1 overflow-hidden max-h-[80vh] relative">
          <div className="sticky top-0 bg-white z-20 px-6 pt-4 pb-5 md:px-8 md:pt-6 md:pb-3 border-b border-blue-200">
            <h2 className="text-2xl font-semibold text-indigo-700">Liste des Services</h2>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto h-[calc(80vh-90px)]">
            <table className="m-0 w-full min-w-[600px] border-collapse table-auto text-gray-700">
              <thead className="bg-indigo-100 top-0 z-0">
                <tr>
                  {["ID", "Nom du direction", "Porte", "Etage", "Voir leur visite", "Modifier"].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-1 border-b border-gray-300 text-left font-medium text-indigo-700 whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-indigo-50">
                    <td className="px-6 py-4 border-b whitespace-nowrap">{service.id}</td>
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
                ))}
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
        </section>
      </div>
    </div>
  );
}
