import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies if needed
});

apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global API errors (e.g., 401 Unauthorized)
        return Promise.reject(error);
    }
);

export default apiClient;
