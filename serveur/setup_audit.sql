-- =====================================================
-- TABLE: audit_logs (journal d'audit)
-- Application VisiTrack - Traçabilité des actions
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(100),
    user_role VARCHAR(50),
    action VARCHAR(50) NOT NULL,        -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    entity_type VARCHAR(50) NOT NULL,   -- visite, visiteur, service, user, auth, etc.
    entity_id INT,                       -- ID de l'entité concernée (NULL si pas applicable)
    details JSONB,                       -- Changements ou métadonnées supplémentaires
    ip_address VARCHAR(45),              -- IPv4 ou IPv6
    user_agent TEXT,                     -- Navigateur / device
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);

-- Vérification
SELECT 'Table audit_logs créée avec succès !' AS status;
