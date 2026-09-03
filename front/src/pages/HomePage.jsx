import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import AuthGuard from '@/components/AuthGuard';
import AjoutVisiteur from '@/components/AjoutVisiteur';
import { exportToPDF, exportToCSV } from '@/utils/exportPDF';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Users, Building2, Clock, Check, ArrowRight, Activity,
  FileText, Download, SquareCheckBig,
  ChevronLeft, ChevronRight, UserPlus, Search,
} from 'lucide-react';

function HomeContent() {
  const { on, off } = useSocket();
  const [visitesLieu, setVisitesLieu] = useState([]);
  const [visitesPersonne, setVisitesPersonne] = useState([]);
  const [stats, setStats] = useState({ totalVisiteurs: 0, totalServices: 0, visitesEnCours: 0 });
  const [loading, setLoading] = useState(true);
  const [ajoutVisiteurOpen, setAjoutVisiteurOpen] = useState(false);
  const [pageEncours, setPageEncours] = useState(0);
  const [pageRecentes, setPageRecentes] = useState(0);
  const [searchEncours, setSearchEncours] = useState('');
  const PER_PAGE = 5;

  const fetchData = useCallback(async () => {
    try {
      const [lieuRes, personneRes, statsRes] = await Promise.all([
        api.get('/visite/listeVisite'),
        api.get('/visite/listeVisitePersonne'),
        api.get('/visite/stats'),
      ]);
      setVisitesLieu(Array.isArray(lieuRes.data?.data) ? lieuRes.data.data : []);
      setVisitesPersonne(Array.isArray(personneRes.data?.data) ? personneRes.data.data : []);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const handleRefresh = () => fetchData();
    on('visite:created', handleRefresh);
    on('visite:terminated', handleRefresh);
    on('visiteur:updated', handleRefresh);
    return () => {
      off('visite:created', handleRefresh);
      off('visite:terminated', handleRefresh);
      off('visiteur:updated', handleRefresh);
    };
  }, [on, off, fetchData]);

  const terminerVisite = async (id, type) => {
    try {
      const endpoint = type === 'personne'
        ? '/visite/visitePersonneTerminer/' + id
        : '/visite/terminerVisite/' + id;
      await api.put(endpoint);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const fmtHeure = (d) => { if (!d) return '-'; return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); };
  const fmtDate = (d) => { if (!d) return '-'; return new Date(d).toLocaleDateString('fr-FR'); };

  const getPageRange = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages = [];
    pages.push(0);
    if (current > 3) pages.push('dots-l');
    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 4) pages.push('dots-r');
    pages.push(total - 1);
    return pages;
  };

  const allVisites = [...visitesLieu, ...visitesPersonne];
  const allVisitesEnCours = allVisites.filter(v => !v.heure_depart);
  const filteredEncours = searchEncours.trim()
    ? allVisitesEnCours.filter(v => {
        const q = searchEncours.toLowerCase();
        const name = `${v.nom || ''} ${v.prenom || ''}`.toLowerCase();
        const lieu = (v.nom_lieu || v.nom_agent || v.personne_visite || '').toLowerCase();
        return name.includes(q) || lieu.includes(q);
      })
    : allVisitesEnCours;
  const allRecentes = allVisites
    .sort((a, b) => new Date(b.date || b.date_p) - new Date(a.date || a.date_p));

  const pagesEncours = Math.max(1, Math.ceil(filteredEncours.length / PER_PAGE));
  const pagesRecentes = Math.max(1, Math.ceil(allRecentes.length / PER_PAGE));
  const visitesEnCours = filteredEncours.slice(pageEncours * PER_PAGE, pageEncours * PER_PAGE + PER_PAGE);
  const recentVisites = allRecentes.slice(pageRecentes * PER_PAGE, pageRecentes * PER_PAGE + PER_PAGE);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-[var(--shadow-blue)]" style={{ background: 'var(--gradient-blue)' }}>
            <Activity className="h-7 w-7" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  /* ── Compact mini-KPI data ── */
  const miniKpis = [
    {
      label: 'Visiteurs',
      value: stats.totalVisiteurs ?? 0,
      icon: Users,
      bg: 'bg-[var(--bg-card-secondary)]',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-[var(--text-primary)]',
      labelColor: 'text-[var(--text-muted)]',
    },
    {
      label: 'Services',
      value: stats.totalServices ?? 0,
      icon: Building2,
      bg: 'bg-[var(--bg-card-secondary)]',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      valueColor: 'text-[var(--text-primary)]',
      labelColor: 'text-[var(--text-muted)]',
    },
    {
      label: 'En cours',
      value: visitesEnCours.length,
      icon: Clock,
      bg: 'bg-[var(--bg-card-secondary)]',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-[var(--text-primary)]',
      labelColor: 'text-[var(--text-muted)]',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="page-container" style={{ paddingTop: '4px', paddingBottom: '16px' }}>

        {/* ═══ Bandeau stats + bouton ════════════════ */}
        <section className="mb-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
          {miniKpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`${kpi.bg} rounded-xl px-4 py-3 flex items-center gap-3 border border-[var(--border-light)] shadow-sm`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-lg font-extrabold leading-tight ${kpi.valueColor}`} style={{ letterSpacing: '-0.03em' }}>
                    {kpi.value}
                  </p>
                  <p className={`text-[11px] font-medium leading-tight ${kpi.labelColor}`}>
                    {kpi.label}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* ── Bouton Nouvelle visite ── */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setAjoutVisiteurOpen(true)}
            className="h-full flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)' }}
          >
            <UserPlus className="h-4.5 w-4.5" />
            Nouvelle visite
          </motion.button>
        </section>

        {/* ═══ Visites en cours + Récentes côte à côte ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-5 mb-6">

        {/* ═══ Visites en cours ═════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="surface"
          >
            <div className="surface-header" style={{ padding: '14px 20px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                  <SquareCheckBig className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                Visites en cours
              </h2>
              <div className="flex items-center gap-2">
                {filteredEncours.length > 0 && (
                  <span className="badge badge--green">
                    {filteredEncours.length}
                  </span>
                )}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Rechercher…"
                    value={searchEncours}
                    onChange={(e) => { setSearchEncours(e.target.value); setPageEncours(0); }}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border-light)] bg-[var(--bg-card-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-emerald-400 w-[140px]"
                  />
                </div>
              </div>
            </div>

            <div style={{ maxHeight: '360px' }} className="overflow-y-auto">
              {visitesEnCours.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--bg-card-secondary)] py-10 text-center mx-3 mb-3">
                  <Check className="mx-auto mb-2 h-8 w-8 text-emerald-300" />
                  <p className="text-sm font-medium text-[var(--text-muted)]">Tout est à jour</p>
                  <p className="text-xs text-[var(--border-light)] mt-0.5">Aucune visite en cours</p>
                </div>
              ) : (
                <div className="p-2.5 space-y-1">
                  {visitesEnCours.map((v) => (
                    <div
                      key={'enc-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--bg-card-secondary)] transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
                          >
                            {(v.nom?.[0] || '?').toUpperCase()}
                          </div>
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                            {v.nom} {v.prenom}
                          </p>
                          <p className="truncate text-[11px] text-[var(--text-muted)]">
                            {v.nom_lieu || v.nom_agent || v.personne_visite || '—'} · {fmtHeure(v.heure_arrivee)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => terminerVisite(v.id_visitelieu || v.id_visitepersonne, v.id_visitepersonne ? 'personne' : 'lieu')}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-sm"
                      >
                        <SquareCheckBig className="h-3.5 w-3.5" />
                        Terminé
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination — Visites en cours */}
            {pagesEncours > 1 && (
              <div className="flex items-center justify-center gap-1 px-4 py-2.5 border-t border-[var(--border-light)]">
                <button
                  onClick={() => setPageEncours(p => Math.max(0, p - 1))}
                  disabled={pageEncours === 0}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {getPageRange(pageEncours, pagesEncours).map((p, idx) =>
                  p === 'dots-l' || p === 'dots-r' ? (
                    <span key={p} className="px-1 text-xs text-[var(--text-muted)]">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPageEncours(p)}
                      className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition-colors ${
                        pageEncours === p
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)]'
                      }`}
                    >
                      {p + 1}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPageEncours(p => Math.min(pagesEncours - 1, p + 1))}
                  disabled={pageEncours === pagesEncours - 1}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </section>

        {/* ═══ Visites récentes ═════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="surface"
        >
          <div className="surface-header">
            <h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-50)]">
                <Clock className="h-4 w-4 text-[var(--primary-500)]" />
              </div>
              Visites récentes
            </h2>
            <Link to="/visite" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Visiteur</th>
                  <th>Date</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Service</th>
                </tr>
              </thead>
              <tbody>
                {recentVisites.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-10 w-10 text-[var(--border-light)]" />
                      <p className="text-sm text-[var(--text-muted)]">Aucune visite récente</p>
                    </div>
                  </td></tr>
                ) : (
                  recentVisites.map((v) => (
                    <tr key={'v-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>
                            {(v.nom?.[0] || '?').toUpperCase()}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">{v.nom} {v.prenom}</span>
                        </div>
                      </td>
                      <td className="text-[var(--text-secondary)]">{fmtDate(v.date || v.date_p)}</td>
                      <td>
                        <span className="badge badge--green">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {fmtHeure(v.heure_arrivee)}
                        </span>
                      </td>
                      <td>
                        {v.heure_depart ? (
                          <span className="text-[var(--text-secondary)]">{fmtHeure(v.heure_depart)}</span>
                        ) : (
                          <span className="badge badge--amber">En cours</span>
                        )}
                      </td>
                      <td>
                        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                          {v.nom_lieu || v.nom_agent || v.personne_visite || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — Visites récentes */}
          {pagesRecentes > 1 && (
            <div className="flex items-center justify-center gap-1 px-4 py-2.5 border-t border-[var(--border-light)]">
              <button
                onClick={() => setPageRecentes(p => Math.max(0, p - 1))}
                disabled={pageRecentes === 0}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPageRange(pageRecentes, pagesRecentes).map((p, idx) =>
                p === 'dots-l' || p === 'dots-r' ? (
                  <span key={p} className="px-1 text-xs text-[var(--text-muted)]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPageRecentes(p)}
                    className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition-colors ${
                      pageRecentes === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)]'
                    }`}
                  >
                    {p + 1}
                  </button>
                )
              )}
              <button
                onClick={() => setPageRecentes(p => Math.min(pagesRecentes - 1, p + 1))}
                disabled={pageRecentes === pagesRecentes - 1}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>

        </div>

        {/* ═══ Footer bar ═══════════════════════════ */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border-light)] bg-white px-4 py-2.5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="pulse-dot" />
            Système actif · temps réel
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { const headers = ['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service']; const rows = recentVisites.map((v) => [`${v.nom} ${v.prenom}`, fmtDate(v.date || v.date_p), fmtHeure(v.heure_arrivee), v.heure_depart ? fmtHeure(v.heure_depart) : 'En cours', v.nom_lieu || v.nom_agent || '-']); exportToPDF({ title: 'Dernières visites', headers, rows, fileName: 'dernieres_visites' }); }}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            >
              <FileText className="h-3.5 w-3.5" /> Export PDF
            </button>
            <button
              onClick={() => { const headers = ['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service']; const rows = recentVisites.map((v) => [`${v.nom} ${v.prenom}`, fmtDate(v.date || v.date_p), fmtHeure(v.heure_arrivee), v.heure_depart ? fmtHeure(v.heure_depart) : 'En cours', v.nom_lieu || v.nom_agent || '-']); exportToCSV({ headers, rows, fileName: 'dernieres_visites' }); }}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <AjoutVisiteur open={ajoutVisiteurOpen} onClose={() => setAjoutVisiteurOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

export default function HomePage() {
  return <AuthGuard><HomeContent /></AuthGuard>;
}
