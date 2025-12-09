import { useEffect, useState, useMemo } from 'react';
import UsageStatsKpiList from './UsageStatsKpiList';
import UsageStatsTable from './UsageStatsTable';
import { Typography, Box, TextField, InputAdornment, IconButton, Stack, Button,  Drawer,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem, } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UsageStatsOnBoardKPIDialog from './UsageStatsOnBoardKPIDialog';
import ConfirmDialog from '../../assets/ConfirmDialogBox/ConfirmDialog';
import classes from './UsageStats.module.scss';
import { useSelector } from 'react-redux';
import { selectAdminUsageStatsTableList } from '../../redux/store/adminSlice';
import sortIcon from '../../assets/sortIcon.png';
import filterIcons from '../../assets/filerIcons.png';
import { UsageStatsChartThreeTrends } from './UsageStatsChartThreeTrends';
import { UsageStatsLoginTrends } from './UsageStatsLoginTrends';
import { UsageStatsTimespent } from './UsageStatsTimespent';

const UsageStats = () => {
  const SAMPLE_USERS = useSelector(selectAdminUsageStatsTableList);
 // Extract unique dropdown values dynamically from SAMPLE_USERS
const USER_OPTIONS = useMemo(
  () => [...new Set((SAMPLE_USERS || []).map((u) => u.username))],
  [SAMPLE_USERS]
);

  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // "create" | "edit"
  const [editingUser, setEditingUser] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

    const [openFilters, setOpenFilters] = useState(false);
    const [filterConfig, setFilterConfig] = useState([]);

    const [filters, setFilters] = useState({});
    const [tempFilters, setTempFilters] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = SAMPLE_USERS;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users, falling back to sample users', err);
      setError(err.message || 'Failed to fetch users');
      setUsers(SAMPLE_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userPayload) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const newUser = await res.json();
      // if API responds with created user append to list; otherwise refetch
      if (newUser && newUser.id) setUsers((prev) => [newUser, ...prev]);
      else fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      const fallback = {
        id: String(Date.now()),
        username: userPayload.username || `User ${users.length + 1}`,
        description: userPayload.description || '—',
        category: userPayload.category || '—',
        persona: userPayload.persona || 'Regional Manager',
        status: 'Active',
      };
      setUsers((prev) => [fallback, ...prev]);
    }
  };

  const updateUser = async (id, userPayload) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      if (updated && updated.id) {
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      } else {
        // optimistic update if API did not return object
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  username: userPayload.username || u.username,
                  description: userPayload.description || '—',
                  category: userPayload.category || '—',
                  persona: userPayload.persona || u.persona,
                   status: userPayload.status || u.status, // 🔹 add this
                }
              : u,
          ),
        );
      }
    } catch (err) {
      console.error('Error updating user:', err);
      // optimistic local update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                username: userPayload.username || u.username,
                description: userPayload.description || '—',
                category: userPayload.category || '—',
                persona: userPayload.persona || u.persona,
                 status: userPayload.status || u.status, // 🔹 add this
              }
            : u,
        ),
      );
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleCreateOpen = () => {
    setDialogMode('create');
    setEditingUser(null);
    setOpen(true);
  };

  const handleEditOpen = (user) => {
    setDialogMode('edit');
    setEditingUser(user);
    setOpen(true);
  };

  const handleSave = async (data) => {
    if (dialogMode === 'edit' && editingUser) {
      await updateUser(editingUser.id, data);
    } else {
      await createUser(data);
    }
    setOpen(false);
    setEditingUser(null);
  };

  const handleAskDelete = (user) => {
    setToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (toDelete) await deleteUser(toDelete.id);
    setConfirmOpen(false);
    setToDelete(null);
  };

    useEffect(() => {
      if (!users || users.length === 0) {
        setFilterConfig([]);
        setFilters({});
        return;
      }
  
      const first = users[0];
      const excludeKeys = new Set(['id', 'createdAt', 'updatedAt']);
      const keys = Object.keys(first).filter((k) => !excludeKeys.has(k));
  
      const cfg = keys.map((key) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        const optionsSet = new Set();
        users.forEach((u) => {
          const val = u[key];
          if (val !== undefined && val !== null && String(val).trim() !== '') optionsSet.add(String(val));
        });
        const options = Array.from(optionsSet).sort((a, b) => a.localeCompare(b));
        return { key, label, options };
      });
  
      setFilterConfig(cfg);
  
      setFilters((prev) => {
        const next = { ...prev };
        cfg.forEach((c) => {
          if (!(c.key in next)) next[c.key] = '';
        });
        Object.keys(next).forEach((k) => {
          if (!cfg.find((c) => c.key === k)) delete next[k];
        });
        return next;
      });
    }, [users]);

   const filteredSortedUsers = useMemo(() => {
     const text = (search || '').trim().toLowerCase();
 
     return [...users]
       .filter((u) => {
         if (!text) return true;
         const searchFields = ['username', 'description', 'category', 'persona'];
         return searchFields.some((f) =>
           String(u[f] || '')
             .toLowerCase()
             .includes(text),
         );
       })
       .filter((u) =>
         Object.keys(filters).every((k) => {
           const filterVal = filters[k];
           if (!filterVal) return true;
           const userVal = u[k];
           return String(userVal ?? '').toLowerCase() === String(filterVal).toLowerCase();
         }),
       )
       .sort((a, b) => {
         const { key, direction } = sortConfig;
         if (!key) return 0;
         const va = String(a[key] ?? '').toLowerCase();
         const vb = String(b[key] ?? '').toLowerCase();
         if (va < vb) return direction === 'asc' ? -1 : 1;
         if (va > vb) return direction === 'asc' ? 1 : -1;
         return 0;
       });
   }, [users, search, filters, sortConfig]);

  const handleOpenFilters = () => {
    setTempFilters({ ...filters });
    setOpenFilters(true);
  };

  return (
    <div className={classes.kpiMainContainer}>
      <UsageStatsKpiList />
      <div style={{height: '100vh', overflowY: 'scroll'}}>
      <Box className={classes.usageGraphContainer}>
        <UsageStatsLoginTrends />
        <UsageStatsTimespent />
        <UsageStatsChartThreeTrends />
      </Box>
      <Box className={classes.TableContaier}>
        <Box sx={{ flex: 1 }}>
          <Box className={classes.KpisTableHeader}>
            <Typography className={classes.headerTitle}>User List</Typography>
            {/* <Button
              className={classes.addButton}
              startIcon={<AddCircleOutlineIcon className={classes.addIcon} />}
              onClick={handleCreateOpen}>
              Add KPI
            </Button> */}
          </Box>

          <Box className={classes.searchContainer}>
            <Stack className={classes.searchStack}>
              <TextField
                placeholder="Search Users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                className={classes.searchStackTextFiled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} className={classes.iconActions}>
                <IconButton
                  className={classes.sortIconWrapper}
                  onClick={() =>
                    setSortConfig((prev) => ({
                      key: 'username', // sorted column
                      direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    }))
                  }>
                  <img className={classes.sortIcon} src={sortIcon} alt="Sort Icon" /> Sort by
                </IconButton>
               <IconButton className={classes.sortIconWrapper} onClick={handleOpenFilters}>
                  <Badge badgeContent={Object.values(filters).filter(Boolean).length} color="primary">
                    <img className={classes.sortIcon} src={filterIcons} alt="Filter Icon" />
                  </Badge>
                  Filters
                </IconButton>
              </Stack>
            </Stack>

            <UsageStatsTable users={filteredSortedUsers} search={search} onEdit={handleEditOpen} onDelete={handleAskDelete} />
          </Box>

 {/* Filter Drawer */}
            <Drawer classes={{ paper: classes.customDialogPaper }} anchor="right" open={openFilters} onClose={() => setOpenFilters(false)}>
              <Box sx={{ p: 2 }}>
                <IconButton
                  onClick={() => setOpenFilters(false)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}>
                  <CloseIcon />
                </IconButton>
                <Typography className={classes.dialogueTitle} variant="h6">Filters</Typography>

                {filterConfig.map((cfg) => (
                  <FormControl fullWidth sx={{ mt: 2 }} key={cfg.key}>
                    <InputLabel fullWidth sx={{ fontSize: '12px' }}>{cfg.label}</InputLabel>
                    <Select
                    // size="small"
                    sx={{ fontSize: '12px' }}
                    fullWidth
                      value={tempFilters[cfg.key] ?? ''}
                      label={cfg.label}
                      onChange={(e) => setTempFilters((prev) => ({ ...prev, [cfg.key]: e.target.value }))}>
                      {cfg.options.map((op) => (
                        <MenuItem fullWidth sx={{ fontSize: '12px' }} key={op} value={op}>
                          {op}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}

                <Stack className={classes.dialogActions} direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button
                  className={classes.saveBtn} 
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setFilters({ ...tempFilters });
                      setOpenFilters(false);
                    }}>
                    Apply
                  </Button>
                  <Button
                  className={classes.cancelBtn}
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      const reset = {};
                      filterConfig.forEach((c) => (reset[c.key] = ''));
                      setTempFilters(reset);
                      setFilters(reset);
                    }}>
                    Reset
                  </Button>
                </Stack>
              </Box>
            </Drawer>

          {loading && <Typography sx={{ mt: 2 }}>Loading users...</Typography>}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        <UsageStatsOnBoardKPIDialog
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          mode={dialogMode}
          USER_OPTIONS={USER_OPTIONS}
          initialValues={
            editingUser
              ? {
                username: editingUser.username,
                emailId: editingUser.emailId,
                officerId: editingUser.officerId,
                title: editingUser.title,
                department: editingUser.department,
                status: editingUser.status,
                }
              : undefined
          }
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Are you sure you want to delete?"
          description={
            toDelete
              ? `This will permanently remove ${toDelete.username}. Please click on delete to confirm.`
              : undefined
          }
          confirmText="Delete"
          onCancel={() => {
            setConfirmOpen(false);
            setToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </Box>
      </div>
    </div>
  );
};

export default UsageStats;
