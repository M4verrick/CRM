import React, { lazy } from 'react';

// layout import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute.jsx';

// render pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

const Unauthorized = () => <div>You are not authorized to view this page</div>;
const ProfileTable = Loadable(lazy(() => import('pages/tables/profile-table')));
const UserTable = Loadable(lazy(() => import('pages/tables/user-table')));
const ClientTransactionTable = Loadable(lazy(() => import('pages/tables/client-transaction-table')));
const UserTransactionTable = Loadable(lazy(() => import('pages/tables/user-transaction-table')));
const AccountForm = Loadable(lazy(() => import('pages/forms/NewAccount')));
const ClientForm = Loadable(lazy(() => import('pages/forms/NewClient')));
const UserForm = Loadable(lazy(() => import('pages/forms/NewUser')));

// ==============================|| MAIN ROUTING ||============================== //

// Define your routes with role-based protection
const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
    ),
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
        )
    },
    {
      path: 'ProfileTable',
      element: (
        <ProtectedRoute>
          <ProfileTable />
        </ProtectedRoute>
      )
    },
    {
      path: 'UserTable',
      element:
      (
        <ProtectedRoute>
          <UserTable />
        </ProtectedRoute>
      )
    },
    {
      path: 'ClientTransactionTable',
      element:
      (
        <ProtectedRoute>
          <ClientTransactionTable />
        </ProtectedRoute>
      )
    },
    {
      path: 'UserTransactionTable',
      element:
      (
        <ProtectedRoute>
          <UserTransactionTable />
        </ProtectedRoute>
      )
    },
    {
      path: 'AccountForm',
      element: 
      (
        <ProtectedRoute>
          <AccountForm />
        </ProtectedRoute>
      )
    },
    {
      path: 'ClientForm',
      element: 
      (
        <ProtectedRoute>
          <ClientForm />
        </ProtectedRoute>
      )
    },
    {
      path: 'UserForm',
      element:(
        <ProtectedRoute>
          <UserForm />
        </ProtectedRoute>
      )
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
  ]
};

export default MainRoutes;
