import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

// Gate for routes that require a signed-in user. While the session is still
// bootstrapping we show a spinner (so we never flash the login page). If the
// check resolves to "not authenticated", redirect to /login and remember where
// the user was headed so we can send them back after sign-in.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-coral-500">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
