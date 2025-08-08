import React, { useState, useEffect } from "react";
import { Edit2, Trash2, UserPlus2 } from "lucide-react";
import { useDarkMode } from "../utils/DarkModeContext";

const initialAdmins = [
  { id: 1, username: "admin1", role: "admin", tel: "034 12 345 67", dateAjout: "2025-07-20" },
  { id: 2, username: "admin2", role: "admin", tel: "032 98 765 43", dateAjout: "2025-07-21" },
  { id: 3, username: "superadmin", role: "superadmin", tel: "033 55 44 33 22", dateAjout: "2025-07-22" },
];

export default function GestionComptes() {
  const { darkMode } = useDarkMode();
  const today = new Date().toISOString().split("T")[0];

  const [admins, setAdmins] = useState(initialAdmins);
  const [filters, setFilters] = useState({ id: "", username: "", role: "", tel: "" });
  const [searchValues, setSearchValues] = useState({ id: "", username: "", role: "", tel: "" });
  const [filteredAdmins, setFilteredAdmins] = useState(admins);
  const [openAjout, setOpenAjout] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    role: "admin",
    tel: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => setFilters(searchValues), 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

  useEffect(() => {
    const result = admins.filter((admin) => {
      return (
        (filters.id === "" || admin.id === Number(filters.id)) &&
        (filters.username === "" || admin.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (filters.role === "" || admin.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.tel === "" || admin.tel.includes(filters.tel))
      );
    });
    setFilteredAdmins(result);
  }, [filters, admins]);

  const handleChange = (e) => setSearchValues({ ...searchValues, [e.target.name]: e.target.value });

  const handleReset = () => {
    setSearchValues({ id: "", username: "", role: "", tel: "" });
    setFilters({ id: "", username: "", role: "", tel: "" });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.username || !newAdmin.password || !newAdmin.tel) 
      return alert("Tous les champs sont obligatoires");
    if (newAdmin.password !== newAdmin.confirmPassword) 
      return alert("Les mots de passe ne correspondent pas");

    const newId = admins.length > 0 ? admins[admins.length - 1].id + 1 : 1;
    const adminToAdd = {
      id: newId,
      username: newAdmin.username,
      role: newAdmin.role,
      tel: newAdmin.tel,
      dateAjout: today
    };
    
    setAdmins([...admins, adminToAdd]);
    setNewAdmin({
      username: "",
      role: "admin",
      tel: "",
      password: "",
      confirmPassword: ""
    });
    setOpenAjout(false);
  };

  const deleteAdmin = (id) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  const nouveauxAdmins = admins.filter(a => a.dateAjout === today).length;

  const bgMain = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-blue-200 text-gray-700";
  const tableHead = darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-100 text-indigo-700";
  const tableRowHover = darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50";

  const buttonBaseClasses = `
    relative inline-flex items-center justify-center px-5 py-2 border rounded-full font-semibold
    transition duration-300 ease-in-out cursor-pointer select-none
    focus:outline-none focus:ring-4 focus:ring-indigo-300
  `;

  const buttonVariants = {
    primary: darkMode
      ? "border-indigo-500 text-indigo-400 hover:text-white hover:bg-indigo-600 focus:ring-indigo-500"
      : "border-indigo-600 text-indigo-700 hover:text-white hover:bg-indigo-600 focus:ring-indigo-300",
    neutral: darkMode
      ? "border-gray-500 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-500"
      : "border-gray-400 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-gray-300",
    danger: darkMode
      ? "border-red-500 text-red-400 hover:text-white hover:bg-red-600 focus:ring-red-500"
      : "border-red-600 text-red-700 hover:text-white hover:bg-red-600 focus:ring-red-300"
  };

  return (
    <div className={`min-h-screen pt-24 px-4 md:px-10 transition-all duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-extrabold mb-7 ml-2 md:ml-6">Gestion des comptes Agents</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">

        {/* Filtres */}
        <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 border-blue-200 ${cardBg}`}>
          <h2 className="text-2xl font-semibold text-center mb-6">Filtres</h2>

          <div className="flex flex-col space-y-4">
            {["id", "username", "role", "tel"].map((field) => (
              <label key={field} className="flex flex-col font-medium capitalize">
                {field === "username" ? "Nom d'utilisateur" : 
                 field === "role" ? "Rôle" : 
                 field === "tel" ? "Téléphone" : "ID"}
                <input
                  type={field === "id" ? "number" : "text"}
                  name={field}
                  value={searchValues[field]}
                  onChange={handleChange}
                  placeholder={`Rechercher par ${field === "username" ? "nom d'utilisateur" : 
                               field === "tel" ? "téléphone" : field}`}
                  className={`mt-2 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </label>
            ))}
            <button
              onClick={handleReset}
              className={`${buttonBaseClasses} ${buttonVariants.neutral} mt-4 w-full text-center`}
              aria-label="Réinitialiser les filtres"
            >
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau + Statistiques */}
        <section
          className={`rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh] border-4
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}
        >
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Liste des agents</h2>

            <div className="flex flex-wrap items-center gap-4">

              {/* Statistiques */}
              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg} shadow-md`}>
                <p className="font-medium px-2">Total :</p>
                <p className="text-2xl font-bold">{filteredAdmins.length}</p>
              </div>

              <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg} shadow-md`}>
                <p className="font-medium px-2">Nouveau :</p>
                <p className="text-2xl font-bold">{nouveauxAdmins}</p>
              </div>

              {/* Bouton Voir tous */}
              <button
                onClick={() => {
                  setFilters({ id: "", username: "", role: "", tel: "" });
                  setSearchValues({ id: "", username: "", role: "", tel: "" });
                }}
                className={`${buttonBaseClasses} ${buttonVariants.neutral} shadow-sm`}
                aria-label="Voir tous les administrateurs"
              >
                Voir tous
                <span className="ml-2 text-xl font-bold">→</span>
              </button>

              {/* Bouton Ajout */}
              <button
                onClick={() => setOpenAjout(true)}
                className={`${buttonBaseClasses} ${buttonVariants.primary} shadow-lg`}
                aria-label="Ajouter un administrateur"
              >
                <UserPlus2 className="w-5 h-5 mr-2" />
                Ajout
              </button>

            </div>
          </div>

          <table className="w-full min-w-[600px] border-collapse table-auto">
            <thead className={`${tableHead} sticky top-0 z-10`}>
              <tr>
                {["ID", "Nom d'utilisateur", "Rôle", "Téléphone", "Date d'ajout", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Aucun administrateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className={`${tableRowHover} transition-colors`}
                  >
                    <td className="px-6 py-4 border-b whitespace-nowrap">{admin.id}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{admin.username}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap capitalize">{admin.role}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{admin.tel}</td>
                    <td className="px-6 py-4 border-b whitespace-nowrap">{admin.dateAjout}</td>
                    <td className="px-6 py-1 border-b whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full
                            border transition duration-300
                            ${
                              darkMode
                                ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
                                : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                            }`}
                          aria-label={`Modifier ${admin.username}`}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full
                            border transition duration-300
                            ${
                              darkMode
                                ? "border-red-400 text-red-300 hover:bg-red-400 hover:text-gray-900"
                                : "border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
                            }`}
                          aria-label={`Supprimer ${admin.username}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* Modal d'ajout */}
      {openAjout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-2xl p-6 w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-2xl font-semibold mb-4">Ajouter un administrateur</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Rôle</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={newAdmin.tel}
                  onChange={(e) => setNewAdmin({...newAdmin, tel: e.target.value})}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="034 12 345 67"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Confirmer mot de passe</label>
                <input
                  type="password"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenAjout(false)}
                className={`${buttonBaseClasses} ${buttonVariants.neutral}`}
              >
                Annuler
              </button>
              <button
                onClick={handleAddAdmin}
                className={`${buttonBaseClasses} ${buttonVariants.primary}`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}