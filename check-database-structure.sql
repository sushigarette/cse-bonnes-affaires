-- Script pour vérifier la structure actuelle de la base de données
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier la structure de la table articles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier la structure de la table promos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'promos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier spécifiquement les colonnes qui nous intéressent
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('articles', 'promos') 
AND table_schema = 'public'
AND column_name IN ('article_url', 'document_url', 'website_url')
ORDER BY table_name, column_name;
