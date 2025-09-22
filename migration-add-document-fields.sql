-- Migration pour ajouter les champs de documents et URLs
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter les colonnes manquantes à la table articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS article_url TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 2. Ajouter les colonnes manquantes à la table promos  
ALTER TABLE public.promos 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 3. Ajouter des commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN public.articles.article_url IS 'URL vers l''article externe';
COMMENT ON COLUMN public.articles.document_url IS 'URL vers le document PDF associé';
COMMENT ON COLUMN public.promos.website_url IS 'URL vers le site web du partenaire';
COMMENT ON COLUMN public.promos.document_url IS 'URL vers le document PDF associé';

-- 4. Vérifier que les colonnes ont été ajoutées correctement
DO $$
BEGIN
    -- Vérifier les colonnes de la table articles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'article_url'
    ) THEN
        RAISE EXCEPTION 'La colonne article_url n''a pas été ajoutée à la table articles';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        RAISE EXCEPTION 'La colonne document_url n''a pas été ajoutée à la table articles';
    END IF;
    
    -- Vérifier les colonnes de la table promos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'website_url'
    ) THEN
        RAISE EXCEPTION 'La colonne website_url n''a pas été ajoutée à la table promos';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        RAISE EXCEPTION 'La colonne document_url n''a pas été ajoutée à la table promos';
    END IF;
    
    RAISE NOTICE 'Migration réussie : toutes les colonnes ont été ajoutées correctement';
END $$;

-- 5. Afficher la structure des tables pour vérification
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('articles', 'promos') 
AND table_schema = 'public'
AND column_name IN ('article_url', 'document_url', 'website_url')
ORDER BY table_name, column_name;
