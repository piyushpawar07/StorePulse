import { useState, useEffect } from 'react';
import { fetchStoreById } from '../api/store.api';

/**
 * Hooks layer for a single store detail.
 */
export const useStoreDetail = (id) => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStoreById(id);
            setStore(data.store);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Store not found.');
            } else {
                setError(err.response?.data?.message || 'Failed to load store details');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    return { store, loading, error, refetch: load };
};
