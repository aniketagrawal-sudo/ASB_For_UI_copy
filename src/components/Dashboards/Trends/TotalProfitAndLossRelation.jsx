import { useEffect, useState } from 'react';
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

export default function TotalProfitAndLossRelation() {
  const [timeFilter, setTimeFilter] = useState('YoY');
  const [profitLossFilter, setProfitLossFilter] = useState('Profit');
  const [selectedAccount, setSelectedAccount] = useState('Top 1');
  const [dataSets, setDataSets] = useState({});
  const [loading, setLoading] = useState(true);

  const accounts = ['Top 1', 'Top 2', 'Top 3'];

  // ✅ Simulate fetch (replace this with your real API)
  useEffect(() => {
    async function fetchData() {
      try {
        // This mimics fetching from your backend
        // const response = await fetch('/api/profit-loss-data.json'); // mock URL for now
        // If you don’t have API yet, use static fallback:
        const staticData = {
          'Top 1': {
            YoY: {
              Profit: [
                { year: 2021, product1: 700000, product2: 600000, product3: 500000 },
                { year: 2022, product1: 750000, product2: 630000, product3: 520000 },
                { year: 2023, product1: 720000, product2: 610000, product3: 540000 },
                { year: 2024, product1: 760000, product2: 640000, product3: 550000 },
                { year: 2025, product1: 780000, product2: 660000, product3: 580000 },
              ],
              Loss: [
                { year: 2021, product1: 300000, product2: 250000, product3: 200000 },
                { year: 2022, product1: 280000, product2: 260000, product3: 210000 },
                { year: 2023, product1: 290000, product2: 270000, product3: 230000 },
                { year: 2024, product1: 310000, product2: 280000, product3: 250000 },
                { year: 2025, product1: 320000, product2: 300000, product3: 270000 },
              ],
            },
            MoM: {
              Profit: [
                { month: 'Jan', product1: 400000, product2: 380000, product3: 350000 },
                { month: 'Feb', product1: 420000, product2: 390000, product3: 370000 },
                { month: 'Mar', product1: 440000, product2: 410000, product3: 390000 },
                { month: 'Apr', product1: 460000, product2: 430000, product3: 410000 },
                { month: 'May', product1: 480000, product2: 450000, product3: 430000 },
                { month: 'Jun', product1: 500000, product2: 470000, product3: 450000 },
              ],
              Loss: [
                { month: 'Jan', product1: 150000, product2: 130000, product3: 120000 },
                { month: 'Feb', product1: 140000, product2: 125000, product3: 115000 },
                { month: 'Mar', product1: 130000, product2: 120000, product3: 110000 },
                { month: 'Apr', product1: 125000, product2: 115000, product3: 105000 },
                { month: 'May', product1: 120000, product2: 110000, product3: 100000 },
                { month: 'Jun', product1: 115000, product2: 105000, product3: 95000 },
              ],
            },
          },
          'Top 2': {
            YoY: {
              Profit: [
                { year: 2021, product1: 650000, product2: 550000, product3: 500000 },
                { year: 2022, product1: 690000, product2: 580000, product3: 520000 },
                { year: 2023, product1: 720000, product2: 600000, product3: 540000 },
                { year: 2024, product1: 760000, product2: 640000, product3: 560000 },
                { year: 2025, product1: 800000, product2: 670000, product3: 580000 },
              ],
              Loss: [
                { year: 2021, product1: 280000, product2: 240000, product3: 200000 },
                { year: 2022, product1: 290000, product2: 250000, product3: 210000 },
                { year: 2023, product1: 300000, product2: 260000, product3: 220000 },
                { year: 2024, product1: 320000, product2: 280000, product3: 240000 },
                { year: 2025, product1: 340000, product2: 300000, product3: 260000 },
              ],
            },
            MoM: {
              Profit: [
                { month: 'Jan', product1: 380000, product2: 360000, product3: 340000 },
                { month: 'Feb', product1: 400000, product2: 370000, product3: 350000 },
                { month: 'Mar', product1: 420000, product2: 390000, product3: 370000 },
                { month: 'Apr', product1: 440000, product2: 410000, product3: 390000 },
                { month: 'May', product1: 460000, product2: 430000, product3: 410000 },
                { month: 'Jun', product1: 480000, product2: 450000, product3: 430000 },
              ],
              Loss: [
                { month: 'Jan', product1: 140000, product2: 120000, product3: 110000 },
                { month: 'Feb', product1: 130000, product2: 115000, product3: 105000 },
                { month: 'Mar', product1: 125000, product2: 110000, product3: 100000 },
                { month: 'Apr', product1: 120000, product2: 105000, product3: 95000 },
                { month: 'May', product1: 115000, product2: 100000, product3: 90000 },
                { month: 'Jun', product1: 110000, product2: 95000, product3: 85000 },
              ],
            },
          },
          'Top 3': {
            YoY: {
              Profit: [
                { year: 2021, product1: 600000, product2: 520000, product3: 470000 },
                { year: 2022, product1: 640000, product2: 550000, product3: 490000 },
                { year: 2023, product1: 680000, product2: 580000, product3: 510000 },
                { year: 2024, product1: 720000, product2: 610000, product3: 540000 },
                { year: 2025, product1: 760000, product2: 640000, product3: 560000 },
              ],
              Loss: [
                { year: 2021, product1: 260000, product2: 220000, product3: 200000 },
                { year: 2022, product1: 270000, product2: 230000, product3: 210000 },
                { year: 2023, product1: 290000, product2: 250000, product3: 220000 },
                { year: 2024, product1: 310000, product2: 270000, product3: 230000 },
                { year: 2025, product1: 320000, product2: 280000, product3: 240000 },
              ],
            },
            MoM: {
              Profit: [
                { month: 'Jan', product1: 360000, product2: 330000, product3: 310000 },
                { month: 'Feb', product1: 380000, product2: 350000, product3: 330000 },
                { month: 'Mar', product1: 400000, product2: 370000, product3: 350000 },
                { month: 'Apr', product1: 420000, product2: 390000, product3: 370000 },
                { month: 'May', product1: 440000, product2: 410000, product3: 390000 },
                { month: 'Jun', product1: 460000, product2: 430000, product3: 410000 },
              ],
              Loss: [
                { month: 'Jan', product1: 130000, product2: 110000, product3: 100000 },
                { month: 'Feb', product1: 125000, product2: 105000, product3: 95000 },
                { month: 'Mar', product1: 120000, product2: 100000, product3: 90000 },
                { month: 'Apr', product1: 115000, product2: 95000, product3: 85000 },
                { month: 'May', product1: 110000, product2: 90000, product3: 80000 },
                { month: 'Jun', product1: 105000, product2: 85000, product3: 75000 },
              ],
            },
          },
        };
        setDataSets(staticData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const data = dataSets[selectedAccount]?.[timeFilter]?.[profitLossFilter] || [];
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
              <Bar dataKey="product1" name="Product 1" fill="#03AB53" barSize={11.29} radius={[4, 4, 0, 0]} />
              <Bar dataKey="product2" name="Product 2" fill="#F7901D" barSize={11.29} radius={[4, 4, 0, 0]} />
              <Bar dataKey="product3" name="Product 3" fill="#0057B8" barSize={11.29} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}