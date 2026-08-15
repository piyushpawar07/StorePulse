import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStores } from '../hooks/useAdminStores';
import { useCreateStore } from '../hooks/useCreateStore';
import './Admin.scss';

const AdminStores = () => {
    const {
        stores, pagination, loading, error,
        search, page, sortBy, order,
        setPage, handleSearch, handleSortChange, refetch,
    } = useAdminStores();

    const [searchInput, setSearchInput] = useState('');
    const [showForm, setShowForm] = useState(false);

    const { form, submitting, error: formError, successMessage, handleChange, handleSubmit, reset } =
        useCreateStore({ onSuccess: () => { refetch(); setShowForm(false); } });

    const onSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchInput.trim());
    };

    const sortIcon = (col) => {
        if (sortBy !== col) return '';
        return order === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h2>Stores</h2>
                <button
                    id="admin-create-store-btn"
                    className="btn-primary btn-sm"
                    onClick={() => { setShowForm((v) => !v); reset(); }}
                >
                    {showForm ? 'Cancel' : '+ Create Store'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-panel">
                    <h3>Create Store</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                        The owner must have the <strong>STORE_OWNER</strong> role. Enter their user ID.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cs-name">Store Name</label>
                                <input id="cs-name" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cs-email">Store Email</label>
                                <input id="cs-email" type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cs-address">Address</label>
                                <input id="cs-address" name="address" value={form.address} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cs-owner">Owner ID</label>
                                <input
                                    id="cs-owner"
                                    type="number"
                                    name="ownerId"
                                    value={form.ownerId}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    placeholder="Enter STORE_OWNER user ID"
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Store'}
                            </button>
                            {formError && <span className="form-feedback form-feedback--error">{formError}</span>}
                            {successMessage && <span className="form-feedback form-feedback--success">{successMessage}</span>}
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-toolbar">
                <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        aria-label="Search stores"
                    />
                    <button type="submit" className="btn-primary btn-sm">Search</button>
                    {search && (
                        <button type="button" className="btn-clear" onClick={() => { setSearchInput(''); handleSearch(''); }}>
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {loading && <div className="admin-state">Loading stores...</div>}
            {error && !loading && <div className="admin-state admin-state--error">{error}</div>}
            {!loading && !error && stores.length === 0 && (
                <div className="admin-state">No stores found.</div>
            )}

            {!loading && !error && stores.length > 0 && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="sortable" onClick={() => handleSortChange('name')}>
                                    Name<span className="sort-indicator">{sortIcon('name')}</span>
                                </th>
                                <th className="sortable" onClick={() => handleSortChange('email')}>
                                    Email<span className="sort-indicator">{sortIcon('email')}</span>
                                </th>
                                <th>Address</th>
                                <th className="sortable" onClick={() => handleSortChange('rating')}>
                                    Avg Rating<span className="sort-indicator">{sortIcon('rating')}</span>
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td>{s.address}</td>
                                    <td>
                                        {s.averageRating > 0
                                            ? `★ ${Number(s.averageRating).toFixed(1)}`
                                            : '—'}
                                    </td>
                                    <td>
                                        <Link to={`/admin/stores/${s.id}`} className="table-link">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default AdminStores;
