import { Link, useParams } from 'react-router-dom';
import { useAdminUserDetail } from '../hooks/useAdminUserDetail';
import './Admin.scss';

const ROLE_LABELS = { ADMIN: 'Admin', USER: 'User', STORE_OWNER: 'Store Owner' };
const ROLE_BADGE  = { ADMIN: 'admin', USER: 'user', STORE_OWNER: 'owner' };

const AdminUserDetail = () => {
    const { id } = useParams();
    const { user, loading, error } = useAdminUserDetail(id);

    if (loading) return <div className="admin-state">Loading user...</div>;
    if (error)   return <div className="admin-state admin-state--error">{error}</div>;
    if (!user)   return null;

    return (
        <div className="admin-page">
            <Link to="/admin/users" className="admin-page__back">← Back to Users</Link>

            <div className="admin-detail-card">
                <h3>User Details</h3>
                <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{user.name}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{user.address}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">
                        <span className={`badge badge--${ROLE_BADGE[user.role] || 'user'}`}>
                            {ROLE_LABELS[user.role] || user.role}
                        </span>
                    </span>
                </div>
            </div>

            {user.stores && user.stores.length > 0 && (
                <div className="admin-detail-card">
                    <h3>Owned Stores</h3>
                    {user.stores.map((store) => (
                        <div key={store.id} className="detail-row" style={{ alignItems: 'center', borderBottom: '1px solid var(--border-color, #eee)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                            <span className="detail-label">Store Name</span>
                            <span className="detail-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <Link to={`/admin/stores/${store.id}`} className="table-link">
                                    {store.name}
                                </Link>
                                <span style={{ color: '#888', fontSize: '0.875rem' }}>
                                    {store.averageRating > 0
                                        ? `★ ${Number(store.averageRating).toFixed(1)}`
                                        : 'No ratings yet'}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUserDetail;
