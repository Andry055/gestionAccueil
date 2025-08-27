import { findVisitorCin, createVisiteur, createVisiteService, findServiceId, findPersonneId, updateVisiteur, updateVisitelieu, SelectAllVisiteur, SelectAllVisite, SelectAllVisiteNotLieu, SelectAllVisiteNotPersonne, countVisiteEncours, countVisitePersonneEncours, CountVisiteurLieuNow, CountVisiteurPersonneNow, selectAllVisiteForId, selectIdVisiteur, updateVisiteurWithoutCin, updateVisitelieuNom, selectIdVisiteurForVisitePersonne, updateVisitePersonne, updateVisitePersonneNom, chartMois, chartSemaine, SuperChartJour, SuperChartSemaine, SelectAllVisitePersonne } from "../models/visiteModel.js";
import { visiteTerminer, createPersonne , createVisitePersonne , visitePersonneTerminer} from "../models/visiteModel.js";
import { SuperChartMois } from "../models/visiteModel.js";

export async function createVisiteController(req, res) {
    const { nom, prenom, cin,nomAgent, motif, nomService } = req.body; 
    console.log(req.body);
    try {
        // Vérifier si le visiteur existe déjà
        let visiteur = await findVisitorCin(cin);
        
        // Si le visiteur n'existe pas, le créer
        if (!visiteur) {
            visiteur = await createVisiteur(nom, prenom, cin, nomAgent);
        }

        // Trouver le service
        const service = await findServiceId(nomService);
        if (!service) {
            return res.status(404).json({ error: "Service non trouvé" });
        }

        // Créer la visite
        await createVisiteService(
            visiteur.id_visiteur, 
            service.id_lieu, 
            motif
        );

        res.status(201).json({ message: "Visite enregistrée avec succès" });

    } catch(err) { 
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}


export async function updateVisiteurControlleur(req, res) {
    const {id} = req.params;
    const {nom, prenom, cin} = req.body;
    try{
        let visite = await  updateVisiteur(id, nom , prenom , cin);
        res.status(201).json({ message: "Visiteur mise à jour avec succès" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Errer serveur"});
    }
}

export async function updateVisiteLieuControlleur(req, res) {
    const {idVisite,motif, nomLieu} = req.body;
    try{
        let lieu= await findServiceId(nomLieu);
        if (!lieu) {
            return res.status(404).json({ error: "Service non trouvé" });
        }
        let visite = await  updateVisitelieu(idVisite,motif, lieu.id_lieu);
        res.status(201).json({ message: "Visite mise à jour avec succès" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Errer serveur"});
    }
}

export async function visiteterminerControlleur(req, res) {
    const {id} = req.params;
    try{
        let visite = await  visiteTerminer(id);
        res.status(200).json({ message: "Visite terminée avec succès", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Errer serveur"});
    }
}

export async function ajoutVisitePersonne(req, res) {
    const {nom,prenom ,cin, nomAgent, personneVisite}=req.body;
    try{
        let visiteur= await findVisitorCin(cin);
        if (!visiteur) {
            visiteur = await createVisiteur(nom, prenom, cin, nomAgent);
        }
        let agent = await findPersonneId(personneVisite);
        if (!agent){
            agent=await createPersonne(personneVisite);
        }
        
        let visite= await createVisitePersonne(visiteur.id_visiteur, agent.id_agent);
        res.status(201).json({message: "Visite personne enregistrer"});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Erreur serveur sut ajout visite personne"});
    }
}

export async function UpdateVisitePersonneAccueil(req, res) {
    const { id } = req.params;
    const { nom, prenom, personneVisite } = req.body;
    
    // Validation des données d'entrée
    if (!id || !nom || !prenom || !personneVisite) {
        return res.status(400).json({ 
            message: "Tous les champs sont requis (id, nom, prenom, personneVisite)" 
        });
    }

    try {
        // 1. Vérification de l'existence de la visite
        const selectId = await selectIdVisiteurForVisitePersonne(id);
        if (!selectId) {
            return res.status(404).json({ message: "Visite personne non trouvée" });
        }

        // 2. Gestion de l'agent/personne visitée
        let agent = await findPersonneId(personneVisite);
        if (!agent) {
            agent = await createPersonne(personneVisite);
            if (!agent) {
                throw new Error("Échec de la création de la personne visitée");
            }
        }

        // 3. Mise à jour du visiteur
        const visiteur = await updateVisiteurWithoutCin(selectId.id_visiteur, nom, prenom);
        if (!visiteur) {
            throw new Error("Échec de la mise à jour du visiteur");
        }

        // 4. Mise à jour de la visite
        const visite = await updateVisitePersonneNom(id, agent.id_agent);
        if (!visite) {
            throw new Error("Échec de la mise à jour de la visite");
        }

        // Succès
        res.status(200).json({ 
            message: "Visite personne mise à jour avec succès",
            data: {
                visite,
                visiteur,
                personneVisite: agent
            }
        });

    } catch (err) {
        console.error("Erreur dans UpdateVisitePersonneAccueil:", err);
        res.status(500).json({ 
            message: "Erreur serveur lors de la mise à jour de la visite personne",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

export async function visitePersonneTerminerController(req, res) {
    const {id} = req.params;
    try {
        let visite = await  visitePersonneTerminer(id);
        res.status(200).json({ message: "Visite personne terminée avec succès", data: visite });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Errer serveur"});
    }
}

export async function getAllVisiteursController(req, res) {
    try {
        const visiteurs = await SelectAllVisiteur();
        res.status(200).json({ 
            message: "Visiteurs listés avec succès",
            data: visiteurs
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });        
    }
}

export async function getAllVisiteLieuController(req, res) {
    try {
        const visites = await SelectAllVisite();
        res.status(200).json({ 
            message: "Visites listés avec succès",
            data: visites
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });        
    }
}

export async function getAllVisitePersonneController(req, res) {
    try {
        const visites = await SelectAllVisitePersonne();
        res.status(200).json({ 
            message: "Visites listés avec succès",
            data: visites
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });        
    }
}

//Statistique

export async function AllVisitePersonneControlleur(req, res) {
    try{
        const visite= await SelectAllVisiteNotPersonne();
        res.status(200).json({message:"Liste des visite en cours", visite});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur pour Listé les visites personne en cours"});
    }
}

export async function AllVisiteLieuControlleur(req, res) {
    const visitePersonne=false;
    try{
        const visite= await SelectAllVisiteNotLieu();
        res.status(200).json({message:"Liste des visite en cours", visite});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur pour Listé les visites lieu en cours"});
    }
}

export async function CountVisiteEncoursControlleur(req, res) {
    try{
        const nbvisiteLieu= await countVisiteEncours();
        const nbvisitePersonne=await countVisitePersonneEncours();
        const nbVisite=nbvisiteLieu+nbvisitePersonne;
        res.status(200).json({message:"Nombre de visite en cours", nbVisite});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lors de la recuperation du nombre des visite en Cours"});
    }
}

export async function CountVisiteursNowControlleur(req, res) {
    try{
        const nbvisiteLieu= await CountVisiteurLieuNow();
        const nbvisitePersonne=await CountVisiteurPersonneNow();
        const nbVisite=nbvisiteLieu+nbvisitePersonne;
        res.status(200).json({message:"Nombre de visite en cours", nbVisite});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lors de la recuperation du nombre des visite en Cours"});
    }
}
export async function VisitesForId(req, res) {
    const{id}=req.params;
    try{ 
        const visite= await selectAllVisiteForId(id);
        res.status(200).json({message: "Liste de visite par id", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation par id"});
    }
}

export async function updateVisitelieuAccueil(req, res) {
    const{id}=req.params;
    const{nom, prenom, nomLieu}=req.body;
    try{
        const selectId=await selectIdVisiteur(id);
        const lieu=await findServiceId(nomLieu);
        const visiteur=await updateVisiteurWithoutCin(selectId.id_visiteur,nom,prenom)
        const visite= await updateVisitelieuNom(id,lieu.id_lieu);
        res.status(201).json({message: "Update reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation par id"});
    }
}

export async function ChartMoisControlleur(req, res) {
    try{
        const visite= await chartMois();
        res.status(201).json({message: "Donnée chart mois reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation "});
    }
}

export async function ChartSemainesControlleur(req, res) {
    try{
        const visite= await chartSemaine();
        res.status(201).json({message: "Donnée chart semaine reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation "});
    }
}

export async function SuperChartJourControlleur(req, res) {
    try{
        const visite= await SuperChartJour();
        res.status(201).json({message: "Donnée chart jours reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation "});
    }
}
export async function SuperChartSemaineControlleur(req, res) {
    try{
        const visite= await SuperChartSemaine();
        res.status(201).json({message: "Donnée chart semaine reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation "});
    }
}

export async function SuperChartMoisControlleur(req, res) {
    try{
        const visite= await SuperChartMois();
        res.status(201).json({message: "Donnée chart Mois reussi", data: visite});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"problème de recuperation "});
    }
}