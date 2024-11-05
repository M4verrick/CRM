import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import VerifyRoutes from './VerifyRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([VerifyRoutes, MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
