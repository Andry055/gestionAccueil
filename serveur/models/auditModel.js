import pool from '../db.js';

/**
 * Enregistre une action dans le journal d'audit.
 *
 * @param {Object} params
 * @param {number|null}  params.userId     - ID de l'utilisateur (null si non authentifié)
 * @param {string|null}  params.userName   - Nom de l'utilisateur
 * @param {string|null}  params.userRole   - Rôle de l'utilisateur
 * @param {string}       params.action     - CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
 * @param {string}       params.entityType - visite, visiteur, service, user, auth, etc.
 * @param {number|null}  params.entityId   - ID de l'entité concernée
 * @param {Object|null}  params.details    - Métadonnées supplémentaires (JSON)
 * @param {string|null}  params.ipAddress  - Adresse IP du client
 * @param {string|null}  params.userAgent  - User-Agent du client
 */
export async function createAuditLog({
  userId = null,
  userName = null,
  userRole = null,
  action,
  entityType,
  entityId = null,
  details = null,
  ipAddress = null,
  userAgent = null,
}) {
  try {
    await pool.query(
      `INSERT INTO audit_logs
         (user_id, user_name, user_role, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        userName,
        userRole,
        action,
        entityType,
        entityId,
        details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      ]
    );
  } catch (err) {
    // Ne pas faire échouer la requête principale si l'audit échoue
    console.error('[AUDIT] Erreur enregistrement log:', err.message);
  }
}

/**
 * Récupère les logs d'audit avec pagination et filtres.
 *
 * @param {Object} params
 * @param {number}  params.page     - Numéro de page (défaut: 1)
 * @param {number}  params.limit    - Nombre par page (défaut: 50)
 * @param {string}  params.action   - Filtrer par action
 * @param {string}  params.entity   - Filtrer par type d'entité
 * @param {number}  params.userId   - Filtrer par utilisateur
 * @param {string}  params.dateFrom - Date début (YYYY-MM-DD)
 * @param {string}  params.dateTo   - Date fin (YYYY-MM-DD)
 */
export async function getAuditLogs({
  page = 1,
  limit = 50,
  action = null,
  entity = null,
  userId = null,
  dateFrom = null,
  dateTo = null,
} = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (action) {
    conditions.push(`action = $${idx++}`);
    values.push(action);
  }
  if (entity) {
    conditions.push(`entity_type = $${idx++}`);
    values.push(entity);
  }
  if (userId) {
    conditions.push(`user_id = $${idx++}`);
    values.push(userId);
  }
  if (dateFrom) {
    conditions.push(`created_at >= $${idx++}`);
    values.push(dateFrom);
  }
  if (dateTo) {
    conditions.push(`created_at <= $${idx++}`);
    values.push(dateTo + ' 23:59:59');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM audit_logs ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query(
    `SELECT * FROM audit_logs ${where}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
