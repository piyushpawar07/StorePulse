import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthProvider } from '../features/auth/state/AuthContext';
import { useAuth } from '../features/auth/hooks/useAuth';
import '../index.scss';

// A wrapper component to initialize auth state using the hook
const AuthInitializer = ({ children }) => {
    const { restoreSession, loading } = useAuth();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    if (loading) {
        return <div className="app-loading">Loading application...</div>;
    }

    return children;
};

// Navbar component for testing auth flow
const Navbar = () => {
    const { user, isAuthenticated, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Store Rating Platform</h1>
                <nav>
                    {isAuthenticated && user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span>Welcome, {user.name} ({user.role})</span>
                            <Link to="/change-password" style={{ fontSize: '0.875rem' }}>Change Password</Link>
                            <button onClick={onLogout} className="btn-primary" style={{ padding: '0.25rem 0.5rem' }}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <span>Guest</span>
                        </div>
                    )}
                </nav>
            </div>
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
