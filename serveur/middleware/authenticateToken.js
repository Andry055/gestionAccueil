import jwt from 'jsonwebtoken';

/**
 * Middleware d'authentification JWT.
 * Vérifie le token Bearer dans le header Authorization.
 * Si valide, attache les informations utilisateur à req.user.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(403).json({ error: 'Token invalide.' });
  }
}
