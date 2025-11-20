import { Box, Typography } from "@mui/material";
import classes from "./TrendComponent.module.scss";
import DepositLoan from "./Trends/DepositLoan";
import RevenueGraph from "./Trends/RevenueGraph";
import TotalProfitAndLossRelation from "./Trends/TotalProfitAndLossRelation";
import ClinetInformationComponent from "./Trends/ClinetInformationComponent";
import RevenueProfitAtProductLevel from "./Trends/RevenueProfitAtProductLevel";
import VolumeUsage from "./Trends/VolumeUsage";
import PropTypes from "prop-types";

export default function TrendComponent({revenueForClient}) {
    return (
        <>
            <Box className={classes.trendComponent}>
                <DepositLoan />
                <RevenueGraph revenueForClient={revenueForClient}/>
                <TotalProfitAndLossRelation />
                <div className={classes.revenueProfitVolumeUsage}>
                    <RevenueProfitAtProductLevel />
                    <VolumeUsage />
                </div>
            </Box>
            <Typography variant="h6" margin={1.6}>
                Client Information
            </Typography>

            <Box className={classes.trendComponent}>
                <Typography variant="body2" component="div">
                    <ClinetInformationComponent />
                </Typography>
            </Box>
        </>



    );
}

TrendComponent.propTypes = {
   revenueForClient: PropTypes.object.isRequired
};