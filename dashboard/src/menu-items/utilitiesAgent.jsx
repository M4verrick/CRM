// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  ProfileOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
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
      id: 'accountform',
      title: 'Add Account',
      type: 'item',
      url: '/AccountForm',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default utilitiesAgent;
