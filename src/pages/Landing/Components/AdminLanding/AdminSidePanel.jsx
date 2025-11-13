import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, selectCurrentPage } from '../../../../features/auth/authSlice';
import { ADMIN_MENU_CONFIG } from './adminMenuConfig';
import classes from './AdminSidePanel.module.scss';
import AssociatedBankLogo from '../../../../assets/Sidepanel/AssociatedBankLogo.svg'

function AdminSidePanel() {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);

  // 🟢 Set default page (first item in config)
  useEffect(() => {
    if (!currentPage) {
      dispatch(setCurrentPage(ADMIN_MENU_CONFIG[0].id));
    }
  }, [currentPage, dispatch]);

  const handlePageChange = (pageId) => {
    dispatch(setCurrentPage(pageId));
  };

  return (
    <div className={classes.sidePanelContainer}>
      {/* Header */}
      <div className={classes.headerContent}>
        <div className={classes.logoSection}>
          <div className={classes.senseAiContainer}>
            <Tooltip title="Go to Dashboard" arrow>
              <div className={classes.logoWrapper}>
                <img
                  src={AssociatedBankLogo}
                  alt="Logo"
                  className={classes.logo}
                />
              </div>
            </Tooltip>
          </div>
          <Typography variant="h6" className={classes.title}>
            ASB FOR AI
          </Typography>
        </div>

        <Divider className={classes.divider} />

        {/* Role Chip */}
        <div className={classes.roleSection}>
          <div className={`${classes.roleChip} ${classes.adminActive}`}>
            <Typography variant="body2">Admin Persona</Typography>
          </div>
        </div>
      </div>

      {/* Dynamic Menu */}
      <List component="nav" className={classes.menuList}>
        {ADMIN_MENU_CONFIG.map((item) => (
          <Tooltip key={item.id} title={item.label} arrow placement="right">
            <ListItem
              component="button"
              className={`${classes.menuItem} ${
                currentPage === item.id ? classes.selected : ''
              }`}
              onClick={() => handlePageChange(item.id)}
            >
              <ListItemIcon className={classes.menuIcon}>
                <img src={item.icon} alt={item.label} className={classes.menuIconImage} />
              </ListItemIcon>
              <ListItemText primary={item.label} className={classes.menuText} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </div>
  );
}

export default AdminSidePanel;
