import { useState, useEffect, useCallback } from 'react';
import { fetchAdminUsers } from '../api/admin.api';

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('asc');

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { page, limit: 10, sortBy, order };
            if (search) params.name = search;
            if (role) params.role = role;
            const data = await fetchAdminUsers(params);
            setUsers(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [search, role, page, sortBy, order]);

    useEffect(() => {
        void load();
    }, [load]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleRoleFilter = (value) => {
        setRole(value);
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
        users,
        pagination,
        loading,
        error,
        search,
        role,
        page,
        sortBy,
        order,
        setPage,
        handleSearch,
        handleRoleFilter,
        handleSortChange,
        refetch: load,
    };
};
