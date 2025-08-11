import express from 'express';
import { createServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { updateServiceController } from '../controllers/ajoutServiceControlleur.js';
import { DeleteServiceController } from '../controllers/ajoutServiceControlleur.js';

const router = express.Router();

router.post('/ajoutservice', createServiceControlleur);
router.post('/updateService', updateServiceController);
router.post('/suprimerService', DeleteServiceController);


export default router;