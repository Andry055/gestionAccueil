import Groq from 'groq-sdk';
import {
  CountVisiteurLieuNow, CountVisiteurPersonneNow,
  countVisiteEncours, countVisitePersonneEncours,
  CountServiceNow,
} from '../models/visiteModel.js';
import { SelectAllService, getTopServices, CountVisiteurService } from '../models/lieuModel.js';
import { SelectAllUsers } from '../models/userModel.js';

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const ALLOWED_ROUTES = {
  admin: ['/home', '/visiteur', '/visite', '/service', '/about'],
  superadmin: [
    '/superAdmin/dashboard', '/superAdmin/utilisateurs',
    '/visiteur', '/visite', '/superAdmin/service',
    '/superAdmin/statistiques', '/about',
  ],
};

function validerActions(actions, role) {
  if (!Array.isArray(actions)) return [];
  const routesAutorisees = ALLOWED_ROUTES[role] || ALLOWED_ROUTES.admin;
  return actions.filter((a) => {
    switch (a.type) {
      case 'navigate':
        return a.path && routesAutorisees.includes(a.path) && !a.path.includes('://');
      case 'logout':
      case 'refresh':
        return true;
      default:
        return false;
    }
  });
}

function extraireActions(reponse) {
  const matchs = [];
  const regex1 = /<actions>([\s\S]*?)<\/actions>/g;
  let m;
  while ((m = regex1.exec(reponse)) !== null) {
    try { const p = JSON.parse(m[1].trim()); if (Array.isArray(p)) matchs.push(...p); } catch {}
  }
  return matchs;
}

// Détection par mots-clés (fallback si l'IA n'a pas généré le tag <actions>)
function detecterActionsParMotsCles(message) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Logout
  if (/deconnecte|deconnexion|log ?out|quitter/.test(msg)) {
    return [{ type: 'logout' }];
  }

  // Refresh
  if (/actualise|rafraich|refresh|recharge/.test(msg)) {
    return [{ type: 'refresh' }];
  }

  // Navigation - détection de la page demandée
  const navKeywords = /(?:va|vas|navigue|ouvre|affiche|montre|page)(?:\s+(?:sur|vers|a|moi|nous))?/i;
  if (navKeywords.test(msg)) {
    const pages = [
      { mots: [/statistiques?/, /stats/, /graphique/], path: '/superAdmin/statistiques' },
      { mots: [/accueil/, /dashboard/, /tableau de bord/, /home/], path: '/superAdmin/dashboard' },
      { mots: [/utilisateurs?/, /comptes?/, /users?/], path: '/superAdmin/utilisateurs' },
      { mots: [/services?/], path: '/superAdmin/service' },
      { mots: [/visiteurs?/], path: '/visiteur' },
      { mots: [/visites?/], path: '/visite' },
      { mots: [/a propos/, /about/, /info/], path: '/about' },
    ];

    for (const page of pages) {
      if (page.mots.some(re => re.test(msg))) {
        return [{ type: 'navigate', path: page.path }];
      }
    }
  }

  return [];
}

