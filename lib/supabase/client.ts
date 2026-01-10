import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// For client components (browser-side)
export const createBrowserClient = () => {
    return createClientComponentClient();
};

// Alternative direct client creation
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types for database tables
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string | null;
                    avatar_url: string | null;
                    daily_goal: number;
                    glass_size: number;
                    preferred_unit: 'ml' | 'oz' | 'cups';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    daily_goal?: number;
                    glass_size?: number;
                    preferred_unit?: 'ml' | 'oz' | 'cups';
                };
                Update: {
                    display_name?: string | null;
                    avatar_url?: string | null;
                    daily_goal?: number;
                    glass_size?: number;
                    preferred_unit?: 'ml' | 'oz' | 'cups';
                };
            };
            water_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    amount: number;
                    logged_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    amount: number;
                    logged_at?: string;
                };
                Update: {
                    amount?: number;
                    logged_at?: string;
                };
            };
            notification_settings: {
                Row: {
                    id: string;
                    user_id: string;
                    enabled: boolean;
                    start_time: string;
                    end_time: string;
                    interval_hours: number;
                    sound_enabled: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    enabled?: boolean;
                    start_time?: string;
                    end_time?: string;
                    interval_hours?: number;
                    sound_enabled?: boolean;
                };
                Update: {
                    enabled?: boolean;
                    start_time?: string;
                    end_time?: string;
                    interval_hours?: number;
                    sound_enabled?: boolean;
                };
            };
            health_data: {
                Row: {
                    id: string;
                    user_id: string;
                    data_type: string;
                    data_value: any;
                    recorded_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    data_type: string;
                    data_value: any;
                    recorded_at?: string;
                };
                Update: {
                    data_type?: string;
                    data_value?: any;
                };
            };
        };
    };
};