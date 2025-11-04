/* eslint-disable no-unused-vars */
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
// import HelpIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DashboardIcon from '../../../assets/Sidepanel/DashboardIcon.svg';
import InsightsIcon from '../../../assets/Sidepanel/InsightsIcon.svg';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  toggleFeedbackMode,
  selectIsFeedbackEnabled,
  resetConversationData,
} from '../../../redux/store/conversationSlice';
import {
  selectUser,
  selectCurrentPage,
  setCurrentPage,
  setSelectedRole,
  selectSelectedIndustry,
} from '../../../features/auth/authSlice';
import {
  selectHomeDashboardLoading,
  selectInsightsDashboardLoading,
  setLastRefreshed,
} from '../../../redux/store/dashboardSlice';
import { useResetVisualMutation } from '../../../services/dashboardApi';
import classes from './SidePanel.module.scss';
import AssociatedBankLogo from '../../../assets/Sidepanel/AssociatedBankLogo.svg';
import ProfileIcon from '../../../assets/Sidepanel/ProfileIcon.svg';
import HelpIcon from '../../../assets/Sidepanel/HelpIcon.svg';

import MainInfo from '../../../assets/Sidepanel/Main Info.svg';
import keycloak from '../../../utils/keycloak';

function SidePanel({
  onRefresh,
  isPolling,
  executingQueries,
  dashboardsReady,
  dashboardsLoading,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const currentPage = useSelector(selectCurrentPage);
  const isHomeLoading = useSelector(selectHomeDashboardLoading);
  const isInsightsLoading = useSelector(selectInsightsDashboardLoading);
  const isFeedbackEnabled = useSelector(selectIsFeedbackEnabled);
  const selectedIndustry = useSelector(selectSelectedIndustry);

  const [anchorEl, setAnchorEl] = useState(null);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const [resetVisual] = useResetVisualMutation();

  // 🔹 Role selection logic
  const [selectedRole, setSelectedRoleLocal] = useState('Relationship Manager');

  const handleToggleRole = () => {
    setSelectedRoleLocal((prev) =>
      prev === 'Relationship Manager' ? 'Admin Persona' : 'Relationship Manager'
    );
    dispatch(
      setSelectedRole(
        selectedRole === 'Relationship Manager'
          ? 'Admin Persona'
          : 'Relationship Manager'
      )
    );
  };

  const isRefreshing = isPolling || localRefreshing;

  const handlePageChange = (pageId) => {
    dispatch(setCurrentPage(pageId));
    dispatch(resetConversationData());
  };

  const handleLogoClick = () => {
    dispatch(setSelectedRole(null));
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await keycloak.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: DashboardIcon,
      loading: isHomeLoading || isRefreshing,
    },
    {
      id: 'insight',
      label: 'Insights',
      icon: InsightsIcon,
      loading: isInsightsLoading || isRefreshing || executingQueries,
    },
  ];

  const renderIcon = (item) => {
    if (item.loading)
      // return <CircularProgress size={20} className={classes.loadingIcon} />;
    return <img src={item.icon} alt={item.label} className={classes.menuIconImage} />;
  };

  return (
    <div className={classes.sidePanelContainer}>
      {/* Header */}
      <div className={classes.headerContent}>
        <div className={classes.logoSection}>
          <div className={classes.senseAiContainer}>
            <Tooltip title="" arrow>
              <div className={classes.logoWrapper} onClick={handleLogoClick}>
                <img src={AssociatedBankLogo} alt="Logo" className={classes.logo} />
              </div>
            </Tooltip>
          </div>
          <Typography variant="h6" className={classes.title}>
            ASB FOR AI
          </Typography>
        </div>

        <Divider className={classes.divider} />

        {/* 🔹 Selected Role Chip */}
        <div className={classes.roleSection}>
          <div
            className={`${classes.roleChip} ${selectedRole === 'Admin Persona'
              ? classes.adminActive
              : classes.managerActive
              }`}
            style={{ cursor: 'pointer' }}
            onClick={handleToggleRole}
          >
            <Typography variant="body2">{selectedRole}</Typography>
          </div>

        </div>
      </div>

      {/* Menu */}
      <List component="nav" className={classes.menuList}>
        {menuItems.map((item) => (
          <Tooltip key={item.id} title={item.label} arrow placement="right">
            <ListItem
              component="button"
              className={`${classes.menuItem} ${currentPage === item.id ? classes.selected : ''
                }`}
              onClick={() => handlePageChange(item.id)}
            >
              <ListItemIcon className={classes.menuIcon}>
                {renderIcon(item)}
              </ListItemIcon>
              <ListItemText primary={item.label} className={classes.menuText} />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Footer */}
      <div className={classes.footer}>
        <div className={classes.footerActions}>
          <Tooltip title="Help" arrow>
            {/* <IconButton className={classes.footerIcon}> */}
              {/* <HelpIcon /> */}
              <img src={HelpIcon} alt="HelpIcon" />
            {/* </IconButton> */}
          </Tooltip>

          <Tooltip title="Notification" arrow>
            {/* <IconButton className={classes.footerIcon}> */}
              <img src={MainInfo} alt="Main Info" />
            {/* </IconButton> */}
          </Tooltip>

          <Tooltip title="User Menu" arrow>
            {/* <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} className={classes.footerIcon}> */}
             <img src={ProfileIcon} alt="ProfileIcon" />
            {/* </IconButton> */}
          </Tooltip>
        </div>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          className={classes.userMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <div className={classes.userInfo}>
            <Avatar src={user?.picture} className={classes.menuAvatar}>
              {!user?.picture && user?.name?.[0]}
            </Avatar>
            <div className={classes.userDetails}>
              <Typography variant="subtitle1">{user?.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email}
              </Typography>
            </div>
          </div>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

SidePanel.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  isPolling: PropTypes.bool.isRequired,
  executingQueries: PropTypes.bool,
  dashboardsReady: PropTypes.object,
  dashboardsLoading: PropTypes.object,
};

SidePanel.defaultProps = {
  executingQueries: false,
  dashboardsReady: { home: false, insights: false },
  dashboardsLoading: { home: false, insights: false },
};

export default SidePanel;