export async function chatController(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message requis' });

  const groq = getGroqClient();
  if (!groq) {
    return res.status(503).json({
      error: 'Clé API Groq non configurée',
      reply: "⚠️ L'assistant IA n'est pas encore configuré. L'administrateur doit ajouter une clé API Groq dans le fichier .env du serveur.",
    });
  }

  try {
    const [visiteursLieu, visiteursPersonne, visitesEncoursLieu, visitesEncoursPersonne, servicesCount, services, topServices, statsServices, users] = await Promise.all([
      CountVisiteurLieuNow(), CountVisiteurPersonneNow(),
      countVisiteEncours(), countVisitePersonneEncours(),
      CountServiceNow(), SelectAllService(),
      getTopServices(), CountVisiteurService(),
      SelectAllUsers(),
    ]);

    const appData = {
      stats: {
        visiteurs_aujourdhui: (visiteursLieu || 0) + (visiteursPersonne || 0),
        visites_en_cours: (visitesEncoursLieu || 0) + (visitesEncoursPersonne || 0),
        services_visites_aujourdhui: servicesCount || 0,
        total_services: Array.isArray(services) ? services.length : 0,
        total_utilisateurs: Array.isArray(users) ? users.length : 0,
      },
      top_services: Array.isArray(topServices) ? topServices.map(s => ({ nom: s.nom_lieu, visites: s.visites || 0 })) : [],
      services: Array.isArray(services) ? services.map(s => ({ id: s.id_lieu, nom: s.nom_lieu, porte: s.porte, etage: s.etage })) : [],
    };

    const userRole = req.body.role || 'admin';
    const routesDisponibles = ALLOWED_ROUTES[userRole] || ALLOWED_ROUTES.admin;

    const systemPrompt = `Tu es un assistant IA dans l'app VisiTrack (gestion de visiteurs). Réponds en français, concis.

DONNÉES : ${JSON.stringify(appData, null, 2)}
RÔLE : ${userRole}
PAGES : ${routesDisponibles.join(', ')}

RÈGLE ACTIONS — SI l'utilisateur utilise des mots comme : "va sur", "va à", "va vers", "navigue", "ouvre", "affiche la page", "page de", "vas-y"
ALORS tu DOIS terminer ta réponse par EXACTEMENT le tag <actions>[{"type":"navigate","path":"/chemin"}]</actions>

Si déconnexion demandée : <actions>[{"type":"logout"}]</actions>
Si actualisation demandée : <actions>[{"type":"refresh"}]</actions>

EXEMPLES OBLIGATOIRES :
"va sur les statistiques" → "Je vous emmène voir les statistiques.<actions>[{\"type\":\"navigate\",\"path\":\"/superAdmin/statistiques\"}]</actions>"
"affiche les visiteurs" → "Voici la page des visiteurs.<actions>[{\"type\":\"navigate\",\"path\":\"/visiteur\"}]</actions>"
"déconnecte-moi" → "Au revoir !<actions>[{\"type\":\"logout\"}]</actions>"
"actualise" → "Je rafraîchis.<actions>[{\"type\":\"refresh\"}]</actions>"

Si l'utilisateur pose une QUESTION normale (sans demande d'action), réponds normalement SANS le tag actions.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 1024,
    });

    const fullResponse = completion.choices[0]?.message?.content || '';
    // Essayer d'abord de détecter les actions par mots-clés (plus fiable)
    let actionsDetectees = detecterActionsParMotsCles(message);
    console.log('[AI] Keyword detection result:', JSON.stringify(actionsDetectees));
    // Sinon, essayer d'extraire depuis la réponse de l'IA
    if (actionsDetectees.length === 0) {
      actionsDetectees = extraireActions(fullResponse);
      console.log('[AI] AI extraction result:', JSON.stringify(actionsDetectees));
    }
    const actionsValides = validerActions(actionsDetectees, userRole);
    console.log('[AI] Validated actions:', JSON.stringify(actionsValides));
    const reply = fullResponse
      .replace(/<actions>[\s\S]*?<\/actions>/g, '')
      .replace(/```(?:json)?\s*<actions>[\s\S]*?<\/actions>\s*```/g, '')
      .trim();

    res.json({
      reply: reply || 'Désolé, je n\'ai pas pu générer une réponse.',
      actions: actionsValides.length > 0 ? actionsValides : undefined,
      appData,
    });

  } catch (err) {
    console.error('Erreur AI Controller:', err);
    if (err.status === 401 || err.message?.includes('API key')) {
      return res.status(503).json({
        error: 'Clé API Groq non configurée',
        reply: "⚠️ L'assistant IA n'est pas encore configuré. L'administrateur doit ajouter une clé API Groq dans le fichier .env du serveur.",
      });
    }
    res.status(500).json({
      error: 'Erreur lors de la communication avec l\'assistant IA',
      reply: 'Désolé, une erreur est survenue. Veuillez réessayer.',
    });
  }
}
