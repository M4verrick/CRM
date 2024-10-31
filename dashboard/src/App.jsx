import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

import { Account } from './contexts/Account.jsx';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Account>
          <RouterProvider router={router} />
        </Account>
      </ScrollTop>
    </ThemeCustomization>
  );
}
