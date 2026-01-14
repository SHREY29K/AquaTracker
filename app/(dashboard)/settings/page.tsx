'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Settings as SettingsIcon, Bell, Droplet, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Settings state
    const [dailyGoal, setDailyGoal] = useState(2000);
    const [glassSize, setGlassSize] = useState(250);
    const [unit, setUnit] = useState<'ml' | 'oz' | 'cups'>('ml');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const { permission, isEnabled, toggleNotifications, scheduleReminders } = useNotifications();
    const [reminderInterval, setReminderInterval] = useState(120); // minutes

    useEffect(() => {
        const savedInterval = localStorage.getItem('reminder_interval');
        if (savedInterval) {
            setReminderInterval(Number(savedInterval));
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('daily_goal, glass_size, preferred_unit')
            .eq('id', user?.id)
            .single();

        if (data) {
            setDailyGoal(data.daily_goal || 2000);
            setGlassSize(data.glass_size || 250);
            setUnit(data.preferred_unit || 'ml');
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                daily_goal: dailyGoal,
                glass_size: glassSize,
                preferred_unit: unit,
            })
            .eq('id', user?.id);

        if (error) {
            toast.error('Failed to save settings');
        } else {
            toast.success('Settings saved successfully!');
        }

        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            'This will permanently delete all your data. Are you absolutely sure?'
        );

        if (!doubleConfirm) return;

        setLoading(true);

        // Delete user data
        await supabase.from('water_logs').delete().eq('user_id', user?.id);
        await supabase.from('profiles').delete().eq('id', user?.id);

        // Sign out
        await supabase.auth.signOut();

        toast.success('Account deleted successfully');
        router.push('/');
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Settings
            </h1>

            <div className="space-y-6">
                {/* Preferences */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Droplet className="w-6 h-6 text-blue-600" />
                        Water Tracking Preferences
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Daily Goal (ml)
                            </label>
                            <input
                                type="number"
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(Number(e.target.value))}
                                min="500"
                                max="10000"
                                step="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended: 2000-3000ml per day
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Default Glass Size (ml)
                            </label>
                            <input
                                type="number"
                                value={glassSize}
                                onChange={(e) => setGlassSize(Number(e.target.value))}
                                min="100"
                                max="1000"
                                step="50"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Preferred Unit
                            </label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value as 'ml' | 'oz' | 'cups')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ml">Milliliters (ml)</option>
                                <option value="oz">Ounces (oz)</option>
                                <option value="cups">Cups</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveSettings}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 sm:py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 font-semibold disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-orange-600" />
                        Notifications & Reminders
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Enable Reminders</div>
                                <div className="text-sm text-gray-600">
                                    Get notified to drink water throughout the day
                                </div>
                            </div>
                            <button
                                onClick={() => toggleNotifications(!isEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {permission === 'denied' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    ⚠️ Notifications are blocked. Please enable them in your browser settings.
                                </p>
                            </div>
                        )}

                        {isEnabled && (
                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Reminder Interval
                                    </label>
                                    <select
                                        value={reminderInterval}
                                        onChange={(e) => {
                                            const interval = Number(e.target.value);
                                            setReminderInterval(interval);
                                            localStorage.setItem('reminder_interval', interval.toString());
                                            if (isEnabled) {
                                                scheduleReminders(interval);
                                                toast.success(`Reminders set to every ${interval / 60} hours`);
                                            }
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="60">Every 1 hour</option>
                                        <option value="90">Every 1.5 hours</option>
                                        <option value="120">Every 2 hours</option>
                                        <option value="180">Every 3 hours</option>
                                        <option value="240">Every 4 hours</option>
                                    </select>
                                </div>

                                <div className="p-3 bg-white rounded-lg border border-blue-200">
                                    <p className="text-sm text-gray-700">
                                        <strong>Active hours:</strong> 8:00 AM - 10:00 PM
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Reminders will only be sent during these hours
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        const { sendNotification } = require('@/hooks/useNotifications');
                                        new Notification('💧 Time to Hydrate!', {
                                            body: 'Don\'t forget to drink some water. Stay healthy!',
                                            icon: '/icons/icon-192.png',
                                        });
                                        toast.success('Test notification sent!');
                                    }}
                                    className="w-full px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
                                >
                                    Send Test Notification
                                </button>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 p-3 bg-blue-50 rounded-lg">
                            💡 Tip: Browser notifications help you stay on track with your hydration goals!
                        </p>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-red-200">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
                        <Trash2 className="w-6 h-6" />
                        Danger Zone
                    </h2>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>

                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}