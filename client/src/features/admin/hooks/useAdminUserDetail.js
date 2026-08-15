import { useState, useEffect, useCallback } from 'react';
import { fetchAdminUserById } from '../api/admin.api';

export const useAdminUserDetail = (id) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAdminUserById(id);
            setUser(data.user);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('User not found.');
            } else {
                setError(err.response?.data?.message || 'Failed to load user');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void load();
    }, [load]);

    return { user, loading, error, refetch: load };
};
