import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import styles from './RevenueGraph.module.scss';

export default function RevenueGraph() {
  const [timeFilter, setTimeFilter] = useState('YoY');
  const [selectedAccount, setSelectedAccount] = useState('Account Number 1');

  const accounts = ['Account Number 1', 'Account Number 2', 'Account Number 3'];

  // ✅ Dummy data for different filters
  const dataSets = {
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
  };

  const data = dataSets[timeFilter];

  return (
    <div className={styles.revenueChartContainer}>
      {/* Header */}
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Revenue</h2>

        <div className={styles.chartControls}>
          {/* Time Filters */}
          <div className={styles.filterButtons}>
            {['YoY', 'MoM', 'QoQ'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${timeFilter === filter ? styles.active : ''}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Account Dropdown */}
          <div className={styles.accountDropdown}>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className={styles.dropdownSelect}
            >
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
        <hr className={styles.divider}/>
      </div>

      {/* Chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="95%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
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
            <Tooltip
              formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              labelStyle={{ fontWeight: 500 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="net" name="Net Revenue" fill="#03AB53" barSize={11.29} radius={[4, 4, 0, 0]} />
            <Bar dataKey="gross" name="Gross Revenue" fill="#F7901D" barSize={11.29} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
