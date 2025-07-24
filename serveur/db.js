
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();


const pool = new Pool({
  user: process.env.DB_USER,          // ⚠️ ton utilisateur pgAdmin
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,       // ⚠️ nom de ta base
  password: process.env.DB_PASSWORD ,    // ⚠️ ton mot de passe
  port: process.env.DB_PORT,
});

export default pool;
