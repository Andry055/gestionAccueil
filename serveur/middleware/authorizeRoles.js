/**
 * Middleware d'autorisation basé sur les rôles.
 * Doit être utilisé APRÈS authenticateToken.
 * @param  {...string} allowedRoles - Rôles autorisés (ex: 'admin', 'superadmin')
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}.`,
      });
    }

    next();
  };
}
