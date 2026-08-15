import { useState, useEffect, useCallback } from 'react';
import { fetchStores } from '../api/store.api';

/**
 * Hooks layer for store list.
 * Manages local state: stores, pagination, search, loading, error.
 */
export const useStores = () => {
    const [stores, setStores] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('rating');
    const [order, setOrder] = useState('desc');

    const loadStores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStores({ search, page, limit: 10, sortBy, order });
            setStores(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load stores');
        } finally {
            setLoading(false);
        }
    }, [search, page, sortBy, order]);

    useEffect(() => {
        loadStores();
    }, [loadStores]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1); // reset to first page on new search
    };

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(newSortBy);
            setOrder('asc');
        }
        setPage(1);
    };

    return {
        stores,
        pagination,
        loading,
        error,
        search,
        page,
        sortBy,
        order,
        handleSearch,
        handleSortChange,
        setPage,
        refetch: loadStores,
    };
};
