
import pool from "../db.js";

export async function createUser(name, password, role) {
    const result =await pool.query("INSERT INTO users (nom_accueil,password,role) VALUES ($1,$2,$3) RETURNING *",
        [name,password,role]
    );
    return result.rows[0];
}
export async function  findUsersName(name) {
    const result= await pool.query("SELECT * FROM users WHERE nom_accueil = $1",
        [name]
    );
    return result.rows[0];
}


