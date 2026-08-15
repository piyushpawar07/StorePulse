import { useState, useEffect, useCallback } from 'react';
import { fetchOwnerDashboard } from '../api/owner.api';

export const useOwnerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchOwnerDashboard();
            setData(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No store found for your account.');
            } else {
                setError(err.response?.data?.message || 'Failed to load dashboard');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { data, loading, error, refetch: load };
};
