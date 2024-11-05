import React, { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const EmailVerification = Loadable(lazy(() => import('pages/authentication/EmailVerification')));

// ==============================|| AUTH ROUTING ||============================== //

const VerifyRoutes = {
  path: '/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'verify-email',
      element: <EmailVerification />
    },
  ]
};

export default VerifyRoutes;