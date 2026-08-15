import { createBrowserRouter } from 'react-router-dom';
import App from './App';

/* Landing */
import LandingPage from '../features/landing/pages/LandingPage';

/* Auth */
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ChangePassword from '../features/auth/pages/ChangePassword';

/* Stores */
import StoreList from '../features/stores/pages/StoreList';
import StoreDetail from '../features/stores/pages/StoreDetail';

/* Admin */
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminUsers from '../features/admin/pages/AdminUsers';
import AdminUserDetail from '../features/admin/pages/AdminUserDetail';
import AdminStores from '../features/admin/pages/AdminStores';
import AdminStoreDetail from '../features/admin/pages/AdminStoreDetail';

/* Owner */
import OwnerDashboard from '../features/owner/pages/OwnerDashboard';
import OwnerRatings from '../features/owner/pages/OwnerRatings';

/* Shared */
import ProtectedRoute from '../shared/components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            /* Root → Landing page (public). Authenticated users are redirected inside the component. */
            {
                index: true,
                element: <LandingPage />,
            },

            /* ── Public auth pages ── */
            { path: 'login',    element: <Login /> },
            { path: 'register', element: <Register /> },

            /* ── Shared authenticated ── */
            {
                path: 'change-password',
                element: (
                    <ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']}>
                        <ChangePassword />
                    </ProtectedRoute>
                ),
            },

            /* ── Store browsing (all roles) ── */
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

            /* ── ADMIN pages ── */
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin/users',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUsers />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin/users/:id',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUserDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin/stores',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminStores />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin/stores/:id',
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminStoreDetail />
                    </ProtectedRoute>
                ),
            },

            /* ── STORE_OWNER pages ── */
            {
                path: 'owner',
                element: (
                    <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                        <OwnerDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'owner/ratings',
                element: (
                    <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                        <OwnerRatings />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;
