# Configuration du Portail CSE

## Prérequis

- Node.js (version 18 ou supérieure)
- Un compte Supabase
- npm ou yarn

## Installation

1. **Cloner le projet et installer les dépendances :**
```bash
npm install
```

2. **Configurer Supabase :**
   - Créer un nouveau projet sur [supabase.com](https://supabase.com)
   - Aller dans Settings > API pour récupérer :
     - Project URL
     - Anon public key

3. **Configurer les variables d'environnement :**
   - Créer un fichier `.env` à la racine du projet
   - Ajouter les variables suivantes :
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. **Configurer la base de données :**
   - Aller dans l'éditeur SQL de Supabase
   - Exécuter le contenu du fichier `supabase-schema.sql`
   - Cela créera toutes les tables et politiques de sécurité nécessaires

5. **Créer un utilisateur admin :**
   - Aller dans Authentication > Users dans Supabase
   - Créer un nouvel utilisateur avec l'email `admin@cse.com`
   - Le mot de passe sera automatiquement défini
   - Le rôle admin sera automatiquement attribué grâce au trigger

6. **Lancer l'application :**
```bash
npm run dev
```

## Fonctionnalités

### Authentification
- Inscription et connexion via modal
- Gestion des rôles (user/admin)
- Protection des routes admin

### Pages publiques
- **Accueil** : Vue d'ensemble avec statistiques et derniers contenus
- **Articles** : Liste des articles avec filtres et recherche
- **Codes Promo** : Liste des codes promo avec filtres et recherche

### Administration (réservé aux admins)
- **Gestion des articles** : Création, modification, suppression
- **Gestion des codes promo** : Création, modification, suppression
- **Statistiques** : Nombre d'articles, promos, vues, etc.

## Structure de la base de données

### Tables principales
- `profiles` : Profils utilisateurs (extension de auth.users)
- `articles` : Articles du portail
- `promos` : Codes promo et avantages
- `article_views` : Statistiques de vues des articles
- `promo_usage` : Statistiques d'utilisation des codes promo

### Sécurité
- Row Level Security (RLS) activé sur toutes les tables
- Politiques de sécurité pour contrôler l'accès aux données
- Seuls les admins peuvent modifier les articles et promos
- Les utilisateurs peuvent seulement lire les contenus publics

## Déploiement

1. **Build de production :**
```bash
npm run build
```

2. **Déployer sur Vercel/Netlify :**
   - Connecter le repository
   - Ajouter les variables d'environnement
   - Déployer

## Utilisation

### Pour les utilisateurs
1. Se connecter ou s'inscrire via le bouton "Connexion"
2. Naviguer dans les articles et codes promo
3. Utiliser les filtres et la recherche

### Pour les administrateurs
1. Se connecter avec un compte admin
2. Aller sur la page Administration
3. Créer/modifier/supprimer des articles et codes promo
4. Consulter les statistiques

## Support

Pour toute question ou problème, consulter la documentation Supabase ou créer une issue sur le repository.
