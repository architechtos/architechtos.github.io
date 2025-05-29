export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          avatar_url: string | null
          created_at: string
          id: string
          phone: string | null
          phone_verified: boolean | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username?: string
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
      strays: {
        Row: {
          age: number | null
          birth_year: number | null
          characteristics: string[] | null
          coat_colors_tags: string[] | null
          created_at: string
          expenses_paid_by: string | null
          fur_colors: string | null
          gender: string | null
          id: string
          image_url: string | null
          is_neutered: boolean | null
          location_description: string | null
          name: string
          neutering_date: string | null
          neutering_vet: string | null
          possible_relatives: string | null
          registered_by: string
          relative_animals_tags: string[] | null
          story: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          birth_year?: number | null
          characteristics?: string[] | null
          coat_colors_tags?: string[] | null
          created_at?: string
          expenses_paid_by?: string | null
          fur_colors?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          is_neutered?: boolean | null
          location_description?: string | null
          name: string
          neutering_date?: string | null
          neutering_vet?: string | null
          possible_relatives?: string | null
          registered_by: string
          relative_animals_tags?: string[] | null
          story?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          birth_year?: number | null
          characteristics?: string[] | null
          coat_colors_tags?: string[] | null
          created_at?: string
          expenses_paid_by?: string | null
          fur_colors?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          is_neutered?: boolean | null
          location_description?: string | null
          name?: string
          neutering_date?: string | null
          neutering_vet?: string | null
          possible_relatives?: string | null
          registered_by?: string
          relative_animals_tags?: string[] | null
          story?: string | null
          updated_at?: string
        }
        Relationships: []
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
