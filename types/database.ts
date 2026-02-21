/**
 * BulkCart データベース型定義
 * 
 * Supabase から自動生成される型定義の雛形です。
 * 実際の運用では、Supabase CLI で以下のコマンドを実行して型を生成します：
 * 
 * ```bash
 * npx supabase gen types typescript --project-id your-project-id > types/database.ts
 * ```
 * 
 * @see https://supabase.com/docs/guides/api/generating-types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          goal: 'bulk' | 'cut' | 'maintain';
          weight_kg: number | null;
          training_days_per_week: number;
          cooking_time_weekday: number | null;
          cooking_time_weekend: number | null;
          budget_level: 'low' | 'medium' | 'high';
          allergies: string[] | null;
          disliked_ingredients: string[] | null;
          subscription_status: 'free' | 'pro' | 'canceled';
          subscription_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          goal: 'bulk' | 'cut' | 'maintain';
          weight_kg?: number | null;
          training_days_per_week: number;
          cooking_time_weekday?: number | null;
          cooking_time_weekend?: number | null;
          budget_level?: 'low' | 'medium' | 'high';
          allergies?: string[] | null;
          disliked_ingredients?: string[] | null;
          subscription_status?: 'free' | 'pro' | 'canceled';
          subscription_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          goal?: 'bulk' | 'cut' | 'maintain';
          weight_kg?: number | null;
          training_days_per_week?: number;
          cooking_time_weekday?: number | null;
          cooking_time_weekend?: number | null;
          budget_level?: 'low' | 'medium' | 'high';
          allergies?: string[] | null;
          disliked_ingredients?: string[] | null;
          subscription_status?: 'free' | 'pro' | 'canceled';
          subscription_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          cooking_time: number;
          difficulty: 'easy' | 'medium' | 'hard';
          protein_g: number;
          fat_g: number;
          carb_g: number;
          calories: number;
          tags: string[];
          steps: Json;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cooking_time: number;
          difficulty: 'easy' | 'medium' | 'hard';
          protein_g: number;
          fat_g: number;
          carb_g: number;
          calories: number;
          tags?: string[];
          steps?: Json;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cooking_time?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          protein_g?: number;
          fat_g?: number;
          carb_g?: number;
          calories?: number;
          tags?: string[];
          steps?: Json;
          image_url?: string | null;
          created_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          aliases: string[];
          category: 'meat' | 'fish' | 'egg_dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit: string;
          avg_price_per_unit: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          aliases?: string[];
          category: 'meat' | 'fish' | 'egg_dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit: string;
          avg_price_per_unit?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          aliases?: string[];
          category?: 'meat' | 'fish' | 'egg_dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit?: string;
          avg_price_per_unit?: number | null;
          created_at?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          amount: number;
          unit: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_id: string;
          amount: number;
          unit: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          ingredient_id?: string;
          amount?: number;
          unit?: string;
          notes?: string | null;
        };
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          goal: 'bulk' | 'cut' | 'maintain';
          total_protein_g: number | null;
          total_calories: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          goal: 'bulk' | 'cut' | 'maintain';
          total_protein_g?: number | null;
          total_calories?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          goal?: 'bulk' | 'cut' | 'maintain';
          total_protein_g?: number | null;
          total_calories?: number | null;
          created_at?: string;
        };
      };
      plan_items: {
        Row: {
          id: string;
          plan_id: string;
          day_of_week: number;
          meal_slot: 'lunch' | 'dinner' | 'snack';
          recipe_id: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          day_of_week: number;
          meal_slot: 'lunch' | 'dinner' | 'snack';
          recipe_id: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          day_of_week?: number;
          meal_slot?: 'lunch' | 'dinner' | 'snack';
          recipe_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      goal_type: 'bulk' | 'cut' | 'maintain';
      difficulty_level: 'easy' | 'medium' | 'hard';
      ingredient_category: 'meat' | 'fish' | 'dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
      meal_type: 'lunch' | 'dinner' | 'snack';
      subscription_status_type: 'free' | 'pro' | 'canceled';
      budget_level_type: 'low' | 'medium' | 'high';
      meal_plan_status: 'draft' | 'active' | 'completed';
    };
  };
}
