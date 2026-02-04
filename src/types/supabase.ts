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
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
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
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          name: string
          region: string | null
          short_description: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          long_description?: string | null
          name: string
          region?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          long_description?: string | null
          name?: string
          region?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      price_packages: {
        Row: {
          adult_crossed_price: number | null
          adult_max_pax: number | null
          adult_min_pax: number | null
          adult_price: number
          child_age_max: number | null
          child_age_min: number | null
          child_crossed_price: number | null
          child_max_pax: number | null
          child_min_pax: number | null
          child_price: number | null
          created_at: string | null
          description: string | null
          group_discount_enabled: boolean | null
          group_discount_min_pax: number | null
          group_discount_percentage: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          sort_order: number | null
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          adult_crossed_price?: number | null
          adult_max_pax?: number | null
          adult_min_pax?: number | null
          adult_price: number
          child_age_max?: number | null
          child_age_min?: number | null
          child_crossed_price?: number | null
          child_max_pax?: number | null
          child_min_pax?: number | null
          child_price?: number | null
          created_at?: string | null
          description?: string | null
          group_discount_enabled?: boolean | null
          group_discount_min_pax?: number | null
          group_discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          adult_crossed_price?: number | null
          adult_max_pax?: number | null
          adult_min_pax?: number | null
          adult_price?: number
          child_age_max?: number | null
          child_age_min?: number | null
          child_crossed_price?: number | null
          child_max_pax?: number | null
          child_min_pax?: number | null
          child_price?: number | null
          created_at?: string | null
          description?: string | null
          group_discount_enabled?: boolean | null
          group_discount_min_pax?: number | null
          group_discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_packages_tour_id_fkey"
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
          text: string
          tour_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
          text: string
          tour_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
          text?: string
          tour_name?: string | null
        }
        Relationships: []
      }
      tour_activities: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          tour_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          tour_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          tour_id?: string
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
          created_at: string | null
          enabled: boolean | null
          id: string
          max_pax_override: number | null
          notes: string | null
          package_id: string
          price_override: number | null
          tour_date_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_pax_override?: number | null
          notes?: string | null
          package_id: string
          price_override?: number | null
          tour_date_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_pax_override?: number | null
          notes?: string | null
          package_id?: string
          price_override?: number | null
          tour_date_id?: string
          updated_at?: string | null
        }
        Relationships: [
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
          max_participants: number | null
          notes: string | null
          repeat_enabled: boolean | null
          repeat_pattern: string | null
          repeat_until: string | null
          start_date: string
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          notes?: string | null
          repeat_enabled?: boolean | null
          repeat_pattern?: string | null
          repeat_until?: string | null
          start_date: string
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_available?: boolean | null
          max_participants?: number | null
          notes?: string | null
          repeat_enabled?: boolean | null
          repeat_pattern?: string | null
          repeat_until?: string | null
          start_date?: string
          tour_id?: string
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
      tours: {
        Row: {
          age_max: number | null
          age_min: number | null
          base_price_usd: number | null
          category: string | null
          created_at: string | null
          currency: string | null
          destination_id: string | null
          difficulty: string | null
          duration_days: number | null
          excludes: Json | null
          faqs: Json | null
          featured: boolean | null
          gallery_images: string[] | null
          group_size_max: number | null
          group_size_min: number | null
          hero_image_url: string | null
          id: string
          includes: Json | null
          itinerary: Json | null
          long_description: string | null
          short_description: string | null
          slug: string
          status: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          base_price_usd?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          excludes?: Json | null
          faqs?: Json | null
          featured?: boolean | null
          gallery_images?: string[] | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image_url?: string | null
          id?: string
          includes?: Json | null
          itinerary?: Json | null
          long_description?: string | null
          short_description?: string | null
          slug: string
          status?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          base_price_usd?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          excludes?: Json | null
          faqs?: Json | null
          featured?: boolean | null
          gallery_images?: string[] | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image_url?: string | null
          id?: string
          includes?: Json | null
          itinerary?: Json | null
          long_description?: string | null
          short_description?: string | null
          slug?: string
          status?: string | null
          subtitle?: string | null
          title?: string
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
