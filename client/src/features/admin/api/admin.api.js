import apiClient from '../../../shared/api/apiClient';

/* Dashboard */
export const fetchAdminDashboard = async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
};

/* Users */
export const fetchAdminUsers = async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
};

export const fetchAdminUserById = async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
};

export const createAdminUser = async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
};

/* Stores */
export const fetchAdminStores = async (params = {}) => {
    const response = await apiClient.get('/admin/stores', { params });
    return response.data;
};

export const fetchAdminStoreById = async (id) => {
    const response = await apiClient.get(`/admin/stores/${id}`);
    return response.data;
};

export const createAdminStore = async (storeData) => {
    const response = await apiClient.post('/admin/stores', storeData);
    return response.data;
};
