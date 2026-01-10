/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
                }
            }
        },
        {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'supabase-data',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
            }
        },
        {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-resources',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: ({ url }) => {
                const isSameOrigin = self.origin === url.origin;
                if (!isSameOrigin) return false;
                const pathname = url.pathname;
                // Exclude /api routes
                if (pathname.startsWith('/api/')) return false;
                return true;
            },
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages',
                networkTimeoutSeconds: 5,
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        }
    ]
});

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // Image optimization
    images: {
        domains: [
            'localhost',
            '*.supabase.co', // Allow Supabase storage domains
        ],
        formats: ['image/avif', 'image/webp'],
    },

    // Environment variables that should be available on the client
    env: {
        NEXT_PUBLIC_APP_NAME: 'AquaTrack',
        NEXT_PUBLIC_APP_DESCRIPTION: 'Track your daily water intake',
    },

    // Headers for security
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },

    // Redirects
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: false,
                has: [
                    {
                        type: 'cookie',
                        key: 'sb-access-token',
                    },
                ],
            },
        ];
    },

    // Experimental features
    experimental: {
        serverActions: true,
    },
};

module.exports = withPWA(nextConfig);