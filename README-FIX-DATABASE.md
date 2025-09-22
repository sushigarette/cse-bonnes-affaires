# Correction du problème d'upload de documents

## Problème
L'erreur HTTP 400 avec le code PostgREST PGRST204 indique que les colonnes `website_url` et `document_url` n'existent pas dans la base de données Supabase.

## Solution

### 1. Exécuter le script de migration
Connectez-vous à votre projet Supabase et exécutez le script `fix-database-columns.sql` dans l'éditeur SQL :

```sql
-- Le script ajoute automatiquement les colonnes manquantes
-- Voir le fichier fix-database-columns.sql
```

### 2. Vérifier la structure
Exécutez le script `check-database-structure.sql` pour vérifier que les colonnes ont été ajoutées :

```sql
-- Vérification de la structure des tables
-- Voir le fichier check-database-structure.sql
```

### 3. Colonnes ajoutées

**Table `articles` :**
- `article_url` (TEXT) - URL vers l'article externe
- `document_url` (TEXT) - URL vers le document PDF associé

**Table `promos` :**
- `website_url` (TEXT) - URL vers le site web du partenaire  
- `document_url` (TEXT) - URL vers le document PDF associé

### 4. Test
Après avoir exécuté la migration :
1. Rechargez votre application
2. Essayez de créer une nouvelle promo avec un document
3. L'upload devrait maintenant fonctionner correctement

## Fichiers de migration
- `fix-database-columns.sql` - Script principal de migration
- `check-database-structure.sql` - Script de vérification
- `migration-add-document-fields.sql` - Script de migration complet avec vérifications

## Note
Cette migration est sûre et n'affecte pas les données existantes. Les nouvelles colonnes sont optionnelles (NULL autorisé).
