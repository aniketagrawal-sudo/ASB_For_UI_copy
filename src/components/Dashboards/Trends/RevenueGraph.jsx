import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import styles from './RevenueGraph.module.scss';

export default function RevenueGraph() {
  const [timeFilter, setTimeFilter] = useState('YoY');
  const [selectedAccount, setSelectedAccount] = useState('Account Number 1');
  const accounts = ['Account Number 1', 'Account Number 2', 'Account Number 3'];

  // Dummy dataset: unchanged (keeps months for YoY as you had)
  const dataSets = {
    'Account Number 1': {
      YoY: [
        { month: 'Jan', net: 700000, gross: 600000 },
        { month: 'Feb', net: 400000, gross: 300000 },
        { month: 'Mar', net: 200000, gross: 150000 },
        { month: 'Apr', net: 400000, gross: 300000 },
        { month: 'May', net: 600000, gross: 500000 },
        { month: 'Jun', net: 800000, gross: 700000 },
        { month: 'Jul', net: 800000, gross: 600000 },
        { month: 'Aug', net: 400000, gross: 300000 },
        { month: 'Sep', net: 200000, gross: 150000 },
        { month: 'Oct', net: 400000, gross: 300000 },
        { month: 'Nov', net: 500000, gross: 400000 },
        { month: 'Dec', net: 700000, gross: 600000 },
      ],
      MoM: [
        { month: 'Jan', net: 350000, gross: 300000 },
        { month: 'Feb', net: 420000, gross: 380000 },
        { month: 'Mar', net: 460000, gross: 410000 },
        { month: 'Apr', net: 480000, gross: 430000 },
        { month: 'May', net: 520000, gross: 470000 },
        { month: 'Jun', net: 550000, gross: 500000 },
        { month: 'Jul', net: 530000, gross: 480000 },
        { month: 'Aug', net: 510000, gross: 470000 },
        { month: 'Sep', net: 560000, gross: 510000 },
        { month: 'Oct', net: 600000, gross: 550000 },
        { month: 'Nov', net: 580000, gross: 530000 },
        { month: 'Dec', net: 620000, gross: 560000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1200000, gross: 900000 },
        { month: 'Q2', net: 1400000, gross: 1100000 },
        { month: 'Q3', net: 1600000, gross: 1300000 },
        { month: 'Q4', net: 1800000, gross: 1500000 },
      ],
    },
    'Account Number 2': {
      YoY: [
        { month: 'Jan', net: 400000, gross: 350000 },
        { month: 'Feb', net: 450000, gross: 400000 },
        { month: 'Mar', net: 500000, gross: 450000 },
        { month: 'Apr', net: 550000, gross: 480000 },
        { month: 'May', net: 600000, gross: 530000 },
        { month: 'Jun', net: 620000, gross: 540000 },
        { month: 'Jul', net: 640000, gross: 560000 },
        { month: 'Aug', net: 660000, gross: 590000 },
        { month: 'Sep', net: 680000, gross: 610000 },
        { month: 'Oct', net: 700000, gross: 640000 },
        { month: 'Nov', net: 720000, gross: 650000 },
        { month: 'Dec', net: 740000, gross: 670000 },
      ],
      MoM: [
        { month: 'Jan', net: 300000, gross: 250000 },
        { month: 'Feb', net: 340000, gross: 290000 },
        { month: 'Mar', net: 360000, gross: 310000 },
        { month: 'Apr', net: 390000, gross: 340000 },
        { month: 'May', net: 420000, gross: 370000 },
        { month: 'Jun', net: 440000, gross: 400000 },
        { month: 'Jul', net: 470000, gross: 420000 },
        { month: 'Aug', net: 490000, gross: 440000 },
        { month: 'Sep', net: 510000, gross: 460000 },
        { month: 'Oct', net: 530000, gross: 480000 },
        { month: 'Nov', net: 550000, gross: 500000 },
        { month: 'Dec', net: 570000, gross: 520000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1000000, gross: 800000 },
        { month: 'Q2', net: 1200000, gross: 1000000 },
        { month: 'Q3', net: 1400000, gross: 1200000 },
        { month: 'Q4', net: 1600000, gross: 1300000 },
      ],
    },
    'Account Number 3': {
      YoY: [
        { month: 'Jan', net: 500000, gross: 400000 },
        { month: 'Feb', net: 550000, gross: 450000 },
        { month: 'Mar', net: 600000, gross: 500000 },
        { month: 'Apr', net: 650000, gross: 550000 },
        { month: 'May', net: 700000, gross: 600000 },
        { month: 'Jun', net: 750000, gross: 650000 },
        { month: 'Jul', net: 800000, gross: 700000 },
        { month: 'Aug', net: 850000, gross: 750000 },
        { month: 'Sep', net: 900000, gross: 800000 },
        { month: 'Oct', net: 950000, gross: 850000 },
        { month: 'Nov', net: 1000000, gross: 900000 },
        { month: 'Dec', net: 1050000, gross: 950000 },
      ],
      MoM: [
        { month: 'Jan', net: 400000, gross: 350000 },
        { month: 'Feb', net: 420000, gross: 370000 },
        { month: 'Mar', net: 440000, gross: 390000 },
        { month: 'Apr', net: 460000, gross: 410000 },
        { month: 'May', net: 480000, gross: 430000 },
        { month: 'Jun', net: 500000, gross: 450000 },
        { month: 'Jul', net: 520000, gross: 470000 },
        { month: 'Aug', net: 540000, gross: 490000 },
        { month: 'Sep', net: 560000, gross: 510000 },
        { month: 'Oct', net: 580000, gross: 530000 },
        { month: 'Nov', net: 600000, gross: 550000 },
        { month: 'Dec', net: 620000, gross: 570000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1300000, gross: 1000000 },
        { month: 'Q2', net: 1500000, gross: 1200000 },
        { month: 'Q3', net: 1700000, gross: 1400000 },
        { month: 'Q4', net: 1900000, gross: 1600000 },
      ],
    },
  };

  // Safely pick raw data for selected account/timeFilter
  const raw =
    dataSets[selectedAccount] && dataSets[selectedAccount][timeFilter] ? dataSets[selectedAccount][timeFilter] : [];

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
    <div className={styles.revenueChartContainer}>
      {/* Header */}
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Revenue</h2>

        <div className={styles.chartControls}>
          {/* Filters */}
          <div className={styles.filterButtons}>
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
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className={styles.dropdownSelect}>
              {accounts.map((account) => (
                <option key={account} value={account}>
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
        <hr className={styles.divider} />
      </div>

      {/* Chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="95%" height={250}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {/* ✅ Dynamic X-Axis key based on selected filter */}
            <XAxis
              dataKey={timeFilter === 'YoY' ? 'year' : 'month'}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={timeFilter === 'YoY' ? 0 : 0}
              textAnchor="middle"
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
            />

            <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} labelStyle={{ fontWeight: 500 }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />

            <Bar dataKey="net" name="Net Revenue" fill="#03AB53" barSize={11.29} radius={[4, 4, 0, 0]} />
            <Bar dataKey="gross" name="Gross Revenue" fill="#F7901D" barSize={11.29} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
