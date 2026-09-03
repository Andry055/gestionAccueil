import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const executeActions = useCallback((actions, auto = false) => {
    if (!actions || !Array.isArray(actions)) return;
    actions.forEach((action) => {
      switch (action.type) {
        case 'navigate': if (action.path) navigate(action.path); break;
        case 'logout': if (!auto) { logout(); navigate('/'); } break;
        case 'refresh': if (!auto) window.location.reload(); break;
        default: console.warn('Action inconnue:', action.type);
      }
    });
  }, [navigate, logout]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/api/ai/chat', { message: msg, role: user?.role || 'admin' });
      const reply = res.data?.reply || 'Désolé, je n\'ai pas pu générer une réponse.';
      const actions = res.data?.actions;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, actions }]);
      if (actions && actions.length > 0) {
        const navActions = actions.filter((a) => a.type === 'navigate');
        if (navActions.length > 0) setTimeout(() => executeActions(navActions, true), 2500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.reply || 'Erreur de connexion avec l\'assistant. Veuillez réessayer.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const cardBg = darkMode ? 'bg-slate-900' : 'bg-[var(--bg-card-secondary)]';
  const textColor = darkMode ? 'text-white' : 'text-[var(--text-primary)]';
  const mutedText = darkMode ? 'text-slate-400' : 'text-[var(--text-muted)]';
  const border = darkMode ? 'border-slate-700' : 'border-[var(--border-light)]';
  const inputBg = darkMode ? 'bg-slate-800' : 'bg-white';

  const userBubble = 'ml-12 rounded-[20px] rounded-tr-md text-white';
  const assistantBubble = darkMode
    ? 'mr-12 rounded-[20px] rounded-tl-md bg-slate-800 text-slate-100'
    : 'mr-12 rounded-[20px] rounded-tl-md bg-white text-[var(--text-secondary)]';

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-xl transition-all duration-300 hover:scale-[1.03]"
        style={{ background: 'var(--gradient-blue)', boxShadow: 'var(--shadow-blue)' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Assistant IA"
      >
        {open ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageSquare size={22} />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border ${border} ${cardBg} shadow-xl`}
            style={{ maxHeight: 'min(620px, calc(100vh - 160px))' }}
          >
            <div className={`flex items-center justify-between border-b ${border} px-5 py-4`} style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(96,165,250,0.04))' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: 'var(--gradient-blue)' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${textColor}`}>Assistant IA</h3>
                  <p className={`text-xs ${mutedText}`}>Vos demandes en un instant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className={`rounded-xl p-1.5 transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-[var(--border-light)]'} ${mutedText}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto p-4" style={{ height: '380px' }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-white shadow-md" style={{ background: 'var(--gradient-blue)' }}>
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? userBubble : assistantBubble}`} style={msg.role === 'user' ? { background: 'var(--gradient-blue)' } : {}}>
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className={`mt-2 flex flex-wrap gap-1.5 border-t ${border} pt-2`}>
                        {msg.actions.map((action, aIdx) => (
                          <button key={aIdx} onClick={() => executeActions([action])} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200">
                            {action.type === 'navigate' && <ExternalLink size={12} />}
                            {action.type === 'logout' && <LogOut size={12} />}
                            {action.type === 'refresh' && <RefreshCw size={12} />}
                            {action.type === 'navigate' ? `Aller à ${action.path}` : action.type === 'logout' ? 'Se déconnecter' : action.type === 'refresh' ? 'Actualiser' : action.type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#334155] shadow-md">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-white shadow-md" style={{ background: 'var(--gradient-blue)' }}>
                    <Bot size={14} />
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-3 ${assistantBubble}`}>
                    <Loader2 size={14} className="animate-spin" style={{ color: 'var(--primary-500)' }} />
                    <span className={`text-sm ${mutedText}`}>Réflexion...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`border-t ${border} p-3`}>
              <div className="flex items-center gap-2">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Posez une question..." disabled={loading}
                  className={`flex-1 rounded-2xl border ${border} ${inputBg} ${textColor} px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--primary-200)] disabled:opacity-50`}
                />
                <motion.button onClick={sendMessage} disabled={loading || !input.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: 'var(--gradient-blue)' }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </div>
              <p className={`mt-2 text-center text-[10px] ${mutedText}`}>
                Propulsé par <span className="font-semibold" style={{ color: 'var(--primary-500)' }}>Groq</span> · Réponses basées sur les données en temps réel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
