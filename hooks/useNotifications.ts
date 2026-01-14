import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);

            // Check if notifications are enabled in localStorage
            const enabled = localStorage.getItem('notifications_enabled') === 'true';
            setIsEnabled(enabled);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            toast.error('Your browser does not support notifications');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                toast.success('Notifications enabled! 🔔');
                return true;
            } else {
                toast.error('Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    };

    const sendNotification = (title: string, body: string) => {
        if (permission === 'granted' && isEnabled) {
            const notification = new Notification(title, {
                body,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-192.png',
                tag: 'water-reminder',
            });

            // Vibrate separately (mobile devices)
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }

            return notification;
        }
    };

    const scheduleReminders = (intervalMinutes: number) => {
        // Clear existing reminders
        const existingInterval = localStorage.getItem('reminder_interval_id');
        if (existingInterval) {
            clearInterval(Number(existingInterval));
        }

        if (!isEnabled || permission !== 'granted') {
            return;
        }

        // Schedule new reminders
        const intervalId = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();

            // Only send notifications between 8 AM and 10 PM
            if (hour >= 8 && hour < 22) {
                const notification = new Notification('💧 Time to Hydrate!', {
                    body: 'Don\'t forget to drink some water. Stay healthy!',
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    tag: 'water-reminder',
                });

                // Vibrate separately
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                }
            }
        }, intervalMinutes * 60 * 1000);

        localStorage.setItem('reminder_interval_id', intervalId.toString());
    };

    const toggleNotifications = async (enabled: boolean) => {
        if (enabled && permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return;
        }

        setIsEnabled(enabled);
        localStorage.setItem('notifications_enabled', enabled.toString());

        if (enabled) {
            // Default: remind every 2 hours
            const interval = Number(localStorage.getItem('reminder_interval') || '120');
            scheduleReminders(interval);
            toast.success('Reminders enabled! 🔔');
        } else {
            const intervalId = localStorage.getItem('reminder_interval_id');
            if (intervalId) {
                clearInterval(Number(intervalId));
                localStorage.removeItem('reminder_interval_id');
            }
            toast.success('Reminders disabled');
        }
    };

    return {
        permission,
        isEnabled,
        requestPermission,
        sendNotification,
        scheduleReminders,
        toggleNotifications,
    };
};