import express from 'express';
import cors from 'cors';
import  dotenv  from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 
import { register } from './controllers/registerController.js';
import visiteRoutes from './routes/ajoutVisiteRoutes.js';
import Service from './routes/serviceRoutes.js'

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

// Route API
app.use('/service',Service);
app.use('/visite', visiteRoutes);
app.use('/api/auth', authRoutes);
app.use('/register', register);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
