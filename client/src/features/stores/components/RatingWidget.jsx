import { useRating } from '../../ratings/hooks/useRating';
import './RatingWidget.scss';

const STARS = [1, 2, 3, 4, 5];

/**
 * RatingWidget: allows a user to rate or update a store.
 * Props:
 *   - storeId: number
 *   - userRating: number | null
 *   - onRated: callback(updatedRating) called after success
 */
const RatingWidget = ({ storeId, userRating, onRated }) => {
    const { submitRating, submitting, error, successMessage, hasRated } = useRating({
        storeId,
        initialUserRating: userRating,
        onSuccess: (rating) => {
            if (onRated) onRated(rating);
        },
    });

    const handleClick = (star) => {
        if (!submitting) submitRating(star);
    };

    return (
        <div className="rating-widget">
            <p className="rating-widget__label">
                {hasRated ? `Your rating: ${userRating} / 5 — click to update` : 'Rate this store:'}
            </p>
            <div className="rating-widget__stars">
                {STARS.map((star) => (
                    <button
                        key={star}
                        className={`star-btn ${userRating >= star ? 'star-btn--filled' : ''}`}
                        onClick={() => handleClick(star)}
                        disabled={submitting}
                        aria-label={`Rate ${star} out of 5`}
                        title={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        ★
                    </button>
                ))}
            </div>
            {submitting && <p className="rating-widget__status rating-widget__status--loading">Saving...</p>}
            {successMessage && <p className="rating-widget__status rating-widget__status--success">{successMessage}</p>}
            {error && <p className="rating-widget__status rating-widget__status--error">{error}</p>}
        </div>
    );
};

export default RatingWidget;
