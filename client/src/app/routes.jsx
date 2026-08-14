import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <div>Home Page (Placeholder)</div>,
            },
            // Routes for features will go here
            // { path: 'auth', element: <AuthLayout /> },
            // { path: 'admin', element: <AdminDashboard /> },
        ],
    },
]);

export default router;
