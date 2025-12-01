import { useEffect, useState } from 'react';
import UsageStatsKpiList from './UsageStatsKpiList';
import UsageStatsTable from './UsageStatsTable';
import { Typography, Box, TextField, InputAdornment, IconButton, Stack, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UsageStatsOnBoardKPIDialog from './UsageStatsOnBoardKPIDialog';
import ConfirmDialog from '../../assets/ConfirmDialogBox/ConfirmDialog';
import classes from './UsageStats.module.scss';

const SAMPLE_USERS = [
  {
    id: '1',
    username: 'William Anderson',
    description: 'VP - Commercial Banking',
    category: 'OKR',
    persona: 'Regional Manager',
    status: 'In-Active',
  },
  {
    id: '2',
    username: 'Mia White',
    description: 'VP - Commercial Banking',
    category: 'Widget',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '3',
    username: 'Neha Kapoor',
    description: 'Team Leader',
    category: 'Chart',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '4',
    username: 'Emily Johnson',
    description: 'Team Leader',
    category: 'Dashboard Metric',
    persona: 'Regional Manager',
    status: 'Active',
  },
];

const UsageStats = () => {
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // "create" | "edit"
  const [editingUser, setEditingUser] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users, falling back to sample users', err);
      setError(err.message || 'Failed to fetch users');
      // fallback
      setUsers(SAMPLE_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
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
      // fallback: add locally with generated id
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

  // Update user
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
              }
            : u,
        ),
      );
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      // remove from state
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      // fallback: remove locally anyway
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // handlers used by UI
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

  return (
    <div className={classes.kpiMainContainer}>
      <UsageStatsKpiList />
      <Box className={classes.TableContaier}>
        <Box sx={{ flex: 1 }}>
          <Box className={classes.KpisTableHeader}>
            <Typography
              className={classes.headerTitle}
              >
              User List
            </Typography>
            <Button
               className={classes.addButton}
              startIcon={<AddCircleOutlineIcon className={classes.addIcon} />}
              onClick={handleCreateOpen}>
              Add KPI
            </Button>
          </Box>

          <Box className={classes.searchContainer}>
            <Stack
              className={classes.searchStack}
              >
              <TextField
                placeholder="Search KPIs..."
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
              {/* <Stack direction="row" spacing={1} className={classes.iconActions}>
                <IconButton>
                  <SortIcon /> Sort By
                </IconButton>
                <IconButton>
                  <FilterListIcon /> Filters
                </IconButton>
              </Stack> */}
            </Stack>

            <UsageStatsTable users={users} search={search} onEdit={handleEditOpen} onDelete={handleAskDelete} />
          </Box>

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
          initialValues={
            editingUser
              ? {
                  username: editingUser.username,
                  description: editingUser.description,
                  category: editingUser.category,
                  persona: editingUser.persona,
                }
              : undefined
          }
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Are you sure you want to delete?"
          description={
            toDelete ? `This will permanently remove ${toDelete.username}. Please click on delete to confirm.` : undefined
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
  );
};

export default UsageStats;
