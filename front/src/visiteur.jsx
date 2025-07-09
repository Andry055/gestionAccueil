import React, { useState } from "react";
import Navbar from "./navbar";

const utilisateurs = [
  { id: 1, nom: "Andry", prenom: "Nirina", date: "12-06-2025", heure: "10:30", description: "Verification du dossier ", service: "GDTP", agent:"Mr RAKOTO"},
  { id: 2, nom: "Mialy", prenom: "Lionnel", date: "30-06-2025", heure: "11:40", description: "Demande de stage", service: "HDDT",agent:"Mr Secretaire generale" },
  { id: 3, nom: "Feno", prenom: "Grey", date: "19-06-2025", heure: "15:55", description: "Demande d'emplois", service: "GTTP", agent:"Mme Hasina"},
];

export default function Visiteur() {
  const [filters, setFilters] = useState({
    id: "",
    nom: "",
    date: "",
    heure: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredUtilisateurs = utilisateurs.filter((user) => {
    return (
      (filters.id === "" || user.id === Number(filters.id)) &&
      (filters.nom === "" || user.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.date === "" || user.date === filters.date) &&
      (filters.heure === "" || user.heure === filters.heure)
    );
  });

  return (
    <div className="min-h-screen bg-gray-300 pt-24 px-4 md:px-10">
      <Navbar />

      <h1 className="text-4xl font-extrabold text-gray-800 mb-12 ml-2 md:ml-6">Visiteurs</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto pb-10">
        {/* Filtres */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full md:w-1/4 ">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Filtres</h2>

          <div className="flex flex-col space-y-5">
            <label className="flex flex-col text-gray-700 font-medium">
              ID
              <input
                type="number"
                name="id"
                value={filters.id}
                onChange={handleChange}
                placeholder="ID"
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Nom
              <input
                type="text"
                name="nom"
                value={filters.nom}
                onChange={handleChange}
                placeholder="Nom"
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Date de visite
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Heure de visite
              <input
                type="time"
                name="heure"
                value={filters.heure}
                onChange={handleChange}
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>
        </section>

        {/* Tableau avec scroll horizontal sur petits écrans */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Liste des visiteurs</h2>

          <table className="w-full min-w-[600px] border-collapse table-auto text-gray-700">
            <thead className="bg-indigo-100 sticky top-0 z-10">
              <tr>
                {["ID", "Nom", "Prénom", "Date de visite", "Heure de visite", "Description", "Service visité", "agent"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 border-b border-gray-300 text-left font-medium text-indigo-700 whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUtilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Aucun visiteur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUtilisateurs.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.nom}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.prenom}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.date}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.heure}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.description}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.service}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.agent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
