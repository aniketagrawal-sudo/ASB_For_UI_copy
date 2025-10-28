import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
  Chip,
  Box,
  Collapse,
  Badge,
  Pagination,
  CircularProgress,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/HelpOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Import Tiger Analytics logo
import NotificationIcon from '../../../assets/Sidepanel/Notification.png';
import TALogo from '../../../assets/TA-logo.png';
import classes from './AdminSidePanel.module.scss';

// Import Keycloak for logout
import keycloak from '../../../utils/keycloak';

// Import selectors
import { selectUser } from '../../../features/auth/authSlice';

/**
 * Format a username for display
 * - Converts dots to spaces
 * - Capitalizes first letter of each word
 */
export function formatName(name) {
  if (!name) return '';

  // Remove dots and replace with spaces
  const withoutDots = name.replace(/\./g, ' ');

  // Split by spaces and capitalize each part
  return withoutDots
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function AdminSidePanel({ selectedSection, onSectionChange, adminData }) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    personas: false,
    biDashboards: false,
    dbTables: false,
    users: false,
  });

  // Pagination state for each section
  const [currentPages, setCurrentPages] = useState({
    personas: 1,
    biDashboards: 1,
    dbTables: 1,
    users: 1,
  });

  const ITEMS_PER_PAGE = 5;

  // Get selected industry ID for filtering
  const selectedIndustryId = adminData.selectedIndustryName || 'All Industries';

  // Handle user menu operations
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await keycloak.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  // Toggle dropdown sections
  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // Handle section selection
  const handleSectionSelect = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  // Handle adding new items
  const handleAddNew = (section, e) => {
    e.stopPropagation();
    handleSectionSelect(`new-${section}`);
  };

  // Handle pagination for sections
  const handlePageChange = (section, page) => {
    setCurrentPages((prev) => ({
      ...prev,
      [section]: page,
    }));
  };

  // Calculate pagination for sections
  const getPaginatedItems = (items, section) => {
    if (!items || items.length === 0) {
      return [];
    }

    const pageIndex = currentPages[section] || 1;
    const startIndex = (pageIndex - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Calculate total pages for each section
  const getTotalPages = (items) => {
    if (!items || items.length === 0) {
      return 1;
    }
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  // Get section counts
  const getCounts = {
    personas: adminData.personas?.length || 0,
    biDashboards: adminData.biDashboards?.length || 0,
    dbTables: adminData.dbTables?.length || 0,
    users: adminData.users?.length || 0,
  };

  // Auto-open the dropdown of the current section
  useEffect(() => {
    if (selectedSection.startsWith('persona-')) {
      setOpenDropdowns((prev) => ({ ...prev, personas: true }));
    } else if (selectedSection.startsWith('biDashboard-')) {
      setOpenDropdowns((prev) => ({ ...prev, biDashboards: true }));
    } else if (selectedSection.startsWith('dbTable-')) {
      setOpenDropdowns((prev) => ({ ...prev, dbTables: true }));
    } else if (selectedSection.startsWith('user-')) {
      setOpenDropdowns((prev) => ({ ...prev, users: true }));
    }
  }, [selectedSection]);

  return (
    <div className={classes.sidePanelContainer}>
      {/* Header Section */}
      <div className={classes.headerContent}>
        <div className={classes.logoSection}>
          <div className={classes.logoWrapper} onClick={handleLogoClick}>
            <img src={TALogo} alt="TA Logo" className={classes.logo} />
            <Typography variant="h6" className={classes.title}>
              Sense AI
            </Typography>
          </div>
        </div>
        <Divider className={classes.divider} />
      </div>

      {/* Role Section */}
      <div className={classes.roleSection}>
        <Chip
          label={`Industry: ${selectedIndustryId}`}
          className={classes.roleChip}
          color="primary"
          variant="outlined"
        />
      </div>

      {/* Menu List */}
      <List className={classes.menuList} component="nav">
        {/* Home */}
        <ListItem
          className={`${classes.menuItem} ${selectedSection === 'home' ? classes.selected : ''}`}
          onClick={() => handleSectionSelect('home')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard Overview"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
          </div>
        </ListItem>

        {/* Personas */}
        <ListItem
          className={`${classes.menuItem} ${
            selectedSection === 'personas' || selectedSection.startsWith('persona-') ? classes.selected : ''
          }`}
          onClick={() => handleSectionSelect('personas')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Persona Management"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
            <Badge badgeContent={getCounts.personas} color="primary" className={classes.countBadge} max={99} />
            <IconButton
              size="small"
              className={classes.addButton}
              onClick={(e) => handleAddNew('personas', e)}
              title="Add New Persona">
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('personas');
              }}>
              {openDropdowns.personas ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </div>
        </ListItem>

        <Collapse in={openDropdowns.personas} timeout="auto" unmountOnExit className={classes.dropdownCollapse}>
          <List component="div" disablePadding className={classes.nestedList}>
            {adminData.loading ? (
              <ListItem>
                <CircularProgress size={20} className={classes.loadingSpinner} />
                <ListItemText primary="Loading personas..." />
              </ListItem>
            ) : getPaginatedItems(adminData.personas, 'personas').length > 0 ? (
              getPaginatedItems(adminData.personas, 'personas').map((persona) => (
                <ListItem
                  key={persona.id}
                  className={`${classes.nestedListItem} ${
                    selectedSection === `persona-${persona.id}` ? classes.nestedSelected : ''
                  }`}
                  onClick={() => handleSectionSelect(`persona-${persona.id}`)}>
                  <ListItemText
                    primary={persona.name}
                    className={classes.nestedListText}
                    primaryTypographyProps={{ className: classes.nestedItemTypography }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem className={classes.nestedListItem}>
                <ListItemText
                  primary="No personas found"
                  className={classes.nestedListText}
                  primaryTypographyProps={{ className: classes.nestedItemTypography }}
                />
              </ListItem>
            )}

            {/* Pagination for personas */}
            {getTotalPages(adminData.personas) > 1 && (
              <Box className={classes.paginationContainer}>
                <Pagination
                  count={getTotalPages(adminData.personas)}
                  page={currentPages.personas}
                  onChange={(e, page) => handlePageChange('personas', page)}
                  size="small"
                  className={classes.pagination}
                />
              </Box>
            )}
          </List>
        </Collapse>

        {/* BI Dashboards */}
        <ListItem
          className={`${classes.menuItem} ${
            selectedSection === 'biDashboards' || selectedSection.startsWith('biDashboard-') ? classes.selected : ''
          }`}
          onClick={() => handleSectionSelect('biDashboards')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText
              primary="BI Dashboards"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
            <Badge badgeContent={getCounts.biDashboards} color="primary" className={classes.countBadge} max={99} />
            <IconButton
              size="small"
              className={classes.addButton}
              onClick={(e) => handleAddNew('biDashboards', e)}
              title="Add New Dashboard">
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('biDashboards');
              }}>
              {openDropdowns.biDashboards ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </div>
        </ListItem>

        <Collapse in={openDropdowns.biDashboards} timeout="auto" unmountOnExit className={classes.dropdownCollapse}>
          <List component="div" disablePadding className={classes.nestedList}>
            {adminData.loading ? (
              <ListItem>
                <CircularProgress size={20} className={classes.loadingSpinner} />
                <ListItemText primary="Loading dashboards..." />
              </ListItem>
            ) : getPaginatedItems(adminData.biDashboards, 'biDashboards').length > 0 ? (
              getPaginatedItems(adminData.biDashboards, 'biDashboards').map((dashboard) => (
                <ListItem
                  key={dashboard.id}
                  className={`${classes.nestedListItem} ${
                    selectedSection === `biDashboard-${dashboard.id}` ? classes.nestedSelected : ''
                  }`}
                  onClick={() => handleSectionSelect(`biDashboard-${dashboard.id}`)}>
                  <ListItemText
                    primary={dashboard.name}
                    className={classes.nestedListText}
                    primaryTypographyProps={{ className: classes.nestedItemTypography }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem className={classes.nestedListItem}>
                <ListItemText
                  primary="No dashboards found"
                  className={classes.nestedListText}
                  primaryTypographyProps={{ className: classes.nestedItemTypography }}
                />
              </ListItem>
            )}

            {/* Pagination for dashboards */}
            {getTotalPages(adminData.biDashboards) > 1 && (
              <Box className={classes.paginationContainer}>
                <Pagination
                  count={getTotalPages(adminData.biDashboards)}
                  page={currentPages.biDashboards}
                  onChange={(e, page) => handlePageChange('biDashboards', page)}
                  size="small"
                  className={classes.pagination}
                />
              </Box>
            )}
          </List>
        </Collapse>

        {/* Database Tables */}
        <ListItem
          className={`${classes.menuItem} ${
            selectedSection === 'dbTables' || selectedSection.startsWith('dbTable-') ? classes.selected : ''
          }`}
          onClick={() => handleSectionSelect('dbTables')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Database Tables"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
            <Badge badgeContent={getCounts.dbTables} color="primary" className={classes.countBadge} max={99} />
            <IconButton
              size="small"
              className={classes.addButton}
              onClick={(e) => handleAddNew('dbTables', e)}
              title="Add New Table">
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('dbTables');
              }}>
              {openDropdowns.dbTables ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </div>
        </ListItem>

        <Collapse in={openDropdowns.dbTables} timeout="auto" unmountOnExit className={classes.dropdownCollapse}>
          <List component="div" disablePadding className={classes.nestedList}>
            {adminData.loading ? (
              <ListItem>
                <CircularProgress size={20} className={classes.loadingSpinner} />
                <ListItemText primary="Loading database tables..." />
              </ListItem>
            ) : getPaginatedItems(adminData.dbTables, 'dbTables').length > 0 ? (
              getPaginatedItems(adminData.dbTables, 'dbTables').map((table) => (
                <ListItem
                  key={table.id}
                  className={`${classes.nestedListItem} ${
                    selectedSection === `dbTable-${table.id}` ? classes.nestedSelected : ''
                  }`}
                  onClick={() => handleSectionSelect(`dbTable-${table.id}`)}>
                  <ListItemText
                    primary={table.name}
                    className={classes.nestedListText}
                    primaryTypographyProps={{ className: classes.nestedItemTypography }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem className={classes.nestedListItem}>
                <ListItemText
                  primary="No database tables found"
                  className={classes.nestedListText}
                  primaryTypographyProps={{ className: classes.nestedItemTypography }}
                />
              </ListItem>
            )}

            {/* Pagination for database tables */}
            {getTotalPages(adminData.dbTables) > 1 && (
              <Box className={classes.paginationContainer}>
                <Pagination
                  count={getTotalPages(adminData.dbTables)}
                  page={currentPages.dbTables}
                  onChange={(e, page) => handlePageChange('dbTables', page)}
                  size="small"
                  className={classes.pagination}
                />
              </Box>
            )}
          </List>
        </Collapse>

        {/* Users */}
        <ListItem
          className={`${classes.menuItem} ${
            selectedSection === 'users' || selectedSection.startsWith('user-') ? classes.selected : ''
          }`}
          onClick={() => handleSectionSelect('users')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
            <Badge badgeContent={getCounts.users} color="primary" className={classes.countBadge} max={99} />
            <IconButton
              size="small"
              className={classes.addButton}
              onClick={(e) => handleAddNew('users', e)}
              title="Add New User">
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('users');
              }}>
              {openDropdowns.users ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </div>
        </ListItem>

        <Collapse in={openDropdowns.users} timeout="auto" unmountOnExit className={classes.dropdownCollapse}>
          <List component="div" disablePadding className={classes.nestedList}>
            {adminData.loading ? (
              <ListItem>
                <CircularProgress size={20} className={classes.loadingSpinner} />
                <ListItemText primary="Loading users..." />
              </ListItem>
            ) : getPaginatedItems(adminData.users, 'users').length > 0 ? (
              getPaginatedItems(adminData.users, 'users').map((user) => (
                <ListItem
                  key={user.id}
                  className={`${classes.nestedListItem} ${
                    selectedSection === `user-${user.id}` ? classes.nestedSelected : ''
                  }`}
                  onClick={() => handleSectionSelect(`user-${user.id}`)}>
                  <ListItemText
                    primary={user.name || user.email}
                    className={classes.nestedListText}
                    primaryTypographyProps={{ className: classes.nestedItemTypography }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem className={classes.nestedListItem}>
                <ListItemText
                  primary="No users found"
                  className={classes.nestedListText}
                  primaryTypographyProps={{ className: classes.nestedItemTypography }}
                />
              </ListItem>
            )}

            {/* Pagination for users */}
            {getTotalPages(adminData.users) > 1 && (
              <Box className={classes.paginationContainer}>
                <Pagination
                  count={getTotalPages(adminData.users)}
                  page={currentPages.users}
                  onChange={(e, page) => handlePageChange('users', page)}
                  size="small"
                  className={classes.pagination}
                />
              </Box>
            )}
          </List>
        </Collapse>

        {/* Settings */}
        <ListItem
          className={`${classes.menuItem} ${selectedSection === 'settings' ? classes.selected : ''}`}
          onClick={() => handleSectionSelect('settings')}>
          <div className={classes.menuItemContent}>
            <ListItemIcon className={classes.menuIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="System Settings"
              primaryTypographyProps={{
                className: classes.menuText,
              }}
            />
          </div>
        </ListItem>
      </List>

      {/* Footer with User Profile */}
      <div className={classes.footer}>
        <div className={classes.footerActions}>
          {/* Help Icon */}
          <Tooltip title="Help & Documentation" arrow>
            <IconButton className={classes.footerIcon}>
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButton className={classes.footerIcon}>
              <img src={NotificationIcon} alt="Notifications" className={classes.actionIcon} />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title={formatName(user?.preferred_username) || 'User'} arrow>
            <IconButton
              onClick={handleOpenUserMenu}
              className={classes.avatarButton}
              aria-label="User menu"
              aria-controls="user-menu"
              aria-haspopup="true">
              <Avatar className={classes.userAvatar}>
                {user?.preferred_username ? user.preferred_username[0].toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            className={classes.userMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}>
            <div className={classes.userInfo}>
              <Avatar src={user?.picture} className={classes.menuAvatar}>
                {!user?.picture && user?.preferred_username?.[0].toUpperCase()}
              </Avatar>
              <div className={classes.userDetails}>
                <Typography variant="subtitle1">{formatName(user?.preferred_username)}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
              </div>
            </div>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

AdminSidePanel.propTypes = {
  selectedSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  adminData: PropTypes.shape({
    loading: PropTypes.bool,
    personas: PropTypes.array,
    biDashboards: PropTypes.array,
    dbTables: PropTypes.array,
    users: PropTypes.array,
    selectedIndustryName: PropTypes.string,
  }).isRequired,
};

export default AdminSidePanel;
