import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import './Admin.scss';

const AdminDashboard = () => {
    const { stats, loading, error, refetch } = useAdminDashboard();

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h2>Admin Dashboard</h2>
                <button className="btn-primary btn-sm" onClick={refetch} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {loading && <div className="admin-state">Loading stats...</div>}
            {error && !loading && <div className="admin-state admin-state--error">{error}</div>}

            {!loading && !error && stats && (
                <div className="stat-cards">
                    <div className="stat-card stat-card--blue">
                        <div className="stat-card__label">Total Users</div>
                        <div className="stat-card__value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card stat-card--green">
                        <div className="stat-card__label">Total Stores</div>
                        <div className="stat-card__value">{stats.totalStores}</div>
                    </div>
                    <div className="stat-card stat-card--amber">
                        <div className="stat-card__label">Total Ratings</div>
                        <div className="stat-card__value">{stats.totalRatings}</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/admin/users" className="btn-primary">Manage Users</Link>
                <Link to="/admin/stores" className="btn-primary">Manage Stores</Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
