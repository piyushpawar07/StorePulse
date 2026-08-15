import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useCreateUser } from '../hooks/useCreateUser';
import './Admin.scss';

const ROLES = ['', 'USER', 'STORE_OWNER', 'ADMIN'];

const AdminUsers = () => {
    const {
        users, pagination, loading, error,
        search, role, page, sortBy, order,
        setPage, handleSearch, handleRoleFilter, handleSortChange, refetch,
    } = useAdminUsers();

    const [searchInput, setSearchInput] = useState('');
    const [showForm, setShowForm] = useState(false);

    const { form, submitting, error: formError, successMessage, handleChange, handleSubmit, reset } =
        useCreateUser({ onSuccess: () => { refetch(); setShowForm(false); } });

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
                <h2>Users</h2>
                <button
                    id="admin-create-user-btn"
                    className="btn-primary btn-sm"
                    onClick={() => { setShowForm((v) => !v); reset(); }}
                >
                    {showForm ? 'Cancel' : '+ Create User'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-panel">
                    <h3>Create User</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cu-name">Full Name</label>
                                <input id="cu-name" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cu-email">Email</label>
                                <input id="cu-email" type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cu-password">Password</label>
                                <input id="cu-password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cu-address">Address</label>
                                <input id="cu-address" name="address" value={form.address} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group" style={{ maxWidth: '200px' }}>
                            <label htmlFor="cu-role">Role</label>
                            <select id="cu-role" name="role" value={form.role} onChange={handleChange}>
                                <option value="USER">User</option>
                                <option value="STORE_OWNER">Store Owner</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create User'}
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
                        aria-label="Search users"
                    />
                    <button type="submit" className="btn-primary btn-sm">Search</button>
                    {search && (
                        <button type="button" className="btn-clear" onClick={() => { setSearchInput(''); handleSearch(''); }}>
                            Clear
                        </button>
                    )}
                </form>
                <select
                    value={role}
                    onChange={(e) => handleRoleFilter(e.target.value)}
                    aria-label="Filter by role"
                >
                    <option value="">All roles</option>
                    {ROLES.filter(Boolean).map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            {loading && <div className="admin-state">Loading users...</div>}
            {error && !loading && <div className="admin-state admin-state--error">{error}</div>}
            {!loading && !error && users.length === 0 && (
                <div className="admin-state">No users found.</div>
            )}

            {!loading && !error && users.length > 0 && (
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
                                <th className="sortable" onClick={() => handleSortChange('role')}>
                                    Role<span className="sort-indicator">{sortIcon('role')}</span>
                                </th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge badge--${u.role === 'ADMIN' ? 'admin' : u.role === 'STORE_OWNER' ? 'owner' : 'user'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>{u.address}</td>
                                    <td>
                                        <Link to={`/admin/users/${u.id}`} className="table-link">View</Link>
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

export default AdminUsers;
