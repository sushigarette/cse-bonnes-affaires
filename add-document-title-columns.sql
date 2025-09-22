-- Script pour ajouter la colonne document_title aux tables
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne document_title à la table articles si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'document_title'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN document_title TEXT;
        RAISE NOTICE 'Colonne document_title ajoutée à la table articles';
    ELSE
        RAISE NOTICE 'Colonne document_title existe déjà dans la table articles';
    END IF;
END $$;

-- Ajouter la colonne document_title à la table promos si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'document_title'
    ) THEN
        ALTER TABLE public.promos ADD COLUMN document_title TEXT;
        RAISE NOTICE 'Colonne document_title ajoutée à la table promos';
    ELSE
        RAISE NOTICE 'Colonne document_title existe déjà dans la table promos';
    END IF;
END $$;

-- Ajouter des commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN public.articles.document_title IS 'Titre personnalisé du document PDF associé';
COMMENT ON COLUMN public.promos.document_title IS 'Titre personnalisé du document PDF associé';

-- Vérifier que les colonnes ont été ajoutées correctement
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('articles', 'promos') 
AND table_schema = 'public'
AND column_name = 'document_title'
ORDER BY table_name;
