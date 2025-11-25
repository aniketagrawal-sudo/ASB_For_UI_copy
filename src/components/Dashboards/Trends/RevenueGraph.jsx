import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import styles from './RevenueGraph.module.scss';
// import { useSelector } from 'react-redux';
// import { selectRevenueGraphDetails } from '../../../redux/store/dashboardSlice';
import { useGetRevenueGraphDetailsQuery } from '../../../services/dashboardApi';
import PropTypes from 'prop-types';

export default function RevenueGraph({revenueForClient}) {
  const {isLoading} = useGetRevenueGraphDetailsQuery();
  // const dataSets = useSelector(selectRevenueGraphDetails)
  const [timeFilter, setTimeFilter] = useState('YoY');
  const [selectedAccount, setSelectedAccount] = useState('Account Number 1');
  const accounts = ['Account Number 1', 'Account Number 2', 'Account Number 3'];

  // Safely pick raw data for selected account/timeFilter
  const raw =
    revenueForClient[selectedAccount] && revenueForClient[selectedAccount][timeFilter] ? revenueForClient[selectedAccount][timeFilter] : [];

  // Build chartData and X-axis settings:
  let chartData = raw.slice(); // copy
  let xAxisKey = 'month';
  let ticks = undefined;

  if (timeFilter === 'YoY') {
    // If raw items already provide a 'year' key use it, otherwise synthesize 2021.. based on index.
    chartData = raw.map((item, idx) => {
      if (item.year !== undefined) return item;
      // create year starting from 2021
      return { ...item, year: 2021 + idx };
    });
    xAxisKey = 'year';
    ticks = chartData.map((d) => String(d.year));
  } else if (timeFilter === 'QoQ') {
    // use quarters as X axis (items have 'month' values like 'Q1')
    xAxisKey = 'month';
    ticks = chartData.map((d) => d.month);
  } else {
    // MoM or others use month
    xAxisKey = 'month';
    ticks = chartData.map((d) => d.month);
  }

  return (
    <div className={styles.revenueChartContainer} data-testid="revenue-graph">
      {/* Header */}
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}  data-testid="title">Revenue</h2>

        <div className={styles.chartControls}>
          {/* Filters */}
          <div className={styles.filterButtons} data-testid="filters">
            {['YoY', 'MoM', 'QoQ'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${timeFilter === filter ? styles.active : ''}`}
                onClick={() => setTimeFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>

          {/* Dropdown */}
          <div className={styles.accountDropdown}>
            <select
            data-testid="account-dropdown"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className={styles.dropdownSelect}>
              {accounts.map((account) => (
                <option key={account} value={account} data-testid="account-option">
                  {account}
                </option>
              ))}
            </select>
            <span className={styles.dropdownIcon}>▼</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.dividerWrapper}>
        <hr className={styles.divider} data-testid="divider"/>
      </div>

      {/* Chart */}
      <div className={styles.chartWrapper} data-testid="chart-wrapper">
        <ResponsiveContainer width="95%" height={250} data-testid="responsive-container">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} data-testid="bar-chart">
            <CartesianGrid strokeDasharray="3 3" vertical={false} data-testid="grid" />

            {/* ✅ Dynamic X-Axis key based on selected filter */}
            <XAxis
              dataKey={timeFilter === 'YoY' ? 'year' : 'month'}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={timeFilter === 'YoY' ? 0 : 0}
              textAnchor="middle"
              data-key={xAxisKey}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              label={{
                value: 'Revenue ($)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 },
              }}
               data-testid="y-axis"
            />

            <Tooltip data-testid="tooltip" formatter={(value) => `$${(value / 1000).toFixed(0)}K`} labelStyle={{ fontWeight: 500 }} />
            <Legend data-testid="legend" wrapperStyle={{ fontSize: '12px' }} />

            <Bar data-testid="bar-net" dataKey="net" name="Net Revenue" fill="#03AB53" barSize={11.29} radius={[4, 4, 0, 0]} />
            <Bar data-testid="bar-gross" dataKey="gross" name="Gross Revenue" fill="#F7901D" barSize={11.29} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

RevenueGraph.propTypes = {
   revenueForClient: PropTypes.object.isRequired
};