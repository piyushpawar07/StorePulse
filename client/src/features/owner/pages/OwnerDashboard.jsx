import { NavLink } from 'react-router-dom';
import { useOwnerDashboard } from '../hooks/useOwnerDashboard';
import './Owner.scss';

const OwnerDashboard = () => {
    const { data, loading, error } = useOwnerDashboard();

    return (
        <div className="owner-page">
            <div className="owner-page__header">
                <h2>Store Dashboard</h2>
                <p>Overview of your store performance</p>
            </div>

            <nav className="owner-page__nav">
                <NavLink to="/owner" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Dashboard
                </NavLink>
                <NavLink to="/owner/ratings" className={({ isActive }) => isActive ? 'active' : ''}>
                    Ratings
                </NavLink>
            </nav>

            {loading && <div className="owner-state">Loading dashboard...</div>}
            {error && !loading && <div className="owner-state owner-state--error">{error}</div>}

            {!loading && !error && data && (
                <>
                    {(data.stores || [data]).map((store) => (
                        <div key={store.id} className="owner-store-card">
                            <h3>{store.name}</h3>
                            <div className="owner-store-info">
                                <div className="owner-store-info__row">
                                    <span className="label">Email</span>
                                    <span>{store.email}</span>
                                </div>
                                <div className="owner-store-info__row">
                                    <span className="label">Address</span>
                                    <span>{store.address}</span>
                                </div>
                            </div>

                            <div className="owner-stats">
                                <div className="owner-stat">
                                    <div className="owner-stat__label">Average Rating</div>
                                    <div className="owner-stat__value">
                                        <span className="owner-stat__star">★ </span>
                                        {store.averageRating > 0
                                            ? Number(store.averageRating).toFixed(1)
                                            : '—'}
                                    </div>
                                </div>
                                <div className="owner-stat">
                                    <div className="owner-stat__label">Total Ratings</div>
                                    <div className="owner-stat__value">{store.totalRatings}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default OwnerDashboard;
