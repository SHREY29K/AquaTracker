import { LoginForm } from '@/components/auth/LoginForm';
import { Droplets } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Droplets className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome to AquaTrack
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sign in to track your hydration
                </p>
                <LoginForm />
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-600 hover:underline font-semibold">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}