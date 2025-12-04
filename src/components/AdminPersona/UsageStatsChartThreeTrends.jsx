"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const chart3Data = {
  All: [
    { name: "Persona 1", value: 7 },
    { name: "Persona 2", value: 9 },
    { name: "Persona 3", value: 12 },
  ],
  Active: [
    { name: "Persona 1", value: 7 },
    { name: "Persona 3", value: 12 },
  ],
  Inactive: [{ name: "Persona 2", value: 9 }],
};

export function UsageStatsChartThreeTrends() {
  const [filter, setFilter] = useState("All");

  return (
    <Card sx={{ p: 2,}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Chart 3</h2>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="chart3-label">Filter</InputLabel>
          <Select
            labelId="chart3-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </div>

      <CardContent sx={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart3Data[filter]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "No. of Hours", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
