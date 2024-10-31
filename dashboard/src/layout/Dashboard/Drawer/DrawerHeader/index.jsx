import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';

import Button from '@mui/material/Button';

// project import
import { LogoutOutlined } from '@ant-design/icons';

import { useContext } from 'react';

import { AccountContext } from 'contexts/Account';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();

  const { logout } = useContext(AccountContext);

  return (
    <DrawerHeaderStyled theme={theme} open={!!open}>
      <Button onClick={logout} variant="outlined" startIcon={<LogoutOutlined sx={{ width: open ? 'auto' : 35, height: 35 }}/>}>
        Logout
      </Button>
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
