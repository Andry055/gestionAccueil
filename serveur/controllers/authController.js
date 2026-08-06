import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { findUsersName } from '../models/userModel.js';

export async function login(req, res) {
  const {name,password}=req.body;
  try{
    const user= await findUsersName(name);
    if (!user) return res.status(400).json({error:"Nom incorrect"});

    const passwordMatch= await bcrypt.compare(password,user.password);
    if (!passwordMatch) return res.status(401).json({error:"Mot de passe incorrect"});
    
    const token =generateToken(user);
    res.status(200).json({
      message:"Connexion réussie",
      token,
      username:user.nom_accueil,
      prenom:user.prenom_accueil,
      role:user.role,
      tel:user.tel
    });
    
  }
  catch(err){
    console.error(err);
    res.status(500).json({error:"Erreur de serveur"});
  }
}

