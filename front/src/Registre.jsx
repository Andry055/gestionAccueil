import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin"); // par défaut admin
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      setError("Erreur réseau, veuillez réessayer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-500 to-blue-300 flex items-center justify-center p-4 relative">
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-700/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">Succès !</h2>
              <p className="text-gray-700 mb-4">
                {role === "superadmin"
                  ? "Super Admin créé avec succès."
                  : "Admin créé avec succès."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-gray-100 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight text-center">
          Créer un compte
        </h2>

        <form onSubmit={handleRegister} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrer votre nom"
              required
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créer un mot de passe"
              required
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 hover:bg-green-600 transition rounded-lg text-white font-semibold shadow-md"
          >
            Créer le compte
          </button>

          {error && <p className="mt-2 text-red-600 text-center">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-500 hover:underline">
            Retour au Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
