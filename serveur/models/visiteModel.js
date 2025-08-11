import pool from "../db.js";

export async function createVisiteur(nom, prenom, cin, nomAgent) {
    const result = await pool.query(
        "INSERT INTO visiteurs (nom, prenom, cin, nom_agent) VALUES ($1, $2, $3, $4) RETURNING *",
        [nom, prenom, cin, nomAgent] 
    );
    return result.rows[0];
}

export async function findVisitorCin(cin) {  // Changé de findVisitorId à findVisitorCin pour correspondre au contrôleur
    const result = await pool.query("SELECT * FROM visiteurs WHERE cin = $1", [cin]);
    return result.rows[0];
}

export async function findServiceId(nomLieu) {
    const result = await pool.query("SELECT * FROM lieu WHERE nom_lieu = $1", [nomLieu]);
    return result.rows[0];
}

export async function createVisiteService(idVisiteur, idLieu, motif) {  // Ajout du paramètre motif
    const result = await pool.query(
        "INSERT INTO visites_lieu(id_visiteur, id_lieu, motif) VALUES ($1, $2, $3) RETURNING *",
        [idVisiteur, idLieu, motif]
    );
    return result.rows[0];
}

export async function visiteTerminer(idVisite) {
    const result=await pool.query(" UPDATE visites_lieu SET heure_depart = NOW(), statut = 'terminé 'WHERE id_visitelieu = $1 AND statut = 'en cours' RETURNING *",[idVisite]);
    return result.rows[0];
}

export async function createVisitePersonne(idVisiteur,idPresonne ) {  // Ajout du paramètre motif
    const result = await pool.query(
        "INSERT INTO visites_personne(id_visiteur, id_agent) VALUES ($1, $2) RETURNING *",
        [idVisiteur, idPresonne]
    );
    return result.rows[0];
}

export async function  findPersonneId(nomPersonne) {
    const result = await pool.query(
        "SELECT * FROM agent WHERE nom_agent= $1",
        [nomPersonne]
    );
    return result.rows[0];
}

export async function createPersonne(nomPersonne) {
    const result = await pool.query(
        "INSERT INTO agent(nom_agent) VALUES($1)",[nomPersonne]
    );
    return result.rows[0];
}

export async function visitePersonneTerminer(idVisite) {
    const result= await pool.query(
        " UPDATE visites_personne SET heure_depart = NOW(), statut = 'terminé 'WHERE id_visitepersonne = $1 AND statut = 'en cours' RETURNING *",[idVisite]
    );
    return result.rows[0];
}

export async function updateVisiteur(id, nom, prenom, cin) {
    const result= await pool.query(
        " UPDATE visiteurs SET nom =$1  , prenom =$2 , cin=$3 WHERE id_Visiteur= $4 RETURNING *",[nom,prenom,cin,id]
    );
    return result.rows[0];
}
