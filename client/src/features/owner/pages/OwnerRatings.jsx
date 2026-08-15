import { NavLink } from 'react-router-dom';
import { useOwnerRatings } from '../hooks/useOwnerRatings';
import './Owner.scss';

const OwnerRatings = () => {
    const { ratings, loading, error } = useOwnerRatings();

    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="owner-page">
            <div className="owner-page__header">
                <h2>Customer Ratings</h2>
                <p>All ratings submitted for your store</p>
            </div>

            <nav className="owner-page__nav">
                <NavLink to="/owner" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Dashboard
                </NavLink>
                <NavLink to="/owner/ratings" className={({ isActive }) => isActive ? 'active' : ''}>
                    Ratings
                </NavLink>
            </nav>

            {loading && <div className="owner-state">Loading ratings...</div>}
            {error && !loading && <div className="owner-state owner-state--error">{error}</div>}
            {!loading && !error && ratings.length === 0 && (
                <div className="owner-state">No ratings yet for your store.</div>
            )}

            {!loading && !error && ratings.length > 0 && (
                <div className="owner-table-wrap">
                    <table className="owner-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Store</th>
                                <th>Rating</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((r) => (
                                <tr key={r.ratingId}>
                                    <td>{r.user.name}</td>
                                    <td>{r.user.email}</td>
                                    <td>{r.store?.name || '—'}</td>
                                    <td>
                                        <span className="star-rating">
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                        </span>
                                        {' '}{r.rating}/5
                                    </td>
                                    <td>{formatDate(r.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OwnerRatings;
