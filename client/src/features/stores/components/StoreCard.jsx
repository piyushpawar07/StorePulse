import { Link } from 'react-router-dom';
import './StoreCard.scss';

/**
 * StoreCard: displays a store summary in the listing page.
 * Props: store { id, name, email, address, averageRating, userRating }
 */
const StoreCard = ({ store }) => {
    const { id, name, email, address, averageRating, userRating } = store;

    return (
        <article className="store-card">
            <div className="store-card__body">
                <h3 className="store-card__name">{name}</h3>
                <p className="store-card__address">{address}</p>
                <p className="store-card__email">{email}</p>
            </div>

            <div className="store-card__footer">
                <div className="store-card__ratings">
                    <span className="store-card__avg">
                        ★ {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    {userRating !== null && userRating !== undefined && (
                        <span className="store-card__user-rating">Your rating: {userRating}</span>
                    )}
                </div>
                <Link to={`/stores/${id}`} className="store-card__link">
                    View & Rate →
                </Link>
            </div>
        </article>
    );
};

export default StoreCard;
