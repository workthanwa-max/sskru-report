import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type User } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: User['role'][];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If not authorized for this specific role, bounce them to their default dashboard
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};
