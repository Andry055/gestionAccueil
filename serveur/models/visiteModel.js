import pool from "../db.js";

export async function createVisiteur(nom, prenom, cin, nomAgent) {
    const result = await pool.query(
        "INSERT INTO visiteurs (nom, prenom, cin, nom_agent) VALUES ($1, $2, $3, $4) RETURNING *",
        [nom, prenom, cin, nomAgent] 
    );
    return result.rows[0];
}

export async function findVisitorCin(cin) {  
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

export async function updateVisitelieu(idVisite,motif, idLieu) {
    const result=await pool.query("UPDATE visites_lieu SET motif = $1,  id_lieu=$2  WHERE id_visitelieu = $3 RETURNING *",[motif,idLieu,idVisite]);
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

export async function SelectAllVisiteur() {
    const result= await pool.query(
        " SELECT * FROM visiteurs "
    );
    return result.rows;
}

export async function SelectAllVisite() {
    const result= await pool.query(
        "SELECT vis.id_visitelieu , v.nom , v.prenom , vis.date, vis.heure_arrivee, vis.heure_depart , l.nom_lieu, vis.motif FROM visites_lieu vis JOIN visiteurs v ON v.id_visiteur=vis.id_visiteur JOIN lieu l ON l.id_lieu=vis.id_lieu ORDER BY vis.date DESC, vis.heure_arrivee DESC;"
    );
    return result.rows;
}

//        Statisitque 
// *Tableau ACCUEI  visite en cours

export async function SelectAllVisiteNotLieu() {
    const  result= await pool.query(
        "SELECT vis.id_visitelieu , v.nom , v.prenom ,l.nom_lieu , vis.heure_arrivee, FROM visites_lieu vis JOIN visiteurs v ON v.id_visiteur=vis.id_visiteur JOIN lieu l ON l.id_lieu=vis.id_lieu WHERE vis.statut='en cours'  ORDER BY vis.date DESC, vis.heure_arrivee DESC;"
    );
    return result.rows;
}

export async function SelectAllVisiteNotPersonne() {
    const result= await pool.query(
        "SELECT vis.id_visitepersonne , v.nom , v.prenom ,a.nom_agent , vis.heure_arrivee FROM visites_personne vis JOIN visiteurs v ON v.id_visiteur=vis.id_visiteur JOIN agent a ON a.id_agent=vis.id_agent WHERE vis.statut='en cours'  ORDER BY vis.date DESC, vis.heure_arrivee DESC;"
    );
    return result.rows;
}

export async function CountServiceNow() {
    const result= await pool.query(
        "SELECT COUNT(DISTINCT id_lieu) FROM visites_lieu WHERE date=CURRENT_DATE"
    );
    return parseInt(result.rows[0].count, 10);
}

export async function countVisiteEncours() {
    const result= await pool.query(
        "SELECT COUNT(DISTINCT id_visitelieu) FROM visites_lieu WHERE statut='en cours'"
    );
    return parseInt(result.rows[0].count, 10);
}

export async function countVisitePersonneEncours() {
    const result= await pool.query(
        "SELECT COUNT(DISTINCT id_visitePersonne) FROM visites_personne WHERE statut='en cours'"
    );
    return parseInt(result.rows[0].count, 10);
}

export async function CountVisiteurLieuNow() {
    const result= await pool.query(
        "SELECT COUNT(DISTINCT id_visiteur) FROM visites_lieu WHERE date=CURRENT_DATE"
    );
    return parseInt(result.rows[0].count, 10);
}

export async function CountVisiteurPersonneNow() {
    const result= await pool.query(
        "SELECT COUNT(DISTINCT id_visiteur) FROM visites_personne WHERE date=CURRENT_DATE"
    );
    return parseInt(result.rows[0].count, 10);
}