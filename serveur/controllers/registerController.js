import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { createUser } from '../models/userModel.js';
import { findUsersName } from '../models/userModel.js';

export async function register(req, res){
    const {name, password, role}=req.body;
    try{
        const existing = await findUsersName(name);
        if (existing) return res.status(400).json({errour: "utilisateur Dejà existée"});
        const hashedpassword=await bcrypt.hash(password, 10);
        const user = await createUser(name, hashedpassword, role);
        const token= generateToken(user);
        res.status(201).json({message:"Inscription réussie", token});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Erreur serveur"});
    }
}