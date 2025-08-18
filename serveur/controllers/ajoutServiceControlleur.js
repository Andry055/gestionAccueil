import { CountVisiteurService, createService, DeleteService, SelectAllService, updateService, selectAllVisiteurService } from "../models/lieuModel.js";
import { CountServiceNow, findServiceId } from "../models/visiteModel.js";
import { getTopServices } from "../models/lieuModel.js";
import { DeleteUsers, DeleteUsersAccueil, SelectAllUsers, UpdateUsers } from "../models/userModel.js";
import bcrypt from 'bcrypt';

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
    const {id}=req.params;
    const {nom_lieu, porte, etage }= req.body;
    try{
        const service= await updateService(id, nom_lieu, porte, etage);
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

export async function listeVisiteurServiceNom(req, res) {
    const {id} = req.params;
    try{
        let lieu = await selectAllVisiteurService(id);
        res.status(200).json({message:"Liste des Visiteur reussi", data:lieu});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lors de la recuperation des nombre des lieu"});
    }
}

export async function getTopServicesController(req, res) {
    try {
        const topServices = await getTopServices();
        res.status(200).json({data: topServices});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erreur lors de la récupération des top services"});
    }
}

               //  AGENT D' ACCUEIL  //
export async function SelectAllUsersController(req, res) {
    try {
        const users = await SelectAllUsers();
        res.status(200).json({data: users});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erreur lors de la récupération des donnée agent accuiel"});
    }      
 }

 export async function UpdateUsersController(req, res) {
    const { id } = req.params;
    const { nom, prenom, role, tel, password } = req.body;
    
    try {
        let hashedPassword = null;
        
        // Si un nouveau mot de passe est fourni, on le hache
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Appel de la fonction de mise à jour avec le mot de passe haché
        const updatedUser = await UpdateUsers(nom, prenom, role, tel, hashedPassword, id);
        
        // On ne retourne jamais le mot de passe dans la réponse
        const { password: _, ...userWithoutPassword } = updatedUser;
        
        res.status(200).json({ 
            success: true,
            message: "Utilisateur mis à jour avec succès",
            data: userWithoutPassword 
        });
        
    } catch (err) {
        console.error("Erreur dans UpdateUsersController:", err);
        res.status(500).json({ 
            success: false,
            error: "Erreur lors de la mise à jour de l'utilisateur",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

export async function DelelteUsersControlleur(req, res) {
    const {id}= req.params
    try {
        const users = await DeleteUsersAccueil(id);
        res.status(200).json({data: users});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erreur lors de la supression"});
    }
}