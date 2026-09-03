import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, CheckCircle, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await api.post('/api/auth/register', { nom, prenom, role, tel, password });
      setShowModal(true);
      setTimeout(() => { setShowModal(false); navigate('/'); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
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
        <div className="absolute -left-12 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <div>
            <div className="text-sm text-blue-100/85">Gestion des Visiteurs</div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Rejoignez la plateforme
          </div>
          <h1 className="text-[3.2rem] font-black leading-[0.95] tracking-[-0.06em]">Ouvrez votre espace de travail en quelques secondes.</h1>
          <p className="mt-6 max-w-lg text-lg text-blue-50/80">Créez un compte et commencez à suivre les visites, les services et les performances de votre organisation.</p>
        </div>

        <div className="relative z-10 text-sm text-blue-100/80">Sécurisé • simple • centralisé</div>
      </div>

      {/* ═══ Right: Form ═══════════════════════════ */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="surface" style={{ borderRadius: 'var(--radius-2xl)', padding: '28px 32px', boxShadow: 'var(--shadow-xl)' }}>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-[var(--shadow-blue)]" style={{ background: 'var(--gradient-blue)' }}>
                <UserPlus className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-[var(--text-primary)]">Inscription</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Créez votre compte</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Nom</label>
                  <input type="text" placeholder="Entrez votre nom" value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Prénom</label>
                  <input type="text" placeholder="Entrez votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Téléphone</label>
                <input type="text" placeholder="Entrez votre téléphone" value={tel} onChange={(e) => setTel(e.target.value)} className="input-field" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Rôle</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingRight: '48px' }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Confirmer le mot de passe</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmez votre mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" style={{ paddingRight: '48px' }} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" style={{ justifyContent: 'center', padding: '14px' }}>
                S&apos;inscrire
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
                <ArrowLeft size={16} /> Retour au login
              </Link>
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
              <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)]">Inscription réussie !</h2>
              <p className="text-[var(--text-secondary)]">Redirection vers la connexion...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
