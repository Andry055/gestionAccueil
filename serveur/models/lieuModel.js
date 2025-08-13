import pool from "../db.js";

export async function createService(nom, porte, etage) {
    const result =await pool.query("INSERT INTO lieu (nom_lieu,porte,etage) VALUES ($1,$2,$3) RETURNING *",
        [nom,porte,etage]
    );
    return result.rows[0];
}

export async function updateService(id_lieu,nomLieu, porte, etage) {
    const result = await pool.query("UPDATE lieu SET nom_lieu=$1, porte=$2 , etage=$3 WHERE id_lieu=$4 RETURNING *",
        [nomLieu, porte, etage , id_lieu]
    );
}

export async function DeleteService(id_lieu,nomLieu, porte, etage) {
    const result = await pool.query("DELETE FROM lieu WHERE id_lieu = $1 RETURNING *",
        [id_lieu]
    );
}

export async function SelectAllService() {
    const result = await pool.query("SELECT * FROM lieu ",
    );
    return result.rows;  
}

// Statistique

export async function CountVisiteurService() {
    const result = await pool.query("SELECT l.nom_lieu AS nom_lieu, COUNT(vis.id_visiteur) AS nombre_visiteurs FROM lieu l LEFT JOIN visites_lieu vis ON l.id_lieu = vis.id_lieu GROUP BY l.nom_lieu ORDER BY  nombre_visiteurs DESC;"
    );
    return result.rows;
}