
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",          // ⚠️ ton utilisateur pgAdmin
  host: "localhost",
  database: "visiteur_bd",       // ⚠️ nom de ta base
  password: "",    // ⚠️ ton mot de passe
  port: 5432,
});

module.exports = pool;
