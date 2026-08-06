const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'serveur', '.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'visiteur',
  password: process.env.DB_PASSWORD || 'tsisy00',
  port: parseInt(process.env.DB_PORT) || 5432,
});

const users = [
  { nom_accueil: 'admin', prenom_accueil: 'Admin', role: 'admin', tel: '0320000001', password: 'admin123' },
  { nom_accueil: 'superadmin', prenom_accueil: 'Super', role: 'superadmin', tel: '0320000002', password: 'super123' },
  { nom_accueil: 'agent', prenom_accueil: 'Agent', role: 'agent', tel: '0320000003', password: 'agent123' },
];

async function seed() {
  console.log('=== SEEDING USERS ===\n');

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected\n');

    for (const u of users) {
      const existing = await pool.query('SELECT id FROM users WHERE nom_accueil = $1', [u.nom_accueil]);
      if (existing.rows.length > 0) {
        console.log('SKIP - ' + u.nom_accueil + ' already exists (id: ' + existing.rows[0].id + ')');
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(u.password, salt);

      const r = await pool.query(
        'INSERT INTO users (nom_accueil, prenom_accueil, role, tel, password) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [u.nom_accueil, u.prenom_accueil, u.role, u.tel, hash]
      );

      console.log('CREATED - ' + u.nom_accueil + ' (' + u.role + ') -> id: ' + r.rows[0].id);
    }

    console.log('\n=== COMPTES DE TEST ===');
    console.log('admin / admin123 (Admin)');
    console.log('superadmin / super123 (Super Admin)');
    console.log('agent / agent123 (Agent)');
    console.log('\nConnectez-vous sur http://localhost:3000\n');
  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('PostgreSQL is not running. Start it and retry.');
    }
    if (error.code === '42P01') {
      console.error('Table "users" does not exist.');
    }
  } finally {
    await pool.end();
    console.log('Connection closed.');
  }
}

seed();
