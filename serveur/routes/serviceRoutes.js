import express from 'express';
import { createServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { updateServiceController } from '../controllers/ajoutServiceControlleur.js';
import { DeleteServiceController } from '../controllers/ajoutServiceControlleur.js';
import { SelectAllServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { SelectCountVisiteurServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { CountServiceControlleur } from '../controllers/ajoutServiceControlleur.js';

const router = express.Router();

router.post('/ajoutservice', createServiceControlleur);
router.post('/updateService', updateServiceController);
router.post('/suprimerService', DeleteServiceController);
router.get('/listeService', SelectAllServiceControlleur);
router.get('/listeServiceVisiteur', SelectCountVisiteurServiceControlleur);
router.get('/nombreServiceVisite', CountServiceControlleur);



export default router;