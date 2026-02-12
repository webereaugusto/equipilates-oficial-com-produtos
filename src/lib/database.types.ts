// Tipos gerados para o banco de dados Supabase
// Equipilates - Sistema de Produtos

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          title: string
          slug: string
          short_description: string
          detailed_description: string
          technical_specs: Json
          price: number
          optional_items: Json | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_text: string | null
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string
          // Translation fields
          title_en: string | null
          title_es: string | null
          title_de: string | null
          short_description_en: string | null
          short_description_es: string | null
          short_description_de: string | null
          detailed_description_en: string | null
          detailed_description_es: string | null
          detailed_description_de: string | null
        }
        Insert: {
          id?: string
          category_id: string
          title: string
          slug: string
          short_description: string
          detailed_description: string
          technical_specs?: Json
          price: number
          optional_items?: Json | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_text?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
          // Translation fields
          title_en?: string | null
          title_es?: string | null
          title_de?: string | null
          short_description_en?: string | null
          short_description_es?: string | null
          short_description_de?: string | null
          detailed_description_en?: string | null
          detailed_description_es?: string | null
          detailed_description_de?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          title?: string
          slug?: string
          short_description?: string
          detailed_description?: string
          technical_specs?: Json
          price?: number
          optional_items?: Json | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_text?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
          // Translation fields
          title_en?: string | null
          title_es?: string | null
          title_de?: string | null
          short_description_en?: string | null
          short_description_es?: string | null
          short_description_de?: string | null
          detailed_description_en?: string | null
          detailed_description_es?: string | null
          detailed_description_de?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          is_primary: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          is_primary?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          is_primary?: boolean
          order_index?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para uso na aplicação
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']

// Tipo para produto com categoria e imagens (join)
export interface ProductWithDetails extends Product {
  category: Category
  images: ProductImage[]
}

// Tipo para especificações técnicas
export interface TechnicalSpec {
  item: string
  quantity?: number
}

// Tipo para itens opcionais
export interface OptionalItem {
  name: string
  price: number
}
