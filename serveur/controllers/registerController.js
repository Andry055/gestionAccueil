import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { createUser } from '../models/userModel.js';

export async function register(req, res){
    const {nom, prenom , role, tel, password}=req.body;
    try{
        const hashedpassword=await bcrypt.hash(password, 10);
        const user = await createUser(nom, prenom, role , tel, hashedpassword);
        const token= generateToken(user);
        res.status(201).json({message:"Inscription réussie", token});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Erreur serveur"});
    }
}