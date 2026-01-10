import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import React from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AquaTrack - Water Intake Tracker',
    description: 'Track your daily water intake and stay hydrated',
    manifest: '/manifest.json'
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <meta name="theme-color" content="#3B82F6" />
            <link rel="icon" href="/icons/icon-192.png" />
            <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </head>
        <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
        </body>
        </html>
    );
}