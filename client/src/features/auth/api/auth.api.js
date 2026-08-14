import apiClient from '../../../shared/api/apiClient';

export const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/auth/getMe');
    return response.data;
};

export const changePassword = async (passwords) => {
    const response = await apiClient.patch('/auth/password', passwords);
    return response.data;
};
