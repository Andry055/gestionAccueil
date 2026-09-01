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

const router = express.Router();

// ─── Lecture (tous rôles authentifiés) ───────────────────
router.get('/listeService', SelectAllServiceControlleur);
router.get('/listeServiceVisiteur', SelectCountVisiteurServiceControlleur);
router.get('/nombreServiceVisite', CountServiceControlleur);
router.get('/listeVisiteur/:id', listeVisiteurServiceNom);
router.get('/topServices', getTopServicesController);
router.get('/listeUsers', SelectAllUsersController);

// ─── Écriture (admin + superadmin uniquement) ────────────
router.post('/ajoutservice', authorizeRoles('admin', 'superadmin'), createServiceControlleur);
router.put('/updateService/:id', authorizeRoles('admin', 'superadmin'), updateServiceController);
router.post('/suprimerService', authorizeRoles('admin', 'superadmin'), DeleteServiceController);
router.put('/updateUser/:id', authorizeRoles('admin', 'superadmin'), UpdateUsersController);
router.delete('/deleteUser/:id', authorizeRoles('admin', 'superadmin'), DelelteUsersControlleur);




export default router;