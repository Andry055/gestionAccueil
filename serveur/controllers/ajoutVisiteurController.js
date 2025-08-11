import { findVisitorCin, createVisiteur, createVisiteService, findServiceId, findPersonneId, updateVisiteur } from "../models/visiteModel.js";
import { visiteTerminer, createPersonne , createVisitePersonne , visitePersonneTerminer } from "../models/visiteModel.js";

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