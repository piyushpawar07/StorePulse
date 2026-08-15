import { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboard } from '../api/admin.api';

export const useAdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAdminDashboard();
            setStats(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { stats, loading, error, refetch: load };
};
