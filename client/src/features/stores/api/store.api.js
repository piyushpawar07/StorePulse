import apiClient from '../../../shared/api/apiClient';

/**
 * GET /api/stores
 * Supports: search, page, limit, sortBy, order
 */
export const fetchStores = async (params = {}) => {
    const response = await apiClient.get('/stores', { params });
    return response.data;
};

/**
 * GET /api/stores/:id
 */
export const fetchStoreById = async (id) => {
    const response = await apiClient.get(`/stores/${id}`);
    return response.data;
};
