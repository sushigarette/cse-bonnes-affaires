-- Script pour ajouter le champ website_url à la table promos
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne website_url à la table promos
ALTER TABLE public.promos 
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.promos.website_url IS 'URL du site partenaire pour utiliser le code promo';

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'promos' 
AND column_name = 'website_url';
