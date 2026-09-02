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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl"><Users className="w-10 h-10 text-white" /></div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Gestion des Visiteurs</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Application professionnelle de gestion et de suivi des visiteurs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, idx) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: card.color === 'blue' ? '#dbeafe' : card.color === 'purple' ? '#f3e8ff' : '#fce4ec' }}>
                <card.icon className="w-6 h-6" style={{ color: card.color === 'blue' ? '#2563eb' : card.color === 'purple' ? '#7c3aed' : '#ef4444' }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><Tag className="w-5 h-5 text-green-600" /></div>
                <div><h3 className="font-medium text-gray-900">Version</h3><p className="text-sm text-gray-500">1.2.0</p><p className="text-xs text-gray-400">Mis à jour le 15 Juin 2024</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-blue-600" /></div>
                <div><h3 className="font-medium text-gray-900">Contact</h3><p className="text-sm text-gray-500">nirinaa070@gmail.com</p><p className="text-sm text-gray-500">0384710800</p></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutPage() { return <AuthGuard><AboutContent /></AuthGuard>; }
