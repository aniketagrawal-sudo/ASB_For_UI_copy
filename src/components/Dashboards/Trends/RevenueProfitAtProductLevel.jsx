import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PropTypes from 'prop-types';
import classes from './RevenueProfitAtProductLevel.module.scss';

// -------------------- DUMMY DATA --------------------
const dummyData = [
  { name: 'Product 1', revenue: 400000, profit: 24, category: 'one' },
  { name: 'Product 2', revenue: 300000, profit: 13, category: 'two' },
  { name: 'Product 3', revenue: 200000, profit: 98, category: 'one' },
  { name: 'Product 4', revenue: 278000, profit: 39, category: 'two' },
];

export default function RevenueProfitAtProductLevel({ apiUrl }) {
  const [allData, setAllData] = useState(dummyData);
  const [chartData, setChartData] = useState(dummyData);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // -------------------- API CALL (FUTURE) --------------------
  useEffect(() => {
    if (!apiUrl) return;

    setLoading(true);
    const fetchChartData = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        setAllData(result || dummyData);
        setChartData(result || dummyData);
      } catch (err) {
        console.error('API fetch failed. Using dummy data.');
        setAllData(dummyData);
        setChartData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [apiUrl]);

  // -------------------- FILTER LOGIC (ONLY NEW ADDITION) --------------------
  const handleFilterChange = (value) => {
    setSelectedFilter(value);

    if (value === "All") {
      setChartData(allData);
    } else {
      const filtered = allData.filter((item) => item.category === value.toLowerCase());
      setChartData(filtered);
    }
  };

  // -------------------- DYNAMIC AXIS CALCULATIONS --------------------
  const maxRevenue = chartData.length
    ? Math.max(...chartData.map((d) => d.revenue))
    : 0;

  const roundedRevenueMax = Math.ceil(maxRevenue / 50000) * 50000;

  const revenueTicks = [];
  for (let i = 0; i <= roundedRevenueMax; i += 50000) {
    revenueTicks.push(i);
  }

  const maxProfit = chartData.length
    ? Math.max(...chartData.map((d) => d.profit))
    : 0;

  const roundedProfitMax = Math.ceil(maxProfit / 20) * 20;

  const profitTicks = [];
  for (let i = 0; i <= roundedProfitMax; i += 20) {
    profitTicks.push(i);
  }

  // -------------------- UI (UNCHANGED) --------------------
  return (
    <div className={classes.revenueChartContainer}>
      <div className={classes.chartHeader}>
        <h3 className={classes.chartTitle}>Revenue and Profit at Product Level</h3>

        <div className={classes.chartControls}>
          <div className={classes.accountDropdown}>
            <select
              className={classes.dropdownSelect}
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option>All</option>
              <option>one</option>
              <option>two</option>
            </select>
            <span className={classes.dropdownIcon}>▼</span>
          </div>
        </div>
      </div>

      <div className={classes.dividerWrapper}>
        <hr className={classes.divider} />
      </div>

      <div className={classes.chartWrapper}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <BarChart
            style={{
              width: '100%',
              maxWidth: '700px',
              maxHeight: '70vh',
              aspectRatio: 1.618,
            }}
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 10 }}
              angle={-17}
              dy={-3}
              textAnchor="end"
            />

            <YAxis
              yAxisId="left"
              stroke="#374151"
              interval={0}
              ticks={revenueTicks}
              tickFormatter={(v) => `${v / 1000}k`}
              label={{
                value: 'Revenue ($)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 },
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#374151"
              interval={0}
              ticks={profitTicks}
              tickFormatter={(v) => `${v}%`}
              label={{
                value: 'Profit %',
                angle: -90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 },
              }}
            />

            <Tooltip />
            <Legend />

            <Bar yAxisId="right" dataKey="profit" fill="#03AB53" />
            <Bar yAxisId="left" dataKey="revenue" fill="#F7901D" />
          </BarChart>
        )}
      </div>
    </div>
  );
}

// -------------------- PROP TYPES --------------------
RevenueProfitAtProductLevel.propTypes = {
  apiUrl: PropTypes.string,
};
