'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, LogOut, Settings, User, Home, Calculator } from 'lucide-react';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

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

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Droplets className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AquaTrack
              </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/dashboard')
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Home className="w-5 h-5" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </button>

                            <button
                                onClick={() => router.push('/utilities')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/utilities')
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Calculator className="w-5 h-5" />
                                <span className="text-sm font-medium">Utilities</span>
                            </button>

                            <button
                                onClick={() => router.push('/profile')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/profile')
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm font-medium">Profile</span>
                            </button>

                            <button
                                onClick={() => router.push('/settings')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/settings')
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-sm font-medium">Settings</span>
                            </button>
                        </div>

                        {/* Right Side - User Info & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                  {user.email?.split('@')[0]}
                </span>
                            </div>

                            <button
                                onClick={async () => {
                                    const { supabase } = await import('@/lib/supabase/client');
                                    await supabase.auth.signOut();
                                    router.push('/login');
                                }}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex gap-2 pb-3 overflow-x-auto">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                                isActive('/dashboard')
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => router.push('/utilities')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                                isActive('/utilities')
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Calculator className="w-4 h-4" />
                            Utilities
                        </button>

                        <button
                            onClick={() => router.push('/profile')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                                isActive('/profile')
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>

                        <button
                            onClick={() => router.push('/settings')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                                isActive('/settings')
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
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