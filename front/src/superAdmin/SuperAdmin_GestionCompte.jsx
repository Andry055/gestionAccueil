import React, { useState, useEffect } from "react";
import { Edit2, Trash2, UserPlus2 } from "lucide-react";
import axios from "axios";
import { useDarkMode } from "../utils/DarkModeContext";
import AddUserModal from "./ajoutUsers.JSX";;
import UpdateUserModal from "./updateUsers";

const GestionComptes = () => {
  const { darkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ 
    id: "", 
    nom_accueil: "", 
    prenom_accueil: "",
    role: "", 
    tel: "" 
  });
  const [searchValues, setSearchValues] = useState({ 
    id: "", 
    nom_accueil: "", 
    prenom_accueil: "",
    role: "", 
    tel: "" 
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openAjout, setOpenAjout] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    nom_accueil: "",
    prenom_accueil: "",
    role: "admin",
    tel: "",
    password: "",
    confirmPassword: ""
  });
  const [currentUser, setCurrentUser] = useState({
    id: null,
    nom_accueil: "",
    prenom_accueil: "",
    role: "admin",
    tel: "",
    password: "",
    confirmPassword: ""
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/service/listeUsers");
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setFilters(searchValues), 500);
    return () => clearTimeout(timer);
  }, [searchValues]);

  useEffect(() => {
    const result = users.filter((user) => {
      return (
        (filters.id === "" || user.id === Number(filters.id)) &&
        (filters.nom_accueil === "" || 
          (user.nom_accueil && user.nom_accueil.toLowerCase().includes(filters.nom_accueil.toLowerCase()))) &&
        (filters.prenom_accueil === "" || 
          (user.prenom_accueil && user.prenom_accueil.toLowerCase().includes(filters.prenom_accueil.toLowerCase()))) &&
        (filters.role === "" || 
          (user.role && user.role.toLowerCase().includes(filters.role.toLowerCase()))) &&
        (filters.tel === "" || 
          (user.tel && user.tel.includes(filters.tel)))
      );
    });
    setFilteredUsers(result);
  }, [filters, users]);

  const handleReset = () => {
    setSearchValues({ 
      id: "", 
      nom_accueil: "", 
      prenom_accueil: "",
      role: "", 
      tel: "" 
    });
    setFilters({ 
      id: "", 
      nom_accueil: "", 
      prenom_accueil: "",
      role: "", 
      tel: "" 
    });
  };

  const handleAddUser = (userData) => {
    setUsers([...users, userData]);
    setFilteredUsers([...users, userData]);
    setNewUser({
      nom_accueil: "",
      prenom_accueil: "",
      role: "admin",
      tel: "",
      password: "",
      confirmPassword: ""
    });
    setOpenAjout(false);
  };

  const handleUpdateUser = (updatedUser) => {
    if (updatedUser.password && updatedUser.password !== updatedUser.confirmPassword) {
      return;
    }

    const userToUpdate = {
      ...updatedUser,
      confirmPassword: undefined
    };

    setUsers(users.map(user => 
      user.id === updatedUser.id ? userToUpdate : user
    ));
    setFilteredUsers(filteredUsers.map(user => 
      user.id === updatedUser.id ? userToUpdate : user
    ));
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setOpenDeleteConfirm(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/service/deleteUser/${userToDelete.id}`);
      
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userToDelete.id));
      
      setOpenDeleteConfirm(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Échec de la suppression de l'utilisateur");
    }
  };

  // Styles
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Chargement en cours...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className={`${buttonBaseClasses} ${buttonVariants.primary}`}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl px-6 mx-auto pb-10">
          {/* Section Filtres */}
          <section className={`rounded-xl shadow-lg md:p-8 w-full md:w-1/4 border-4 border-blue-200 ${cardBg}`}>
            <h2 className="text-2xl font-semibold text-center mb-6">Filtres</h2>

            <div className="flex flex-col space-y-4">
              {["id", "nom_accueil", "prenom_accueil", "role", "tel"].map((field) => (
                <label key={field} className="flex flex-col font-medium capitalize">
                  {field === "nom_accueil" ? "Nom" : 
                   field === "prenom_accueil" ? "Prénom" :
                   field === "role" ? "Rôle" : 
                   field === "tel" ? "Téléphone" : "ID"}
                  <input
                    type={field === "id" ? "number" : "text"}
                    name={field}
                    value={searchValues[field]}
                    onChange={handleChange}
                    placeholder={`Rechercher par ${field === "nom_accueil" ? "nom" : 
                                 field === "prenom_accueil" ? "prénom" :
                                 field === "tel" ? "téléphone" : field}`}
                    className={`mt-2 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm
                      ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </label>
              ))}
              <button
                onClick={handleReset}
                className={`${buttonBaseClasses} ${buttonVariants.neutral} mt-4 w-full text-center`}
              >
                Réinitialiser
              </button>
            </div>
          </section>

          {/* Section Tableau */}
          <section className={`rounded-xl shadow-lg p-6 md:p-8 flex-1 overflow-y-auto max-h-[80vh] border-4
            ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-300"}`}>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold">Liste des agents</h2>

              <div className="flex flex-wrap items-center gap-4">
                {/* Statistiques */}
                <div className={`rounded-xl p-3 flex items-center justify-center min-w-[120px] ${cardBg} shadow-md`}>
                  <p className="font-medium px-2">Total :</p>
                  <p className="text-2xl font-bold">{filteredUsers.length}</p>
                </div>

                {/* Bouton Voir tous */}
                <button
                  onClick={handleReset}
                  className={`${buttonBaseClasses} ${buttonVariants.neutral} shadow-sm`}
                >
                  Voir tous
                  <span className="ml-2 text-xl font-bold">→</span>
                </button>

                {/* Bouton Ajout */}
                <button
                  onClick={() => setOpenAjout(true)}
                  className={`${buttonBaseClasses} ${buttonVariants.primary} shadow-lg`}
                >
                  <UserPlus2 className="w-5 h-5 mr-2" />
                  Ajout
                </button>
              </div>
            </div>

            <table className="w-full min-w-[600px] border-collapse table-auto">
              <thead className={`${tableHead} sticky top-0 z-10`}>
                <tr>
                  {["ID", "Nom", "Prénom", "Rôle", "Téléphone", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-3 border-b border-gray-300 text-left font-medium whitespace-nowrap">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={`${tableRowHover} transition-colors`}>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{user.nom_accueil || "-"}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{user.prenom_accueil || "-"}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap capitalize">{user.role || "-"}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap">{user.tel || "-"}</td>
                      <td className="px-6 py-1 border-b whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCurrentUser({
                                ...user,
                                password: "",
                                confirmPassword: ""
                              });
                              setOpenUpdate(true);
                            }}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full border transition duration-300
                              ${darkMode
                                ? "border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-gray-900"
                                : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"}`}
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full border transition duration-300
                              ${darkMode
                                ? "border-red-400 text-red-300 hover:bg-red-400 hover:text-gray-900"
                                : "border-red-600 text-red-700 hover:bg-red-600 hover:text-white"}`}
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
      )}

      {/* Modal d'ajout */}
      <AddUserModal
        isOpen={openAjout}
        onClose={() => setOpenAjout(false)}
        onAddUser={handleAddUser}
        newUser={newUser}
        setNewUser={setNewUser}
      />

      {/* Modal de modification */}
      {currentUser && (
        <UpdateUserModal
          isOpen={openUpdate}
          onClose={() => setOpenUpdate(false)}
          onUpdateUser={handleUpdateUser}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          darkMode={darkMode}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {openDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-2xl p-6 w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.nom_accueil} {userToDelete?.prenom_accueil} ?</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDeleteConfirm(false)}
                className={`${buttonBaseClasses} ${buttonVariants.neutral}`}
              >
                Annuler
              </button>
              <button
                onClick={deleteUser}
                className={`${buttonBaseClasses} ${buttonVariants.danger}`}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionComptes;