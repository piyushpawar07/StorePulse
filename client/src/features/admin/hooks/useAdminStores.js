import { useState, useEffect, useCallback } from 'react';
import { fetchAdminStores } from '../api/admin.api';

export const useAdminStores = () => {
    const [stores, setStores] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('asc');

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { page, limit: 10, sortBy, order };
            if (search) params.name = search;
            const data = await fetchAdminStores(params);
            setStores(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load stores');
        } finally {
            setLoading(false);
        }
    }, [search, page, sortBy, order]);

    useEffect(() => {
        void load();
    }, [load]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleSortChange = (col) => {
        if (col === sortBy) {
            setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(col);
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
        setPage,
        handleSearch,
        handleSortChange,
        refetch: load,
    };
};
