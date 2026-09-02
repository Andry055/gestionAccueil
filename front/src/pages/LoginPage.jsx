import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, Mail, Lock, Shield, Info } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', { name: email, password });
      const { username, prenom, role, token, tel } = response.data;
      login(username, prenom, role, token, tel);
      localStorage.setItem('userRole', role);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        if (role === 'admin') navigate('/home');
        else if (role === 'superadmin') navigate('/superAdmin/dashboard');
        else navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient background */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1a3e 0%, #162052 40%, #1e2d6b 70%, #3a2d6b 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-400 blur-3xl" />
        </div>

        {/* Logo and brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Gestion des Avis</h1>
              <p className="text-white/60 text-sm">Plateforme de concertation nationale</p>
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            La concertation nationale, centralisée et suivie en un seul endroit.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Collectez, consolidez et analysez les avis des directions régionales dans un espace unique,
            sécurisé et conforme aux exigences du Ministère.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/40 text-sm">
            Plateforme de concertation nationale — Volet Fonction Publique
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-lg">Gestion des Avis</h1>
              <p className="text-gray-500 text-xs">Plateforme de concertation</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Accédez à votre espace de travail sécurisé.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email professionnel <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="nirina@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] text-sm"
                style={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                }}
              >
                Se connecter
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Pas encore de compte ?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Créer un compte
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                <Info size={14} />
                À propos de la plateforme
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Bienvenue !</h2>
              <p className="text-gray-500">Connexion réussie. Redirection...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
