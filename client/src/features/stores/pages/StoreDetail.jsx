import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreDetail } from '../hooks/useStoreDetail';
import RatingWidget from '../components/RatingWidget';
import './Stores.scss';

const StoreDetail = () => {
    const { id } = useParams();
    const { store, loading, error, refetch } = useStoreDetail(id);
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(null);

    // Once store data is available, seed local state from it
    const displayUserRating = userRating ?? store?.userRating;
    const displayAvgRating = averageRating ?? store?.averageRating;

    const handleRated = (updatedRating) => {
        setUserRating(updatedRating.rating);
        // Refetch to get updated averageRating
        refetch();
    };

    if (loading) {
        return <div className="store-detail-page__state">Loading store...</div>;
    }

    if (error) {
        return (
            <div className="store-detail-page__state store-detail-page__state--error">
                <p>{error}</p>
                <Link to="/stores">← Back to stores</Link>
            </div>
        );
    }

    if (!store) return null;

    return (
        <div className="store-detail-page">
            <Link to="/stores" className="store-detail-page__back">← Back to stores</Link>

            <div className="store-detail-page__card">
                <h2 className="store-detail-page__name">{store.name}</h2>

                <div className="store-detail-page__info">
                    <div className="store-detail-page__info-row">
                        <span className="label">Address</span>
                        <span>{store.address}</span>
                    </div>
                    <div className="store-detail-page__info-row">
                        <span className="label">Email</span>
                        <span>{store.email}</span>
                    </div>
                </div>

                <div className="store-detail-page__ratings">
                    <div className="store-detail-page__avg">
                        <span className="avg-stars">★</span>
                        <span className="avg-value">
                            {displayAvgRating > 0 ? displayAvgRating.toFixed(1) : 'No ratings yet'}
                        </span>
                        <span className="avg-label">average rating</span>
                    </div>

                    <RatingWidget
                        storeId={store.id}
                        userRating={displayUserRating}
                        onRated={handleRated}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreDetail;
