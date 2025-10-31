import React, { useState } from "react";
import { Box, Typography, Tooltip, Divider } from "@mui/material";
import ConversationDashboard from '../../components/Dashboards/ConversationDashboard';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import classes from "./KPIDashboard.module.scss";
import MeetingIcon from "../../assets/DashboardPage1/Dashboard/Metting_Icon.svg";
import SummaryIcon from "../../assets/DashboardPage1/Dashboard/Summary_Icon.svg";
import ArrowRightIcon from "../../assets/DashboardPage1/Dashboard/Arrow_Right.svg";
import SummaryPanel from '../SummaryPanel/SummaryPanel';
import TrendComponent from "./TrendComponent";


export default function KPIDashboard() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const topData = [
    { title: "Deposit Balance", value: "$10M", sub: "(+3.2% of LY Avg)", trend: "up" },
    { title: "Loan Outstanding", value: "$1.2M", sub: "(Out of $10M)" },
    { title: "Credit Utilisation", value: "60%", sub: "(Out of $22M)" },
    { title: "Net Profit", value: "$2.4M", sub: "(+5% YoY)", trend: "up" },
  ];

  const bottomData = [
    { title: "Financial Score", value: "8.1/10", sub: "(+0.5 of MoM)", badge: "Good", badgeColor: "yellow", trend: "up" },
    { title: "Relationship Score", value: "8.6/10", sub: "(+1.5% MoM)", badge: "Great", badgeColor: "green", trend: "up" },
    { title: "Risk and Stability Score", value: "7.2/10", sub: "(-0.5% MoM)", badge: "Low Risk", badgeColor: "lightGreen", trend: "down" },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row', // side by side layout
        gap: 2, // spacing between KPI/Deposit and Chat
        alignItems: 'flex-start',
      }}
    >
      {/* Left Section — KPI + Deposit */}
      <Box sx={{ flex: 1 }}>
        <Box className={classes.kpiContainer}>
          {/* Header */}
          <Box className={classes.header}>
            <Typography variant="h6" className={classes.title}>KPI</Typography>
            <Box className={classes.actions}>
              <Box className={classes.actionItem}>
                <img src={MeetingIcon} alt="Meeting" />
                <Typography className={classes.actionText}>
                  Generate Pre Meeting Snapshot
                </Typography>
              </Box>

              <Box className={classes.actionItem}>
                <img src={SummaryIcon} alt="Summary" />
                <Typography
                  className={classes.actionText}
                  onClick={() => setIsSummaryOpen(true)}
                >
                  Summary
                  {isSummaryOpen && (
                    <SummaryPanel open onClose={() => setIsSummaryOpen(false)} />
                  )}
                </Typography>
                <img src={ArrowRightIcon} alt="Arrow" />
              </Box>
            </Box>
          </Box>

          {/* KPI Box */}
          <Box className={classes.kpiBox}>
            <Box className={classes.topRow}>
              {topData.map((item, i) => (
                <Box key={i} className={classes.metric}>
                  <Box className={classes.metricHeader} gap={0.7}>
                    <Typography className={classes.metricTitle}>{item.title}</Typography>
                    <Tooltip title={item.title} arrow>
                      <InfoOutlinedIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Box>

                  <Typography className={classes.metricValue}>{item.value}</Typography>

                  <Box className={classes.trendContainer}>
                    {item.trend === 'up' && (
                      <Box className={classes.trendUp}>
                        <ArrowUpwardIcon sx={{ fontSize: '12px' }} />
                      </Box>
                    )}
                    <Typography className={classes.metricSub}>{item.sub}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider className={classes.divider} />

            <Box className={classes.bottomRow}>
              {bottomData.map((item, i) => (
                <Box key={i} className={classes.metric}>
                  <Box className={classes.metricHeader} gap={1}>
                    <Typography className={classes.metricTitle}>{item.title}</Typography>
                    <Tooltip title={item.title} arrow>
                      <InfoOutlinedIcon className={classes.infoIcon} />
                    </Tooltip>
                  </Box>

                  <Box className={classes.valueRow}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight={700} color="text.primary">
                        {item.value}
                      </Typography>
                      {item.badge && (
                        <Box
                          sx={{
                            backgroundColor:
                              item.badgeColor === 'yellow'
                                ? '#fff3cd'
                                : item.badgeColor === 'green'
                                  ? '#d4edda'
                                  : '#e9f7ef',
                            color:
                              item.badgeColor === 'yellow'
                                ? '#856404'
                                : item.badgeColor === 'green'
                                  ? '#155724'
                                  : '#1e7e34',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            px: 1,
                            py: 0.3,
                          }}
                        >
                          {item.badge}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box className={item.trend === 'up' ? classes.trendUp : classes.trendDown}>
                    {/* {item.trend === 'up' ? <ArrowUpwardIcon fontSize="0px"/> : <ArrowDownwardIcon  fontSize="0px"/>} */}
                    {item.trend === 'up' ? (
                      <ArrowUpwardIcon sx={{ fontSize: '12px' }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                    )}
                    <Typography className={classes.metricSub}>{item.sub}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Deposit Section (add your deposit JSX here) */}
          <Box className={classes.depositBox}>
            {/* Example placeholder */}
            <Typography variant="h6" margin={1}>Trends</Typography>
            {/* Add your Deposit content here */}
            <TrendComponent />
          </Box>
        </Box>
      </Box>

      {/* Right Section — Chat */}
      <Box sx={{ flex: 1 }}>
        <ConversationDashboard />
      </Box>
    </Box>

  );
}
