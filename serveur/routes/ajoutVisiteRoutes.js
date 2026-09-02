import express from 'express';
import { createVisiteController, getAllVisitePersonneController, SuperChartMoisControlleur, SuperChartSemaineControlleur } from '../controllers/ajoutVisiteurController.js';
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
import { SuperChartJourControlleur } from '../controllers/ajoutVisiteurController.js';
import { getStatsController } from '../controllers/ajoutVisiteurController.js';
import { auditLog } from '../middleware/auditLog.js';


const router = express.Router();

// ─── Écriture (avec audit) ───────────────────────────────
router.post('/ajoutVisite', auditLog('CREATE', 'visite'), createVisiteController);
router.put('/updateVisiteur/:id', auditLog('UPDATE', 'visiteur'), updateVisiteurControlleur);
router.put('/visiteTerminer/:id', auditLog('UPDATE', 'visite'), visiteterminerControlleur);
router.post('/visitePersonne', auditLog('CREATE', 'visite'), ajoutVisitePersonne);
router.put('/visitePersonneTerminer/:id', auditLog('UPDATE', 'visite'), visitePersonneTerminerController);
router.put('/updateVisiteLieu', auditLog('UPDATE', 'visite'), updateVisiteLieuControlleur);
router.put('/accueil/UpdateVisiteLieu/:id', auditLog('UPDATE', 'visite'), updateVisitelieuAccueil);
router.put('/accueil/UpdateVisitePersonne/:id', auditLog('UPDATE', 'visite'), UpdateVisitePersonneAccueil);
router.put('/terminerVisite/:id', auditLog('UPDATE', 'visite'), visiteterminerControlleur);

// ─── Lecture (pas d'audit) ───────────────────────────────
router.get('/listeVisiteur', getAllVisiteursController);
router.get('/listeVisite', getAllVisiteLieuController);
router.get('/listeVisitePersonne', getAllVisitePersonneController);
router.get('/listeVisiteNotLieu', AllVisiteLieuControlleur);
router.get('/listeVisiteNotPersonne', AllVisitePersonneControlleur);
router.get('/nombreVisiteEncours', CountVisiteEncoursControlleur);
router.get('/nombreVisiteurs', CountVisiteursNowControlleur);
router.get('/visiteParId/:id', VisitesForId);
router.get('/chartMois', ChartMoisControlleur);
router.get('/chartSemaine', ChartSemainesControlleur);
router.get('/superChartJour', SuperChartJourControlleur);
router.get('/superChartSemaine', SuperChartSemaineControlleur);
router.get('/superChartMois', SuperChartMoisControlleur);
router.get('/stats', getStatsController);
router.get('/aujourdhui', SuperChartJourControlleur);
router.get('/semaine', SuperChartSemaineControlleur);
router.get('/mois', SuperChartMoisControlleur);
router.get('/custom', SuperChartJourControlleur);

export default router;
