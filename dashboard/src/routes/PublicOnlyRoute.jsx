import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from 'contexts/Account.jsx';

// Wrapper for public only routes (like login)
const PublicOnlyRoute = ({ children }) => {
    const { user } = useAccount();
    const location = useLocation();
  
    if (user) {
      // Redirect to the page they came from or default to dashboard
      return <Navigate to={'/'} replace />;
    }
  
    return children;
};

export default PublicOnlyRoute;