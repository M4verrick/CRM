import { useAccount } from 'contexts/Account.jsx';

// project import
import dashboard from './dashboard';
import utilities from './utilities';
import tables from './tables';
import tablesAgent from './tablesAgent';
import utilitiesAgent from './utilitiesAgent';

const menuItems = () => {
  const { hasGroup } = useAccount();

  // Define menu configurations for different roles
  const menuConfigs = {
    admin: {
      items: [dashboard, utilities, tables]
    },
    agent: {
      items: [dashboard, utilitiesAgent, tablesAgent]
    }
  };

  // Check roles in priority order
  if (hasGroup('admin')) {
    return menuConfigs.admin;
  }
  
  // Default to agent menu items
  return menuConfigs.agent;
};

export default menuItems;
