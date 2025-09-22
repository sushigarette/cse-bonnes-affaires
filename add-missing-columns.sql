-- Script pour ajouter les colonnes manquantes aux tables
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes manquantes à la table articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS article_url TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- Ajouter les colonnes manquantes à la table promos
ALTER TABLE public.promos 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
AND column_name IN ('article_url', 'document_url');

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'promos' 
AND table_schema = 'public'
AND column_name IN ('website_url', 'document_url');
