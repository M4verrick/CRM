import { useAccount } from 'contexts/Account.jsx';

// project import
import dashboard from './dashboard';
import utilities from './utilities';
import tables from './tables';
import tablesAgent from './tablesAgent';
import utilitiesAgent from './utilitiesAgent';
import { useState, useEffect } from 'react';


const menuItems = () => {
  const { hasGroup } = useAccount();
  const [menuConfig, setMenuConfig] = useState(null);

  useEffect(() => {
    const checkRoles = async () => {
      const adminCheck = await hasGroup('admin');
      const rootAdminCheck = await hasGroup('root-admin');

      // no need to check for status here, handled by await
      if ((adminCheck) ||
        (rootAdminCheck)) {
        console.log('Admin')
        console.log('adminCheck:', adminCheck);
        console.log('rootAdminCheck:', rootAdminCheck);
        setMenuConfig(menuConfigs.admin);
      } else {
        console.log('Agent')
        console.log('adminCheck:', adminCheck);
        console.log('rootAdminCheck:', rootAdminCheck);
        setMenuConfig(menuConfigs.agent);
      }
    };

    const menuConfigs = {
      admin: {
        items: [dashboard, utilities, tables]
      },
      agent: {
        items: [dashboard, utilitiesAgent, tablesAgent]
      }
    };

    checkRoles();
  }, [hasGroup]);

  return menuConfig || { items: [] };
};

export default menuItems;