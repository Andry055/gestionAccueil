import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, MessageSquare, Users, Building2, BarChart3,
  Info, ChevronLeft, ChevronRight, UserPlus,
} from 'lucide-react';

const adminLinks = [
  { href: '/home', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/visiteur', label: 'Visiteurs', icon: Users },
  { href: '/visite', label: 'Visites', icon: MessageSquare },
  { href: '/service', label: 'Services', icon: Building2 },
  { href: '/about', label: 'À propos', icon: Info },
];

const superAdminLinks = [
  { href: '/superAdmin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/superAdmin/utilisateurs', label: 'Utilisateurs', icon: UserPlus },
  { href: '/visiteur', label: 'Visiteurs', icon: Users },
  { href: '/superAdmin/service', label: 'Services', icon: Building2 },
  { href: '/superAdmin/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/about', label: 'À propos', icon: Info },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const role = user?.role;
  const links = role === 'superadmin' ? superAdminLinks : adminLinks;

  const isActive = (href) => pathname === href;

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #1e40af 100%)' }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm leading-tight">VisiTrack</h1>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">Gestion des Visiteurs</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-white/15 text-white shadow-lg shadow-black/20'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  active ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                }`}
              />
              {!collapsed && <span>{link.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/8 hover:text-white/80 transition-all duration-200"
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
