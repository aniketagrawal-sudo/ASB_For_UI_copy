import { Box, Typography } from "@mui/material";
import classes from "./TrendComponent.module.scss";
import DepositLoan from "./Trends/DepositLoan";
import RevenueGraph from "./Trends/RevenueGraph";
import TotalProfitAndLossRelation from "./Trends/TotalProfitAndLossRelation";
import ClinetInformationComponent from "./Trends/ClinetInformationComponent";
import RevenueProfitAtProductLevel from "./Trends/RevenueProfitAtProductLevel";
import VolumeUsage from "./Trends/VolumeUsage";
import PropTypes from "prop-types";

export default function TrendComponent({revenueForClient, filterdDepositLoans, filterdtLoansOutstanding, filteredAccountDetails}) {
    return (
        <>
            <Box className={classes.trendComponent}>
                <DepositLoan filterdDepositLoans={filterdDepositLoans} filterdtLoansOutstanding={filterdtLoansOutstanding} />
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
                    <ClinetInformationComponent filteredAccountDetails={filteredAccountDetails}/>
                </Typography>
            </Box>
        </>



    );
}

TrendComponent.propTypes = {
   revenueForClient: PropTypes.object.isRequired,
   filterdDepositLoans: PropTypes.object.isRequired,
   filterdtLoansOutstanding: PropTypes.object.isRequired,
     filteredAccountDetails: PropTypes.object.isRequired
};