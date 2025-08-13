import { findVisitorCin, createVisiteur, createVisiteService, findServiceId, findPersonneId, updateVisiteur, updateVisitelieu, SelectAllVisiteur, SelectAllVisite, SelectAllVisiteNotLieu, SelectAllVisiteNotPersonne, countVisiteEncours, countVisitePersonneEncours, CountVisiteurLieuNow, CountVisiteurPersonneNow } from "../models/visiteModel.js";
import { visiteTerminer, createPersonne , createVisitePersonne , visitePersonneTerminer} from "../models/visiteModel.js";

export async function createVisiteController(req, res) {
    const { nom, prenom, cin,nomAgent, motif, nomService } = req.body; 

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
    const {idVisite,nom, prenom, cin} = req.body;
    try{
        let visite = await  updateVisiteur(idVisite, nom , prenom , cin);
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
    const {idVisite} = req.body;
    try{
        let visite = await  visiteTerminer(idVisite);
        res.status(201).json({ message: "Visite terminée avec succès" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Errer serveur"});
    }
}

export async function ajoutVisitePersonne(req, res) {
    const {nom,prenom ,cin, nomAgent, nomPersonne}=req.body;
    try{
        let visiteur= await findVisitorCin(cin);
        if (!visiteur) {
            visiteur = await createVisiteur(nom, prenom, cin, nomAgent);
        }
        let agent = await findPersonneId(nomPersonne);
        if (!agent){
            agent=await createPersonne(nomPersonne);
        }
        
        let visite= await createVisitePersonne(visiteur.id_visiteur, agent.id_agent);
        res.status(201).json({message: "Visite personne enregistrer"});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Erreur serveur sut ajout visite personne"});
    }
}

export async function visitePersonneTerminerController(req, res) {
    const {idVisite} = req.body;
    try{
        let visite = await  visitePersonneTerminer(idVisite);
        res.status(201).json({ message: "Visite personne terminée avec succès" });
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

//Statistique

export async function AllVisitePersonneControlleur(req, res) {
    const visitePersonne=true;
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