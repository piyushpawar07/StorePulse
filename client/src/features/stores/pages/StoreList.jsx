import { useState } from 'react';
import { useStores } from '../hooks/useStores';
import StoreCard from '../components/StoreCard';
import './Stores.scss';

const StoreList = () => {
    const {
        stores,
        pagination,
        loading,
        error,
        search,
        page,
        sortBy,
        order,
        handleSearch,
        handleSortChange,
        setPage,
    } = useStores();

    const [searchInput, setSearchInput] = useState('');

    const onSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchInput.trim());
    };

    const sortLabel = (col) => {
        if (sortBy !== col) return col;
        return `${col} ${order === 'asc' ? '↑' : '↓'}`;
    };

    return (
        <div className="store-list-page">
            <div className="store-list-page__header">
                <h2>Stores</h2>
                <form onSubmit={onSearchSubmit} className="store-list-page__search">
                    <input
                        type="text"
                        placeholder="Search by name or address..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        aria-label="Search stores"
                    />
                    <button type="submit">Search</button>
                    {search && (
                        <button
                            type="button"
                            className="btn-clear"
                            onClick={() => { setSearchInput(''); handleSearch(''); }}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div className="store-list-page__sort">
                <span>Sort by:</span>
                {['rating', 'name', 'address'].map((col) => (
                    <button
                        key={col}
                        className={`sort-btn ${sortBy === col ? 'sort-btn--active' : ''}`}
                        onClick={() => handleSortChange(col)}
                    >
                        {sortLabel(col)}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="store-list-page__state">Loading stores...</div>
            )}

            {error && !loading && (
                <div className="store-list-page__state store-list-page__state--error">{error}</div>
            )}

            {!loading && !error && stores.length === 0 && (
                <div className="store-list-page__state">
                    {search ? `No stores found for "${search}".` : 'No stores available yet.'}
                </div>
            )}

            {!loading && !error && stores.length > 0 && (
                <div className="store-grid">
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="store-list-page__pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        ← Prev
                    </button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoreList;
