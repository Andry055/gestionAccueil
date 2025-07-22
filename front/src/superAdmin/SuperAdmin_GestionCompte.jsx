import React, { useState } from "react";

const initialAdmins = [
  { id: 1, username: "admin1", role: "admin" },
  { id: 2, username: "admin2", role: "admin" },
];

export default function GestionComptes() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("admin");

  const addAdmin = () => {
    if (!newUsername) return alert("Entrez un nom d'utilisateur");
    const newAdmin = {
      id: Date.now(),
      username: newUsername,
      role: newRole,
    };
    setAdmins([...admins, newAdmin]);
    setNewUsername("");
  };

  const deleteAdmin = (id) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Gestion des comptes Admin</h2>

      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button
          onClick={addAdmin}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nom d'utilisateur</th>
            <th className="border p-2">Rôle</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-100">
              <td className="border p-2">{admin.id}</td>
              <td className="border p-2">{admin.username}</td>
              <td className="border p-2">{admin.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteAdmin(admin.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
