// assets
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  LogoutOutlined
};

// ==============================|| MENU ITEMS - AUTH PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
    },
    // {
    //   id: 'logout',
    //   title: 'Logout',
    //   type: 'item',
    //   icon: icons.LogoutOutlined,
    // },
  ]
};

export default pages;
