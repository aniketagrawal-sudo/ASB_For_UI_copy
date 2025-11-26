import React from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import classes from './VolumeUsage.module.scss';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function VolumeUsage({ isAnimationActive, filterdtVoumeOfUsage}) {

  const totalValue = filterdtVoumeOfUsage.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={classes.revenueChartContainer} data-testid="volume-usage-container">
      <div className={classes.chartHeader}>
        <h3 className={classes.chartTitle} data-testid="chart-title">Volume of Usage</h3>
      </div>

      <div className={classes.dividerWrapper}>
        <hr className={classes.divider} />
      </div>

      <div className={classes.chartWrapper} data-testid="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%" >
          <PieChart data-testid="pie-chart">

            <Pie
              data={filterdtVoumeOfUsage}
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
              data-testid="pie-slices"
            >
              {filterdtVoumeOfUsage.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} data-testid={`slice-${index}`} />
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
               data-testid="total-value"
            >
              {`Total: ${totalValue}`}
            </text>

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

VolumeUsage.propTypes = {
  isAnimationActive: PropTypes.bool,
  filterdtVoumeOfUsage: PropTypes.array.isRequired,
};

VolumeUsage.defaultProps = {
  isAnimationActive: true,
};
