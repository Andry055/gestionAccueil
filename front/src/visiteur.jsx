import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import VisiteListPopup from "./listeVisite";
import { NotebookText, Edit2, UserPlus2 } from "lucide-react";

const utilisateurs = [
  { id: 1, nom: "Andry", prenom: "Nirina", cin: "2010245124536" },
  { id: 2, nom: "Mialy", prenom: "Lionnel", cin: "20105114250" },
  { id: 3, nom: "Feno", prenom: "Grey", cin: "102410231546" },
];

export default function Visiteur() {
  const [filters, setFilters] = useState({
    id: "",
    nom: "",
    prenom: "",
    cin: "",
  });

  const [searchValues, setSearchValues] = useState({
    id: "",
    nom: "",
    prenom: "",
    cin: "",
  });

  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState(utilisateurs);
  const [openVisite, setOpenVisite] = useState(false);
  const [open, setOpen] = useState(false);

  const visites = [
    { id: 1, date: "2025-07-10", heureArr: "8:55", heureSor: "10:55", service: "DRFP", motif: "Réunion", chefService: "Mr TOVONIAINA Hasa" },
    { id: 2, date: "2025-07-12", heureArr: "9:00", heureSor: "10:50", service: "DTFP", motif: "Dépôt de dossier", chefService: "Mme RAMANATSOA Lala" },
    { id: 3, date: "2025-07-15", heureArr: "10:20", heureSor: "11:55", service: "DRFP", motif: "Entretien", chefService: "Mr LAZANIRINA Manana" },
  ];

  const togglePopup = () => setOpen(!open);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(searchValues);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

  useEffect(() => {
    const result = utilisateurs.filter((user) => {
      return (
        (filters.id === "" || user.id === Number(filters.id)) &&
        (filters.nom === "" || user.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
        (filters.prenom === "" || user.prenom.toLowerCase().includes(filters.prenom.toLowerCase())) &&
        (filters.cin === "" || user.cin.toLowerCase().includes(filters.cin.toLowerCase()))
      );
    });

    setFilteredUtilisateurs(result);
  }, [filters]);

  const handleChange = (e) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setSearchValues({ id: "", nom: "", prenom: "", cin: "" });
    setFilters({ id: "", nom: "", prenom: "", cin: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 md:px-10">
      <Navbar />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-7 ml-2 md:ml-6">Visiteurs</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto pb-10">

        {/* Filtres */}
        <section className="bg-blue-200 rounded-xl shadow-lg p-6 md:p-8 w-full md:w-1/4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Filtres</h2>

          <div className="flex flex-col space-y-2">
            {["id", "nom", "prenom", "cin"].map((field) => (
              <label key={field} className="flex flex-col text-gray-700 font-medium capitalize">
                {field}
                <input
                  type={field === "id" ? "number" : "text"}
                  name={field}
                  value={searchValues[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="mt-1 p-3 rounded-md border border-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            ))}

            <button
              onClick={handleReset}
              className="mt-4 bg-red-400 text-white py-2 rounded hover:bg-red-500"
            >
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau + Statistique */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">

            <h2 className="text-2xl font-semibold text-gray-700">Liste des visiteurs</h2>

            <div className="flex flex-wrap items-center gap-4">

              <div className="bg-blue-200 rounded-xl p-3 flex items-center justify-center text-center min-w-[150px]">
                <p className="font-medium px-1 text-gray-800">Total :</p>
                <p className="text-2xl font-bold text-gray-900">{filteredUtilisateurs.length}</p>
              </div>

              <div className="bg-blue-200 rounded-xl p-3 flex items-center justify-center text-center min-w-[150px]">
                <p className="font-medium px-1 text-gray-800">Nouveau :</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>

              <button onClick={togglePopup}>
                <div className="flex shadow-xl justify-center items-center bg-green-600 rounded-2xl w-32 h-12 hover:scale-105 transition-transform p-2">
                  <b><p className="text-white pr-2">Ajout</p></b>
                  <UserPlus2 className="w-8 text-white" />
                </div>
              </button>

            </div>
          </div>

          <table className="w-full min-w-[600px] border-collapse table-auto text-gray-700">
            <thead className="bg-indigo-100 sticky top-0 z-10">
              <tr>
                {["ID", "Nom", "Prénom", "CIN", "Voir leur visite", "Modifier"].map((heading) => (
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
                  <td colSpan={6} className="text-center py-10 text-gray-500">
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
                    <td className="px-6 py-1 border-b border-l whitespace-nowrap">
                      <button onClick={() => setOpenVisite(true)}>
                        <div className="grid place-items-center bg-orange-400 rounded-2xl w-15 h-12">
                          <NotebookText className="w-10 text-white" />
                        </div>
                      </button>
                    </td>
                    <td className="px-6 border-b border-r border-l whitespace-nowrap">
                      <div className="grid place-items-center bg-blue-600 rounded-2xl w-15 h-12">
                        <Edit2 className="w-10 text-white" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <VisiteListPopup open={openVisite} onClose={() => setOpenVisite(false)} visites={visites} />
        </section>
      </div>
    </div>
  );
}
