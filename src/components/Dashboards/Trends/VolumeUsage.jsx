import { useEffect, useState } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import classes from './VolumeUsage.module.scss';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function CustomActiveShapePieChart({ isAnimationActive }) {
  const [chartData, setChartData] = useState([
    // Dummy data (WILL BE REPLACED by API in future)
    { name: 'Product A', value: 12 },
    { name: 'Product B', value: 20 },
    { name: 'Product C', value: 28 },
    { name: 'Product D', value: 16 },
  ]);

  // ───────────────────────────────────────────
  // Future API Integration (Already Structured)
  // ───────────────────────────────────────────
  /*
  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch('/api/volume-usage'); // example API endpoint
        const json = await res.json();
        setChartData(json.data);  // API structure should return array [{name,value}]
      } catch (err) {
        console.error("API error:", err);
      }
    }

    fetchChartData();
  }, []);
  */

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={classes.revenueChartContainer}>
      <div className={classes.chartHeader}>
        <h3 className={classes.chartTitle}>Volume of Usage</h3>
      </div>

      <div className={classes.dividerWrapper}>
        <hr className={classes.divider} />
      </div>

      <div className={classes.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="65%"
              dataKey="value"
              isAnimationActive={isAnimationActive}
              labelLine={false}

              // Only show name:value ON slices, no hover
              label={({ name, value }) => `${name}:${value}`}

              // Disable hover highlight
              activeIndex={null}
              activeShape={null}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* Center Total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fontWeight="bold"
              fill="#333"
            >
              {`Total: ${totalValue}`}
            </text>

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

CustomActiveShapePieChart.propTypes = {
  isAnimationActive: PropTypes.bool,
};

CustomActiveShapePieChart.defaultProps = {
  isAnimationActive: true,
};
