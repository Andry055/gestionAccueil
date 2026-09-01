import express from 'express';
import cors from 'cors';
import  dotenv  from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 
import visiteRoutes from './routes/ajoutVisiteRoutes.js';
import Service from './routes/serviceRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { authenticateToken } from './middleware/authenticateToken.js';
import { authorizeRoles } from './middleware/authorizeRoles.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
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

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
