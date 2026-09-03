-- =====================================================
-- SEED DATA - VisiTrack Application
-- Données réalistes pour démonstration
-- =====================================================

-- Services / Lieux supplémentaires
INSERT INTO lieu (nom_lieu, porte, etage) VALUES
    ('Direction Commerciale', 'F1', '4'),
    ('Service Juridique', 'G2', '3'),
    ('Marketing', 'H3', '2'),
    ('Logistique', 'I4', '1'),
    ('Direction Financière', 'J5', '5'),
    ('Service Qualité', 'K6', '2'),
    ('Communication', 'L7', '3'),
    ('Direction Technique', 'M8', '4'),
    ('R&D', 'N9', '5'),
    ('Service Formation', 'O10', '1')
ON CONFLICT DO NOTHING;

-- Agents (personnes visitées)
INSERT INTO agent (nom_agent) VALUES
    ('Ahmed Bennani'),
    ('Fatima Zahra El Idrissi'),
    ('Mohammed Tazi'),
    ('Khadija Alaoui'),
    ('Youssef Chraibi'),
    ('Amina Berrada'),
    ('Hassan Filali'),
    ('Nadia Omrani'),
    ('Karim Benjelloun'),
    ('Samira Fassi Fihri'),
    ('Rachid Tahiri'),
    ('Leila Bouzidi'),
    ('Omar Alami'),
    ('Zineb Sabri'),
    ('Mehdi Kettani')
ON CONFLICT DO NOTHING;

-- Visiteurs avec données réalistes marocaines
INSERT INTO visiteurs (nom, prenom, cin, nom_agent) VALUES
    ('El Fassi', 'Rachid', 'BK482901', 'Ahmed Bennani'),
    ('Benkirane', 'Salma', 'BE631245', 'Fatima Zahra El Idrissi'),
    ('Ait Ouaziz', 'Mehdi', 'BK715632', 'Mohammed Tazi'),
    ('Chakir', 'Nora', 'BE294817', 'Khadija Alaoui'),
    ('Tahiri', 'Omar', 'BK563028', 'Youssef Chraibi'),
    ('Bennani', 'Fatima', 'BE847193', 'Amina Berrada'),
    ('Filali', 'Hamza', 'BK321546', 'Hassan Filali'),
    ('Alami', 'Leila', 'BE678432', 'Nadia Omrani'),
    ('Kettani', 'Youssef', 'BK905127', 'Karim Benjelloun'),
    ('Sabri', 'Amina', 'BE432891', 'Samira Fassi Fihri'),
    ('Tazi', 'Mohammed', 'BK786345', 'Rachid Tahiri'),
    ('Berrada', 'Khadija', 'BE519283', 'Leila Bouzidi'),
    ('Chraibi', 'Ahmed', 'BK264718', 'Omar Alami'),
    ('Idrissi', 'Salma', 'BE893456', 'Zineb Sabri'),
    ('Mouline', 'Karim', 'BK347892', 'Mehdi Kettani'),
    ('Benali', 'Nadia', 'BE621347', 'Ahmed Bennani'),
    ('Tahraoui', 'Hassan', 'BK958214', 'Fatima Zahra El Idrissi'),
    ('Fihri', 'Yasmine', 'BE384561', 'Mohammed Tazi'),
    ('Oukhouya', 'Rachid', 'BK712683', 'Khadija Alaoui'),
    ('Daoudi', 'Malika', 'BE495728', 'Youssef Chraibi'),
    ('Guerrouad', 'Slimane', 'BK831459', 'Amina Berrada'),
    ('Lahlou', 'Aicha', 'BE267348', 'Hassan Filali'),
    ('Slaoui', 'Driss', 'BK548923', 'Nadia Omrani'),
    ('Maatallah', 'Zakia', 'BE716284', 'Karim Benjelloun'),
    ('El Khatib', 'Brahim', 'BK394567', 'Samira Fassi Fihri'),
    ('Bouhlal', 'Houda', 'BE823195', 'Rachid Tahiri'),
    ('Cherkaoui', 'Abdelilah', 'BK657412', 'Leila Bouzidi'),
    ('Naciri', 'Meryem', 'BE438926', 'Omar Alami'),
    ('Bennis', 'Tarik', 'BK781354', 'Zineb Sabri'),
    ('Ouazzani', 'Siham', 'BE562183', 'Mehdi Kettani'),
    ('Jabri', 'Abdelghafour', 'BK293847', 'Ahmed Bennani'),
    ('Zeroual', 'Halima', 'BE614529', 'Fatima Zahra El Idrissi'),
    ('Mansouri', 'Younes', 'BK847261', 'Mohammed Tazi'),
    ('Benchekroun', 'Latifa', 'BE375618', 'Khadija Alaoui'),
    ('Ouadghiri', 'Abdelmoula', 'BK529843', 'Youssef Chraibi'),
    ('Seghir', 'Najat', 'BE768352', 'Amina Berrada'),
    ('Benmoussa', 'Saïd', 'BK412697', 'Hassan Filali'),
    ('Chakir', 'Rajae', 'BE893174', 'Nadia Omrani'),
    ('Ait Brahim', 'Abdelaziz', 'BK635428', 'Karim Benjelloun'),
    ('Tlemçani', 'Fatima Aïcha', 'BE248951', 'Samira Fassi Fihri')
