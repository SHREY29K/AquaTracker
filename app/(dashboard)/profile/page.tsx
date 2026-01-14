'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { User, Mail, Calendar, Droplets, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalWater: 0,
        daysActive: 0,
        longestStreak: 7,
    });

    useEffect(() => {
        if (user) {
            loadProfile();
            loadStats();
        }
    }, [user]);

    const loadProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user?.id)
            .single();

        if (data) {
            setDisplayName(data.display_name || '');
        }
    };

    const loadStats = async () => {
        if (!user?.id) return;

        // Get total water consumed
        const { data: logs } = await supabase
            .from('water_logs')
            .select('amount, logged_at')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: false });

        const total = logs?.reduce((sum, log) => sum + log.amount, 0) || 0;

        // Get unique dates
        const uniqueDates = new Set(
            logs?.map(log => new Date(log.logged_at).toDateString())
        );

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if there's activity today
        const hasToday = logs?.some(log => {
            const logDate = new Date(log.logged_at);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === today.getTime();
        });

        if (hasToday || uniqueDates.size > 0) {
            currentStreak = 1;

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
        }

        setStats({
            totalWater: total,
            daysActive: uniqueDates.size,
            longestStreak: currentStreak,
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({ display_name: displayName })
            .eq('id', user?.id);

        if (error) {
            toast.error('Failed to update profile');
        } else {
            toast.success('Profile updated successfully!');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                My Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Profile Info Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        Account Information
                    </h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{user?.email}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Member Since</label>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                  {user?.created_at && new Date(user.created_at).toLocaleDateString()}
                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Stats Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-orange-500" />
                        Your Achievements
                    </h2>

                    <div className="space-y-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                            <Droplets className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                            <div className="text-3xl font-bold text-gray-800">
                                {(stats.totalWater / 1000).toFixed(1)}L
                            </div>
                            <div className="text-sm text-gray-600">Total Water Consumed</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                                <div className="text-2xl font-bold text-gray-800">{stats.daysActive}</div>
                                <div className="text-xs text-gray-600">Days Active</div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                                <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-1">
                                    {stats.longestStreak} 🔥
                                </div>
                                <div className="text-xs text-gray-600">Longest Streak</div>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                            <div className="text-center">
                                <div className="text-2xl mb-2">🏆</div>
                                <div className="font-semibold text-gray-800">Hydration Champion</div>
                                <div className="text-xs text-gray-600 mt-1">
                                    Keep up the great work!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}