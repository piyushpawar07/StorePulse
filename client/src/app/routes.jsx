import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ChangePassword from '../features/auth/pages/ChangePassword';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import { useAuth } from '../features/auth/hooks/useAuth';

// A simple test component for the home page
const HomeTest = () => {
    const { user } = useAuth();
    return (
        <div>
            <h2>Dashboard</h2>
            <p>This is a protected route. Only authenticated users can see this.</p>
            {user?.role === 'ADMIN' && <div style={{marginTop: '1rem', padding: '1rem', background: '#fee2e2'}}>ADMIN ZONE: Hello Admin!</div>}
            {user?.role === 'STORE_OWNER' && <div style={{marginTop: '1rem', padding: '1rem', background: '#fef08a'}}>OWNER ZONE: Hello Store Owner!</div>}
            {user?.role === 'USER' && <div style={{marginTop: '1rem', padding: '1rem', background: '#dcfce7'}}>USER ZONE: Hello Normal User!</div>}
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <HomeTest />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'change-password',
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <ChangePassword />
                    </ProtectedRoute>
                ),
            },
            // Other protected routes will be added here in future parts
        ],
    },
]);

export default router;
