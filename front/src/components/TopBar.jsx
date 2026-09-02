import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  LogOut, Moon, Sun, Bell, Info, Clock,
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

  // Get the page title from the current route
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
      className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
      }`}
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">{getPageTitle()}</h2>
      </div>

      {/* Right: User actions */}
      <div className="flex items-center gap-3">
        {/* User profile */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {user?.prenom || ''} {user?.username || 'Utilisateur'}
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">
              {user?.role === 'superadmin' ? 'Super Admin' : 'Administrateur'}
            </p>
          </div>
        </div>

        {/* Notification bell */}
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
          <Bell size={18} />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Info */}
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
          <Info size={18} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
