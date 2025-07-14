import pool from '../db.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const name = req.body.name?.trim();
  const password = req.body.password?.trim();

  console.log("Nom reçu :", name);
  console.log("Mot de passe reçu :", password);

  try {
    // Recherche l'utilisateur par son nom
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Nom incorrect' });
    }

    // Compare le mot de passe saisi avec le mot de passe hashé
    if (password !== user.password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Connexion réussie
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name, // ⚠️ ici tu avais mis `user.password` par erreur !
      },
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
