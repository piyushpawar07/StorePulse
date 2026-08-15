import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ChangePassword from '../features/auth/pages/ChangePassword';
import StoreList from '../features/stores/pages/StoreList';
import StoreDetail from '../features/stores/pages/StoreDetail';
import ProtectedRoute from '../shared/components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <StoreList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'stores',
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <StoreList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'stores/:id',
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <StoreDetail />
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
        ],
    },
]);

export default router;
