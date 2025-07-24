import express from 'express';
import cors from 'cors';
import  dotenv  from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // ✅ Vérifie que ce chemin est correct
import { register } from './controllers/registerController.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de test (GET)
app.get('/', (req, res) => {
  res.send('✅ Serveur backend opérationnel !');
});

// Route API de login
app.use('/api/auth', authRoutes);
app.use('/register', register);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
