import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import classes from './UsageStatsLoginTrends.module.scss';

const loginTrendsData = {
  '6 Months': [
    { month: 'Jan', 'Persona 1': 800, 'Persona 2': 900, 'Persona 3': 400 },
    { month: 'Feb', 'Persona 1': 600, 'Persona 2': 800, 'Persona 3': 500 },
    { month: 'Mar', 'Persona 1': 700, 'Persona 2': 950, 'Persona 3': 600 },
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '3 Months': [
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '1 Month': [{ month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 }],
};

export function UsageStatsLoginTrends() {
  const [period, setPeriod] = useState('6 Months');

  return (
    <Card sx={{ p: 2, borderRadius: '10px' }} className={classes.loginTrendsContainer}>
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

      <CardContent sx={{ p: 2.5 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginTrendsData[period]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" style={{ fontSize: '12px', color: '#1A1A1A' }} />
            <YAxis style={{ fontSize: '12px', color: '#1A1A1A' }}>
              <Label
                value="Login Count"
                angle={-90}
                position="insideLeft"
                offset={0}
                style={{ textAnchor: 'middle', fontSize: '12px' }}
              />
            </YAxis>
            <Tooltip itemStyle={{ fontSize: '12px' }} labelStyle={{ fontSize: '12px' }} />
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
