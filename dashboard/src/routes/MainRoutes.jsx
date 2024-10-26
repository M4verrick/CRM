import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const AdminDashboard = Loadable(lazy(() => import('pages/dashboard-admin/index')));

// Placeholder components (replace with your actual components)
const Unauthorized = () => <div>You are not authorized to view this page</div>;

// render pages
const ProfileTable = Loadable(lazy(() => import('pages/tables/profile-table')));
const UserTable = Loadable(lazy(() => import('pages/tables/user-table')));
const ClientTransactionTable = Loadable(lazy(() => import('pages/tables/client-transaction-table')));
const UserTransactionTable = Loadable(lazy(() => import('pages/tables/user-transaction-table')));
const AccountForm = Loadable(lazy(() => import('pages/forms/NewAccount')));
const ClientForm = Loadable(lazy(() => import('pages/forms/NewClient')));
const UserForm = Loadable(lazy(() => import('pages/forms/NewUser')));

// ==============================|| MAIN ROUTING ||============================== //

// Mock authentication hook (replace with your actual auth logic)
const useAuth = () => {
  return {
    user: { role: 'admin' } // or 'agent', or null if not logged in
  };
};

// ProtectedRoute wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.includes(user.role)) {
    return element;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

// Define your routes with role-based protection
const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: 'admin',
      children: [
        {
          path: 'default',
          element: <ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />,
        }
      ]
    },
    {
      path: 'agent',
      children: [
        {
          path: 'default',
          element: <ProtectedRoute element={<DashboardDefault />} allowedRoles={['agent', 'admin']} />,
        }
      ]
    },
    // All visible for now, fix later after settling integration
    {
      path: 'ProfileTable',
      element: <ProfileTable />
    },
    {
      path: 'UserTable',
      element: <UserTable />
    },
    {
      path: 'ClientTransactionTable',
      element: <ClientTransactionTable />
    },
    {
      path: 'UserTransactionTable',
      element: <UserTransactionTable />
    },
    {
      path: 'AccountForm',
      element: <AccountForm />
    },
    {
      path: 'ClientForm',
      element: <ClientForm />
    },
    {
      path: 'UserForm',
      element: <UserForm />
    },
    // {
    //   path: '*',
    //   element: <Navigate to="/login" replace />,
    // }
  ]
};

export default MainRoutes;
