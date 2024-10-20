import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// import awsConfig from './aws-exports';  // Import AWS configuration

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

// Amplify.configure(awsConfig);

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
