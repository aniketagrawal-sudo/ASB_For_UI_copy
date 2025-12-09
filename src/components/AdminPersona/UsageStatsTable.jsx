import React from 'react';
import PropTypes from "prop-types";
import styles from "./UsageStatsTable.module.scss";
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

export default function UsageStatsTable({ users, search, onEdit, onDelete }) {
  const filtered = (users || []).filter((u) =>
    u.username.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <TableContainer component={Paper} elevation={0} className={styles.tableContainer}>
      <Table size="medium" aria-label="user list">
        <TableHead>
          <TableRow className={styles.tableHeader}>
            <TableCell>User Name</TableCell>
            <TableCell>Email ID</TableCell>
            <TableCell>Officer ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>User Status</TableCell>
            <TableCell>Active Since</TableCell>
            <TableCell>Avg. Time Spent</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id} hover className={styles.tableRow}>
              <TableCell sx={{ width: 160 }}>
                {row.username}
              </TableCell>
               <TableCell sx={{ width: 200 }}>{row.emailId}</TableCell>
              <TableCell sx={{ width: 150 }}>{row.officerId}</TableCell>
              <TableCell sx={{ width: 175 }}>{row.title}</TableCell>
              <TableCell sx={{ width: 200 }}>{row.department}</TableCell>
               <TableCell sx={{ width: 120 }}>
                <Chip
                  label={row.status}
                  size="small"
                  color={row.status === "Onboarded" ? "success" : "default"}
                  variant={row.status === "Onboarded" ? "filled" : "outlined"}
                />
              </TableCell>
              <TableCell sx={{ width: 180 }}>
                {row.activeSince}
              </TableCell>
              <TableCell sx={{ width: 150 }}>
                {row.avgTimeSpent}
              </TableCell>
             
             
              <TableCell align="right" sx={{ width: 120 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit && onEdit({...row, status: row.status === "Offboarded" ? "Offboarded" : row.status})}
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

UsageStatsTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      emailId: PropTypes.string,
      officerId: PropTypes.string,
      title: PropTypes.string,
      department: PropTypes.string,
      status: PropTypes.string,
      activeSince: PropTypes.string,
      avgTimeSpent: PropTypes.string,
    })
  ),
  search: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

UsageStatsTable.defaultProps = {
  users: [],
  search: "",
};
