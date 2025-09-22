# Ajout des titres personnalisés pour les documents PDF

## Fonctionnalité ajoutée
Possibilité de donner un titre personnalisé aux documents PDF uploadés dans les articles et promos.

## Modifications apportées

### 1. **Base de données**
- Ajout de la colonne `document_title` (TEXT) aux tables `articles` et `promos`
- Colonne optionnelle (peut être NULL)

### 2. **Interfaces TypeScript**
- Mise à jour des interfaces `Article` et `Promo` dans `src/lib/database.ts`
- Mise à jour des types Supabase dans `src/types/supabase.ts`

### 3. **Composant FileUpload**
- Ajout d'un champ de saisie pour le titre du document
- Le titre est transmis lors de l'upload du fichier
- Affichage du titre personnalisé dans la prévisualisation

### 4. **Interface d'administration**
- Gestion du titre du document dans les formulaires d'articles et promos
- Sauvegarde et mise à jour du titre lors des modifications

### 5. **Affichage public**
- Affichage du titre personnalisé dans `ArticleDetail` et `PromoDetail`
- Fallback sur "Document PDF" si aucun titre n'est défini

## Installation

### 1. Exécuter le script SQL
Connectez-vous à votre projet Supabase et exécutez le script `add-document-title-columns.sql` dans l'éditeur SQL.

### 2. Redémarrer l'application
L'application détectera automatiquement les nouvelles colonnes et fonctionnalités.

## Utilisation

### Dans l'interface d'administration :
1. Lors de l'upload d'un document PDF, saisissez un titre personnalisé
2. Le titre sera affiché dans la section "Document associé" des articles/promos
3. Le titre peut être modifié lors de l'édition

### Dans l'affichage public :
- Le titre personnalisé remplace "Document PDF" générique
- Si aucun titre n'est défini, "Document PDF" est affiché par défaut

## Avantages
- **Meilleure UX** : Les utilisateurs voient un titre descriptif au lieu de "Document PDF"
- **Flexibilité** : Chaque document peut avoir un titre unique et significatif
- **Rétrocompatibilité** : Les documents existants continuent de fonctionner
- **Optionnel** : Le titre n'est pas obligatoire, l'ancien comportement est préservé

## Fichiers modifiés
- `src/lib/database.ts` - Interfaces Article et Promo
- `src/types/supabase.ts` - Types Supabase
- `src/components/FileUpload.tsx` - Composant d'upload avec titre
- `src/pages/Admin.tsx` - Interface d'administration
- `src/pages/ArticleDetail.tsx` - Affichage des articles
- `src/pages/PromoDetail.tsx` - Affichage des promos
- `add-document-title-columns.sql` - Script de migration
