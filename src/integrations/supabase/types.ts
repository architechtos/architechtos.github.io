export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      forum_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string | null
          id: string
          requester_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          addressee_id: string
          created_at?: string | null
          id?: string
          requester_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string
          created_at?: string | null
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          points: number
          reference_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          points: number
          reference_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_verification_document_url: string | null
          address_verification_status: string | null
          address_verified: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          phone: string | null
          phone_verified: boolean | null
          updated_at: string
          username: string
          verification_submitted_at: string | null
        }
        Insert: {
          address_verification_document_url?: string | null
          address_verification_status?: string | null
          address_verified?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username: string
          verification_submitted_at?: string | null
        }
        Update: {
          address_verification_document_url?: string | null
          address_verification_status?: string | null
          address_verified?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username?: string
          verification_submitted_at?: string | null
        }
        Relationships: []
      }
      rank_levels: {
        Row: {
          badge_color: string
          created_at: string | null
          id: number
          min_points: number
          name: string
        }
        Insert: {
          badge_color: string
          created_at?: string | null
          id?: number
          min_points: number
          name: string
        }
        Update: {
          badge_color?: string
          created_at?: string | null
          id?: number
          min_points?: number
          name?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          animal_type: string
          condition: string
          created_at: string
          description: string
          id: string
          image_urls: string[] | null
          location_description: string | null
          location_lat: number | null
          location_lng: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_type: string
          condition: string
          created_at?: string
          description: string
          id?: string
          image_urls?: string[] | null
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_type?: string
          condition?: string
          created_at?: string
          description?: string
          id?: string
          image_urls?: string[] | null
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stray_actions: {
        Row: {
          action_date: string
          action_description: string
          action_type: string
          created_at: string
          id: string
          stray_id: string
          user_id: string
        }
        Insert: {
          action_date?: string
          action_description: string
          action_type: string
          created_at?: string
          id?: string
          stray_id: string
          user_id: string
        }
        Update: {
          action_date?: string
          action_description?: string
          action_type?: string
          created_at?: string
          id?: string
          stray_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stray_actions_stray_id_fkey"
            columns: ["stray_id"]
            isOneToOne: false
            referencedRelation: "strays"
            referencedColumns: ["id"]
          },
        ]
      }
      stray_activities: {
        Row: {
          activity_date: string
          activity_description: string
          activity_type: string
          cost: number | null
          created_at: string
          id: string
          image_urls: string[] | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          quantity: number | null
          stray_id: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_description: string
          activity_type: string
          cost?: number | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          quantity?: number | null
          stray_id: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_description?: string
          activity_type?: string
          cost?: number | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          quantity?: number | null
          stray_id?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stray_activities_stray_id_fkey"
            columns: ["stray_id"]
            isOneToOne: false
            referencedRelation: "strays"
            referencedColumns: ["id"]
          },
        ]
      }
      stray_products: {
        Row: {
          created_at: string
          description: string
          id: string
          image_urls: string[] | null
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      strays: {
        Row: {
          age: number | null
          animal_type: string
          available_for_adoption: boolean | null
          birth_year: number | null
          characteristics: string[] | null
          coat_colors_tags: string[] | null
          created_at: string
          expenses_paid_by: string | null
          fur_colors: string | null
          gender: string | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_neutered: boolean | null
          location_description: string | null
          name: string
          neutering_date: string | null
          neutering_vet: string | null
          possible_relatives: string | null
          registered_by: string
          registerer_username: string | null
          relative_animals_tags: string[] | null
          story: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          animal_type?: string
          available_for_adoption?: boolean | null
          birth_year?: number | null
          characteristics?: string[] | null
          coat_colors_tags?: string[] | null
          created_at?: string
          expenses_paid_by?: string | null
          fur_colors?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_neutered?: boolean | null
          location_description?: string | null
          name: string
          neutering_date?: string | null
          neutering_vet?: string | null
          possible_relatives?: string | null
          registered_by: string
          registerer_username?: string | null
          relative_animals_tags?: string[] | null
          story?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          animal_type?: string
          available_for_adoption?: boolean | null
          birth_year?: number | null
          characteristics?: string[] | null
          coat_colors_tags?: string[] | null
          created_at?: string
          expenses_paid_by?: string | null
          fur_colors?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_neutered?: boolean | null
          location_description?: string | null
          name?: string
          neutering_date?: string | null
          neutering_vet?: string | null
          possible_relatives?: string | null
          registered_by?: string
          registerer_username?: string | null
          relative_animals_tags?: string[] | null
          story?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_badges: {
        Row: {
          badge_color: string
          badge_name: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          badge_color?: string
          badge_name: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_color?: string
          badge_name?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ranks: {
        Row: {
          created_at: string | null
          current_rank_id: number | null
          id: string
          points: number
          reports_count: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_rank_id?: number | null
          id: string
          points?: number
          reports_count?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_rank_id?: number | null
          id?: string
          points?: number
          reports_count?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_ranks_current_rank_id_fkey"
            columns: ["current_rank_id"]
            isOneToOne: false
            referencedRelation: "rank_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_points: {
        Args:
          | { user_id: number; points: number }
          | {
              user_id: string
              activity_type: string
              points_to_add: number
              reference_id?: string
            }
        Returns: undefined
      }
      get_user_role: {
        Args: { check_user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
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
