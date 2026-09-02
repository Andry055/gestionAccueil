import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import AuthGuard from '@/components/AuthGuard';
import AjoutVisiteur from '@/components/AjoutVisiteur';
import { exportToPDF, exportToCSV } from '@/utils/exportPDF';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Clock, RefreshCw, Check, Loader2,
  TrendingUp, ArrowRight, Activity, UserPlus, Wifi, WifiOff,
  FileText, Download,
} from 'lucide-react';

function HomeContent() {
  const { user } = useAuth();
  const { connected, on, off } = useSocket();
  const [visitesLieu, setVisitesLieu] = useState([]);
  const [visitesPersonne, setVisitesPersonne] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [stats, setStats] = useState({ totalVisiteurs: 0, totalServices: 0, visitesEnCours: 0 });
  const [loading, setLoading] = useState(true);
  const [ajoutVisiteurOpen, setAjoutVisiteurOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [lieuRes, personneRes, servicesRes, statsRes] = await Promise.all([
        api.get('/visite/listeVisite'),
        api.get('/visite/listeVisitePersonne'),
        api.get('/service/listeService'),
        api.get('/visite/stats'),
      ]);
      setVisitesLieu(Array.isArray(lieuRes.data?.data) ? lieuRes.data.data : []);
      setVisitesPersonne(Array.isArray(personneRes.data?.data) ? personneRes.data.data : []);
      setServicesList(Array.isArray(servicesRes.data?.data) ? servicesRes.data.data : []);
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
    on('service:created', handleRefresh);
    on('service:updated', handleRefresh);
    on('service:deleted', handleRefresh);
    return () => {
      off('visite:created', handleRefresh);
      off('visite:terminated', handleRefresh);
      off('visiteur:updated', handleRefresh);
      off('service:created', handleRefresh);
      off('service:updated', handleRefresh);
      off('service:deleted', handleRefresh);
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

  const recentVisites = [...visitesLieu, ...visitesPersonne]
    .sort((a, b) => new Date(b.date || b.date_p) - new Date(a.date || a.date_p))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center animate-pulse shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <p className="text-sm text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Visiteurs aujourd\'hui',
      value: stats.totalVisiteurs ?? 0,
      icon: Users,
      color: 'blue',
      bgClass: 'bg-blue-50',
      iconClass: 'text-blue-600',
      subtext: 'Toutes directions',
    },
    {
      label: 'Services actifs',
      value: stats.totalServices ?? 0,
      icon: Building2,
      color: 'purple',
      bgClass: 'bg-purple-50',
      iconClass: 'text-purple-600',
      subtext: 'Enregistrés',
    },
    {
      label: 'Visites en cours',
      value: stats.visitesEnCours ?? 0,
      icon: Clock,
      color: 'green',
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-600',
      subtext: 'En attente',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Nouvelle visite card - matches reference image exactly */}
          <div
            className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg cursor-pointer flex flex-col items-center text-center min-h-[220px]"
            style={{
              background: 'linear-gradient(180deg, #1a237e 0%, #283593 60%, #3949ab 100%)',
            }}
            onClick={() => setAjoutVisiteurOpen(true)}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
              <FileText size={24} className="text-white" />
            </div>
            <p className="text-sm font-semibold leading-snug mb-4">Cliquer ici pour<br />enregistrer une<br />nouvelle visite</p>
            <div className="mt-auto">
              <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors backdrop-blur-sm">
                Commencer <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* Stat cards */}
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${s.bgClass} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.iconClass}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.subtext}</p>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active visits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-1"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Clock size={14} className="text-emerald-600" />
                </div>
                Visites en cours
              </h2>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {stats.visitesEnCours} active{stats.visitesEnCours !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="p-4 max-h-[360px] overflow-y-auto">
              {recentVisites.filter(v => !v.heure_depart).length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <Check size={20} className="text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Tout est à jour</p>
                  <p className="text-xs text-gray-400 mt-1">Aucune visite en cours</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentVisites.filter(v => !v.heure_depart).map((v) => (
                    <div
                      key={'act-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-sm">
                            <Users size={14} className="text-white" />
                          </div>
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{v.nom} {v.prenom}</p>
                          <p className="text-xs text-gray-500">
                            {v.nom_lieu || v.nom_agent || '-'} · {fmtHeure(v.heure_arrivee)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => terminerVisite(v.id_visitelieu || v.id_visitepersonne, v.id_visitepersonne ? 'personne' : 'lieu')}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Terminer"
                      >
                        <Check size={14} />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Building2 size={14} className="text-purple-600" />
                </div>
                Services
              </h2>
              <Link to="/service" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
            <div className="p-4">
              {servicesList.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                    <Building2 size={20} className="text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Aucun service</p>
                  <p className="text-xs text-gray-400 mt-1">Les services apparaîtront ici</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.slice(0, 6).map((s) => (
                    <div
                      key={s.id_lieu}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-sm flex-shrink-0">
                        <Building2 size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{s.nom_lieu}</p>
                        <p className="text-xs text-gray-500">
                          Porte {s.porte || '-'} · Étage {s.etage || '-'}
                        </p>
                      </div>
                      <Link
                        to={`/visiteur?service=${s.id_lieu}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent visits table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={14} className="text-blue-600" />
              </div>
              Dernières visites
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const headers = ['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service'];
                  const rows = recentVisites.map(v => [`${v.nom} ${v.prenom}`, fmtDate(v.date || v.date_p), fmtHeure(v.heure_arrivee), v.heure_depart ? fmtHeure(v.heure_depart) : 'En cours', v.nom_lieu || v.nom_agent || '-']);
                  exportToPDF({ title: 'Dernières visites', headers, rows, fileName: 'dernieres_visites' });
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Exporter PDF"
              >
                <FileText size={16} />
              </button>
              <button
                onClick={() => {
                  const headers = ['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service'];
                  const rows = recentVisites.map(v => [`${v.nom} ${v.prenom}`, fmtDate(v.date || v.date_p), fmtHeure(v.heure_arrivee), v.heure_depart ? fmtHeure(v.heure_depart) : 'En cours', v.nom_lieu || v.nom_agent || '-']);
                  exportToCSV({ headers, rows, fileName: 'dernieres_visites' });
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                title="Exporter CSV"
              >
                <Download size={16} />
              </button>
              <Link to="/visite" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentVisites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Clock size={28} className="text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">Aucune visite récente</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentVisites.map((v) => (
                    <tr
                      key={'v-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {(v.nom?.[0] || '?').toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{v.nom} {v.prenom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{fmtDate(v.date || v.date_p)}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {fmtHeure(v.heure_arrivee)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {v.heure_depart ? (
                          <span className="text-sm text-gray-500">{fmtHeure(v.heure_depart)}</span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                            En cours
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Building2 size={14} className="text-blue-500" />
                          {v.nom_lieu || v.nom_agent || v.personne_visite || '-'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <AjoutVisiteur open={ajoutVisiteurOpen} onClose={() => setAjoutVisiteurOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

export default function HomePage() {
  return <AuthGuard><HomeContent /></AuthGuard>;
}
