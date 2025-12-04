"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const loginTrendsData = {
  "6 Months": [
    { month: "Jan", "Persona 1": 800, "Persona 2": 900, "Persona 3": 400 },
    { month: "Feb", "Persona 1": 600, "Persona 2": 800, "Persona 3": 500 },
    { month: "Mar", "Persona 1": 700, "Persona 2": 950, "Persona 3": 600 },
    { month: "Apr", "Persona 1": 950, "Persona 2": 1050, "Persona 3": 700 },
    { month: "May", "Persona 1": 1100, "Persona 2": 1150, "Persona 3": 900 },
    { month: "Jun", "Persona 1": 1200, "Persona 2": 1000, "Persona 3": 1100 },
  ],
  "3 Months": [
    { month: "Apr", "Persona 1": 950, "Persona 2": 1050, "Persona 3": 700 },
    { month: "May", "Persona 1": 1100, "Persona 2": 1150, "Persona 3": 900 },
    { month: "Jun", "Persona 1": 1200, "Persona 2": 1000, "Persona 3": 1100 },
  ],
  "1 Month": [{ month: "Jun", "Persona 1": 1200, "Persona 2": 1000, "Persona 3": 1100 }],
};

export function UsageStatsLoginTrends() {
  const [period, setPeriod] = useState("6 Months");

  return (
    <Card sx={{ p: 2,}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Login Trends</h2>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="login-trends-label">Period</InputLabel>
          <Select
            labelId="login-trends-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="6 Months">6 Months</MenuItem>
            <MenuItem value="3 Months">3 Months</MenuItem>
            <MenuItem value="1 Month">1 Month</MenuItem>
          </Select>
        </FormControl>
      </div>

      <CardContent >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginTrendsData[period]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Persona 1" stroke="#1976d2" strokeWidth={2} />
            <Line type="monotone" dataKey="Persona 2" stroke="#dc004e" strokeWidth={2} />
            <Line type="monotone" dataKey="Persona 3" stroke="#ff9800" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
