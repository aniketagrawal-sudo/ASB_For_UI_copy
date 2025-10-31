import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  IconButton,
  Fade,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useSelector } from "react-redux";
import { selectHomeSummary } from "../../redux/store/dashboardSlice";
import classes from "./SummaryPanel.module.scss";

/* ------------------ Mock Data ------------------ */
const mockKPISummary = [
  {
    title: "Deposit Balance",
    value: "$10M",
    change: "(+3.2% of LY Avg)",
    trend: "up",
    summary:
      "Maintain momentum by replicating high-performing store strategies across underperforming locations. Consider additional promotions or local events in stores with negative variance to boost monthly sales.",
  },
  {
    title: "Financial Score",
    value: "6.2/10",
    change: "(-1.5% MoM)",
    trend: "down",
    summary:
      "Sustain margin gains by continuing to manage discounting and optimizing product mix. Monitor inventory closely to avoid overstock or heavy markdowns that could dilute margin in upcoming quarters.",
  },
  {
    title: "Loan Outstanding",
    value: "$1.2M",
    change: "(Out of $10M)",
    trend: "neutral",
    summary:
      "Sustain margin gains by continuing to manage discounting and optimizing product mix. Monitor inventory closely to avoid overstock or heavy markdowns that could dilute margin in upcoming quarters.",
  },
  {
    title: "Net Profit",
    value: "$2.4M",
    change: "(+5% YoY)",
    trend: "up",
    summary:
      "Sustain margin gains by continuing to manage discounting and optimizing product mix. Monitor inventory closely to avoid overstock or heavy markdowns that could dilute margin in upcoming quarters.",
  },
];

const mockWidgetsSummary = [
  {
    title: "Deposit Trends",
    summary:
      "Maintain consistent deposit inflows by targeting high-value customers and optimizing digital channel engagement.",
  },
  {
    title: "Loan Outstanding Trends",
    summary:
      "Monitor interest rate movements and repayment behaviors to control loan exposure.",
  },
  {
    title: "Total P&L of Relationship (Profit)",
    summary:
      "Optimize the profitability mix by balancing deposits, loans, and cross-sell performance.",
  },
  {
    title: "Revenue Overview",
    summary:
      "Boost revenue via improved pricing strategies and branch-level operational efficiency.",
  },
];

/* ------------------ Component ------------------ */
const SummaryPanel = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("kpi");

  // In future: useSelector(selectHomeSummary)
  const currentData = useMemo(
    () => (activeTab === "kpi" ? mockKPISummary : mockWidgetsSummary),
    [activeTab]
  );

  const renderKPI = (item, index) => (
    <div key={index} className={classes.summaryCard}>
      <div className={classes.metricRow}>
        <Typography variant="subtitle1" className={classes.metricTitle}>
          {item.title}
        </Typography>
          <Divider
        orientation="vertical"
        flexItem
        className={classes.verticalDivider}
      />
        <Typography variant="body1" className={classes.metricValue}>
          {item.value}
          {item.trend === "up" && (
            <TrendingUpIcon className={classes.trendUp} />
          )}
          {item.trend === "down" && (
            <TrendingDownIcon className={classes.trendDown} />
          )}
          <span className={classes.metricChange}>{item.change}</span>
        </Typography>
      </div>
      <div className={classes.summaryTextBlock}>
        <Typography variant="body2" className={classes.summaryLabel}>
          Summary:
        </Typography>
        <Typography variant="body2" className={classes.summaryText}>
          {item.summary}
        </Typography>
      </div>
    </div>
  );

  const renderWidget = (item, index) => (
    <div key={index} className={classes.summaryCard}>
      <Typography variant="subtitle1" className={classes.metricTitle}>
        {item.title}
      </Typography>
        <Typography variant="body2" className={classes.summaryLabel}>
          Summary:
        </Typography>
      <Typography variant="body2" className={classes.summaryText}>
        {item.summary}
      </Typography>
    </div>
  );

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.overlay} ${open ? classes.visible : ""}`}
          onClick={onClose}
        />
      </Fade>

      <div
        className={`${classes.panel} ${open ? classes.open : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
       <div className={classes.header}>
  <div className={classes.headerLeft}>
    <IconButton onClick={onClose} className={classes.closeButton}>
      <CloseIcon />
    </IconButton>
    <Typography variant="h6" className={classes.headerTitle}>
      Summary
    </Typography>
  </div>
</div>


        <div className={classes.tabContainer}>
          <div
            className={`${classes.tab} ${activeTab === "kpi" ? classes.activeTab : ""
              }`}
            onClick={() => setActiveTab("kpi")}
          >
            KPI Summary
          </div>
          <div
            className={`${classes.tab} ${activeTab === "widget" ? classes.activeTab : ""
              }`}
            onClick={() => setActiveTab("widget")}
          >
            Widgets Summary
          </div>
        </div>

        <div className={classes.summaryContent}>
          {currentData.map((item, i) =>
            activeTab === "kpi" ? renderKPI(item, i) : renderWidget(item, i)
            
          )}
        </div>
      </div>
    </>
  );
};

SummaryPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SummaryPanel;
