import React, { useEffect, useState } from 'react';
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
import styles from './TotalProfitAndLossRelation.module.scss';
import { useGetTotalProfitAndLossRelationshipDetailsQuery } from '../../../services/dashboardApi';
import PropTypes from 'prop-types';

export default function TotalProfitAndLossRelation({filterdtTotalProfiandLossRelationship}) {
  const {isLoading} = useGetTotalProfitAndLossRelationshipDetailsQuery();
  const [timeFilter, setTimeFilter] = useState('YoY');
  const [profitLossFilter, setProfitLossFilter] = useState('Profit');
  const [selectedAccount, setSelectedAccount] = useState('Top1');
  const [loading, setLoading] = useState(false);

  const accounts = ['Top1', 'Top2', 'Top3'];

  const data = filterdtTotalProfiandLossRelationship[selectedAccount]?.[timeFilter]?.[profitLossFilter] || [];
  const xAxisKey = timeFilter === 'YoY' ? 'year' : 'month';

  return (
    <div className={styles.revenueChartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Total P&L of Relationship ({profitLossFilter})</h2>

        <div className={styles.chartControls}>
          <div className={styles.filterButtons}>
            {['YoY', 'MoM'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${timeFilter === filter ? styles.active : ''}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className={styles.filterButtons}>
            {['Profit', 'Loss'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${profitLossFilter === filter ? styles.active : ''}`}
                onClick={() => setProfitLossFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

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

      <div className={styles.dividerWrapper}>
        <hr className={styles.divider} />
      </div>

      {loading ? (
        <p>Loading chart...</p>
      ) : data.length === 0 ? (
        <p>No data available for this selection</p>
      ) : (
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="95%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                label={{
                  value: profitLossFilter === 'Profit' ? 'Profit ($)' : 'Loss ($)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 },
                }}
              />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} labelStyle={{ fontWeight: 500 }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar bar dataKey="product1" name="Product 1" fill="#03AB53" barSize={11.29} radius={[4, 4, 0, 0]} />
              <Bar dataKey="product2" name="Product 2" fill="#F7901D" barSize={11.29} radius={[4, 4, 0, 0]} />
              <Bar dataKey="product3" name="Product 3" fill="#0057B8" barSize={11.29} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

TotalProfitAndLossRelation.propTypes = {
filterdtTotalProfiandLossRelationship: PropTypes.object.isRequired
};