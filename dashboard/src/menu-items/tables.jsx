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
      id: 'sample-page',
      title: 'Manage Profiles',
      type: 'item',
      url: '/sample-page',
      icon: icons.ChromeOutlined
    }
  ]
};

export default support;