ON CONFLICT DO NOTHING;

-- Visites par lieu - données réelles sur les 30 derniers jours
-- Aujourd'hui
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (1, 1, CURRENT_DATE, NOW() - INTERVAL '3 hours', NULL, 'Réunion direction', 'en cours'),
    (3, 4, CURRENT_DATE, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 'Maintenance serveur', 'terminée'),
    (5, 2, CURRENT_DATE, NOW() - INTERVAL '1 hour', NULL, 'Entretien RH', 'en cours'),
    (7, 3, CURRENT_DATE, NOW() - INTERVAL '45 minutes', NULL, 'Réunion comptable', 'en cours'),
    (9, 5, CURRENT_DATE, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', 'Signature contrat', 'terminée'),
    (11, 1, CURRENT_DATE, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', 'Réunion stratégie', 'terminée'),
    (13, 6, CURRENT_DATE, NOW() - INTERVAL '1 hour', NULL, 'Audit qualité', 'en cours'),
    (15, 7, CURRENT_DATE, NOW() - INTERVAL '30 minutes', NULL, 'Communication projet', 'en cours'),
    (2, 8, CURRENT_DATE, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours', 'Formation technique', 'terminée'),
    (4, 9, CURRENT_DATE, NOW() - INTERVAL '20 minutes', NULL, 'Présentation R&D', 'en cours'),
    (6, 10, CURRENT_DATE, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 'Session formation', 'terminée'),
    (8, 1, CURRENT_DATE, NOW() - INTERVAL '15 minutes', NULL, 'Direction générale', 'en cours');

-- Hier
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (10, 2, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '09:15:00', (CURRENT_DATE - 1) + TIME '10:30:00', 'Entretien embauche', 'terminée'),
    (12, 3, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '10:00:00', (CURRENT_DATE - 1) + TIME '11:45:00', 'Audit financier', 'terminée'),
    (14, 1, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '14:00:00', (CURRENT_DATE - 1) + TIME '15:30:00', 'Réunion conseil', 'terminée'),
    (16, 4, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '08:30:00', (CURRENT_DATE - 1) + TIME '12:00:00', 'Installation équipement', 'terminée'),
    (18, 5, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '11:00:00', (CURRENT_DATE - 1) + TIME '12:15:00', 'Validation budget', 'terminée'),
    (20, 6, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '15:00:00', (CURRENT_DATE - 1) + TIME '16:00:00', 'Contrôle qualité', 'terminée'),
    (22, 7, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '09:00:00', (CURRENT_DATE - 1) + TIME '10:00:00', 'Briefing média', 'terminée'),
    (24, 8, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '13:00:00', (CURRENT_DATE - 1) + TIME '14:30:00', 'Support technique', 'terminée'),
    (26, 9, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '10:30:00', (CURRENT_DATE - 1) + TIME '12:00:00', 'Démonstration produit', 'terminée'),
    (28, 10, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '14:30:00', (CURRENT_DATE - 1) + TIME '16:00:00', 'Formation sécurité', 'terminée'),
    (30, 1, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '08:00:00', (CURRENT_DATE - 1) + TIME '09:30:00', 'Point hebdomadaire', 'terminée'),
    (32, 2, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '11:30:00', (CURRENT_DATE - 1) + TIME '12:30:00', 'Recrutement', 'terminée');

-- Il y a 2 jours
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (1, 3, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '09:00:00', (CURRENT_DATE - 2) + TIME '10:30:00', 'Revue comptable', 'terminée'),
    (3, 5, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '10:00:00', (CURRENT_DATE - 2) + TIME '11:00:00', 'Signature bon de commande', 'terminée'),
    (5, 1, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '14:00:00', (CURRENT_DATE - 2) + TIME '15:00:00', 'Réunion projet', 'terminée'),
    (7, 6, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '08:30:00', (CURRENT_DATE - 2) + TIME '09:30:00', 'Inspection qualité', 'terminée'),
    (9, 8, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '11:00:00', (CURRENT_DATE - 2) + TIME '12:30:00', 'Maintenance réseau', 'terminée'),
    (11, 4, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '15:00:00', (CURRENT_DATE - 2) + TIME '16:30:00', 'Livraison matériel', 'terminée'),
    (13, 9, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '09:30:00', (CURRENT_DATE - 2) + TIME '11:00:00', 'Recherche collaborative', 'terminée'),
    (15, 10, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '13:30:00', (CURRENT_DATE - 2) + TIME '15:00:00', 'Atelier formation', 'terminée'),
    (17, 2, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '10:00:00', (CURRENT_DATE - 2) + TIME '11:30:00', 'Entretien annuel', 'terminée'),
    (19, 7, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '14:00:00', (CURRENT_DATE - 2) + TIME '15:30:00', 'Conférence presse', 'terminée');

-- Il y a 3 jours
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (2, 1, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '09:00:00', (CURRENT_DATE - 3) + TIME '10:00:00', 'Réunion d''équipe', 'terminée'),
    (4, 3, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '10:30:00', (CURRENT_DATE - 3) + TIME '12:00:00', 'Audit interne', 'terminée'),
    (6, 5, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '11:00:00', (CURRENT_DATE - 3) + TIME '12:30:00', 'Validation factures', 'terminée'),
    (8, 2, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '14:00:00', (CURRENT_DATE - 3) + TIME '15:00:00', 'Entretien promotion', 'terminée'),
    (10, 4, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '08:00:00', (CURRENT_DATE - 3) + TIME '09:30:00', 'Mise à jour logiciel', 'terminée'),
    (12, 6, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '15:00:00', (CURRENT_DATE - 3) + TIME '16:00:00', 'Certification ISO', 'terminée'),
    (14, 8, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '09:30:00', (CURRENT_DATE - 3) + TIME '11:00:00', 'Dépannage réseau', 'terminée'),
    (16, 9, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '13:00:00', (CURRENT_DATE - 3) + TIME '14:30:00', 'Lancement prototype', 'terminée'),
    (18, 10, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '10:00:00', (CURRENT_DATE - 3) + TIME '11:30:00', 'Formation digital', 'terminée'),
    (20, 7, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '14:30:00', (CURRENT_DATE - 3) + TIME '16:00:00', 'Campagne marketing', 'terminée');

-- Il y a 4 jours
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (21, 1, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '09:00:00', (CURRENT_DATE - 4) + TIME '10:30:00', 'Stratégie annuelle', 'terminée'),
    (23, 3, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '11:00:00', (CURRENT_DATE - 4) + TIME '12:00:00', 'Bilan financier', 'terminée'),
    (25, 5, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '10:00:00', (CURRENT_DATE - 4) + TIME '11:30:00', 'Planification budget', 'terminée'),
    (27, 2, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '14:00:00', (CURRENT_DATE - 4) + TIME '15:00:00', 'Concours recrutement', 'terminée'),
    (29, 6, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '08:30:00', (CURRENT_DATE - 4) + TIME '10:00:00', 'Revue qualité', 'terminée'),
    (31, 4, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '13:00:00', (CURRENT_DATE - 4) + TIME '14:30:00', 'Inventaire stock', 'terminée'),
    (33, 8, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '09:00:00', (CURRENT_DATE - 4) + TIME '10:00:00', 'Mise à jour sécurité', 'terminée'),
    (35, 9, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '15:00:00', (CURRENT_DATE - 4) + TIME '16:30:00', 'Test laboratoire', 'terminée'),
    (37, 10, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '10:30:00', (CURRENT_DATE - 4) + TIME '12:00:00', 'Session e-learning', 'terminée'),
    (39, 7, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '14:00:00', (CURRENT_DATE - 4) + TIME '15:30:00', 'Réseau social', 'terminée');

-- Il y a 5 jours
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (2, 4, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '09:00:00', (CURRENT_DATE - 5) + TIME '11:00:00', 'Installation logiciel', 'terminée'),
    (4, 6, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '10:00:00', (CURRENT_DATE - 5) + TIME '11:30:00', 'Audit processus', 'terminée'),
    (6, 8, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '14:00:00', (CURRENT_DATE - 5) + TIME '15:00:00', 'Support applicatif', 'terminée'),
    (8, 1, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '08:30:00', (CURRENT_DATE - 5) + TIME '10:00:00', 'Comité direction', 'terminée'),
    (10, 3, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '11:00:00', (CURRENT_DATE - 5) + TIME '12:30:00', 'Clôture mensuelle', 'terminée'),
    (12, 5, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '15:00:00', (CURRENT_DATE - 5) + TIME '16:00:00', 'Virement bancaire', 'terminée'),
    (14, 7, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '09:30:00', (CURRENT_DATE - 5) + TIME '11:00:00', 'Communication interne', 'terminée'),
    (16, 9, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '13:00:00', (CURRENT_DATE - 5) + TIME '14:30:00', 'Prototypage', 'terminée'),
    (18, 10, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '10:00:00', (CURRENT_DATE - 5) + TIME '11:30:00', 'Certification', 'terminée'),
    (20, 2, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '14:00:00', (CURRENT_DATE - 5) + TIME '15:00:00', 'Entretien salaire', 'terminée');

-- Il y a 6 jours
INSERT INTO visites_lieu (id_visiteur, id_lieu, date, heure_arrivee, heure_depart, motif, statut) VALUES
    (22, 1, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '09:00:00', (CURRENT_DATE - 6) + TIME '10:00:00', 'Point quotidien', 'terminée'),
    (24, 4, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '10:30:00', (CURRENT_DATE - 6) + TIME '12:00:00', 'Mise à jour base données', 'terminée'),
    (26, 6, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '14:00:00', (CURRENT_DATE - 6) + TIME '15:30:00', 'Inspection terrain', 'terminée'),
    (28, 2, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '11:00:00', (CURRENT_DATE - 6) + TIME '12:00:00', 'Entretien pré-embauche', 'terminée'),
    (30, 3, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '15:00:00', (CURRENT_DATE - 6) + TIME '16:30:00', 'Rapprochement bancaire', 'terminée'),
    (32, 5, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '08:30:00', (CURRENT_DATE - 6) + TIME '10:00:00', 'Appel d''offres', 'terminée'),
    (34, 8, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '13:00:00', (CURRENT_DATE - 6) + TIME '14:00:00', 'Dépannage serveur', 'terminée'),
    (36, 9, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '09:00:00', (CURRENT_DATE - 6) + TIME '10:30:00', 'Analyse données', 'terminée'),
    (38, 7, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '14:30:00', (CURRENT_DATE - 6) + TIME '16:00:00', 'Relations publiques', 'terminée'),
    (40, 10, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '10:00:00', (CURRENT_DATE - 6) + TIME '11:00:00', 'Évaluation formation', 'terminée');

-- Visites par personne (visites individuelles)
INSERT INTO visites_personne (id_visiteur, id_agent, date_p, heure_arrivee, heure_depart, statut) VALUES
    (1, 1, CURRENT_DATE, NOW() - INTERVAL '2 hours', NULL, 'en cours'),
    (5, 3, CURRENT_DATE, NOW() - INTERVAL '1 hour', NULL, 'en cours'),
    (9, 5, CURRENT_DATE, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', 'terminée'),
    (13, 7, CURRENT_DATE, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours', 'terminée'),
    (17, 9, CURRENT_DATE, NOW() - INTERVAL '30 minutes', NULL, 'en cours'),
    (21, 11, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '09:00:00', (CURRENT_DATE - 1) + TIME '10:30:00', 'terminée'),
    (25, 13, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '14:00:00', (CURRENT_DATE - 1) + TIME '15:00:00', 'terminée'),
    (29, 15, CURRENT_DATE - 1, (CURRENT_DATE - 1) + TIME '11:00:00', (CURRENT_DATE - 1) + TIME '12:30:00', 'terminée'),
    (33, 2, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '10:00:00', (CURRENT_DATE - 2) + TIME '11:30:00', 'terminée'),
    (37, 4, CURRENT_DATE - 2, (CURRENT_DATE - 2) + TIME '14:00:00', (CURRENT_DATE - 2) + TIME '15:00:00', 'terminée'),
    (2, 6, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '09:00:00', (CURRENT_DATE - 3) + TIME '10:00:00', 'terminée'),
    (6, 8, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '11:00:00', (CURRENT_DATE - 3) + TIME '12:30:00', 'terminée'),
    (10, 10, CURRENT_DATE - 3, (CURRENT_DATE - 3) + TIME '14:00:00', (CURRENT_DATE - 3) + TIME '15:30:00', 'terminée'),
    (14, 12, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '09:00:00', (CURRENT_DATE - 4) + TIME '10:00:00', 'terminée'),
    (18, 14, CURRENT_DATE - 4, (CURRENT_DATE - 4) + TIME '11:00:00', (CURRENT_DATE - 4) + TIME '12:00:00', 'terminée'),
    (22, 1, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '10:00:00', (CURRENT_DATE - 5) + TIME '11:30:00', 'terminée'),
    (26, 3, CURRENT_DATE - 5, (CURRENT_DATE - 5) + TIME '14:00:00', (CURRENT_DATE - 5) + TIME '15:00:00', 'terminée'),
    (30, 5, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '09:00:00', (CURRENT_DATE - 6) + TIME '10:30:00', 'terminée'),
    (34, 7, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '11:00:00', (CURRENT_DATE - 6) + TIME '12:00:00', 'terminée'),
    (38, 9, CURRENT_DATE - 6, (CURRENT_DATE - 6) + TIME '15:00:00', (CURRENT_DATE - 6) + TIME '16:00:00', 'terminée');

-- Compteur de séquence pour les tables séquentielles
SELECT setval('lieu_id_lieu_seq', (SELECT COALESCE(MAX(id_lieu), 1) FROM lieu));
SELECT setval('agent_id_agent_seq', (SELECT COALESCE(MAX(id_agent), 1) FROM agent));
SELECT setval('visiteurs_id_visiteur_seq', (SELECT COALESCE(MAX(id_visiteur), 1) FROM visiteurs));
SELECT setval('visites_lieu_id_visitelieu_seq', (SELECT COALESCE(MAX(id_visitelieu), 1) FROM visites_lieu));
SELECT setval('visites_personne_id_visitepersonne_seq', (SELECT COALESCE(MAX(id_visitepersonne), 1) FROM visites_personne));

SELECT 'Données de seed insérées avec succès !' AS status;
