-- Script pour ajouter le champ article_url à la table articles
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne article_url à la table articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS article_url TEXT;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.articles.article_url IS 'URL externe vers l''article complet ou la source';

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND column_name = 'article_url';
