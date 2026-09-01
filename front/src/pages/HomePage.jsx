import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import AjoutVisiteur from '@/components/AjoutVisiteur';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, Clock, RefreshCw, Eye, Check, Loader2, TrendingUp, Calendar, ArrowRight, Activity, UserPlus } from 'lucide-react';

function HomeContent() {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
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

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

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

  const bg = darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';
  const card = darkMode ? 'bg-slate-800/90 border-slate-700/50 shadow-xl shadow-black/20' : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50';
  const tc = darkMode ? 'text-white' : 'text-slate-900';
  const mc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const brd = darkMode ? 'border-slate-700/50' : 'border-slate-200/60';
  const hoverCard = darkMode ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50/80';

  const statStyle = (c) => ({
    bg: c === 'blue' ? (darkMode ? 'bg-blue-500/15' : 'bg-blue-50') : c === 'purple' ? (darkMode ? 'bg-purple-500/15' : 'bg-purple-50') : (darkMode ? 'bg-emerald-500/15' : 'bg-emerald-50'),
    ic: c === 'blue' ? '#3b82f6' : c === 'purple' ? '#8b5cf6' : '#10b981',
    from: c === 'blue' ? 'from-blue-600' : c === 'purple' ? 'from-purple-600' : 'from-emerald-600',
    to: c === 'blue' ? 'to-blue-400' : c === 'purple' ? 'to-purple-400' : 'to-emerald-400',
  });

  const recentVisites = [...visitesLieu, ...visitesPersonne]
    .sort((a, b) => new Date(b.date || b.date_p) - new Date(a.date || a.date_p))
    .slice(0, 10);

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/25">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <p className={`text-sm ${mc}`}>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${tc}`}>Tableau de bord</h1>
                <p className={`text-sm ${mc}`}>Bienvenue, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.username || 'utilisateur'}</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAjoutVisiteurOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all text-sm font-medium shadow-lg shadow-emerald-500/30"
              title="Ajouter une visite"
            >
              <UserPlus size={16} /> Nouvelle visite
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/30"
            >
              <RefreshCw size={16} /> Actualiser
            </motion.button>
            <Link to="/visiteur" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${brd} ${tc} text-sm font-medium ${hoverCard} transition-all backdrop-blur-sm`}>
              <Users size={16} /> Visiteurs
            </Link>
            <Link to="/visite" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${brd} ${tc} text-sm font-medium ${hoverCard} transition-all backdrop-blur-sm`}>
              <Clock size={16} /> Visites
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Visiteurs aujourd\'hui', value: stats.totalVisiteurs, icon: Users, color: 'blue' },
            { label: 'Services actifs', value: stats.totalServices, icon: Building2, color: 'purple' },
            { label: 'Visites en cours', value: stats.visitesEnCours, icon: Clock, color: 'green' },
          ].map((s, i) => {
            const ss = statStyle(s.color);
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`${card} rounded-2xl p-6 border backdrop-blur-xl relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ss.from} ${ss.to} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className={`text-sm font-medium ${mc}`}>{s.label}</p>
                    <p className={`text-4xl font-bold ${tc} mt-2`}>{s.value ?? 0}</p>
                    <div className={`mt-2 flex items-center gap-1 text-xs ${mc}`}>
                      <TrendingUp size={12} className={s.color === 'green' ? 'text-emerald-500' : s.color === 'blue' ? 'text-blue-500' : 'text-purple-500'} />
                      <span>En temps réel</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${ss.bg} backdrop-blur-sm`}>
                    <s.icon className="w-7 h-7" style={{ color: ss.ic }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visites en cours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${card} rounded-2xl border backdrop-blur-xl overflow-hidden`}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b ${brd} bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent`}>
              <h2 className={`text-lg font-semibold ${tc} flex items-center gap-2`}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Clock size={16} className="text-white" />
                </div>
                Visites en cours
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                {stats.visitesEnCours} active{stats.visitesEnCours !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="p-4 max-h-[420px] overflow-y-auto custom-scrollbar">
              {recentVisites.filter(v => !v.heure_depart).length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                  <p className={`text-sm font-medium ${tc}`}>Tout est à jour</p>
                  <p className={`text-xs ${mc} mt-1`}>Aucune visite en cours pour le moment</p>
                </div>
              ) : (
                <AnimatePresence>
                  {recentVisites.filter(v => !v.heure_depart).map((v, idx) => (
                    <motion.div
                      key={'act-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl ${hoverCard} transition-all ${brd} border-b last:border-0 group/item`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <Users size={16} className="text-white" />
                          </div>
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${tc}`}>{v.nom} {v.prenom}</p>
                          <p className={`text-xs ${mc} flex items-center gap-1 mt-0.5`}>
                            <Building2 size={10} className="text-emerald-500" />
                            {v.nom_lieu || v.nom_agent || v.personne_visite || 'N/A'}
                            <span className="mx-1">·</span>
                            <Clock size={10} className="text-blue-400" />
                            {fmtHeure(v.heure_arrivee)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => terminerVisite(v.id_visitelieu || v.id_visitepersonne, v.id_visitepersonne ? 'personne' : 'lieu')}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all shadow-md shadow-emerald-500/30 opacity-0 group-hover/item:opacity-100 lg:opacity-100"
                        title="Terminer"
                      >
                        <Check size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${card} rounded-2xl border backdrop-blur-xl overflow-hidden`}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b ${brd} bg-gradient-to-r from-transparent via-purple-500/5 to-transparent`}>
              <h2 className={`text-lg font-semibold ${tc} flex items-center gap-2`}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Building2 size={16} className="text-white" />
                </div>
                Services
              </h2>
              <Link to="/service" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4 max-h-[420px] overflow-y-auto custom-scrollbar">
              {servicesList.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-3">
                    <Building2 size={28} className="text-purple-400" />
                  </div>
                  <p className={`text-sm font-medium ${tc}`}>Aucun service</p>
                  <p className={`text-xs ${mc} mt-1`}>Les services apparaîtront ici une fois ajoutés</p>
                </div>
              ) : (
                servicesList.slice(0, 8).map((s, idx) => (
                  <motion.div
                    key={s.id_lieu}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${hoverCard} transition-all ${brd} border-b last:border-0 group/item`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                        <Building2 size={16} className="text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${tc}`}>{s.nom_lieu}</p>
                        <p className={`text-xs ${mc} flex items-center gap-1 mt-0.5`}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
                          Porte {s.porte || '-'} · Étage {s.etage || '-'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/visiteur?service=${s.id_lieu}`}
                      className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/25 transition-all opacity-0 group-hover/item:opacity-100 lg:opacity-100"
                      title="Ajouter visite"
                    >
                      <Eye size={16} />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Dernières visites */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${card} rounded-2xl border backdrop-blur-xl overflow-hidden`}
        >
          <div className={`flex items-center justify-between px-6 py-4 border-b ${brd} bg-gradient-to-r from-transparent via-blue-500/5 to-transparent`}>
            <h2 className={`text-lg font-semibold ${tc} flex items-center gap-2`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Calendar size={16} className="text-white" />
              </div>
              Dernières visites
            </h2>
            <Link to="/visite" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${brd}`}>
                  {['Visiteur', 'Date', 'Arrivée', 'Départ', 'Service'].map((h) => (
                    <th key={h} className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${mc}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentVisites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar size={32} className="text-slate-300 dark:text-slate-600 mb-2" />
                        <p className={`text-sm ${mc}`}>Aucune visite récente</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {recentVisites.map((v, idx) => (
                      <motion.tr
                        key={'v-' + (v.id_visitelieu || 'p' + v.id_visitepersonne)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`${brd} ${hoverCard} transition-colors border-b last:border-0`}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {(v.nom?.[0] || '?').toUpperCase()}
                            </div>
                            <span className={`font-medium ${tc}`}>{v.nom} {v.prenom}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-3.5 ${mc}`}>{fmtDate(v.date || v.date_p)}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {fmtHeure(v.heure_arrivee)}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {v.heure_depart ? (
                            <span className={`text-sm ${mc}`}>{fmtHeure(v.heure_depart)}</span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-500/20">
                              En cours
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-3.5 ${tc}`}>
                          <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-blue-500" />
                            {v.nom_lieu || v.nom_agent || v.personne_visite || '-'}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modal Ajout Visiteur */}
      <AjoutVisiteur open={ajoutVisiteurOpen} onClose={() => setAjoutVisiteurOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

export default function HomePage() {
  return <AuthGuard><HomeContent /></AuthGuard>;
}
