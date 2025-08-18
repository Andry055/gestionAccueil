import express from 'express';
import { createVisiteController } from '../controllers/ajoutVisiteurController.js';
import { ajoutVisitePersonne } from '../controllers/ajoutVisiteurController.js';
import { visiteterminerControlleur } from '../controllers/ajoutVisiteurController.js';
import { visitePersonneTerminerController } from '../controllers/ajoutVisiteurController.js';
import { updateVisiteurControlleur } from '../controllers/ajoutVisiteurController.js';
import { updateVisiteLieuControlleur } from '../controllers/ajoutVisiteurController.js';
import { getAllVisiteursController } from '../controllers/ajoutVisiteurController.js';
import { getAllVisiteLieuController } from '../controllers/ajoutVisiteurController.js';
import { AllVisiteLieuControlleur } from '../controllers/ajoutVisiteurController.js';
import { AllVisitePersonneControlleur } from '../controllers/ajoutVisiteurController.js';
import { CountVisiteEncoursControlleur } from '../controllers/ajoutVisiteurController.js';
import { CountVisiteursNowControlleur } from '../controllers/ajoutVisiteurController.js';
import { VisitesForId } from '../controllers/ajoutVisiteurController.js';
import { updateVisitelieuAccueil } from '../controllers/ajoutVisiteurController.js';
import { UpdateVisitePersonneAccueil } from '../controllers/ajoutVisiteurController.js';
import { ChartMoisControlleur } from '../controllers/ajoutVisiteurController.js';
import { ChartSemainesControlleur } from '../controllers/ajoutVisiteurController.js';

const router = express.Router();

router.post('/ajoutVisite', createVisiteController);
router.put('/updateVisiteur/:id', updateVisiteurControlleur);
router.put('/visiteTerminer/:id', visiteterminerControlleur);
router.post('/visitePersonne', ajoutVisitePersonne);
router.put('/visitePersonneTerminer/:id', visitePersonneTerminerController);
router.put('/updateVisiteLieu', updateVisiteLieuControlleur);
router.get('/listeVisiteur', getAllVisiteursController);
router.get('/listeVisite', getAllVisiteLieuController);
router.get('/listeVisiteNotLieu', AllVisiteLieuControlleur);
router.get('/listeVisiteNotPersonne', AllVisitePersonneControlleur);
router.get('/nombreVisiteEncours', CountVisiteEncoursControlleur);
router.get('/nombreVisiteurs', CountVisiteursNowControlleur);
router.get('/visiteParId/:id', VisitesForId);
router.put('/accueil/UpdateVisiteLieu/:id',updateVisitelieuAccueil );
router.put('/accueil/UpdateVisitePersonne/:id',UpdateVisitePersonneAccueil );
router.get('/chartMois', ChartMoisControlleur);
router.get('/chartSemaine', ChartSemainesControlleur);


export default router;
