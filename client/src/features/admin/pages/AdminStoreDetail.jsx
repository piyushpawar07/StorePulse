import { Link, useParams } from 'react-router-dom';
import { useAdminStoreDetail } from '../hooks/useAdminStoreDetail';
import './Admin.scss';

const AdminStoreDetail = () => {
    const { id } = useParams();
    const { store, loading, error } = useAdminStoreDetail(id);

    if (loading) return <div className="admin-state">Loading store...</div>;
    if (error)   return <div className="admin-state admin-state--error">{error}</div>;
    if (!store)  return null;

    return (
        <div className="admin-page">
            <Link to="/admin/stores" className="admin-page__back">← Back to Stores</Link>

            <div className="admin-detail-card">
                <h3>{store.name}</h3>
                <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{store.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{store.address}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Avg Rating</span>
                    <span className="detail-value">
                        {store.averageRating > 0
                            ? `★ ${Number(store.averageRating).toFixed(1)}`
                            : 'No ratings yet'}
                    </span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Total Ratings</span>
                    <span className="detail-value">{store.totalRatings}</span>
                </div>
            </div>

            {store.owner && (
                <div className="admin-detail-card">
                    <h3>Owner</h3>
                    <div className="detail-row">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">
                            <Link to={`/admin/users/${store.owner.id}`} className="table-link">
                                {store.owner.name}
                            </Link>
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{store.owner.email}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStoreDetail;
