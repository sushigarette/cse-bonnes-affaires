-- Script complet pour ajouter toutes les colonnes manquantes
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter les colonnes manquantes à la table articles
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
        RAISE NOTICE 'Colonne article_url ajoutée à la table articles';
    END IF;
    
    -- Ajouter document_url à articles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN document_url TEXT;
        RAISE NOTICE 'Colonne document_url ajoutée à la table articles';
    END IF;
    
    -- Ajouter document_title à articles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND table_schema = 'public'
        AND column_name = 'document_title'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN document_title TEXT;
        RAISE NOTICE 'Colonne document_title ajoutée à la table articles';
    END IF;
END $$;

-- 2. Ajouter les colonnes manquantes à la table promos
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
        RAISE NOTICE 'Colonne website_url ajoutée à la table promos';
    END IF;
    
    -- Ajouter document_url à promos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'document_url'
    ) THEN
        ALTER TABLE public.promos ADD COLUMN document_url TEXT;
        RAISE NOTICE 'Colonne document_url ajoutée à la table promos';
    END IF;
    
    -- Ajouter document_title à promos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promos' 
        AND table_schema = 'public'
        AND column_name = 'document_title'
    ) THEN
        ALTER TABLE public.promos ADD COLUMN document_title TEXT;
        RAISE NOTICE 'Colonne document_title ajoutée à la table promos';
    END IF;
END $$;

-- 3. Ajouter des commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN public.articles.article_url IS 'URL vers l''article externe';
COMMENT ON COLUMN public.articles.document_url IS 'URL vers le document PDF associé';
COMMENT ON COLUMN public.articles.document_title IS 'Titre personnalisé du document PDF associé';
COMMENT ON COLUMN public.promos.website_url IS 'URL vers le site web du partenaire';
COMMENT ON COLUMN public.promos.document_url IS 'URL vers le document PDF associé';
COMMENT ON COLUMN public.promos.document_title IS 'Titre personnalisé du document PDF associé';

-- 4. Vérifier que toutes les colonnes ont été ajoutées correctement
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('articles', 'promos') 
AND table_schema = 'public'
AND column_name IN ('article_url', 'document_url', 'document_title', 'website_url')
ORDER BY table_name, column_name;
