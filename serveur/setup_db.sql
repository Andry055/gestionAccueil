-- =====================================================
-- SCRIPT D'INITIALISATION DE LA BASE DE DONNÉES
-- Application VisiTrack - Gestion des Visiteurs
-- =====================================================

-- Créer la base si elle n'existe pas
SELECT 'CREATE DATABASE visiteur'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'visiteur')\gexec

-- Se connecter à la base visiteur
\c visiteur

-- =====================================================
-- TABLE: users (utilisateurs / agents d'accueil)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom_accueil VARCHAR(100) NOT NULL,
    prenom_accueil VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent',
    tel VARCHAR(20),
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: lieu (services / lieux)
-- =====================================================
CREATE TABLE IF NOT EXISTS lieu (
    id_lieu SERIAL PRIMARY KEY,
    nom_lieu VARCHAR(150) NOT NULL,
    porte VARCHAR(50),
    etage VARCHAR(50)
);

-- =====================================================
-- TABLE: agent (personnes visitées)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent (
    id_agent SERIAL PRIMARY KEY,
    nom_agent VARCHAR(150) NOT NULL
);

-- =====================================================
-- TABLE: visiteurs
-- =====================================================
CREATE TABLE IF NOT EXISTS visiteurs (
    id_visiteur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cin VARCHAR(20),
    nom_agent VARCHAR(150)
);

-- =====================================================
-- TABLE: visites_lieu (visites par service)
-- =====================================================
CREATE TABLE IF NOT EXISTS visites_lieu (
    id_visitelieu SERIAL PRIMARY KEY,
    id_visiteur INT NOT NULL REFERENCES visiteurs(id_visiteur) ON DELETE CASCADE,
    id_lieu INT NOT NULL REFERENCES lieu(id_lieu) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    heure_arrivee TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    heure_depart TIMESTAMP,
    motif TEXT,
    statut VARCHAR(50) DEFAULT 'en cours'
);

-- =====================================================
-- TABLE: visites_personne (visites par personne)
-- =====================================================
CREATE TABLE IF NOT EXISTS visites_personne (
    id_visitepersonne SERIAL PRIMARY KEY,
    id_visiteur INT NOT NULL REFERENCES visiteurs(id_visiteur) ON DELETE CASCADE,
    id_agent INT NOT NULL REFERENCES agent(id_agent) ON DELETE CASCADE,
    date_p DATE DEFAULT CURRENT_DATE,
    heure_arrivee TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    heure_depart TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'en cours'
);

-- =====================================================
-- INDEX pour optimiser les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_visites_lieu_date ON visites_lieu(date);
CREATE INDEX IF NOT EXISTS idx_visites_lieu_statut ON visites_lieu(statut);
CREATE INDEX IF NOT EXISTS idx_visites_lieu_visiteur ON visites_lieu(id_visiteur);
CREATE INDEX IF NOT EXISTS idx_visites_lieu_lieu ON visites_lieu(id_lieu);

CREATE INDEX IF NOT EXISTS idx_visites_personne_date ON visites_personne(date_p);
CREATE INDEX IF NOT EXISTS idx_visites_personne_statut ON visites_personne(statut);
CREATE INDEX IF NOT EXISTS idx_visites_personne_visiteur ON visites_personne(id_visiteur);
CREATE INDEX IF NOT EXISTS idx_visites_personne_agent ON visites_personne(id_agent);

CREATE INDEX IF NOT EXISTS idx_visiteurs_cin ON visiteurs(cin);

-- =====================================================
-- DONNÉES DE TEST (services de base)
-- =====================================================
INSERT INTO lieu (nom_lieu, porte, etage) VALUES
    ('Direction Générale', 'A1', '1'),
    ('Ressources Humaines', 'B2', '2'),
    ('Comptabilité', 'C3', '1'),
    ('Informatique', 'D4', '3'),
    ('Accueil', 'E5', '0')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
SELECT 'Tables créées avec succès !' AS status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
