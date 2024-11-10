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
      icon: icons.ChromeOutlined
    },
    {
      id: 'account-table',
      title: 'Manage Accounts',
      type: 'item',
      url: '/AccountTable',
      icon: icons.ChromeOutlined
    },
    {
      id: 'client-transaction-table',
      title: 'Manage Transactions',
      type: 'item',
      url: '/ClientTransactionTable',
      icon: icons.ChromeOutlined
    },
  ]
};

export default tablesAgent;
