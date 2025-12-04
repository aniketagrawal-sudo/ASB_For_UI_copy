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
import classes from './UsageStatsTimespent.module.scss';

const timeSpentData = {
  Day: [
    { name: "Persona 1", hours: 7 },
    { name: "Persona 2", hours: 9 },
    { name: "Persona 3", hours: 12 },
  ],
  Week: [
    { name: "Persona 1", hours: 45 },
    { name: "Persona 2", hours: 52 },
    { name: "Persona 3", hours: 68 },
  ],
  Month: [
    { name: "Persona 1", hours: 168 },
    { name: "Persona 2", hours: 200 },
    { name: "Persona 3", hours: 240 },
  ],
};

export function UsageStatsTimespent() {
  const [period, setPeriod] = useState("Day");

  return (
    <Card sx={{ p: 2, height: "100%"}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Times Spent (Personal)</h2>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="time-spent-label">Period</InputLabel>
          <Select
            labelId="time-spent-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Week">Week</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
          </Select>
        </FormControl>
      </div>

      <CardContent sx={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeSpentData[period]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "No. of Hours", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="hours" fill="#1976d2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
