import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Moon, Sun, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const links = [
    { href: '/home', label: 'Accueil' },
    { href: '/visiteur', label: 'Visiteur' },
    { href: '/service', label: 'Service' },
    { href: '/about', label: 'À propos' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href) => pathname === href;

  return (
    <nav
      className={`sticky top-0 z-50 shadow-md transition-colors duration-200 ${
        darkMode
          ? 'bg-gray-800 text-white border-b border-gray-700'
          : 'bg-white text-gray-800 border-b border-[var(--border-light)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ background: 'var(--gradient-blue)' }}>
              VT
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--primary-500)' }}>
              VisiTrack
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-secondary)]'
                }`}
                style={isActive(link.href) ? { background: 'var(--gradient-blue)' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-[var(--bg-card-secondary)] text-[var(--text-muted)]'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-[var(--text-muted)]">
                  <User size={16} className="inline mr-1" />
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-[var(--bg-card-secondary)]'
              }`}
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 py-3 space-y-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-[var(--border-light)]'}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-secondary)]'
              }`}
              style={isActive(link.href) ? { background: 'var(--gradient-blue)' } : {}}
            >
              {link.label}
            </Link>
          ))}
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-[var(--border-light)]'} pt-2 mt-2`}>
            {user && (
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-[var(--text-muted)]">{user.username}</span>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
