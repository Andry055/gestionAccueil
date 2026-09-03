// seed.js - Script pour insérer les données de démonstration
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  console.log('🌱 Début de l\'insertion des données de seed...\n');

  try {
    // Lire le fichier SQL
    const sqlPath = join(__dirname, 'seed.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Exécuter le script SQL
    await pool.query(sql);

    console.log('✅ Données insérées avec succès !\n');

    // Vérifier les résultats
    const tables = [
      { name: 'lieu', query: 'SELECT COUNT(*) as count FROM lieu' },
      { name: 'agent', query: 'SELECT COUNT(*) as count FROM agent' },
      { name: 'visiteurs', query: 'SELECT COUNT(*) as count FROM visiteurs' },
      { name: 'visites_lieu', query: 'SELECT COUNT(*) as count FROM visites_lieu' },
      { name: 'visites_personne', query: 'SELECT COUNT(*) as count FROM visites_personne' },
    ];

    console.log('📊 Résumé des données :');
    console.log('─'.repeat(40));

    for (const table of tables) {
      const result = await pool.query(table.query);
      const count = result.rows[0].count;
      console.log(`  ${table.name.padEnd(20)} ${count} lignes`);
    }

    console.log('─'.repeat(40));
    console.log('\n🎉 Seed terminé ! L\'application est prête.\n');

  } catch (err) {
    console.error('❌ Erreur lors du seed :', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
