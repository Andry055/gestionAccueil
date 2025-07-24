// login.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setError("");
      setShowModal(true);

      login(data.name, data.role, data.token);

      setTimeout(() => {
        setShowModal(false);
        if (data.role === "admin") navigate("/home");
        else if (data.role === "superadmin") navigate("/superAdmin_dahsboard");
        else navigate("/");
      }, 2000);
    } else {
      setShowModal(false);
      setError(data.message || "Erreur de connexion");
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
              <h2 className="text-2xl font-bold text-green-600 mb-4">Bienvenue</h2>
              <p className="text-gray-700 mb-4">Connexion réussie, {name} !</p>

              <div className="flex justify-center">
                <CheckCircle size={64} color="#22c55e" strokeWidth={2.5} />
              </div>
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
        <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-4 rounded-full shadow-md" />
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Gestion Visiteur</h1>
        <p className="text-gray-600 mb-6 text-center">Connectez-vous à votre espace</p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrer votre nom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-600 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition rounded-lg text-white font-semibold shadow-md"
          >
            Se connecter
          </button>

          {error && <p className="mt-2 text-red-600 text-center">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">
            S'enregistrer
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
