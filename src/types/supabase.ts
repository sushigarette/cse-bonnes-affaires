// Types pour Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          author: string
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          author: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          author?: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      promos: {
        Row: {
          id: string
          title: string
          description: string
          code: string
          discount: string
          valid_until: string
          partner: string
          category: string
          image_url: string | null
          active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          code: string
          discount: string
          valid_until: string
          partner: string
          category: string
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          code?: string
          discount?: string
          valid_until?: string
          partner?: string
          category?: string
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
  }
}
