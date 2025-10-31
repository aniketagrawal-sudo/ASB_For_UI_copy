import React from "react";
import { Card, Grid, Typography, Box, Select, MenuItem, useTheme, } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import classes from "./TrendComponent.module.scss";
import RevenueGraph from "./Trends/RevenueGraph";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

// ---------- Static Data ----------
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const depositData = [3.5, 4.2, 4.8, 5.0, 5.5, 5.8, 6.2, 6.5, 6.0];
const loanData = [1.0, 1.2, 1.3, 1.5, 1.4, 1.6, 1.7, 1.9, 2.0];
const revenueData = [85, 50, 35, 55, 70, 85, 95, 80, 90];
const grossData = [75, 40, 28, 45, 65, 78, 85, 70, 85];

const pnlData = {
    labels: months,
    datasets: [
        { label: "Product 1", data: [75, 50, 30, 45, 60, 75, 80, 65, 70], backgroundColor: "#88B04B" },
        { label: "Product 2", data: [80, 45, 25, 48, 70, 85, 90, 70, 80], backgroundColor: "#FFD700" },
        { label: "Product 3", data: [65, 35, 35, 40, 55, 78, 70, 60, 65], backgroundColor: "#6A5ACD" },
    ],
};

const productData = {
    labels: ["Product 1", "Product 2", "Product 3", "Product 4"],
    datasets: [
        { label: "Revenue", data: [230, 240, 200, 160], backgroundColor: "#4CAF50" },
        { label: "Profit", data: [210, 250, 180, 140], backgroundColor: "#FF9800" },
    ],
};

const usageData = {
    labels: ["Product 1", "Product 2", "Product 3", "Product 4"],
    datasets: [
        {
            data: [16.5, 6.5, 4.1, 3.0],
            backgroundColor: ["#8A2BE2", "#FFC300", "#FF5733", "#40E0D0"],
        },
    ],
};

// ---------- Chart Configs ----------
const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
        y: { ticks: { callback: (v) => `$${v}M` }, grid: { color: "#eee" } },
        x: { grid: { display: false } },
    },
};

const barOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: {
        y: { ticks: { callback: (v) => `${v}K` }, grid: { color: "#eee" } },
        x: { grid: { display: false } },
    },
};

const pieOptions = {
    responsive: true,
    plugins: {
        legend: { position: "right" },
    },
};

// ---------- Header Component ----------
function ChartHeader({ title, active = "MoM" }) {
    return (
        <Box className={classes.chartHeader}>
            <Typography className={classes.headerTitle}>{title}</Typography>
            <Box className={classes.headerControls}>
                {["YoY", "MoM", "QoQ"].map((label) => (
                    <Typography
                        key={label}
                        className={
                            label === active ? classes.activeLink : classes.inactiveLink
                        }
                    >
                        {label}
                    </Typography>
                ))}
                <Select defaultValue="Overall" size="small">
                    <MenuItem value="Overall">Overall</MenuItem>
                    <MenuItem value="Region">Region</MenuItem>
                </Select>
            </Box>
        </Box>
    );
}

// ---------- Main Component ----------
export default function TrendComponent() {
    const theme = useTheme();

    const depositChart = {
        labels: months,
        datasets: [
            {
                label: "Deposit Balance",
                data: depositData,
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const loanChart = {
        labels: months,
        datasets: [
            {
                label: "Loan Outstanding",
                data: loanData,
                borderColor: "#FF9800",
                backgroundColor: "#FFE0B2",
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const revenueChart = {
        labels: months,
        datasets: [
            { label: "Net Revenue", data: revenueData, backgroundColor: "#4CAF50" },
            { label: "Gross Revenue", data: grossData, backgroundColor: "#FF9800" },
        ],
    };

    return (
        <Box className={classes.trendComponent}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <ChartHeader title="Deposit Trends" />
                        <Line data={depositChart} options={lineOptions} />
                    </Card>

                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <ChartHeader title="Deposit Trends" />
                        <Line data={depositChart} options={lineOptions} />
                    </Card>

                </Grid>

            </Grid>
            <RevenueGraph />

        </Box>
    );
}
