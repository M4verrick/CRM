// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

// Currently default (admin) route shows all pages for ease of testing,
// settle the routing after settling the integration
const support = {
  id: 'support',
  title: 'Profiles',
  type: 'group',
  children: [
    {
      id: 'profile-table',
      title: 'Manage Profiles',
      type: 'item',
      url: '/ProfileTable',
      icon: icons.ChromeOutlined
    },
    {
      id: 'user-table',
      title: 'Manage System Users',
      type: 'item',
      url: '/UserTable',
      icon: icons.ChromeOutlined
    },
    {
      id: 'client-transaction-table',
      title: 'Manage Transactions',
      type: 'item',
      url: '/ClientTransactionTable',
      icon: icons.ChromeOutlined
    },
    {
      id: 'user-transaction-table',
      title: 'Manage User Transactions',
      type: 'item',
      url: '/UserTransactionTable',
      icon: icons.ChromeOutlined
    },
  ]
};

export default support;
