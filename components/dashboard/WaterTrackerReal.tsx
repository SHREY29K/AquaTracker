'use client';

import React, { useState, useEffect } from 'react';
import { Droplets, Plus, TrendingUp, Award, Target, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWaterLog } from '@/hooks/useWaterLog';
import toast from 'react-hot-toast';

const WaterTrackerReal = () => {
    const { user } = useAuth();
    const { logs, loading, addLog, deleteLog } = useWaterLog(user?.id);
    const [dailyGoal] = useState(2000);
    const [showCelebration, setShowCelebration] = useState(false);
    const [animateWave, setAnimateWave] = useState(false);

    const waterIntake = logs.reduce((sum, log) => sum + log.amount, 0);
    const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);
    // Calculate real streak
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const calculateStreak = () => {
            if (logs.length === 0) {
                setStreak(0);
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get unique dates
            const uniqueDates = new Set(
                logs.map(log => {
                    const date = new Date(log.logged_at);
                    date.setHours(0, 0, 0, 0);
                    return date.toDateString();
                })
            );

            // Check if there's activity today
            const hasToday = Array.from(uniqueDates).some(dateStr => {
                return new Date(dateStr).getTime() === today.getTime();
            });

            if (!hasToday && uniqueDates.size === 0) {
                setStreak(0);
                return;
            }

            let currentStreak = 1;

            // Count consecutive days backwards
            for (let i = 1; i < 365; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                const dateString = checkDate.toDateString();

                if (uniqueDates.has(dateString)) {
                    currentStreak++;
                } else {
                    break;
                }
            }

            setStreak(currentStreak);
        };

        calculateStreak();
    }, [logs]);

    const handleAddWater = async (amount: number) => {
        const previousIntake = waterIntake;
        await addLog(amount);

        setAnimateWave(true);
        setTimeout(() => setAnimateWave(false), 1000);

        const newIntake = previousIntake + amount;
        if (newIntake >= dailyGoal && previousIntake < dailyGoal) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    };

    const getWaterColor = () => {
        if (percentage >= 100) return 'from-cyan-400 to-blue-600';
        if (percentage >= 75) return 'from-cyan-300 to-blue-500';
        if (percentage >= 50) return 'from-sky-300 to-cyan-500';
        return 'from-sky-200 to-cyan-400';
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your data...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Water Tracker Card */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    <div className="flex flex-col items-center">
                        {/* Water Glass Visualization */}
                        <div className="relative w-64 h-80 mb-6">
                            <div className="absolute inset-0 border-4 border-blue-300 rounded-b-[50px] rounded-t-lg overflow-hidden bg-gradient-to-b from-blue-50/30 to-transparent">
                                <div
                                    className={`absolute bottom-0 w-full bg-gradient-to-t ${getWaterColor()} transition-all duration-1000 ease-out`}
                                    style={{ height: `${percentage}%` }}
                                >
                                    <div className={`absolute top-0 w-full h-8 ${animateWave ? 'animate-pulse' : ''}`}>
                                        <svg viewBox="0 0 1200 100" className="w-full h-full">
                                            <path
                                                d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z"
                                                fill="rgba(255,255,255,0.3)"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                        {Math.round(percentage)}%
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {waterIntake}ml / {dailyGoal}ml
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Add Buttons */}
                        <div className="grid grid-cols-4 gap-3 w-full max-w-md mb-6">
                            {[250, 500, 750, 1000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleAddWater(amount)}
                                    className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl py-4 px-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                                >
                                    <Plus className="w-5 h-5 mx-auto mb-1" />
                                    {amount}ml
                                </button>
                            ))}
                        </div>

                        {/* Status Message */}
                        <div className="text-center">
                            {percentage >= 100 ? (
                                <div className="text-green-600 font-semibold text-lg flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Goal achieved! Excellent work!
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            ) : percentage >= 75 ? (
                                <div className="text-blue-600 font-semibold">Almost there! Keep it up! 💪</div>
                            ) : percentage >= 50 ? (
                                <div className="text-cyan-600 font-semibold">Great progress! You&apos;re halfway there! 🎯</div>
                            ) : (
                                <div className="text-gray-600 font-semibold">Let&apos;s start hydrating! 💧</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold text-gray-800">Today&apos;s Stats</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Average per intake</div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {logs.length > 0 ? Math.round(waterIntake / logs.length) : 0}ml
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 mb-1">Times hydrated</div>
                                <div className="text-2xl font-bold text-gray-800">{logs.length}x</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 mb-1">Remaining</div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {Math.max(0, dailyGoal - waterIntake)}ml
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Logs */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-gray-800">Recent Activity</h3>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {logs.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No logs yet. Start tracking!</p>
                            ) : (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                                                <Droplets className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{log.amount}ml</div>
                                                <div className="text-xs text-gray-500">{formatTime(log.logged_at)}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this log?')) {
                                                    deleteLog(log.id);
                                                }
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-bounce">
                        <div className="text-6xl mb-4 text-center">🎉</div>
                        <div className="text-2xl font-bold text-green-600 text-center">
                            Daily Goal Achieved!
                        </div>
                        <div className="text-gray-600 text-center mt-2">
                            Fantastic job staying hydrated! 💧
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaterTrackerReal;