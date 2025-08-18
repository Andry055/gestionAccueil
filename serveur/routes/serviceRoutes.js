import express from 'express';
import { createServiceControlleur, SelectAllUsersController } from '../controllers/ajoutServiceControlleur.js';
import { updateServiceController } from '../controllers/ajoutServiceControlleur.js';
import { DeleteServiceController } from '../controllers/ajoutServiceControlleur.js';
import { SelectAllServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { SelectCountVisiteurServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { CountServiceControlleur } from '../controllers/ajoutServiceControlleur.js';
import { listeVisiteurServiceNom } from '../controllers/ajoutServiceControlleur.js';
import { getTopServicesController } from '../controllers/ajoutServiceControlleur.js';
import { UpdateUsersController } from '../controllers/ajoutServiceControlleur.js';
import { DelelteUsersControlleur } from '../controllers/ajoutServiceControlleur.js';

const router = express.Router();

router.post('/ajoutservice', createServiceControlleur);
router.put('/updateService/:id', updateServiceController);
router.post('/suprimerService', DeleteServiceController);
router.get('/listeService', SelectAllServiceControlleur);
router.get('/listeServiceVisiteur', SelectCountVisiteurServiceControlleur);
router.get('/nombreServiceVisite', CountServiceControlleur);
router.get('/listeVisiteur/:id', listeVisiteurServiceNom);
router.get('/topServices', getTopServicesController);
router.get('/listeUsers', SelectAllUsersController);
router.put('/updateUser/:id',UpdateUsersController);
router.delete('/deleteUser/:id', DelelteUsersControlleur);




export default router;