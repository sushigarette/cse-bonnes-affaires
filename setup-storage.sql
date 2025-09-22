-- Configuration de Supabase Storage pour l'hébergement de fichiers
-- Ce script configure un bucket pour stocker les documents PDF

-- Créer le bucket pour les documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Politique RLS pour permettre la lecture publique des documents
CREATE POLICY "Documents are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

-- Politique RLS pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Politique RLS pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Politique RLS pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);
