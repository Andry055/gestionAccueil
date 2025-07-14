import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Nom :", name);
    console.log("Mot de passe :", password);

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`Bienvenue ${data.user.name}`);
      setTimeout(() => {
        navigate("/home");
      }, 1000); // redirection après une petite pause
    } else {
      setMessage(data.message || "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-sky-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-300 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 tracking-tight">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrer votre nom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-blue-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition rounded-lg text-white font-semibold shadow-md"
          >
            Sign In
          </button>

          {message && <p className="mt-2 text-red-600 text-center">{message}</p>}
        </form>

        <p className="text-gray-600 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
