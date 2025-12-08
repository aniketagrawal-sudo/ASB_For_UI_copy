import React from "react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FormControl, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import classes from './UsageStatsTimespent.module.scss';
import { useSelector } from "react-redux";
import { selectAdminUsageStatsTimeSpentBar } from "../../redux/store/adminSlice";

// 🎨 Persona Colors
const colorMap = {
  "Persona 1": "#03AB53",
  "Persona 2": "#F7901D",
  "Persona 3": "#1F77B4",
};

export function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

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

      <div>Total Users: <strong>{data.activeUsers}</strong></div>
      <div>Avg Time Spent: <strong>{data.avgTimeSpent} hours</strong></div>
    </div>
  );
}

export function UsageStatsTimespent() {
    const timeSpentData= useSelector(selectAdminUsageStatsTimeSpentBar);
  const [period, setPeriod] = useState("Day");

  return (
    <Card sx={{ px: 0, py: 2, borderRadius: '10px'}}className={classes.loginTrendsContainer}>
      <div className={classes.loginTrendsHeader}>
        <h2 className={classes.loginHeaderText}>Times Spent (Persona)</h2>

        <FormControl variant="outlined" size="small" className={classes.loginDropdownContainer}>
          <InputLabel 
          className={classes.loginDropdownInput}id="time-spent-label">Period</InputLabel>
          <Select
          data-testid="timespent-dropdown"
           className={classes.loginDropdownSelect}
            labelId="time-spent-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem className={classes.loginDropdownOptions} value="Day">Day</MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Week">Week</MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Month">Month</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.dividerWrapper}>
  <Divider className={classes.divider} />
      </div>
      <CardContent sx={{ p: 2.5 }}>
       <ResponsiveContainer width="100%" height={300}>
  <BarChart data={timeSpentData[period]}>
    <CartesianGrid strokeDasharray="3 3" />

   <XAxis
  dataKey="name"
  tick={({ x, y, payload }) => {
    const colorMap = {
      "Persona 1": "#03AB53",
      "Persona 2": "#F7901D",
      "Persona 3": "#1F77B4",
    };

    return (
      <text
        x={x}
        y={y + 8}                 // reduce vertical space
        textAnchor="middle"
        fill={colorMap[payload.value]}
        fontSize="10"  
        color='#1A1A1A'           // reduce font size
        fontWeight="400"          // optional, looks cleaner
      >
        {payload.value}
      </text>
    );
  }}
/>
    <YAxis 
    tick={{ fontSize: 10, fill: "#1A1A1A" }} 
      label={{ 
        value: "No. of Hours", 
        angle: -90, 
        position: "insideLeft",
        offset: 24,
        fontSize: 10,
        color: '#1A1A1A',
      }} 
    />

    <Tooltip 
    content={<CustomTooltip />}
      itemStyle={{ fontSize: '10px' }} 
      labelStyle={{ fontSize: '10px' }} 
    />

    {/* MULTIPLE Bars to allow different colors */}
    <Bar dataKey="hours" barSize={18} radius={[0, 0, 0, 0]}>
  {timeSpentData[period].map((entry, index) => {
    const colorMap = {
      "Persona 1": "#03AB53",
      "Persona 2": "#F7901D",
      "Persona 3": "#1F77B4",
    };

    return <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />;
  })}
</Bar>

  </BarChart>
</ResponsiveContainer>

      </CardContent>
    </Card>
  );
}
