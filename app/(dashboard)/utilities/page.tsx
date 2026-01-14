'use client';

import { useState } from 'react';
import { Calculator, Heart, Moon, Activity, Droplets } from 'lucide-react';
import { calculateBMI, calculateCalories } from '@/types';

export default function UtilitiesPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Health Utilities
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <BMICalculator />
                <CalorieCalculator />
                <HydrationCalculator />
                <HealthTips />
            </div>
        </div>
    );
}

// BMI Calculator Component
function BMICalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleCalculate = () => {
        if (height && weight) {
            const bmiData = calculateBMI(Number(weight), Number(height));
            setResult(bmiData);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'underweight': return 'text-yellow-600 bg-yellow-50';
            case 'normal': return 'text-green-600 bg-green-50';
            case 'overweight': return 'text-orange-600 bg-orange-50';
            case 'obese': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">BMI Calculator</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="170"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 font-semibold"
                >
                    Calculate BMI
                </button>

                {result && (
                    <div className={`mt-4 p-4 rounded-lg ${getCategoryColor(result.category)}`}>
                        <p className="text-3xl font-bold text-center">{result.bmi}</p>
                        <p className="text-center capitalize mt-1">{result.category}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Calorie Calculator Component
function CalorieCalculator() {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = () => {
        if (age && height && weight) {
            const calories = calculateCalories(
                Number(age),
                gender,
                Number(weight),
                Number(height),
                activity
            );
            setResult(calories);
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold">Calorie Calculator</h2>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="25"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="170"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="70"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Activity Level</label>
                    <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="light">Light (exercise 1-3 days/week)</option>
                        <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                        <option value="active">Active (exercise 6-7 days/week)</option>
                        <option value="very_active">Very Active (physical job or training)</option>
                    </select>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold text-sm"
                >
                    Calculate Calories
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                        <p className="text-3xl font-bold text-center text-red-600">{result}</p>
                        <p className="text-center text-sm text-gray-600 mt-1">calories/day</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Hydration Calculator Component
function HydrationCalculator() {
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
    const [climate, setClimate] = useState<'cold' | 'moderate' | 'hot'>('moderate');
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = () => {
        if (weight) {
            let baseAmount = Number(weight) * 33;

            if (activity === 'moderate') baseAmount *= 1.2;
            if (activity === 'active') baseAmount *= 1.4;

            if (climate === 'hot') baseAmount *= 1.2;
            if (climate === 'cold') baseAmount *= 0.9;

            setResult(Math.round(baseAmount));
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-bold">Hydration Calculator</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Activity Level</label>
                    <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Climate</label>
                    <select
                        value={climate}
                        onChange={(e) => setClimate(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="cold">Cold</option>
                        <option value="moderate">Moderate</option>
                        <option value="hot">Hot</option>
                    </select>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 font-semibold"
                >
                    Calculate Goal
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-center text-cyan-600">{result}ml</p>
                        <p className="text-center text-sm text-gray-600 mt-1">recommended daily intake</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Health Tips Component
function HealthTips() {
    const tips = [
        "💧 Drink water first thing in the morning to kickstart your metabolism",
        "🏃 Stay extra hydrated during and after exercise",
        "🌡️ In hot weather, increase your water intake by 20-30%",
        "⏰ Set regular reminders to drink water throughout the day",
        "🥤 Carry a reusable water bottle wherever you go",
        "🍎 Eat water-rich foods like cucumber, watermelon, and oranges"
    ];

    const [currentTip, setCurrentTip] = useState(0);

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-green-600"/>
                <h2 className="text-xl font-bold">Health Tips</h2>
            </div>

            <div className="space-y-4">
                <div
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg min-h-[120px] flex items-center">
                    <p className="text-center text-gray-700">{tips[currentTip]}</p>
                </div>

                <button
                    onClick={() => setCurrentTip((currentTip + 1) % tips.length)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold"
                >
                    Next Tip
                </button>

                <div className="flex justify-center gap-2">
                    {tips.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTip(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentTip ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}