import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, Building2, BarChart3,
  Info, UserPlus, CircleUserRound, Search, Menu, X, LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const adminNav = [
  { label: 'Accueil', href: '/home', icon: LayoutDashboard },
  { label: 'Visiteurs', href: '/visiteur', icon: Users },
  { label: 'Visites', href: '/visite', icon: MessageSquare },
  { label: 'Services', href: '/service', icon: Building2 },
  { label: 'À propos', href: '/about', icon: Info },
];

const superAdminNav = [
  { label: 'Dashboard', href: '/superAdmin/dashboard', icon: LayoutDashboard },
  { label: 'Utilisateurs', href: '/superAdmin/utilisateurs', icon: UserPlus },
  { label: 'Visiteurs', href: '/visiteur', icon: Users },
  { label: 'Visites', href: '/visite', icon: MessageSquare },
  { label: 'Services', href: '/superAdmin/service', icon: Building2 },
  { label: 'Statistiques', href: '/superAdmin/statistiques', icon: BarChart3 },
  { label: 'À propos', href: '/about', icon: Info },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainNav = user?.role === 'superadmin' ? superAdminNav : adminNav;

  const isCurrent = (href) => {
    if (href === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(href);
  };

  const initials = user?.prenom
    ? user.prenom.charAt(0).toUpperCase() + (user.username?.charAt(0)?.toUpperCase() || '')
    : user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[var(--bg-page)] px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1360px]">

        {/* ═══ Navbar ═══════════════════════════════ */}
        <header className="navbar">
          <div className="flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <div className="flex items-center gap-3 min-w-[160px]">
              <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
              <span className="hidden sm:block text-sm font-bold tracking-tight text-[var(--text-primary)]">
                VisiTrack
              </span>
            </div>

            {/* ── Center nav (pill tabs) ── */}
            <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white p-1.5 border border-[var(--border-light)]">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`nav-link ${isCurrent(item.href) ? 'active' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* ── Right side ── */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] transition hover:bg-[var(--primary-100)]">
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* User profile */}
              <div className="flex items-center gap-3 rounded-full border border-[var(--border-light)] bg-white px-2 py-1.5 pr-4 shadow-[var(--shadow-sm)]">
                <div className="avatar avatar--lg" style={{ background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' }}>
                  <span className="text-[var(--text-primary)]">{initials}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] text-[var(--text-muted)] leading-tight">Hello!</div>
                  <div className="text-[0.95rem] font-bold text-[var(--text-primary)] leading-tight">
                    {user?.prenom || user?.username || 'Utilisateur'}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <LogOut size={14} />
                Déconnexion
              </button>
            </div>
          </div>

          {/* ── Mobile nav (scrollable pill tabs) ── */}
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                  isCurrent(item.href)
                    ? 'bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-400)] text-white shadow-[var(--shadow-blue)]'
                    : 'bg-white text-[var(--text-secondary)] hover:bg-white/70 border border-[var(--border-light)]'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ═══ Page content ═════════════════════════ */}
        <main className="pt-8">{children}</main>
      </div>
    </div>
  );
}
