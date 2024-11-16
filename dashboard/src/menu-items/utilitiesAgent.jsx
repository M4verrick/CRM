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

const utilitiesAgent = {
  id: 'utilitiesAgent',
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
  ]
};

export default utilitiesAgent;
