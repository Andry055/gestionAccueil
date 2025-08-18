
import pool from "../db.js";

export async function createUser(nom, prenom , role ,tel ,password) {
    const result =await pool.query("INSERT INTO users ( nom_accueil, prenom_accueil, role, tel, password ) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [nom, prenom , role , tel ,password]
    );
    return result.rows[0];
}
export async function  findUsersName(name) {
    const result= await pool.query("SELECT * FROM users WHERE nom_accueil = $1 ",
        [name]
    );
    return result.rows[0];
}

export async function  SelectAllUsers() {
    const result= await pool.query("SELECT id, nom_accueil, prenom_accueil, role, tel FROM users ORDER BY id ASC;"
    );
    return result.rows;
}

export async function  DeleteUsers() {
    const result= await pool.query("SELECT id, nom_accueil, prenom_accueil, role, tel FROM users ORDER BY id ASC;"
    );
    return result.rows;
}

export async function UpdateUsers(nom, prenom, role, tel, password, id) {
    const result = await pool.query(
        "UPDATE users SET nom_accueil = $1, prenom_accueil = $2, role = $3, tel = $4, password = $5 WHERE id = $6 RETURNING *",
        [nom, prenom, role, tel, password, id] 
    );
    return result.rows[0];
}

export async function DeleteUsersAccueil(id) {
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *;",[id]
    );
    return result.rows[0];
}


