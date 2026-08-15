import apiClient from '../../../shared/api/apiClient';

/**
 * POST /api/ratings
 * Body: { storeId, rating }
 */
export const createRating = async ({ storeId, rating }) => {
    const response = await apiClient.post('/ratings', { storeId, rating });
    return response.data;
};

/**
 * PATCH /api/ratings/:storeId
 * Body: { rating }
 */
export const updateRating = async ({ storeId, rating }) => {
    const response = await apiClient.patch(`/ratings/${storeId}`, { rating });
    return response.data;
};
