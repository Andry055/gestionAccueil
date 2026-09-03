import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
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
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">

      {/* ═══ Left panel ════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[56%] relative flex-col justify-between overflow-hidden p-12 text-white"
        style={{
          background: 'radial-gradient(circle at top left, rgba(57,98,255,0.28), transparent 30%), linear-gradient(135deg, #0a4f9d 0%, #1e40af 30%, #0f172a 100%)',
        }}
      >
        <div className="absolute -left-10 top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-16 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <div>
            <div className="text-sm text-blue-100/85">Gestion des Visiteurs</div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Plateforme moderne
          </div>
          <h1 className="text-[3.2rem] font-black leading-[0.95] tracking-[-0.06em]">
            Une gestion claire, rapide et sécurisée.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-blue-50/80">
            Centralisez les visites, services et suivi administratif dans une interface pensée pour la performance et la confiance.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-100/80">
          Plateforme de concertation • suivi en temps réel
        </div>
      </div>

      {/* ═══ Right: Form ═══════════════════════════ */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="surface" style={{ borderRadius: 'var(--radius-2xl)', padding: '32px', boxShadow: 'var(--shadow-xl)' }}>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-black tracking-[-0.05em] text-[var(--text-primary)]">Connexion</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Accédez à votre espace sécurisé.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nirina@gmail.com"
                    className="input-field"
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    style={{ paddingLeft: '48px', paddingRight: '48px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition hover:text-[var(--text-secondary)]">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" style={{ justifyContent: 'center', padding: '14px' }}>
                Se connecter
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              Pas encore de compte ?{' '}
              <a href="/register" className="font-semibold text-[var(--primary-500)] hover:text-[var(--primary-700)]">
                Créer un compte
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Success modal ═════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="mx-4 max-w-sm rounded-[var(--radius-2xl)] bg-white p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)]">Bienvenue !</h2>
              <p className="text-[var(--text-secondary)]">Connexion réussie. Redirection...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
