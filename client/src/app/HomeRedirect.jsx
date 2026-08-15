import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

/**
 * HomeRedirect: redirects an authenticated user to their role's home page.
 * Must be rendered inside a ProtectedRoute so user is guaranteed non-null.
 */
const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
};

export default HomeRedirect;
