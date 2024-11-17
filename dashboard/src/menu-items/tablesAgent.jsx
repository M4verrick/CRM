// assets
import {
  BankOutlined,
  UserOutlined,
  ProfileOutlined,
  BookOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProfileOutlined,
  BookOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

// Currently default (admin) route shows all pages for ease of testing,
// settle the routing after settling the integration
const tablesAgent = {
  id: 'tablesAgent',
  title: 'Profiles',
  type: 'group',
  children: [
    {
      id: 'profile-table',
      title: 'Manage Profiles',
      type: 'item',
      url: '/ProfileTable',
      icon: icons.ProfileOutlined
    },
    {
      id: 'account-table',
      title: 'Manage Accounts',
      type: 'item',
      url: '/AccountTable',
      icon: icons.BankOutlined
    },
    {
      id: 'client-transaction-table',
      title: 'Account Transactions',
      type: 'item',
      url: '/ClientTransactionTable',
      icon: icons.BookOutlined
    },
  ]
};

export default tablesAgent;
