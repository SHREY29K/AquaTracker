import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export interface WaterLog {
    id: string;
    user_id: string;
    amount: number;
    logged_at: string;
    created_at: string;
}

export const useWaterLog = (userId: string | undefined) => {
    const [logs, setLogs] = useState<WaterLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('water_logs')
            .select('*')
            .eq('user_id', userId)
            .gte('logged_at', today.toISOString())
            .order('logged_at', { ascending: false });

        if (error) {
            console.error('Error fetching logs:', error);
            toast.error('Failed to fetch water logs');
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    const addLog = async (amount: number) => {
        if (!userId) {
            toast.error('You must be logged in');
            return;
        }

        const { data, error } = await supabase
            .from('water_logs')
            .insert([{
                user_id: userId,
                amount,
                logged_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding log:', error);
            toast.error('Failed to log water');
        } else {
            setLogs([data, ...logs]);
            toast.success(`Added ${amount}ml! 💧`);
        }
    };

    const deleteLog = async (id: string) => {
        const { error } = await supabase
            .from('water_logs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting log:', error);
            toast.error('Failed to delete log');
        } else {
            setLogs(logs.filter(log => log.id !== id));
            toast.success('Log deleted');
        }
    };

    useEffect(() => {
        fetchLogs();

        // Subscribe to real-time changes
        if (!userId) return;

        const channel = supabase
            .channel('water_logs_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'water_logs',
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    fetchLogs();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { logs, loading, addLog, deleteLog, refetch: fetchLogs };
};