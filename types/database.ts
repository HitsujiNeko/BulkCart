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
          weight_kg: number;
          training_days_per_week: number;
          cooking_time_per_meal: number;
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
          weight_kg: number;
          training_days_per_week: number;
          cooking_time_per_meal: number;
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
          weight_kg?: number;
          training_days_per_week?: number;
          cooking_time_per_meal?: number;
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
          description: string | null;
          cooking_time_minutes: number;
          difficulty: 'easy' | 'medium' | 'hard';
          calories_per_serving: number;
          protein_per_serving: number;
          fat_per_serving: number;
          carbs_per_serving: number;
          tags: string[];
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          cooking_time_minutes: number;
          difficulty: 'easy' | 'medium' | 'hard';
          calories_per_serving: number;
          protein_per_serving: number;
          fat_per_serving: number;
          carbs_per_serving: number;
          tags?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          cooking_time_minutes?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          calories_per_serving?: number;
          protein_per_serving?: number;
          fat_per_serving?: number;
          carbs_per_serving?: number;
          tags?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          normalized_name: string;
          category: 'meat' | 'fish' | 'dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          normalized_name: string;
          category: 'meat' | 'fish' | 'dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          normalized_name?: string;
          category?: 'meat' | 'fish' | 'dairy' | 'vegetable' | 'grain' | 'seasoning' | 'other';
          unit?: string;
          created_at?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          ingredient_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          instruction: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          step_number: number;
          instruction: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          step_number?: number;
          instruction?: string;
          created_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          status: 'draft' | 'active' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          status?: 'draft' | 'active' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          status?: 'draft' | 'active' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_slots: {
        Row: {
          id: string;
          meal_plan_id: string;
          recipe_id: string;
          day_of_week: number;
          meal_type: 'lunch' | 'dinner' | 'snack';
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_plan_id: string;
          recipe_id: string;
          day_of_week: number;
          meal_type: 'lunch' | 'dinner' | 'snack';
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_plan_id?: string;
          recipe_id?: string;
          day_of_week?: number;
          meal_type?: 'lunch' | 'dinner' | 'snack';
          created_at?: string;
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
