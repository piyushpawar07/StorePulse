import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading-spinner">Loading session...</div>;
    }

    if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated, save the intended location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized or home if role doesn't match
        // For now, redirect to home if they don't have access
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
