import { createService, DeleteService, updateService } from "../models/lieuModel.js";

export async function createServiceControlleur(req ,res ) {
    const {nom, porte, etage }= req.body;
    try{
        const service= await createService(nom, porte, etage);
        res.status(201).json({ message: "Service enregistrée avec succès" });

    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}

export async function updateServiceController(req, res) {
    const {id, nom, porte, etage }= req.body;
    try{
        const service= await updateService(id, nom, porte, etage);
        res.status(201).json({ message: "Service mise à jour avec succès" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
export async function DeleteServiceController(req, res) {
    const {id}= req.body;
    try{
        const service= await DeleteService(id);
        res.status(201).json({ message: "Service suprimer avec succès" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
