import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import classes from './UsageStatsChartThreeTrends.module.scss';

const chart3Data = {
  All: [
    { name: 'Persona 1', value: 7 },
    { name: 'Persona 2', value: 9 },
    { name: 'Persona 3', value: 12 },
  ],
  Active: [
    { name: 'Persona 1', value: 7 },
    { name: 'Persona 3', value: 12 },
  ],
  Inactive: [{ name: 'Persona 2', value: 9 }],
};

export function UsageStatsChartThreeTrends() {
  const [filter, setFilter] = useState('All');

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
            label="Filter">
            <MenuItem className={classes.loginDropdownOptions} value="All">
              All
            </MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Active">
              Active
            </MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="Inactive">
              Inactive
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.dividerWrapper}>
        <Divider className={classes.divider} />
      </div>
      <CardContent sx={{ p: 2.5 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart3Data[filter]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={({ x, y, payload }) => {
                const colorMap = {
                  'Persona 1': '#03AB53',
                  'Persona 2': '#F7901D',
                  'Persona 3': '#1F77B4',
                };

                return (
                  <text
                    x={x}
                    y={y + 8} // reduce vertical space
                    textAnchor="middle"
                    fill={colorMap[payload.value]}
                    fontSize="10"
                    color="#1A1A1A" // reduce font size
                    fontWeight="400" // optional, looks cleaner
                  >
                    {payload.value}
                  </text>
                );
              }}
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
            <Tooltip itemStyle={{ fontSize: '10px' }} labelStyle={{ fontSize: '10px' }} />
            <Bar dataKey="value" barSize={18} radius={[0, 0, 0, 0]}>
              {chart3Data[filter].map((entry, index) => {
                const colorMap = {
                  'Persona 1': '#03AB53',
                  'Persona 2': '#F7901D',
                  'Persona 3': '#1F77B4',
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
