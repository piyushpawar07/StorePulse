import { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink, Link } from 'react-router-dom';
import { AuthProvider } from '../features/auth/state/AuthContext';
import { useAuth } from '../features/auth/hooks/useAuth';
import '../index.scss';

const ROLE_LABELS = {
    ADMIN: 'Admin',
    USER: 'User',
    STORE_OWNER: 'Store Owner',
};

const ROLE_CLASSES = {
    ADMIN: 'badge--admin',
    USER: 'badge--user',
    STORE_OWNER: 'badge--owner',
};

const AuthInitializer = ({ children }) => {
    const { restoreSession, loading } = useAuth();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    if (loading) {
        return (
            <div className="app-splash">
                <span className="app-splash__text">Loading…</span>
            </div>
        );
    }

    return children;
};

const Navbar = () => {
    const { user, isAuthenticated, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const onLogout = async () => {
        setMenuOpen(false);
        await handleLogout();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    <img
                        src="/StorePulse_logo.png"
                        alt="StorePulse logo"
                        className="navbar__logo"
                    />
                    StorePulse
                </Link>

                {isAuthenticated && user ? (
                    <>
                        <nav className="navbar__links">
                            <NavLink to="/stores" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                                Stores
                            </NavLink>
                        </nav>

                        <div className="navbar__user">
                            <span className="navbar__name">{user.name}</span>
                            <span className={`badge ${ROLE_CLASSES[user.role] || ''}`}>
                                {ROLE_LABELS[user.role] || user.role}
                            </span>
                            <div className="navbar__actions">
                                <Link to="/change-password" className="nav-link">Password</Link>
                                <button className="btn-logout" onClick={onLogout}>Logout</button>
                            </div>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="navbar__hamburger"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle menu"
                        >
                            ☰
                        </button>
                    </>
                ) : (
                    <div className="navbar__guest">
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/register" className="btn-primary btn-sm">Register</Link>
                    </div>
                )}
            </div>

            {/* Mobile dropdown */}
            {isAuthenticated && menuOpen && (
                <div className="navbar__mobile-menu">
                    <NavLink to="/stores" onClick={() => setMenuOpen(false)} className="mobile-link">Stores</NavLink>
                    <NavLink to="/change-password" onClick={() => setMenuOpen(false)} className="mobile-link">Change Password</NavLink>
                    <button className="mobile-link mobile-link--logout" onClick={onLogout}>Logout</button>
                </div>
            )}
        </header>
    );
};

function App() {
    return (
        <AuthProvider>
            <AuthInitializer>
                <div className="app-container">
                    <Navbar />
                    <main className="app-content">
                        <Outlet />
                    </main>
                </div>
            </AuthInitializer>
        </AuthProvider>
    );
}

export default App;
