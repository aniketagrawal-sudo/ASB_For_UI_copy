import React from "react";
import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import classes from "./TrendComponent.module.scss";
import DepositLoan from "./Trends/DepositLoan";
import RevenueGraph from "./Trends/RevenueGraph";

export default function TrendComponent() {
    return (
        <Box className={classes.trendComponent}>
            {/* Row 1 */}
            <Grid2 container spacing={2}>
                <Grid2 xs={12} md={6}>
                    <DepositLoan />
                </Grid2>
            </Grid2>

            {/* Row 2 */}
            <Grid2 container spacing={2}>
                <Grid2 xs={12} md={4}>
                    {/* <RevenueGraph /> */}
                    {/* <DepositLoan /> */}
                </Grid2>
            </Grid2>

            {/* Row 3 */}
            <Grid2 container spacing={2}>
                {/* (No components right now) */}
            </Grid2>

            {/* Row 4 */}
            <Grid2 container spacing={2}>
                {/* (No components right now) */}
            </Grid2>
            
        </Box>

      
    );
}
