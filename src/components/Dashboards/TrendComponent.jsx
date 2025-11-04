import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import classes from './TrendComponent.module.scss';
import DepositLoan from './Trends/DepositLoan';
import RevenueGraph from './Trends/RevenueGraph';
import TotalProfitAndLossRelation from './Trends/TotalProfitAndLossRelation';

export default function TrendComponent() {
  return (
    <Box className={classes.trendComponent}>
      <DepositLoan />
      <RevenueGraph />
      <TotalProfitAndLossRelation />
    </Box>
  );
}
