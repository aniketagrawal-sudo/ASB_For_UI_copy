import React from "react";
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import classes from './UsageStatsChartThreeTrends.module.scss';
import { useSelector } from 'react-redux';
import { selectAdminUsageStatsChartThreeBar } from '../../redux/store/adminSlice';

const colorMap = {
  "Persona 1": "#03AB53",
  "Persona 2": "#F7901D",
  "Persona 3": "#1F77B4",
};

export function Chart3Tooltip({ active, payload, filter }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  let userLabel =
    filter === "Active"
      ? "Active Users"
      : filter === "Inactive"
      ? "Inactive Users"
      : "Total Users";

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "10px",
      }}
    >
      <div style={{ color: colorMap[data.name], fontWeight: "600" }}>
        {data.name}
      </div>

      <div>{userLabel}: <strong>{data.users}</strong></div>
      <div>Avg Time Spent: <strong>{data.avgTimeSpent} hours</strong></div>
    </div>
  );
}

export function UsageStatsChartThreeTrends() {
  const chart3Data = useSelector(selectAdminUsageStatsChartThreeBar);
  const [filter, setFilter] = useState('All');

  // --- FIXED: filtered data inside component ---
  const filteredData = chart3Data.filter(item => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  return (
    <Card sx={{ px: 0, py: 2, borderRadius: '10px' }} className={classes.loginTrendsContainer}>
      <div className={classes.loginTrendsHeader}>
        <h2 className={classes.loginHeaderText}>Chart 3</h2>

        <FormControl className={classes.loginDropdownContainer} variant="outlined" size="small">
          <InputLabel className={classes.loginDropdownInput} id="chart3-label">
            Filter
          </InputLabel>
          <Select
            className={classes.loginDropdownSelect}
            labelId="chart3-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem className={classes.loginDropdownOptions} value="All">All</MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Active">Active</MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.dividerWrapper}>
        <Divider className={classes.divider} />
      </div>

      <CardContent sx={{ p: 2.5 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 8}
                  textAnchor="middle"
                  fill={colorMap[payload.value]}
                  fontSize="10"
                  fontWeight="400"
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#1A1A1A' }}
              label={{
                value: 'No. of Hours',
                angle: -90,
                position: 'insideLeft',
                offset: 24,
                fontSize: 10,
                color: '#1A1A1A',
              }}
            />

            <Tooltip
              content={(props) => <Chart3Tooltip {...props} filter={filter} />}
              itemStyle={{ fontSize: '10px' }}
              labelStyle={{ fontSize: '10px' }}
            />

            <Bar dataKey="value" barSize={18} radius={[0, 0, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
