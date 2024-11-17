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
      id: 'clientform',
      title: 'Add Client Profile',
      type: 'item',
      url: '/ClientForm',
      icon: icons.ProfileOutlined
    },
    {
      id: 'userform',
      title: 'Add Account',
      type: 'item',
      url: '/AccountForm',
      icon: icons.BankOutlined
    },
  ]
};

export default utilitiesAgent;
