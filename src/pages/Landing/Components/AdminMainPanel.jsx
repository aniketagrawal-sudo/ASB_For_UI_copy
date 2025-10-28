import { useState, useEffect, useMemo } from 'react'; // useCallback unused
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  Storage as StorageIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Code as CodeIcon,
  PersonOutline as PersonOutlineIcon,
  BubbleChart as BubbleChartIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { selectUser } from '../../../features/auth/authSlice';
import classes from './AdminMainPanel.module.scss';
import { formatName } from './AdminSidePanel'; // Reuse the formatName function

const sectionTitles = {
  home: 'Admin Dashboard',
  personas: 'Persona Dashboard',
  biDashboards: 'BI Dashboard Management',
  dbTables: 'Database Tables',
  users: 'User Management',
  settings: 'System Settings',
};

function AdminMainPanel({ selectedSection, onSectionChange, adminData }) {
  const user = useSelector(selectUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState({
    personas: [],
    biDashboards: [],
    dbTables: [],
    users: [],
  });

  // Filtered overview cards for search functionality
  const overviewCards = useMemo(() => {
    return [
      {
        id: 'personas',
        title: 'Persona Management',
        description: 'Create, edit, and manage user personas',
        count: adminData.personas?.length || 0,
        icon: <PersonOutlineIcon fontSize="large" />,
        color: '#3f51b5',
      },
      {
        id: 'biDashboards',
        title: 'BI Dashboards',
        description: 'Manage business intelligence dashboards',
        count: adminData.biDashboards?.length || 0,
        icon: <BarChartIcon fontSize="large" />,
        color: '#4caf50',
      },
      {
        id: 'dbTables',
        title: 'Database Tables',
        description: 'Configure and monitor database tables',
        count: adminData.dbTables?.length || 0,
        icon: <StorageIcon fontSize="large" />,
        color: '#ff9800',
      },
      {
        id: 'users',
        title: 'User Management',
        description: 'Manage user accounts and permissions',
        count: adminData.users?.length || 0,
        icon: <SupervisorAccountIcon fontSize="large" />,
        color: '#e91e63',
      },
    ];
  }, [adminData]);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData({
        personas: adminData.personas || [],
        biDashboards: adminData.biDashboards || [],
        dbTables: adminData.dbTables || [],
        users: adminData.users || [],
      });
      return;
    }

    const term = searchTerm.toLowerCase();

    setFilteredData({
      personas: (adminData.personas || []).filter(
        (p) => p.name.toLowerCase().includes(term) || (p.context && p.context.toLowerCase().includes(term)),
      ),
      biDashboards: (adminData.biDashboards || []).filter(
        (b) => b.name.toLowerCase().includes(term) || (b.type && b.type.toLowerCase().includes(term)),
      ),
      dbTables: (adminData.dbTables || []).filter(
        (t) => t.name.toLowerCase().includes(term) || (t.description && t.description.toLowerCase().includes(term)),
      ),
      users: (adminData.users || []).filter(
        (u) => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term),
      ),
    });
  }, [searchTerm, adminData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSectionSelect = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  // Render the overview dashboard (home section)
  const renderOverviewDashboard = () => {
    return (
      <div className={classes.adminHomeContainer}>
        <Typography variant="h4" className={classes.welcomeTitle}>
          Hello, {formatName(user?.name || user?.preferred_username || 'Admin')}
        </Typography>
        <Typography className={classes.welcomeSubtitle}>
          Welcome to your admin dashboard. Here&apos;s an overview of your system.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search personas, dashboards, tables, users..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              className: classes.searchField,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <Grid container spacing={3} className={classes.statsGrid}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={classes.statTitle}>Total Personas</Typography>
                <Typography className={classes.statValue}>{adminData.personas?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={classes.statTitle}>BI Dashboards</Typography>
                <Typography className={classes.statValue}>{adminData.biDashboards?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={classes.statTitle}>DB Tables</Typography>
                <Typography className={classes.statValue}>{adminData.dbTables?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={classes.statTitle}>Active Users</Typography>
                <Typography className={classes.statValue}>{adminData.users?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" className={classes.sectionTitle} sx={{ mt: 4, mb: 2 }}>
          Management Sections
        </Typography>

        <Grid container spacing={3}>
          {overviewCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.id}>
              <Card className={classes.personaCard} onClick={() => handleSectionSelect(card.id)}>
                <CardActionArea>
                  <CardContent className={classes.personaCardContent}>
                    <Avatar className={classes.personaCardIcon} sx={{ bgcolor: card.color }}>
                      {card.icon}
                    </Avatar>
                    <Typography variant="h6" className={classes.personaCardTitle}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" className={classes.personaCardSubtitle}>
                      {card.description}
                    </Typography>
                    <Chip label={`${card.count} items`} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* System Status Section */}
        <Paper className={classes.sectionPaper} sx={{ mt: 4 }}>
          <Typography variant="h5" className={classes.sectionTitle}>
            System Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: adminData.systemStatus?.apiServerStatus === 'online' ? 'success.main' : 'error.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  API Server: {adminData.systemStatus?.apiServerStatus || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: adminData.systemStatus?.databaseStatus === 'connected' ? 'success.main' : 'error.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Database: {adminData.systemStatus?.databaseStatus || 'Unknown'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: adminData.systemStatus?.azureAdStatus === 'active' ? 'success.main' : 'error.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Azure AD: {adminData.systemStatus?.azureAdStatus || 'Unknown'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: adminData.systemStatus?.biServicesStatus === 'online' ? 'success.main' : 'error.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  BI Services: {adminData.systemStatus?.biServicesStatus || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Activities Section */}
        <Paper className={classes.sectionPaper} sx={{ mt: 4 }}>
          <Typography variant="h5" className={classes.sectionTitle}>
            Recent Activities
          </Typography>
          {adminData.recentActivities && adminData.recentActivities.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {adminData.recentActivities.slice(0, 5).map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {activity.message || `Activity ${index + 1}`}
                    {activity.user && <span> by {activity.user}</span>}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              No recent activities found.
            </Typography>
          )}
        </Paper>
      </div>
    );
  };

  // Render the personas dashboard
  const renderPersonasDashboard = () => {
    const personas = filteredData.personas || [];

    // Group personas by access frequency (mocked data for demonstration)
    const mostAccessed = personas.slice(0, 3);
    const favorites = personas.filter((p, index) => index % 2 === 0).slice(0, 2); // Just an example logic
    const allPersonas = personas.filter((p) => !mostAccessed.includes(p) && !favorites.includes(p));

    return (
      <div className={classes.personasBrowseContainer}>
        <TextField
          fullWidth
          placeholder="Search personas..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            className: classes.searchField,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        {mostAccessed.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon className={classes.sectionIcon} />
              <Typography variant="h6" className={classes.sectionSubtitle}>
                Most Accessed
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {mostAccessed.map((persona) => (
                <Grid item xs={12} sm={6} md={4} key={persona.id}>
                  <Card className={classes.personaCard}>
                    <CardActionArea onClick={() => handleSectionSelect(`persona-${persona.id}`)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" className={classes.personaCardTitle}>
                            {persona.name}
                          </Typography>
                          <ArrowForwardIcon />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }} noWrap>
                          {persona.context || 'No context available'}
                        </Typography>

                        {/* KPIs count */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          <Chip
                            size="small"
                            label={`${
                              Array.isArray(persona.KPIs) ? persona.KPIs.length : persona.KPIs?.KPIs?.length || 0
                            } KPIs`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`${persona.homeSummary?.length || 0} Reports`}
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {favorites.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FavoriteIcon className={classes.sectionIcon} />
              <Typography variant="h6" className={classes.sectionSubtitle}>
                Favorites
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {favorites.map((persona) => (
                <Grid item xs={12} sm={6} md={4} key={persona.id}>
                  <Card className={classes.personaCard}>
                    <CardActionArea onClick={() => handleSectionSelect(`persona-${persona.id}`)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" className={classes.personaCardTitle}>
                            {persona.name}
                          </Typography>
                          <ArrowForwardIcon />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }} noWrap>
                          {persona.context || 'No context available'}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          <Chip
                            size="small"
                            label={`${
                              Array.isArray(persona.KPIs) ? persona.KPIs.length : persona.KPIs?.KPIs?.length || 0
                            } KPIs`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`${persona.homeSummary?.length || 0} Reports`}
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
          <BubbleChartIcon className={classes.sectionIcon} />
          <Typography variant="h6" className={classes.sectionSubtitle}>
            All Personas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {allPersonas.length > 0 ? (
            allPersonas.map((persona) => (
              <Grid item xs={12} sm={6} md={4} key={persona.id}>
                <Card className={classes.personaCard}>
                  <CardActionArea onClick={() => handleSectionSelect(`persona-${persona.id}`)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" className={classes.personaCardTitle}>
                          {persona.name}
                        </Typography>
                        <ArrowForwardIcon />
                      </Box>

                      <Typography variant="body2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }} noWrap>
                        {persona.context || 'No context available'}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip
                          size="small"
                          label={`${
                            Array.isArray(persona.KPIs) ? persona.KPIs.length : persona.KPIs?.KPIs?.length || 0
                          } KPIs`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`${persona.homeSummary?.length || 0} Reports`}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No personas found matching your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  // Render the BI Dashboards section
  const renderBIDashboardsSection = () => {
    const dashboards = filteredData.biDashboards || [];

    return (
      <div className={classes.personasBrowseContainer}>
        <TextField
          fullWidth
          placeholder="Search BI dashboards..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            className: classes.searchField,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <Grid item xs={12} sm={6} md={4} key={dashboard.id}>
                <Card className={classes.dashboardCard}>
                  <CardActionArea onClick={() => handleSectionSelect(`biDashboard-${dashboard.id}`)}>
                    <CardContent className={classes.dashboardCardContent}>
                      <BarChartIcon className={classes.dashboardCardIcon} />
                      <Typography variant="h6" className={classes.dashboardCardTitle}>
                        {dashboard.name}
                      </Typography>
                      <Chip
                        label={dashboard.type}
                        size="small"
                        className={classes.dashboardTypeChip}
                        color={dashboard.type === 'powerbi' ? 'primary' : 'secondary'}
                      />
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Industry ID: {dashboard.industryId}
                        {dashboard.personaId ? ` • Persona ID: ${dashboard.personaId}` : ''}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No BI dashboards found matching your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  // Render DB Tables section
  const renderDBTablesSection = () => {
    const tables = filteredData.dbTables || [];

    return (
      <div className={classes.personasBrowseContainer}>
        <TextField
          fullWidth
          placeholder="Search database tables..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            className: classes.searchField,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {tables.length > 0 ? (
            tables.map((table) => (
              <Grid item xs={12} sm={6} md={4} key={table.id}>
                <Card className={classes.personaCard}>
                  <CardActionArea onClick={() => handleSectionSelect(`dbTable-${table.id}`)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" className={classes.personaCardTitle}>
                          {table.name}
                        </Typography>
                        <ArrowForwardIcon />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Schema: {table.schema}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }} noWrap>
                        {table.description || 'No description available'}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip
                          size="small"
                          label={`${table.rowCount?.toLocaleString() || 0} Rows`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`Industry: ${table.industryId}`}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No database tables found matching your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  // Render Users section
  const renderUsersSection = () => {
    const users = filteredData.users || [];

    return (
      <div className={classes.personasBrowseContainer}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            className: classes.searchField,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {users.length > 0 ? (
            users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card className={classes.personaCard}>
                  <CardActionArea onClick={() => handleSectionSelect(`user-${user.id}`)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" className={classes.personaCardTitle}>
                          {formatName(user.name) || 'Unknown User'}
                        </Typography>
                        <ArrowForwardIcon />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }}>
                        {user.email || 'No email available'}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {user.industries && (
                          <Chip
                            size="small"
                            label={`${user.industries.length} Industries`}
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          size="small"
                          label={new Date(user.createdAt).toLocaleDateString()}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No users found matching your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  // Render the specific persona details view
  const renderPersonaDetails = (personaId) => {
    const persona = adminData.personas?.find((p) => p.id === parseInt(personaId));
    if (!persona) {
      return (
        <div className={classes.detailsContainer}>
          <Typography variant="h5" sx={{ mb: 2, color: 'error.main' }}>
            Persona not found
          </Typography>
          <Typography variant="body1">The requested persona with ID {personaId} could not be found.</Typography>
        </div>
      );
    }

    // Parse KPIs data
    const kpis = persona.KPIs;
    const kpiItems = Array.isArray(kpis) ? kpis : kpis?.KPIs || [];

    // Parse responsibilities
    const responsibilities = kpis?.['Key responsibilities'] || [];

    // Parse action levers
    const actionLevers = kpis?.['Key action levers'] || {};

    return (
      <div className={classes.detailsContainer}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search within persona details..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              className: classes.searchField,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Persona Header */}
        <Paper className={classes.detailsPaper} sx={{ mb: 3 }}>
          <Typography variant="h5">{persona.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Created: {new Date(persona.createdAt).toLocaleDateString()}
            {persona.updatedAt && ` • Updated: ${new Date(persona.updatedAt).toLocaleDateString()}`}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {persona.context || 'No context description available for this persona.'}
          </Typography>
        </Paper>

        {/* KPIs Section */}
        <Typography variant="h6" className={classes.sectionSubtitle} sx={{ mt: 3, mb: 2 }}>
          <CodeIcon className={classes.sectionIcon} />
          Key Performance Indicators
        </Typography>

        <Grid container spacing={3}>
          {kpiItems.length > 0 ? (
            kpiItems.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={classes.kpiCard}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {kpi}
                    </Typography>
                    {actionLevers[kpi] && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Action Levers:
                        </Typography>
                        <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                          {actionLevers[kpi].map((lever, idx) => (
                            <li key={idx}>
                              <Typography variant="body2">{lever}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No KPIs defined for this persona.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Responsibilities Section */}
        {responsibilities.length > 0 && (
          <>
            <Typography variant="h6" className={classes.sectionSubtitle} sx={{ mt: 4, mb: 2 }}>
              <BusinessIcon className={classes.sectionIcon} />
              Key Responsibilities
            </Typography>
            <Paper className={classes.detailsPaper}>
              <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                {responsibilities.map((responsibility, index) => (
                  <li key={index}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {responsibility}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </>
        )}

        {/* Home Summary Section */}
        {persona.homeSummary && persona.homeSummary.length > 0 && (
          <>
            <Typography variant="h6" className={classes.sectionSubtitle} sx={{ mt: 4, mb: 2 }}>
              <BubbleChartIcon className={classes.sectionIcon} />
              Home Summary Insights
            </Typography>
            <Grid container spacing={3}>
              {persona.homeSummary.map((summary, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper className={classes.detailsPaper}>
                    <Typography variant="subtitle1" gutterBottom>
                      {summary.title}
                    </Typography>
                    <Typography variant="body2">{summary.summary}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </div>
    );
  };

  // Determine which content to render based on the selected section
  const renderContent = () => {
    if (selectedSection === 'home') {
      return renderOverviewDashboard();
    }

    if (selectedSection === 'personas') {
      return renderPersonasDashboard();
    }

    if (selectedSection === 'biDashboards') {
      return renderBIDashboardsSection();
    }

    if (selectedSection === 'dbTables') {
      return renderDBTablesSection();
    }

    if (selectedSection === 'users') {
      return renderUsersSection();
    }

    if (selectedSection.startsWith('persona-')) {
      const personaId = selectedSection.split('-')[1];
      return renderPersonaDetails(personaId);
    }

    // Default case
    return renderOverviewDashboard();
  };

  // Determine the current section title
  const getSectionTitle = () => {
    if (selectedSection.startsWith('persona-')) {
      const personaId = selectedSection.split('-')[1];
      const persona = adminData.personas?.find((p) => p.id === parseInt(personaId));
      return persona ? `Persona: ${persona.name}` : 'Persona Details';
    }

    return sectionTitles[selectedSection] || 'Admin Dashboard';
  };

  return (
    <div className={classes.mainPanelContainer}>
      <div className={classes.contentHeader}>
        <Typography variant="h5" className={classes.contentHeaderTitle}>
          {getSectionTitle()}
        </Typography>
      </div>
      {renderContent()}
    </div>
  );
}

AdminMainPanel.propTypes = {
  selectedSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  adminData: PropTypes.object.isRequired,
};

export default AdminMainPanel;
