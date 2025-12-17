import React from "react";
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import classes from './UsageStatsLoginTrends.module.scss';
import { useSelector } from 'react-redux';
import { selectAdminUsageStatsLoginTrends } from '../../redux/store/adminSlice';

export function UsageStatsLoginTrends() {
  const loginTrendsData = useSelector(selectAdminUsageStatsLoginTrends);
  const [period, setPeriod] = useState('6 Months');

  return (
    <Card sx={{ px: 0, py: 2, borderRadius: '10px' }} className={classes.loginTrendsContainer}>
      <div className={classes.loginTrendsHeader}>
        <h2 className={classes.loginHeaderText}>Login Trends</h2>

        <FormControl className={classes.loginDropdownContainer} variant="outlined" size="small">
          <InputLabel className={classes.loginDropdownInput} id="login-trends-label">
            Period
          </InputLabel>
          <Select
            labelId="login-trends-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
            className={classes.loginDropdownSelect}>
            <MenuItem className={classes.loginDropdownOptions} value="6 Months">
              6 Months
            </MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="3 Months">
              3 Months
            </MenuItem>
            <MenuItem className={classes.loginDropdownOptions} value="1 Month">
              1 Month
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.dividerWrapper}>
        <Divider className={classes.divider} />
      </div>

      <CardContent sx={{ p: 2.5 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginTrendsData[period]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" style={{ fontSize: '10px', color: '#1A1A1A' }} />
            <YAxis style={{ fontSize: '10px', color: '#1A1A1A' }}>
              <Label
                value="No of Users"
                angle={-90}
                position="insideLeft"
                offset={12}
                style={{ textAnchor: 'middle', fontSize: '10px' }}
              />
            </YAxis>
            <Tooltip itemStyle={{ fontSize: '10px' }} labelStyle={{ fontSize: '10px' }} />
            <Legend
              wrapperStyle={{
                fontSize: '10px',
                marginTop: -5,
              }}
            />
            <Line type="monotone" dataKey="Persona 1" stroke="#03AB53" strokeWidth={1} />
            <Line type="monotone" dataKey="Persona 2" stroke="#F7901D" strokeWidth={1} />
            <Line type="monotone" dataKey="Persona 3" stroke="#1F77B4" strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
