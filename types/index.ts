// User Profile Types
export interface UserProfile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    daily_goal: number;
    glass_size: number;
    preferred_unit: 'ml' | 'oz' | 'cups';
    created_at: string;
    updated_at: string;
}

// Water Log Types
export interface WaterLog {
    id: string;
    user_id: string;
    amount: number;
    logged_at: string;
    created_at: string;
}

export interface WaterLogInput {
    amount: number;
    logged_at?: Date;
}

// Notification Settings Types
export interface NotificationSettings {
    id: string;
    user_id: string;
    enabled: boolean;
    start_time: string;
    end_time: string;
    interval_hours: number;
    sound_enabled: boolean;
    created_at: string;
    updated_at: string;
}

// Health Data Types
export interface HealthData {
    id: string;
    user_id: string;
    data_type: 'bmi' | 'calorie' | 'sleep' | 'steps' | 'hydration';
    data_value: any;
    recorded_at: string;
}

export interface BMIData {
    height: number; // in cm
    weight: number; // in kg
    bmi: number;
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export interface CalorieData {
    age: number;
    gender: 'male' | 'female';
    weight: number; // in kg
    height: number; // in cm
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    daily_calories: number;
}

export interface SleepData {
    date: string;
    hours: number;
    quality: 1 | 2 | 3 | 4 | 5; // 1-5 rating
}

export interface StepData {
    date: string;
    steps: number;
    goal: number;
}

// Statistics Types
export interface DailyStats {
    date: string;
    total_amount: number;
    log_count: number;
    goal_achieved: boolean;
}

export interface WeeklyStats {
    week_start: string;
    total_amount: number;
    average_daily: number;
    days_goal_achieved: number;
    logs: DailyStats[];
}

export interface UserStats {
    current_streak: number;
    longest_streak: number;
    total_water_consumed: number;
    days_active: number;
    average_daily_intake: number;
}

// Form Types
export interface LoginFormData {
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirm_password: string;
    display_name: string;
}

export interface ProfileUpdateData {
    display_name?: string;
    daily_goal?: number;
    glass_size?: number;
    preferred_unit?: 'ml' | 'oz' | 'cups';
}

// Unit Conversion
export const UNIT_CONVERSIONS = {
    ml_to_oz: 0.033814,
    ml_to_cups: 0.00422675,
    oz_to_ml: 29.5735,
    cups_to_ml: 236.588,
} as const;

// Helper Functions
export const convertUnits = (
    amount: number,
    from: 'ml' | 'oz' | 'cups',
    to: 'ml' | 'oz' | 'cups'
): number => {
    if (from === to) return amount;

    // Convert to ml first
    let ml = amount;
    if (from === 'oz') ml = amount * UNIT_CONVERSIONS.oz_to_ml;
    if (from === 'cups') ml = amount * UNIT_CONVERSIONS.cups_to_ml;

    // Convert from ml to target unit
    if (to === 'ml') return ml;
    if (to === 'oz') return ml * UNIT_CONVERSIONS.ml_to_oz;
    if (to === 'cups') return ml * UNIT_CONVERSIONS.ml_to_cups;

    return amount;
};

export const formatWaterAmount = (
    amount: number,
    unit: 'ml' | 'oz' | 'cups'
): string => {
    const converted = Math.round(amount);
    return `${converted}${unit}`;
};

// Date Helpers
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const isToday = (date: Date | string): boolean => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

// BMI Calculation
export const calculateBMI = (weight: number, height: number): BMIData => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category: BMIData['category'];
    if (bmi < 18.5) category = 'underweight';
    else if (bmi < 25) category = 'normal';
    else if (bmi < 30) category = 'overweight';
    else category = 'obese';

    return { height, weight, bmi: parseFloat(bmi.toFixed(1)), category };
};

// Calorie Calculation (Harris-Benedict Equation)
export const calculateCalories = (
    age: number,
    gender: 'male' | 'female',
    weight: number,
    height: number,
    activity_level: CalorieData['activity_level']
): number => {
    // Calculate BMR
    let bmr: number;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Apply activity multiplier
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    return Math.round(bmr * multipliers[activity_level]);
};

// Hydration Calculation
export const calculateHydrationGoal = (
    weight: number,
    activity_level: 'sedentary' | 'moderate' | 'active',
    climate: 'cold' | 'moderate' | 'hot'
): number => {
    // Base: 30-35ml per kg of body weight
    let baseAmount = weight * 33;

    // Adjust for activity
    if (activity_level === 'moderate') baseAmount *= 1.2;
    if (activity_level === 'active') baseAmount *= 1.4;

    // Adjust for climate
    if (climate === 'hot') baseAmount *= 1.2;
    if (climate === 'cold') baseAmount *= 0.9;

    return Math.round(baseAmount);
};