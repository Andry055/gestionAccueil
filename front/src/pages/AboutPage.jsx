import AuthGuard from '@/components/AuthGuard';
import { motion } from 'framer-motion';
import { Shield, Users, Code, Heart, Tag, Mail } from 'lucide-react';

function AboutContent() {
  const cards = [
    { icon: Shield, title: 'Mission', description: "Développer des solutions logicielles intuitives pour simplifier la gestion des visiteurs et optimiser le suivi au sein de l'organisation.", color: 'blue' },
    { icon: Code, title: 'Technologies', description: 'Construit avec React, Vite, Tailwind CSS, et une API Express.js avec MongoDB pour une expérience moderne et performante.', color: 'purple' },
    { icon: Heart, title: 'Valeurs', description: 'Simplicité, efficacité et fiabilité sont au cœur de chaque fonctionnalité développée pour nos utilisateurs.', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ═══ Hero ═════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl text-white" style={{ background: 'var(--gradient-blue)' }}>
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">Gestion des Visiteurs</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">Application professionnelle de gestion et de suivi des visiteurs</p>
        </motion.div>

        {/* ═══ Cards ════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, idx) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="surface" style={{ padding: '24px' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: card.color === 'blue' ? '#dbeafe' : card.color === 'purple' ? '#f3e8ff' : '#fce4ec' }}>
                <card.icon className="w-6 h-6" style={{ color: card.color === 'blue' ? '#2563eb' : card.color === 'purple' ? '#7c3aed' : '#ef4444' }} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{card.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ═══ Info ═════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface" style={{ padding: '24px' }}>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Informations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><Tag className="w-5 h-5 text-emerald-600" /></div>
              <div><h3 className="font-medium text-[var(--text-primary)]">Version</h3><p className="text-sm text-[var(--text-secondary)]">1.2.0</p><p className="text-xs text-[var(--text-muted)]">Mis à jour le 15 Juin 2024</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[var(--primary-500)]" /></div>
              <div><h3 className="font-medium text-[var(--text-primary)]">Contact</h3><p className="text-sm text-[var(--text-secondary)]">nirinaa070@gmail.com</p><p className="text-sm text-[var(--text-secondary)]">0384710800</p></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutPage() { return <AuthGuard><AboutContent /></AuthGuard>; }
