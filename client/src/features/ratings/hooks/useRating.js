import { useState } from 'react';
import { createRating, updateRating } from '../api/rating.api';

/**
 * Hooks layer for submit/update a rating.
 * storeId and current userRating are passed in from the UI.
 */
export const useRating = ({ storeId, initialUserRating, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const hasRated = initialUserRating !== null && initialUserRating !== undefined;

    const submitRating = async (rating) => {
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let data;
            if (hasRated) {
                data = await updateRating({ storeId, rating });
            } else {
                data = await createRating({ storeId, rating });
            }
            setSuccessMessage(data.message || 'Rating saved!');
            if (onSuccess) onSuccess(data.rating);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return {
        submitRating,
        submitting,
        error,
        successMessage,
        hasRated,
        clearMessages,
    };
};
