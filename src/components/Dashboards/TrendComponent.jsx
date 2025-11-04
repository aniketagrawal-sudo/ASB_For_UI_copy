import React from "react";
import { Box, Typography } from "@mui/material";
import classes from "./TrendComponent.module.scss";
import DepositLoan from "./Trends/DepositLoan";
import RevenueGraph from "./Trends/RevenueGraph";
import TotalProfitAndLossRelation from "./Trends/TotalProfitAndLossRelation";
import ClinetInformationComponent from "./Trends/ClinetInformationComponent";

export default function TrendComponent() {
    return (
        <>
            <Box className={classes.trendComponent}>
                <DepositLoan />
                <RevenueGraph />
                <TotalProfitAndLossRelation />


            </Box>
            {/* <Box className={classes.depositBox}> */}
            <Typography variant="h6" margin={1}>
                Client Information
            </Typography>
            {/* </Box> */}

            <Box className={classes.trendComponent}>
                <Typography variant="body2" component="div">
                    <ClinetInformationComponent />
                </Typography>

            </Box>
        </>



    );
}
