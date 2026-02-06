// Tipos generados automáticamente por Supabase
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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: number
          code: string
          name: string
          description: string | null
          price: number
          status_id: number
          category_id: number
          city_id: number
          zone_id: number | null
          rooms: number | null
          bathrooms: number | null
          area: number | null
          kitchen: number | null
          hall: number | null
          dining: number | null
          closet: number | null
          clothing: number | null
          gas: number | null
          dressing: number | null
          created_at: string
          updated_at: string
        }
      }
      property_amenities: {
        Row: {
          id: number
          property_id: number
          amenity_id: number
          created_at: string
        }
      }
      categorias: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
      }
      amenities: {
        Row: {
          id: number
          name: string
          icon: string | null
          created_at: string
        }
      }
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
        }
      }
      state: {
        Row: {
          id: number
          name: string
        }
      }
      city: {
        Row: {
          id: number
          name: string
          state_id: number
        }
      }
      zone: {
        Row: {
          id: number
          name: string
          city_id: number
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
