import React from 'react';
import PropTypes from "prop-types";
import styles from "./KpiRepositoryTable.module.scss";
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
    <TableContainer component={Paper} elevation={0} className={styles.tableContainer}>
      <Table size="medium" aria-label="user list">
        <TableHead>
          <TableRow className={styles.tableHeader}>
            <TableCell>KPI Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Assignment</TableCell>
            {/* <TableCell>Status</TableCell> */}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id} hover className={styles.tableRow}>
              <TableCell sx={{ width: 260 }}>
                {row.username}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell sx={{ width: 220 }}>{row.persona}</TableCell>
              {/* <TableCell sx={{ width: 120 }}>
                <Chip
                  label={row.status}
                  size="small"
                  color={row.status === "Active" ? "success" : "default"}
                  variant={row.status === "Active" ? "filled" : "outlined"}
                />
              </TableCell> */}
              <TableCell align="right" sx={{ width: 120 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit && onEdit({...row})}
                    aria-label="edit user"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete && onDelete(row)}
                    aria-label="delete user"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Box className={styles.noData}>No KPI found.</Box>
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
      category: PropTypes.string,
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
