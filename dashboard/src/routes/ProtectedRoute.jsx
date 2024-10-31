import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAccount } from 'contexts/Account.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAccount();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Check for specific user roles if needed
  // const hasRequiredRole = (requiredRoles) => {
  //   if (!requiredRoles?.length) return true;
  //   return requiredRoles.some(role => userGroups?.includes(role));
  // };

  return children;
};

export default ProtectedRoute;