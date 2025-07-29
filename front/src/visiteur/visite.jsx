import React, { useState, useEffect } from "react";
import Navbar from "../utils/navbar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../utils/DarkModeContext";

// Données exemples
const utilisateursInitiaux = [
  { id: 1, nom: "Andry", prenom: "Nirina" },
  { id: 2, nom: "Mialy", prenom: "Lionnel" },
  { id: 3, nom: "Feno", prenom: "Grey" },
];

const visitesInit = [
  { id: 1, utilisateurId: 1, date: "2025-07-10", heureArr: "8:55", heureSor: "10:55", service: "DRFP", motif: "Réunion" },
  { id: 2, utilisateurId: 2, date: "2025-07-12", heureArr: "9:00", heureSor: "10:50", service: "DTFP", motif: "Dépôt de dossier" },
  { id: 3, utilisateurId: 3, date: "2025-07-15", heureArr: "10:20", heureSor: "11:55", service: "DRFP", motif: "Entretien" },
];

export default function Visite() {
  const { darkMode } = useDarkMode();

  const [utilisateurs] = useState(utilisateursInitiaux);
  const [visites] = useState(visitesInit);
  const [filteredVisites, setFilteredVisites] = useState(visites);

  // Filtres
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");

  // Style
  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : " text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  // Filtrage dynamique
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredVisites(
        visites.filter((v) => {
          const user = utilisateurs.find((u) => u.id === v.utilisateurId);
          const nomPrenom = `${user?.nom ?? ""} ${user?.prenom ?? ""}`.toLowerCase();
          const dateValide = dateDebut === "" || v.date >= dateDebut;

          return (
            dateValide &&
            (nomPrenom.includes(search.toLowerCase()) ||
              v.service.toLowerCase().includes(search.toLowerCase()) ||
              v.motif.toLowerCase().includes(search.toLowerCase()))
          );
        })
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [search, dateDebut, visites, utilisateurs]);

  // Reset
  const handleReset = () => {
    setSearch("");
    setDateDebut("");
  };

  return (
    <div className={`min-h-screen pt-23 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Historique des visites</h1>

      <div className="max-w-7xl px-8 mx-auto pb-10">
        {/* Filtres */}
        <div className={`rounded-xl md:p-6 p-4 mb-5 ${cardBg}`}>
          <div className="flex flex-col md:flex-row gap-4  items-center">
            {/* Recherche */}
            <input
              type="text"
              placeholder="Nom, service ou motif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full md:w-1/3 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
              }`}
            />

            {/* Date début */}
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className={`w-full md:w-1/4 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-800 text-black"
              }`}
            />

          </div>
        </div>

        {/* Tableau */}
        <section className={`rounded-xl shadow-lg p-6 md:p-8 overflow-y-auto max-h-[75vh] border-4 ${
          darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Liste des visites</h2>
            <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg}`}>
              <p className="font-medium px-1">Total :</p>
              <p className="text-2xl font-bold">{filteredVisites.length}</p>
            </div>
          </div>

          <table className="w-full min-w-[800px] border-collapse table-auto">
            <thead className={`${tableHead} sticky top-0 z-10`}>
              <tr>
                {["ID", "Nom", "Prénom", "Date", "Heure Arrivée", "Heure Sortie", "Service", "Motif", "Modifier"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredVisites.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    Aucune visite trouvée.
                  </td>
                </tr>
              ) : (
                filteredVisites.map((v) => {
                  const user = utilisateurs.find((u) => u.id === v.utilisateurId) || {};
                  return (
                    <tr key={v.id} className={`${tableRowHover} transition-colors`}>
                      <td className="px-6 py-4 border-b">{v.id}</td>
                      <td className="px-6 py-4 border-b">{user.nom || "-"}</td>
                      <td className="px-6 py-4 border-b">{user.prenom || "-"}</td>
                      <td className="px-6 py-4 border-b">{v.date}</td>
                      <td className="px-6 py-4 border-b">{v.heureArr}</td>
                      <td className="px-6 py-4 border-b">{v.heureSor}</td>
                      <td className="px-6 py-4 border-b">{v.service}</td>
                      <td className="px-6 py-4 border-b">{v.motif}</td>
                      <td className="px-6 py-1 border-b whitespace-nowrap">
                        <div className="grid place-items-center bg-blue-600 rounded-2xl w-12 h-12">
                          <PencilSquareIcon className="w-7 text-white" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
