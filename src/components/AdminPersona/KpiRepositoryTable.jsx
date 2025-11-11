
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function KpiRepositoryTable({ users, search, onEdit, onDelete }) {
  const filtered = (users || []).filter((u) =>
    u.username.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
      <Table size="medium" aria-label="user list">
        <TableHead sx={{ backgroundColor: "#fafafa" }}>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Allocated Persona</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ width: 260 }}>
                <Typography fontWeight={600}>{row.username}</Typography>
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell sx={{ width: 220 }}>{row.persona}</TableCell>
              <TableCell sx={{ width: 120 }}>
                <Chip
                  label={row.status}
                  size="small"
                  color={row.status === "Active" ? "success" : "default"}
                  variant={row.status === "Active" ? "filled" : "outlined"}
                />
              </TableCell>
              <TableCell align="right" sx={{ width: 120 }}>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit && onEdit(row)} aria-label="edit user">
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => onDelete && onDelete(row)} aria-label="delete user">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>No users found.</Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

KpiRepositoryTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      description: PropTypes.string,
      persona: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  search: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

KpiRepositoryTable.defaultProps = {
  users: [],
  search: "",
};
