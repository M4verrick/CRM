import React, { lazy } from 'react';

// layout import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute.jsx';
import { Button, Result } from 'antd';
import { Navigate } from 'react-router-dom';

// render pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ProfileTable = Loadable(lazy(() => import('pages/tables/profile-table')));
const AccountTable = Loadable(lazy(() => import('pages/tables/account-table')));
const UserTable = Loadable(lazy(() => import('pages/tables/user-table')));
const ClientTransactionTable = Loadable(lazy(() => import('pages/tables/client-transaction-table')));
const UserTransactionTable = Loadable(lazy(() => import('pages/tables/user-transaction-table')));
const AccountForm = Loadable(lazy(() => import('pages/forms/NewAccount')));
const ClientForm = Loadable(lazy(() => import('pages/forms/NewClient')));
const UserForm = Loadable(lazy(() => import('pages/forms/NewUser')));

// result pages
const Unauthorized = () => {
  return <div><Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button type="primary" onClick={() => <Navigate to="/" />}>
      Back Home
    </Button>} /></div>;
}
const DoesNotExist = () => {
  return <div><Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={() => <Navigate to="/" />}>
      Back Home
    </Button>} /></div>;
}

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
          <ProtectedRoute roles={['admin', 'root-admin']}>
            <UserTable />
          </ProtectedRoute>
        )
    },
    {
      path: 'AccountTable',
      element:
        (
          <ProtectedRoute >
            <AccountTable />
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
      element: (
        <ProtectedRoute>
          <UserForm />
        </ProtectedRoute>
      )
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: '*',
      element: <DoesNotExist />,
    },
  ]
};

export default MainRoutes;
