import React, { useState } from "react";
import Navbar from "./navbar";
import { NotebookText } from "lucide-react";
import { Edit2Icon } from "lucide-react";
import { UserPlus2Icon } from "lucide-react";

const utilisateurs = [
  { id: 1, nom: "Andry", prenom: "Nirina", cin: "2010245124536"},
  { id: 2, nom: "Mialy", prenom: "Lionnel", cin: "20105114250" },
  { id: 3, nom: "Feno", prenom: "Grey", cin: "102410231546"},
];

export default function Visiteur() {
  const [filters, setFilters] = useState({
    id: "",
    nom: "",
    date: "",
    heure: "",
  });
  const [open, setOpen] = useState(false);
  const togglePopup = () => setOpen(!open);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredUtilisateurs = utilisateurs.filter((user) => {
    return (
      (filters.id === "" || user.id === Number(filters.id)) &&
      (filters.nom === "" || user.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.prenom === "" || user.prenom.toLowerCase().includes(filters.nom.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-300 pt-24 px-4 md:px-10">
      <Navbar />

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 relative">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Formulaire</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nom"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Prenom"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Cin"
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}
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
              Prenom
              <input
                type="text"
                name="prenom"
                value={filters.prenom}
                onChange={handleChange}
                placeholder="Prenom"
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Cin
              <input
                type="text"
                name="cin"
                value={filters.cin}
                onChange={handleChange}
                placeholder="Cin"
                className="mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>
        </section>

        {/* Tableau avec scroll horizontal sur petits écrans */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-x-auto">
         <div>
         <h2 className="float-left text-2xl font-semibold text-gray-700 mb-6">Liste des visiteurs</h2>
          <button className="float-right" onClick={togglePopup}>
            <div className="flex justify-center items-center bg-green-600 rounded-2xl mb-2 w-30 h-12 p-2">
                            <b><p className=" text-white pr-2">ajout</p></b>
                            <UserPlus2Icon className=" w-10 text-white " />
            </div>
          </button>
         </div>
          <table className="w-full min-w-[600px] border-collapse table-auto text-gray-700">
            <thead className="bg-indigo-100 sticky top-0 z-10">
              <tr>
                {["ID", "Nom", "Prénom", "CIN", "Voir leur visite","Modifier"].map((heading) => (
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
                    <td className="px-6 py-4 border-b whitespace-nowrap">{user.cin}</td>
                    <td className="px-6 py-1 border-b border-l whitespace-nowrap justify-items-center">
                      <div className="grid place-items-center bg-orange-400 rounded-2xl w-15 h-12 ">
                            <NotebookText className="w-10 text-white " />
                          </div>
                    </td>
                    <td className="px-6  border-b border-r border-l whitespace-nowrap justify-items-center">
                        <div className="grid place-items-center bg-blue-600 rounded-2xl w-15 h-12 ">
                          <Edit2Icon className="w-10 text-white " />
                        </div>
                    </td>
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
