# MHCSE - Portail CSE

Portail pour le Comité Social et Économique permettant de partager articles, actualités et codes promo avec les collaborateurs.

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd cse-bonnes-affaires
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Supabase**
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Exécuter le script `supabase-schema.sql` dans l'éditeur SQL
   - Exécuter les scripts `add-website-url-field.sql` et `add-article-url-field.sql`
   - Créer un fichier `.env` avec vos clés Supabase :
     ```
     VITE_SUPABASE_URL=votre_url_supabase
     VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
     ```

4. **Créer un compte admin**
   - Créer un compte via l'interface d'authentification
   - Exécuter cette requête SQL :
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'votre-email@exemple.com';
     ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 📁 Structure

- `src/pages/` - Pages principales (Accueil, Articles, Promos, Admin)
- `src/components/` - Composants réutilisables
- `src/lib/` - Utilitaires et configuration Supabase
- `supabase-schema.sql` - Schéma de base de données principal
- `add-*.sql` - Scripts d'ajout de champs

## ✨ Fonctionnalités

- **Articles** : Création, édition, affichage avec éditeur de texte riche
- **Codes promo** : Gestion des réductions avec liens vers sites partenaires
- **Authentification** : Système de connexion/inscription
- **Administration** : Interface admin pour gérer le contenu
- **Mode sombre** : Thème clair/sombre
- **Responsive** : Interface adaptée mobile et desktop

## 🛠️ Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Supabase
- TipTap (éditeur de texte riche)
