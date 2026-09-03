import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Diamond, Search, ChevronDown, Filter, DollarSign,
  Users, UserPlus, TrendingUp, ArrowUpRight,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const lineData = [
  { month: 'Jan', revenue: 18, users: 22, signups: 10 },
  { month: 'Feb', revenue: 28, users: 18, signups: 15 },
  { month: 'Mar', revenue: 22, users: 35, signups: 20 },
  { month: 'Apr', revenue: 35, users: 30, signups: 25 },
  { month: 'May', revenue: 30, users: 38, signups: 18 },
  { month: 'Jun', revenue: 38, users: 28, signups: 30 },
  { month: 'Jul', revenue: 36, users: 40, signups: 28 },
];

const donutData = [
  { name: 'Q1', value: 13.1, color: '#93C5FD' },
  { name: 'Q2', value: 28.6, color: '#60A5FA' },
  { name: 'Q3', value: 28, color: '#3B82F6' },
  { name: 'Q4', value: 30.3, color: '#2563EB' },
];

const kpiCards = [
  { label: 'Total Revenue', value: '$24,580', change: '+2% from last month', icon: DollarSign, accent: false },
  { label: 'Active Users', value: '1,245', change: '+8% growth', icon: Users, accent: false },
  { label: 'New Signups', value: '320', change: '+5% this week', icon: UserPlus, accent: false },
  { label: 'Conversion Rate', value: '4.8%', change: '+12% increase', icon: TrendingUp, accent: false },
];

export default function SaaSAnalyticsPage() {
  const [period, setPeriod] = useState('This Month');

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="mx-auto max-w-[1280px] px-6 py-8">

        {/* ═══ Title row ════════════════════════════ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Monitor your business performance in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="filter-dropdown">
              {period}
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="btn-primary">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* ═══ KPI Cards ════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="kpi-card kpi-card--blue" style={{ padding: '24px' }}>
            <div className="flex flex-col justify-between" style={{ minHeight: '110px' }}>
              <div className="flex items-start justify-between">
                <p className="kpi-label">{kpiCards[0].label}</p>
                <div className="kpi-icon kpi-icon--blue">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="kpi-value">{kpiCards[0].value}</p>
                <p className="kpi-delta flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {kpiCards[0].change}
                </p>
              </div>
            </div>
          </motion.div>

          {kpiCards.slice(1).map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: (i + 1) * 0.08 }} className="kpi-card">
                <div className="flex flex-col justify-between" style={{ minHeight: '110px' }}>
                  <div className="flex items-start justify-between">
                    <p className="kpi-label">{card.label}</p>
                    <div className="kpi-icon kpi-icon--dark">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="kpi-value">{card.value}</p>
                    <p className="kpi-delta flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      {card.change}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ Charts ═══════════════════════════════ */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Line chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="chart-surface">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">Revenue Trends</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#93C5FD]" />Users</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#BFDBFE]" />Signups</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="users" stroke="#60A5FA" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="signups" stroke="#BFDBFE" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#BFDBFE', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut + Revenue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.28 }} className="chart-surface flex flex-col">
            <h2 className="text-base font-bold text-[var(--text-primary)]">Revenue Analytics</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-2">Quarterly breakdown</p>

            <div className="flex items-center gap-5 mb-4">
              <div>
                <p className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">$120</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Total this period</p>
              </div>
              <button className="btn-primary">Payment</button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {donutData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 13 }} formatter={(v) => `${v}%`} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} formatter={(value) => {
                    const item = donutData.find((d) => d.name === value);
                    return <span className="text-xs text-[var(--text-secondary)]">{value} <span className="font-bold text-[var(--text-primary)]">{item?.value}%</span></span>;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
