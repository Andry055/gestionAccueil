import { CountVisiteurService, createService, DeleteService, SelectAllService, updateService } from "../models/lieuModel.js";
import { CountServiceNow } from "../models/visiteModel.js";

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

export async function SelectAllServiceControlleur(req, res) {
    try{
        let lieux= await SelectAllService();
        res.status(200).json({message:"Liste des Lieux",
             data: lieux});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur pour Listé les Lieux"});
    }
}

//STATISTIQUES 

export async function SelectCountVisiteurServiceControlleur(req, res) {
    try{
        let lieu= await CountVisiteurService();
        res.status(200).json({message:"Liste des Lieux avec le nombre des viciteur", lieu});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur pour Listé les Lieux avec nombres des visiteurs"});
    }
}

export async function CountServiceControlleur(req, res) {
    try{
        let nblieu = await CountServiceNow();
        res.status(200).json({message:"Nombre des service visitée aujourd'hui", nblieu});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lors de la recuperation des nombre des lieu"});
    }
}
