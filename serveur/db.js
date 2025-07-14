
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",          // ⚠️ ton utilisateur pgAdmin
  host: "localhost",
  database: "visiteur",       // ⚠️ nom de ta base
  password: 'tsisy00',    // ⚠️ ton mot de passe
  port: 5433,
});

export default pool;
