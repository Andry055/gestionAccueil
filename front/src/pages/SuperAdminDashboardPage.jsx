import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowUpRight,
  ChevronDown,
  Filter,
  TrendingUp,
  Users,
  CircleDollarSign,
} from 'lucide-react';

const fallbackChartData = [
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 18 },
  { month: 'Mar', value: 14 },
  { month: 'Apr', value: 26 },
  { month: 'May', value: 22 },
  { month: 'Jun', value: 32 },
  { month: 'Jul', value: 30 },
];

const pieData = [
  { name: 'Q1', value: 31.3, color: '#1e40af' },
  { name: 'Q2', value: 28.6, color: '#3b82f6' },
  { name: 'Q3', value: 28, color: '#60a5fa' },
  { name: 'Q4', value: 13.1, color: '#93c5fd' },
];

function SuperAdminDashboardContent() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(fallbackChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/visite/mois');
        const data = res.data?.data || [];
        if (Array.isArray(data) && data.length) {
          setChartData(
            data.map((item) => ({
              month: item.nom || item.nom_lieu || item.mois || 'M',
              value: Number(item.nombre_visites || item.visites || item.nb_visites || 0),
            }))
          );
        }
      } catch (error) {
        console.error('Erreur de chargement du dashboard', error);
        setChartData(fallbackChartData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = [
    { label: 'Total Revenue', value: '$24,580', delta: '+12% from last month', variant: 'blue', icon: CircleDollarSign },
    { label: 'Active Users', value: '1,245', delta: '+8% growth', variant: 'dark', icon: Users },
    { label: 'New Signups', value: '320', delta: '+5% this week', variant: 'light', icon: TrendingUp },
    { label: 'Conversion Rate', value: '4.8%', delta: '+1.2% increase', variant: 'dark', icon: ArrowUpRight },
  ];

  return (
    <div className="px-1 pb-12">
      {/* ═══ Header ═══════════════════════════════ */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="page-title" style={{ fontSize: '3.2rem' }}>Dashboard Overview</h1>
          <p className="page-subtitle" style={{ fontSize: '1.05rem', marginTop: '12px' }}>Monitor your business performance in real-time</p>
        </div>
        <div className="flex items-center gap-3 self-end">
          <button className="filter-dropdown">
            <span>This Month</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="btn-primary">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ═══ KPI Cards ════════════════════════════ */}
      <section className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isBlue = metric.variant === 'blue';
          const isDark = metric.variant === 'dark';
          return (
            <div key={metric.label} className={`kpi-card ${isBlue ? 'kpi-card--blue' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="kpi-label">{metric.label}</p>
                  <p className="kpi-value">{metric.value}</p>
                  <p className="kpi-delta">{metric.delta}</p>
                </div>
                <div className={`kpi-icon ${isBlue ? 'kpi-icon--blue' : isDark ? 'kpi-icon--dark' : 'kpi-icon--light'}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ═══ Charts ═══════════════════════════════ */}
      <section className="grid gap-6 xl:grid-cols-[1.8fr_0.9fr]">
        {/* Line chart */}
        <div className="chart-surface">
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">Chargement...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 10 }}>
                  <CartesianGrid stroke="#dfe6ef" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 40]} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={3} dot={{ r: 4, fill: '#1e40af' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="value" stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut */}
        <div className="chart-surface">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[1.05rem] font-medium text-[var(--text-primary)]">Revenue Analytics</h2>
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <div className="h-2 w-2 rounded-full bg-[var(--primary-700)]" />
              <span className="text-sm text-[var(--text-secondary)]">Q1</span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={100} dataKey="value" startAngle={90} endAngle={-270} paddingAngle={0} stroke="transparent">
                    {pieData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[var(--bg-card-secondary)] text-center shadow-inner">
                  <div>
                    <div className="text-[2.4rem] font-black tracking-[-0.08em] text-[var(--text-primary)]">$120</div>
                    <div className="text-sm text-[var(--text-secondary)]">Payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3 text-sm text-[var(--text-primary)]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return <AuthGuard><SuperAdminDashboardContent /></AuthGuard>;
}
