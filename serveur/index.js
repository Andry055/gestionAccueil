import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import visiteRoutes from './routes/ajoutVisiteRoutes.js';
import Service from './routes/serviceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { authenticateToken } from './middleware/authenticateToken.js';
import { authorizeRoles } from './middleware/authorizeRoles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Rendre io accessible dans les controllers via req.app.get('io')
app.set('io', io);

// ─── Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── Routes publiques ────────────────────────────────────
app.get('/', (req, res) => {
  res.send('✅ Serveur backend opérationnel !');
});
app.use('/api/auth', authRoutes);

// ─── Routes protégées (authentification requise) ─────────
app.use('/visite', authenticateToken, visiteRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/service', authenticateToken, Service);

// ─── WebSocket ───────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[WS] Client connecté : ${socket.id}`);

  // Le client rejoint une room par rôle
  socket.on('join', (role) => {
    socket.join(role);
    console.log(`[WS] ${socket.id} a rejoint la room "${role}"`);
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client déconnecté : ${socket.id}`);
  });
});

// Lancement du serveur
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📡 WebSocket actif sur ws://localhost:${PORT}`);
});
