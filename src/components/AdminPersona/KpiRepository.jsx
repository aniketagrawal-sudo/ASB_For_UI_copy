import { useEffect, useState } from 'react';
import classes from './KpiRepository.module.scss';
import KpiRepositoryLists from './KpiRepositoryLists';
import KpiRepositoryTable from './KpiRepositoryTable';
import { Typography, Box, TextField, InputAdornment, Button, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OnBoardKPIDialogue from './OnBoardKPIDialogue';
import ConfirmDialog from './ConfirmDialog';

const SAMPLE_USERS = [
  {
    id: '1',
    username: 'William Anderson',
    description: 'VP - Commercial Banking',
    persona: 'Regional Manager',
    status: 'In-Active',
  },
  {
    id: '2',
    username: 'Mia White',
    description: 'VP - Commercial Banking',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '3',
    username: 'Neha Kapoor',
    description: 'Team Leader',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '4',
    username: 'Emily Johnson',
    description: 'Team Leader',
    persona: 'Regional Manager',
    status: 'Active',
  },
];

const KpiRepository = () => {
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
        description: userPayload.description || userPayload.category || '—',
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
                  description: userPayload.description || userPayload.category || u.description,
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
                description: userPayload.description || userPayload.category || u.description,
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
      <KpiRepositoryLists />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ flex: 1 }}>
          {/* User list header */}
          <Box sx={{ mt: 3, mb: 1.5 }}>
            <Typography variant="h6">User List</Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}>
            <TextField
              placeholder="Search Usernames..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ maxWidth: 360, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1}>
              <IconButton>
                <SortIcon />
              </IconButton>
              <IconButton>
                <FilterListIcon />
              </IconButton>
              <Button startIcon={<AddCircleOutlineIcon />} color="primary" onClick={handleCreateOpen}>
                Onboard User
              </Button>
            </Stack>
          </Stack>

          <KpiRepositoryTable users={users} search={search} onEdit={handleEditOpen} onDelete={handleAskDelete} />

          {loading && <Typography sx={{ mt: 2 }}>Loading users...</Typography>}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        <OnBoardKPIDialogue
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          mode={dialogMode}
          initialValues={
            editingUser
              ? {
                  username: editingUser.username,
                  description: editingUser.description,
                  persona: editingUser.persona,
                  category: editingUser.category,
                }
              : undefined
          }
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Delete user?"
          description={
            toDelete ? `This will permanently remove ${toDelete.username}. This action cannot be undone.` : undefined
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

export default KpiRepository;
