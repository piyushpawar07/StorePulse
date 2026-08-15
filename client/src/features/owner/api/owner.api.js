import apiClient from '../../../shared/api/apiClient';

/**
 * GET /api/owner/dashboard
 * Returns: { data: { store, averageRating, totalRatings } }
 */
export const fetchOwnerDashboard = async () => {
    const response = await apiClient.get('/owner/dashboard');
    return response.data;
};

/**
 * GET /api/owner/ratings
 * Returns: { data: [ { ratingId, user: { id, name, email }, rating, createdAt } ] }
 */
export const fetchOwnerRatings = async () => {
    const response = await apiClient.get('/owner/ratings');
    return response.data;
};
