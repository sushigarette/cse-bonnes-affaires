-- Script simple pour ajouter les colonnes manquantes
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes à la table articles si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter article_url à articles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'article_url'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN article_url TEXT;
    END IF;
    
    -- Ajouter document_url à articles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN document_url TEXT;
    END IF;
END $$;

-- Ajouter les colonnes à la table promos si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter website_url à promos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'website_url'
    ) THEN
        ALTER TABLE public.promos ADD COLUMN website_url TEXT;
    END IF;
    
    -- Ajouter document_url à promos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        ALTER TABLE public.promos ADD COLUMN document_url TEXT;
    END IF;
END $$;

-- Vérifier que tout a été ajouté
SELECT 'Articles' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
AND column_name IN ('article_url', 'document_url')

UNION ALL

SELECT 'Promos' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promos' 
AND table_schema = 'public'
AND column_name IN ('website_url', 'document_url')

ORDER BY table_name, column_name;
