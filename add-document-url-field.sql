-- Ajouter le champ document_url aux tables articles et promos
-- Ce script permet de stocker des liens vers des documents (PDF, etc.)

-- Ajouter document_url à la table articles
ALTER TABLE articles 
ADD COLUMN document_url TEXT;

-- Ajouter document_url à la table promos  
ALTER TABLE promos 
ADD COLUMN document_url TEXT;

-- Ajouter des commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN articles.document_url IS 'URL vers un document associé (PDF, etc.)';
COMMENT ON COLUMN promos.document_url IS 'URL vers un document associé (PDF, etc.)';
