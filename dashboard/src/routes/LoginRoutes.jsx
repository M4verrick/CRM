import React, { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import PublicOnlyRoute from './PublicOnlyRoute.jsx';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: (
        <PublicOnlyRoute>
          <AuthLogin />
        </PublicOnlyRoute>
      )
    },
  ]
};

export default LoginRoutes;
