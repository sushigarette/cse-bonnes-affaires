# Configuration de Supabase Storage

Ce guide explique comment configurer Supabase Storage pour l'upload de fichiers PDF dans l'application CSE Bonnes Affaires.

## 1. Configuration du bucket de stockage

### Via l'interface Supabase Dashboard

1. Connectez-vous à votre projet Supabase
2. Allez dans **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Nom du bucket : `documents`
5. Cochez **Public bucket** pour permettre l'accès public aux fichiers
6. Cliquez sur **Create bucket**

### Via SQL (recommandé)

Exécutez le script `setup-storage.sql` dans l'éditeur SQL de Supabase :

```sql
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
```

## 2. Configuration des politiques RLS

Les politiques RLS (Row Level Security) sont configurées pour :

- **Lecture publique** : Tous les utilisateurs peuvent voir les documents
- **Upload authentifié** : Seuls les utilisateurs connectés peuvent uploader
- **Modification authentifiée** : Seuls les utilisateurs connectés peuvent modifier
- **Suppression authentifiée** : Seuls les utilisateurs connectés peuvent supprimer

## 3. Fonctionnalités de l'upload

### Composant FileUpload

Le composant `FileUpload` offre :

- **Drag & Drop** : Glisser-déposer des fichiers PDF
- **Sélection de fichier** : Clic pour ouvrir le sélecteur de fichiers
- **Validation** : Vérification du type (PDF uniquement) et de la taille (10MB max)
- **Prévisualisation** : Affichage du fichier uploadé avec boutons d'action
- **Suppression** : Suppression du fichier du storage
- **Gestion d'erreurs** : Messages d'erreur informatifs

### Intégration dans l'administration

- **Formulaires d'articles** : Upload de documents PDF associés
- **Formulaires de promos** : Upload de documents PDF associés
- **Gestion automatique** : Suppression des anciens fichiers lors des mises à jour
- **Nettoyage** : Suppression des fichiers lors de la suppression d'articles/promos

## 4. Structure des fichiers

```
documents/
├── 1703123456789-abc123def456.pdf
├── 1703123456790-xyz789uvw012.pdf
└── ...
```

Les fichiers sont nommés avec un timestamp et un identifiant unique pour éviter les conflits.

## 5. Sécurité

- **Authentification requise** : Seuls les utilisateurs connectés peuvent uploader/modifier/supprimer
- **Validation des types** : Seuls les fichiers PDF sont acceptés
- **Limite de taille** : 10MB maximum par fichier
- **URLs publiques** : Les documents sont accessibles publiquement via des URLs sécurisées

## 6. Utilisation

1. **Créer un article/promo** : Utilisez le composant d'upload dans le formulaire
2. **Modifier un document** : Remplacez le fichier existant (l'ancien sera supprimé automatiquement)
3. **Supprimer un article/promo** : Le document associé sera supprimé automatiquement
4. **Accéder aux documents** : Les utilisateurs peuvent cliquer sur "Document" dans les cartes ou pages de détail

## 7. Dépannage

### Erreur d'upload
- Vérifiez que le bucket `documents` existe
- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur est authentifié

### Erreur d'accès
- Vérifiez que le bucket est public
- Vérifiez que la politique de lecture publique est active

### Fichier non trouvé
- Vérifiez que l'URL du fichier est correcte
- Vérifiez que le fichier existe dans le bucket
