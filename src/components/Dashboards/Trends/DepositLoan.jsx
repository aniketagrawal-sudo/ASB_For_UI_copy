import React, { useMemo, useState } from "react";
import { Card, Grid, Typography, Box, Select, MenuItem } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import classes from "./DepositLoan.module.scss";

/* -------------------- DATA (same as before) -------------------- */
const depositsData = {
  MoM: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    data: [0.65,0.60,0.62,0.70,0.78,0.88,0.98,1.02,1.05,1.10,0.90,0.60], // min 0.6, max 1.1
  },
  YoY: { labels: ["2021","2022","2023","2024","2025"], data: [3.0,6.0,13.8,10.5,4.8] },
  QoQ: { labels: ["Q1","Q2","Q3","Q4"], data: [0.7,0.9,1.0,0.6] },
};

const loansData = {
  MoM: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    data: [0.45,0.55,0.80,0.80,0.60,0.50,0.70,0.90,0.75,1.00,0.85,0.65],
  },
  YoY: { labels: ["2021","2022","2023","2024","2025"], data: [2.2,3.1,4.0,3.4,2.8] },
  QoQ: { labels: ["Q1","Q2","Q3","Q4"], data: [0.5,0.9,1.1,0.7] },
};

/* -------------------- HELPERS -------------------- */
const mm = (arr) => {
  let min = arr[0], max = arr[0];
  for (let i = 1; i < arr.length; i++) { if (arr[i] < min) min = arr[i]; if (arr[i] > max) max = arr[i]; }
  return { min, max };
};
const fmtM = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
const tickFmt = (v) => fmtM(Number(v) || 0);

/* Convert your {labels[], data[]} into Recharts-friendly [{label, value}] */
const buildSeries = (cfg) => cfg.labels.map((label, i) => ({ label, value: cfg.data[i] }));

/* -------------------- HEADER (unchanged) -------------------- */
function TrendHeader({ title, view, onViewChange, account, onAccountChange }) {
  const views = ["YoY", "MoM", "QoQ"];
  const accounts = ["Acc No.1", "Acc No.2", "Acc No.3"];

  return (
    <Box className={classes.chartHeader}>
      <Typography className={classes.headerTitle}>{title}</Typography>

      <Box className={classes.headerRight}>
        <Box className={classes.segment}>
          {views.map((v) => (
            <button
              key={v}
              type="button"
              className={`${classes.segmentItem} ${view === v ? classes.segmentItemActive : ""}`}
              onClick={() => onViewChange(v)}
            >
              {v}
            </button>
          ))}
        </Box>

        <Select
          value={account}
          onChange={(e) => onAccountChange(e.target.value)}
          size="small"
          className={classes.accountSelect}
        >
          {accounts.map((acc) => (
            <MenuItem key={acc} value={acc}>{acc}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}

/* -------------------- CARD (Recharts) -------------------- */
function TrendCard({ title, series, yTitle, rightAxis = false }) {
  const [view, setView] = useState("MoM");
  const [account, setAccount] = useState("Acc No.1");

  const cfg = series[view];
  const data = useMemo(() => buildSeries(cfg), [cfg]);
  const minMax = useMemo(() => mm(cfg.data), [cfg]);

  return (
    <Card className={classes.card}>
      <TrendHeader
        title={title}
        view={view}
        onViewChange={setView}
        account={account}
        onAccountChange={setAccount}
      />

      {/* HR under header */}
      <div className={classes.headerHr} />

      {/* Right-aligned badges */}
      <Box className={classes.badgeRowRight}>
        <div className={classes.badge}><span>Lowest:</span>&nbsp;<strong>{fmtM(minMax.min)}</strong></div>
        <div className={classes.badge}><span>Highest:</span>&nbsp;<strong>{fmtM(minMax.max)}</strong></div>
      </Box>

      <Box sx={{ width: "99%", height: 150 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#ddd" }} />
            {rightAxis ? (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={tickFmt}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
              >
                <Label value={yTitle} position="insideRight" angle={-90} style={{ textAnchor: "middle", fontWeight: 600 }} />
              </YAxis>
            ) : (
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={tickFmt}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
              >
                <Label value={yTitle} position="insideLeft" angle={-90} style={{ textAnchor: "middle", fontWeight: 600 }} />
              </YAxis>
            )}
            <Tooltip
              formatter={(val) => [fmtM(Number(val)), title]}
              labelFormatter={(l) => l}
            />
            <Line
              type="monotone"
              dataKey="value"
              yAxisId={rightAxis ? "right" : "left"}
              stroke="#FF9800"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}

/* -------------------- PAGE (unchanged layout) -------------------- */
export default function DepositLoan() {
  return (
    <Box className={classes.Depositheader}>
      <Grid className={classes.trendCard}>
        <Grid item xs={12} md={6}>
          <TrendCard
            title="Deposit Trends"
            series={depositsData}
            yTitle="Deposits"
            rightAxis={false}  // Y axis left
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendCard
            title="Loan Outstanding Trends"
            series={loansData}
            yTitle="Loan Outstanding"
            rightAxis={false}   // Y axis right
          />
        </Grid>
      </Grid>
    </Box>
  );
}
