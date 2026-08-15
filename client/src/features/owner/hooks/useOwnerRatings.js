import { useState, useEffect, useCallback } from 'react';
import { fetchOwnerRatings } from '../api/owner.api';

export const useOwnerRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchOwnerRatings();
            setRatings(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No store found for your account.');
            } else {
                setError(err.response?.data?.message || 'Failed to load ratings');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return { ratings, loading, error, refetch: load };
};
