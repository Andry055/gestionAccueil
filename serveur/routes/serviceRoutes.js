import express from 'express';
import {  SelectAllUsersController } from '../controllers/ajoutServiceControlleur.js';
import { updateServiceController } from '../controllers/ajoutServiceControlleur.js';
import { DeleteServiceController } from '../controllers/ajoutServiceControlleur.js';
import { SelectAllServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { SelectCountVisiteurServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { CountServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { listeVisiteurServiceNom } from '../controllers/ajoutServiceControlleur.js';
import { getTopServicesController } from '../controllers/ajoutServiceControlleur.js';
import { UpdateUsersController } from '../controllers/ajoutServiceControlleur.js';
import { DelelteUsersControlleur } from '../controllers/ajoutServiceControlleur.js';

import { createServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { auditLog } from '../middleware/auditLog.js';
import { getAuditLogs } from '../models/auditModel.js';

const router = express.Router();

// ─── Lecture (tous rôles authentifiés) ───────────────────
router.get('/listeService', SelectAllServiceControlleur);
router.get('/listeServiceVisiteur', SelectCountVisiteurServiceControlleur);
router.get('/nombreServiceVisite', CountServiceControlleur);
router.get('/listeVisiteur/:id', listeVisiteurServiceNom);
router.get('/topServices', getTopServicesController);
router.get('/listeUsers', SelectAllUsersController);

// ─── Audit logs (superadmin uniquement) ──────────────────
router.get('/auditLogs', authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { page, limit, action, entity, userId, dateFrom, dateTo } = req.query;
    const result = await getAuditLogs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      action: action || null,
      entity: entity || null,
      userId: userId ? parseInt(userId, 10) : null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('Erreur audit logs:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
  }
});

// ─── Écriture (admin + superadmin, avec audit) ───────────
router.post('/ajoutservice', authorizeRoles('admin', 'superadmin'), auditLog('CREATE', 'service'), createServiceControlleur);
router.put('/updateService/:id', authorizeRoles('admin', 'superadmin'), auditLog('UPDATE', 'service'), updateServiceController);
router.post('/suprimerService', authorizeRoles('admin', 'superadmin'), auditLog('DELETE', 'service'), DeleteServiceController);
router.put('/updateUser/:id', authorizeRoles('admin', 'superadmin'), auditLog('UPDATE', 'user'), UpdateUsersController);
router.delete('/deleteUser/:id', authorizeRoles('admin', 'superadmin'), auditLog('DELETE', 'user'), DelelteUsersControlleur);




export default router;