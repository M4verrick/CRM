// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

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
    }
  ]
};

export default support;
