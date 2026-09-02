import { createAuditLog } from '../models/auditModel.js';

/**
 * Middleware d'audit log.
 * Intercepte la réponse et enregistre l'action dans audit_logs.
 *
 * Utilisation :
 *   router.post('/route', authenticateToken, auditLog('CREATE', 'visite'), controller);
 *
 * Le middleware attend que le contrôleur s'exécute, puis log si la réponse est un succès (2xx).
 *
 * @param {string} action   - CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
 * @param {string} entityType - visite, visiteur, service, user, auth, etc.
 */
export function auditLog(action, entityType) {
  return (req, res, next) => {
    // On intercepte la méthode json() pour capturer la réponse
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Ne logger que les réponses succès (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Extraire l'ID de l'entité depuis les params, le body ou la réponse
        const entityId =
          req.params?.id ||
          req.params?.idVisite ||
          body?.data?.id ||
          body?.data?.id_visiteur ||
          body?.data?.id_visitelieu ||
          body?.data?.id_visitepersonne ||
          null;

        // Construire les détails
        const details = {};

        // Ajouter le body sans le mot de passe
        if (req.body && Object.keys(req.body).length > 0) {
          const safeBody = { ...req.body };
          delete safeBody.password;
          delete safeBody.confirmPassword;
          details.body = safeBody;
        }

        // Ajouter les params si présents
        if (req.params && Object.keys(req.params).length > 0) {
          details.params = req.params;
        }

        // Info utilisateur depuis req.user (posée par authenticateToken)
        const user = req.user || {};

        createAuditLog({
          userId: user.id || null,
          userName: user.name || null,
          userRole: user.role || null,
          action,
          entityType,
          entityId: entityId ? parseInt(entityId, 10) || null : null,
          details: Object.keys(details).length > 0 ? details : null,
          ipAddress: req.ip || req.connection?.remoteAddress || null,
          userAgent: req.headers['user-agent'] || null,
        });
      }

      return originalJson(body);
    };

    next();
  };
}

/**
 * Fonction utilitaire pour logger une action directement depuis un contrôleur.
 * Utile pour les cas où le middleware ne suffit pas (ex: login, logout).
 *
 * @param {Object} params - Même interface que createAuditLog
 */
export async function logAction(params) {
  await createAuditLog(params);
}
