'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, LogOut, Settings, User } from 'lucide-react';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Droplets className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AquaTrack
              </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/profile')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
                            </button>

                            <button
                                onClick={() => router.push('/settings')}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>

                            <button
                                onClick={async () => {
                                    const { supabase } = await import('@/lib/supabase/client');
                                    await supabase.auth.signOut();
                                    router.push('/login');
                                }}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}