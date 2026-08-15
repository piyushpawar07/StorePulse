import { useState, useEffect, useCallback } from 'react';
import { fetchAdminStoreById } from '../api/admin.api';

export const useAdminStoreDetail = (id) => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAdminStoreById(id);
            setStore(data.store);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Store not found.');
            } else {
                setError(err.response?.data?.message || 'Failed to load store');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void load();
    }, [load]);

    return { store, loading, error, refetch: load };
};
