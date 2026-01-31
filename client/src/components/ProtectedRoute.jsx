import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Protects routes that require authentication (e.g., Dashboard)
// If not logged in, redirects to login page
export const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Protects auth routes (Login, Signup) from logged-in users
// If already logged in, redirects to dashboard
export const GuestRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
