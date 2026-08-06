'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Bot, User, Loader2, Sparkles,
  LogOut, RefreshCw, ExternalLink,
} from 'lucide-react';

export default function AssistantIA() {
  const { darkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Bonjour ! Je suis votre assistant IA. Posez-moi des questions sur les visites, services, statistiques... Ou demandez-moi de naviguer, vous déconnecter, etc.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Exécuter les actions reçues du backend (sauf logout/refresh qui requirent confirmation)
  const executeActions = useCallback((actions, auto = false) => {
    if (!actions || !Array.isArray(actions)) return;

    actions.forEach((action) => {
      switch (action.type) {
        case 'navigate':
          if (action.path) {
            router.push(action.path);
          }
          break;
        case 'logout':
          // Ne jamais auto-exécuter logout
          if (!auto) {
            logout();
            router.push('/');
          }
          break;
        case 'refresh':
          // Ne jamais auto-exécuter refresh
          if (!auto) {
            router.refresh();
          }
          break;
        default:
          console.warn('Action inconnue:', action.type);
      }
    });
  }, [router, logout]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        message: msg,
        role: user?.role || 'admin',
      });
      const reply = res.data?.reply || 'Désolé, je n\'ai pas pu générer une réponse.';
      const actions = res.data?.actions;

      setMessages((prev) => [...prev, { role: 'assistant', content: reply, actions }]);

      // Auto-exécuter UNIQUEMENT les actions de navigation (pas logout/refresh)
      if (actions && actions.length > 0) {
        const navActions = actions.filter((a) => a.type === 'navigate');
        if (navActions.length > 0) {
          setTimeout(() => executeActions(navActions, true), 2500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.reply || 'Erreur de connexion avec l\'assistant. Veuillez réessayer.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-100';

  const userBubble = 'bg-purple-600 text-white ml-12 rounded-2xl rounded-tr-md';

  const assistantBubble = darkMode
    ? 'bg-gray-700 text-gray-100 mr-12 rounded-2xl rounded-tl-md'
    : 'bg-gray-100 text-gray-800 mr-12 rounded-2xl rounded-tl-md';

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Assistant IA"
      >
        {open ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageSquare size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
          </div>
        )}
      </motion.button>

      {/* Panneau de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] ${cardBg} rounded-2xl shadow-2xl border ${border} overflow-hidden`}
            style={{ maxHeight: 'min(600px, calc(100vh - 160px))' }}
          >
            {/* En-tête */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${border} bg-gradient-to-r from-purple-600/10 to-indigo-600/10`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${textColor}`}>Assistant IA</h3>
                  <p className={`text-xs ${mutedText}`}>Posez vos questions sur l'app</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${mutedText}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Zone des messages */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ height: '380px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20 mt-1">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' ? userBubble : assistantBubble
                    }`}
                  >
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/20 dark:border-gray-600/30">
                        {msg.actions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => executeActions([action])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 transition-all"
                          >
                            {action.type === 'navigate' && <ExternalLink size={12} />}
                            {action.type === 'logout' && <LogOut size={12} />}
                            {action.type === 'refresh' && <RefreshCw size={12} />}
                            {action.type === 'navigate' ? `Aller à ${action.path}` :
                             action.type === 'logout' ? 'Se déconnecter' :
                             action.type === 'refresh' ? 'Actualiser' : action.type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className={`px-4 py-3 ${assistantBubble} flex items-center gap-2`}>
                    <Loader2 size={14} className="animate-spin text-purple-500" />
                    <span className={`text-sm ${mutedText}`}>Réflexion...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className={`border-t ${border} p-3`}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez une question..."
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl ${inputBg} ${textColor} ${border} text-sm outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 disabled:opacity-50 transition-all`}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </div>
              <p className={`text-[10px] ${mutedText} text-center mt-1.5`}>
                Propulsé par <span className="font-semibold text-purple-500">Groq</span> · Réponses basées sur les données en temps réel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
