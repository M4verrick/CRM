// assets
import {
  BankOutlined,
  UserOutlined,
  ProfileOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'userform',
      title: 'Add User',
      type: 'item',
      url: '/UserForm',
      icon: icons.UserOutlined
    },
    {
      id: 'clientform',
      title: 'Add Client Profile',
      type: 'item',
      url: '/ClientForm',
      icon: icons.ProfileOutlined
    },
    {
      id: 'accountform',
      title: 'Add Account',
      type: 'item',
      url: '/AccountForm',
      icon: icons.BankOutlined
    }
  ]
};

export default utilities;
