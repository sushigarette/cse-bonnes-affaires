import { supabase } from './supabase'

export interface Article {
  id: string
  title: string
  content: string
  category: string
  author: string
  image_url?: string
  article_url?: string
  published: boolean
  created_at: string
  updated_at: string
  created_by?: string
  views?: number
}

export interface Promo {
  id: string
  title: string
  description: string
  code: string
  discount: string
  valid_until: string
  partner: string
  category: string
  image_url?: string
  website_url?: string
  active: boolean
  created_at: string
  updated_at: string
  created_by?: string
}

export interface Profile {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// Articles
export const getArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getArticleById = async (id: string): Promise<Article | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) throw error
  
  // Compter les vues
  const { count } = await supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', id)
  
  // Enregistrer la vue
  await recordArticleView(id)
  
  return {
    ...data,
    views: count || 0
  }
}

export const createArticle = async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateArticle = async (id: string, updates: Partial<Article>): Promise<Article> => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Promos
export const getPromos = async (): Promise<Promo[]> => {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getPromoById = async (id: string): Promise<Promo | null> => {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) throw error
  return data
}

export const createPromo = async (promo: Omit<Promo, 'id' | 'created_at' | 'updated_at'>): Promise<Promo> => {
  const { data, error } = await supabase
    .from('promos')
    .insert(promo)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updatePromo = async (id: string, updates: Partial<Promo>): Promise<Promo> => {
  const { data, error } = await supabase
    .from('promos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deletePromo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('promos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Profils
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Statistiques
export const getArticleStats = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .eq('published', true)

  if (error) throw error
  return { total: data?.length || 0 }
}

export const getPromoStats = async () => {
  const { data, error } = await supabase
    .from('promos')
    .select('id')
    .eq('active', true)

  if (error) throw error
  return { total: data?.length || 0 }
}

export const getWeeklyStats = async () => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .eq('published', true)
    .gte('created_at', oneWeekAgo.toISOString())

  if (error) throw error
  return { weekly: data?.length || 0 }
}

// Enregistrer les vues et utilisations
export const recordArticleView = async (articleId: string) => {
  const { error } = await supabase
    .from('article_views')
    .insert({ article_id: articleId })

  if (error) console.error('Erreur lors de l\'enregistrement de la vue:', error)
}

export const recordPromoUsage = async (promoId: string) => {
  const { error } = await supabase
    .from('promo_usage')
    .insert({ promo_id: promoId })

  if (error) console.error('Erreur lors de l\'enregistrement de l\'utilisation:', error)
}
