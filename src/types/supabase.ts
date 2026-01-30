export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          gallery_image_storage_paths: string[] | null
          gallery_image_urls: string[] | null
          icon: string | null
          id: string
          image_storage_path: string | null
          image_url: string | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: string[] | null
          icon?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: string[] | null
          icon?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          trip_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          trip_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          trip_type?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          country: string
          created_at: string | null
          gallery_image_storage_paths: string[] | null
          gallery_image_urls: string[] | null
          hero_image_url: string | null
          id: string
          image_storage_path: string | null
          image_url: string | null
          long_description: string | null
          name: string
          parent_id: string | null
          region: string | null
          short_description: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          long_description?: string | null
          name: string
          parent_id?: string | null
          region?: string | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          long_description?: string | null
          name?: string
          parent_id?: string | null
          region?: string | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destinations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_packages: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          name: string
          package_type: string | null
          price: number
          primary_category: string | null
          sort_order: number | null
          tour_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          package_type?: string | null
          price: number
          primary_category?: string | null
          sort_order?: number | null
          tour_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          package_type?: string | null
          price?: number
          primary_category?: string | null
          sort_order?: number | null
          tour_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_packages_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          rating: number | null
          source: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
          source?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
          source?: string | null
          text?: string
        }
        Relationships: []
      }
      tour_activities: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          tour_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          tour_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_activities_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_bullets: {
        Row: {
          created_at: string | null
          id: string
          sort_order: number | null
          text: string
          tour_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sort_order?: number | null
          text: string
          tour_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sort_order?: number | null
          text?: string
          tour_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_bullets_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_date_blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string | null
          id: string
          tour_date_package_id: string
        }
        Insert: {
          blocked_date: string
          created_at?: string | null
          id?: string
          tour_date_package_id: string
        }
        Update: {
          blocked_date?: string
          created_at?: string | null
          id?: string
          tour_date_package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_date_blocked_dates_tour_date_package_id_fkey"
            columns: ["tour_date_package_id"]
            isOneToOne: false
            referencedRelation: "tour_date_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_date_packages: {
        Row: {
          available_units: number | null
          created_at: string | null
          id: string
          override_price: number | null
          package_id: string | null
          tour_date_id: string | null
        }
        Insert: {
          available_units?: number | null
          created_at?: string | null
          id?: string
          override_price?: number | null
          package_id?: string | null
          tour_date_id?: string | null
        }
        Update: {
          available_units?: number | null
          created_at?: string | null
          id?: string
          override_price?: number | null
          package_id?: string | null
          tour_date_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_date_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pricing_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_date_packages_tour_date_id_fkey"
            columns: ["tour_date_id"]
            isOneToOne: false
            referencedRelation: "tour_dates"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_dates: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_available: boolean | null
          notes: string | null
          start_date: string
          tour_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          start_date: string
          tour_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          start_date?: string
          tour_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_dates_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_destinations: {
        Row: {
          created_at: string | null
          destination_id: string | null
          id: string
          tour_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          tour_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_destinations_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itinerary_items: {
        Row: {
          created_at: string | null
          day_number: number
          description: string | null
          id: string
          sort_order: number | null
          title: string
          tour_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_number: number
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
          tour_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_number?: number
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          tour_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_itinerary_items_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          activities_label: string | null
          age_max: number | null
          age_min: number | null
          age_range: string | null
          category: string | null
          created_at: string | null
          currency: string | null
          destination_id: string | null
          destination_label: string | null
          destination_name: string | null
          difficulty: string | null
          difficulty_label: string | null
          difficulty_level: string | null
          duration_days: number | null
          excludes: Json | null
          featured: boolean | null
          gallery_image_storage_paths: string[] | null
          gallery_image_urls: Json | null
          group_size_label: string | null
          group_size_max: number | null
          group_size_min: number | null
          hero_image_storage_path: string | null
          hero_image_url: string | null
          id: string
          includes: Json | null
          itinerary: Json | null
          long_description: string | null
          package_type: string | null
          price_packages: Json | null
          price_usd: number | null
          primary_price_category: string | null
          short_description: string | null
          slug: string
          start_dates: Json | null
          starting_price_from: number | null
          status: string | null
          subtitle: string | null
          title: string
          tour_label: string | null
          updated_at: string | null
        }
        Insert: {
          activities_label?: string | null
          age_max?: number | null
          age_min?: number | null
          age_range?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          destination_label?: string | null
          destination_name?: string | null
          difficulty?: string | null
          difficulty_label?: string | null
          difficulty_level?: string | null
          duration_days?: number | null
          excludes?: Json | null
          featured?: boolean | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: Json | null
          group_size_label?: string | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image_storage_path?: string | null
          hero_image_url?: string | null
          id?: string
          includes?: Json | null
          itinerary?: Json | null
          long_description?: string | null
          package_type?: string | null
          price_packages?: Json | null
          price_usd?: number | null
          primary_price_category?: string | null
          short_description?: string | null
          slug: string
          start_dates?: Json | null
          starting_price_from?: number | null
          status?: string | null
          subtitle?: string | null
          title: string
          tour_label?: string | null
          updated_at?: string | null
        }
        Update: {
          activities_label?: string | null
          age_max?: number | null
          age_min?: number | null
          age_range?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          destination_label?: string | null
          destination_name?: string | null
          difficulty?: string | null
          difficulty_label?: string | null
          difficulty_level?: string | null
          duration_days?: number | null
          excludes?: Json | null
          featured?: boolean | null
          gallery_image_storage_paths?: string[] | null
          gallery_image_urls?: Json | null
          group_size_label?: string | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image_storage_path?: string | null
          hero_image_url?: string | null
          id?: string
          includes?: Json | null
          itinerary?: Json | null
          long_description?: string | null
          package_type?: string | null
          price_packages?: Json | null
          price_usd?: number | null
          primary_price_category?: string | null
          short_description?: string | null
          slug?: string
          start_dates?: Json | null
          starting_price_from?: number | null
          status?: string | null
          subtitle?: string | null
          title?: string
          tour_label?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
