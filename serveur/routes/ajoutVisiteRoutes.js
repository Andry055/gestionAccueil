import express from 'express';
import { createVisiteController } from '../controllers/ajoutVisiteurController.js';
import { ajoutVisitePersonne } from '../controllers/ajoutVisiteurController.js';
import { visiteterminerControlleur } from '../controllers/ajoutVisiteurController.js';
import { visitePersonneTerminerController } from '../controllers/ajoutVisiteurController.js';
import { updateVisiteurControlleur } from '../controllers/ajoutVisiteurController.js';


const router = express.Router();

router.post('/ajoutVisite', createVisiteController);
router.post('/updateVisiteur', updateVisiteurControlleur);
router.post('/visiteTermine', visiteterminerControlleur);
router.post('/visitePersonne', ajoutVisitePersonne);
router.post('/visitePersonneTerminer', visitePersonneTerminerController);


export default router;
