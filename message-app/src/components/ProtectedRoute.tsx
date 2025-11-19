import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  const { session } = useAuthStore();

  // While the session is being checked, you might want to show a loading spinner
  // For now, we'll just check for the presence of the session
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
