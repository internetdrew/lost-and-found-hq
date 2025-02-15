export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      claim_messages: {
        Row: {
          claim_id: number
          created_at: string
          id: number
          message: string
          sender_type: Database["public"]["Enums"]["SENDER_TYPE"]
        }
        Insert: {
          claim_id: number
          created_at?: string
          id?: number
          message: string
          sender_type: Database["public"]["Enums"]["SENDER_TYPE"]
        }
        Update: {
          claim_id?: number
          created_at?: string
          id?: number
          message?: string
          sender_type?: Database["public"]["Enums"]["SENDER_TYPE"]
        }
        Relationships: [
          {
            foreignKeyName: "claim_messages_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "item_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      interested_parties: {
        Row: {
          created_at: string
          email_address: string
          id: number
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: number
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: number
        }
        Relationships: []
      }
      item_claims: {
        Row: {
          claim_details: string
          claimant_email: string
          claimant_first_name: string
          claimant_last_name: string
          created_at: string
          denial_reason: string | null
          id: number
          item_id: number
          location_id: string
          pickup_code: string | null
          status: Database["public"]["Enums"]["CLAIM_STATUS"]
          updated_at: string
        }
        Insert: {
          claim_details: string
          claimant_email: string
          claimant_first_name: string
          claimant_last_name: string
          created_at?: string
          denial_reason?: string | null
          id?: number
          item_id: number
          location_id: string
          pickup_code?: string | null
          status?: Database["public"]["Enums"]["CLAIM_STATUS"]
          updated_at?: string
        }
        Update: {
          claim_details?: string
          claimant_email?: string
          claimant_first_name?: string
          claimant_last_name?: string
          created_at?: string
          denial_reason?: string | null
          id?: number
          item_id?: number
          location_id?: string
          pickup_code?: string | null
          status?: Database["public"]["Enums"]["CLAIM_STATUS"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          added_by_user_id: string
          brief_description: string
          category: Database["public"]["Enums"]["ITEM_CATEGORIES"]
          created_at: string
          date_found: string
          found_at: string
          id: number
          is_public: boolean
          location_id: string
          staff_details: string
          status: Database["public"]["Enums"]["ITEM_STATUSES"]
          title: string
        }
        Insert: {
          added_by_user_id: string
          brief_description: string
          category: Database["public"]["Enums"]["ITEM_CATEGORIES"]
          created_at?: string
          date_found: string
          found_at: string
          id?: number
          is_public?: boolean
          location_id: string
          staff_details: string
          status?: Database["public"]["Enums"]["ITEM_STATUSES"]
          title: string
        }
        Update: {
          added_by_user_id?: string
          brief_description?: string
          category?: Database["public"]["Enums"]["ITEM_CATEGORIES"]
          created_at?: string
          date_found?: string
          found_at?: string
          id?: number
          is_public?: boolean
          location_id?: string
          staff_details?: string
          status?: Database["public"]["Enums"]["ITEM_STATUSES"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_added_by_user_id_fkey"
            columns: ["added_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          name: string
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          name: string
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          name?: string
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: number
          location_id: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: number
          location_id: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: number
          location_id?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
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
      CLAIM_STATUS:
        | "pending"
        | "approved"
        | "denied"
        | "needs_info"
        | "returned"
      ITEM_CATEGORIES:
        | "wallets"
        | "electronics"
        | "clothing"
        | "jewelry"
        | "keys"
        | "documents"
        | "bags"
        | "other"
      ITEM_STATUSES:
        | "pending"
        | "active"
        | "claimed"
        | "returned"
        | "donated"
        | "disposed"
        | "archived"
      SENDER_TYPE: "admin" | "claimant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

