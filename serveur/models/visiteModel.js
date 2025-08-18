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

export async function updateVisitePersonne(idVisite,motif, idLieu) {
    const result=await pool.query("UPDATE visites_lieu SET motif = $1,  id_lieu=$2  WHERE id_visitelieu = $3 RETURNING *",[motif,idLieu,idVisite]);
    return result.rows[0];
}

export async function updateVisitelieuNom(idVisite, idLieu) {
    const result=await pool.query("UPDATE visites_lieu SET  id_lieu=$1  WHERE id_visitelieu = $2 RETURNING *",[idLieu,idVisite]);
    return result.rows[0];
}

export async function updateVisitePersonneNom(idVisite, idPersonne) {
    const result=await pool.query("UPDATE visites_personne SET  id_agent=$1  WHERE id_visitepersonne = $2 RETURNING *",[idPersonne,idVisite]);
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

export async function createPersonne(nom) {
    try {
      const result = await pool.query(
        'INSERT INTO agent (nom_agent) VALUES ($1) RETURNING id_agent',
        [nom]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Erreur création personne:', err);
      throw new Error('Échec de la création de la personne visitée');
    }
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
export async function updateVisiteurWithoutCin(id, nom, prenom) {
    const result= await pool.query(
        " UPDATE visiteurs SET nom =$1 , prenom =$2 WHERE id_Visiteur= $3 RETURNING *",[nom,prenom,id]
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
        "SELECT vis.id_visitelieu , v.nom , v.prenom ,l.nom_lieu , vis.heure_arrivee FROM visites_lieu vis JOIN visiteurs v ON v.id_visiteur=vis.id_visiteur JOIN lieu l ON l.id_lieu=vis.id_lieu WHERE vis.statut='en cours'  ORDER BY vis.date DESC, vis.heure_arrivee DESC;"
    );
    return result.rows;
}

export async function SelectAllVisiteNotPersonne() {
    const result= await pool.query(
        "SELECT vis.id_visitepersonne , v.nom , v.prenom , a.nom_agent , vis.heure_arrivee, a.nom_agent FROM visites_personne vis JOIN visiteurs v ON v.id_visiteur=vis.id_visiteur JOIN agent a ON a.id_agent=vis.id_agent WHERE vis.statut='en cours'  ORDER BY vis.date_p DESC, vis.heure_arrivee DESC;"
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
        "SELECT COUNT(DISTINCT id_visiteur) FROM visites_personne WHERE date_p=CURRENT_DATE"
    );
    return parseInt(result.rows[0].count, 10);
}

export async function  selectAllVisiteForId(idPresonne) {
    const result= await pool.query(
        "SELECT vis.date, vis.heure_arrivee, vis.heure_depart , vis.motif, l.nom_lieu FROM visites_lieu vis JOIN lieu l ON l.id_lieu=vis.id_lieu WHERE id_visiteur=$1",[idPresonne]
    );
    return result.rows;
}
export async function  selectIdVisiteur(idVisite) {
    const result= await pool.query(
        "SELECT id_visiteur FROM visites_lieu WHERE id_visitelieu=$1",[idVisite]
    );
    return result.rows[0];
}

export async function  selectIdVisiteurForVisitePersonne(idVisite) {
    const result= await pool.query(
        "SELECT id_visiteur FROM visites_personne WHERE id_visitepersonne=$1",[idVisite]
    );
    return result.rows[0];
}

// graphique 

export async function  chartMois() {
    const result= await pool.query("SELECT TO_CHAR(date_p, 'Mon') AS mois, COUNT(*) AS nombre_visites, EXTRACT(MONTH FROM date_p) AS mois_num FROM visites_personne WHERE date_p >= CURRENT_DATE - INTERVAL '1 year' GROUP BY mois, mois_num ORDER BY mois_num;"
    );
    return result.rows;
}

export async function  chartSemaine() {
    const result= await pool.query("SELECT 'Sem ' || EXTRACT(WEEK FROM date_p) AS semaine, COUNT(*) AS nombre_visites FROM visites_personne WHERE date_p >= DATE_TRUNC('year', CURRENT_DATE) GROUP BY EXTRACT(WEEK FROM date_p) ORDER BY EXTRACT(WEEK FROM date_p)"
    );
    return result.rows;
}
export async function  SuperChartJour() {
    const result= await pool.query("SELECT l.nom_lieu as nom, COUNT(v.id_visitelieu) as nombre_visites FROM visites_lieu v JOIN lieu l ON v.id_lieu = l.id_lieu WHERE v.date = CURRENT_DATE GROUP BY l.nom_lieu ORDER BY nombre_visites DESC;"
    );
    return result.rows;
}

export async function  SuperChartSemaine() {
    const result= await pool.query("SELECT l.nom_lieu as nom, COUNT(v.id_visitelieu) as nombre_visites FROM visites_lieu v JOIN lieu l ON v.id_lieu = l.id_lieu WHERE v.date >= date_trunc('week', CURRENT_DATE) AND v.date < date_trunc('week', CURRENT_DATE) + interval '1 week' GROUP BY l.nom_lieu ORDER BY nombre_visites DESC;" );
    return result.rows;
}

export async function  SuperChartMois() {
    const result= await pool.query("SELECT l.nom_lieu as nom, COUNT(v.id_visitelieu) as nombre_visites FROM visites_lieu v JOIN lieu l ON v.id_lieu = l.id_lieu WHERE v.date >= date_trunc('month', CURRENT_DATE) AND v.date < date_trunc('month', CURRENT_DATE) + interval '1 month' GROUP BY l.nom_lieu ORDER BY nombre_visites DESC;" );
    return result.rows;
}


