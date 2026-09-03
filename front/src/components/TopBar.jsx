import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  LogOut, Moon, Sun, Bell, Info,
} from 'lucide-react';

export default function TopBar({ sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard') || path === '/home') return 'Tableau de bord';
    if (path.includes('visiteur')) return 'Visiteurs';
    if (path.includes('visite')) return 'Visites';
    if (path.includes('service')) return 'Services';
    if (path.includes('statistiques')) return 'Statistiques';
    if (path.includes('utilisateurs')) return 'Utilisateurs';
    if (path.includes('about')) return 'À propos';
    return 'Tableau de bord';
  };

  const initials = user?.prenom
    ? user.prenom.charAt(0).toUpperCase() + (user.username?.charAt(0)?.toUpperCase() || '')
    : user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 bg-white border-b border-[var(--border-light)] transition-all duration-300 ${
        sidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-blue)' }} />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card-secondary)] border border-[var(--border-light)]">
          <div className="avatar avatar--sm" style={{ background: 'var(--gradient-blue)' }}>
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
              {user?.prenom || ''} {user?.username || 'Utilisateur'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
              {user?.role === 'superadmin' ? 'Super Admin' : 'Administrateur'}
            </p>
          </div>
        </div>

        <button className="p-2 rounded-xl hover:bg-[var(--bg-card-secondary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          <Bell size={18} />
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-[var(--bg-card-secondary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-xl hover:bg-[var(--bg-card-secondary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          <Info size={18} />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border-light)] text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
