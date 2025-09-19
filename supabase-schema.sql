-- Schéma SQL pour le portail CSE
-- À exécuter dans l'éditeur SQL de Supabase

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs (extension de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles
CREATE TABLE public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Table des codes promo
CREATE TABLE public.promos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  discount TEXT NOT NULL,
  valid_until DATE NOT NULL,
  partner TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Table des vues d'articles (pour les statistiques)
CREATE TABLE public.article_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Table des utilisations de codes promo (pour les statistiques)
CREATE TABLE public.promo_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  promo_id UUID REFERENCES public.promos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@cse.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_promos
  BEFORE UPDATE ON public.promos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Politiques de sécurité RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_usage ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les articles
CREATE POLICY "Tout le monde peut lire les articles publiés" ON public.articles
  FOR SELECT USING (published = true);

CREATE POLICY "Les admins peuvent tout faire sur les articles" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les promos
CREATE POLICY "Tout le monde peut lire les promos actives" ON public.promos
  FOR SELECT USING (active = true);

CREATE POLICY "Les admins peuvent tout faire sur les promos" ON public.promos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les vues d'articles
CREATE POLICY "Tout le monde peut créer des vues d'articles" ON public.article_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Les admins peuvent voir toutes les vues" ON public.article_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour l'utilisation des promos
CREATE POLICY "Tout le monde peut enregistrer l'utilisation d'une promo" ON public.promo_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Les admins peuvent voir toutes les utilisations" ON public.promo_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Données d'exemple pour les articles
INSERT INTO public.articles (title, content, category, author, image_url) VALUES
(
  'Nouvelle convention collective signée',
  'Une nouvelle convention collective a été signée avec la direction, apportant de nombreux avantages pour les salariés. Cette convention améliore les conditions de travail, les congés payés et les primes. Les négociations ont duré plusieurs mois et le CSE est satisfait des résultats obtenus.',
  'Social',
  'Comité CSE',
  '/placeholder.svg'
),
(
  'Organisation de la soirée de fin d''année',
  'Le CSE organise la soirée de fin d''année pour tous les collaborateurs. L''événement aura lieu le 15 décembre au Grand Hôtel. Inscription obligatoire avant le 30 septembre. Au programme : cocktail, dîner, spectacle et soirée dansante.',
  'Événement',
  'Bureau CSE',
  '/placeholder.svg'
),
(
  'Nouveaux horaires de la cantine d''entreprise',
  'À partir du 1er octobre, la cantine d''entreprise élargit ses horaires d''ouverture pour mieux s''adapter aux besoins des équipes. Service continu de 11h30 à 14h30. Nouveau menu végétarien disponible tous les jours.',
  'Pratique',
  'Service RH',
  '/placeholder.svg'
),
(
  'Programme de formation continue 2024',
  'Découvrez le nouveau programme de formation continue proposé par l''entreprise. Plus de 50 formations disponibles dans différents domaines : management, technique, langues, développement personnel.',
  'Formation',
  'Formation RH',
  '/placeholder.svg'
);

-- Données d'exemple pour les promos
INSERT INTO public.promos (title, description, code, discount, valid_until, partner, category, image_url) VALUES
(
  'Réduction cinéma UGC',
  'Bénéficiez de 30% de réduction sur vos places de cinéma UGC dans tous les cinémas de France',
  'CSE2024UGC',
  '-30%',
  '2024-12-31',
  'UGC Cinémas',
  'Loisirs',
  '/placeholder.svg'
),
(
  'Vacances Center Parcs',
  'Jusqu''à 25% de réduction sur vos séjours Center Parcs en famille, week-ends et vacances',
  'CENTERPARCS25',
  '-25%',
  '2025-02-28',
  'Center Parcs',
  'Vacances',
  '/placeholder.svg'
),
(
  'Carte restaurant Ticket Restaurant',
  '15% de bonus sur votre carte Ticket Restaurant pour tous vos repas',
  'RESTO15CSE',
  '+15%',
  '2024-12-31',
  'Edenred',
  'Restauration',
  '/placeholder.svg'
),
(
  'Abonnement salle de sport',
  '50% de réduction sur votre abonnement annuel dans les salles Basic Fit',
  'BASICFIT50',
  '-50%',
  '2024-11-15',
  'Basic Fit',
  'Sport',
  '/placeholder.svg'
),
(
  'Voyages SNCF Connect',
  '20% de réduction sur tous vos billets de train avec SNCF Connect',
  'SNCFCSE20',
  '-20%',
  '2024-12-30',
  'SNCF',
  'Transport',
  '/placeholder.svg'
),
(
  'Spectacles Fnac',
  'Tarif préférentiel sur tous les spectacles et concerts via Fnac Spectacles',
  'FNACSPEC',
  '-35%',
  '2025-01-31',
  'Fnac',
  'Culture',
  '/placeholder.svg'
);

-- Pour créer un utilisateur admin :
-- 1. Créez un compte via l'interface d'authentification du site
-- 2. Exécutez cette requête SQL pour lui donner les droits admin :
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'votre-email@exemple.com';
