import { useRef, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './InsightsDataTable.module.scss';

const excludedFields = [
  'anomaly_type',
  'data_point_idx',
  'anomaly_details',
  'anomaly_Details_status',
  'data_point_title',
];

const InsightsDataTable = ({ dataPoints, selectedDataPointIdx = null }) => {
  const tableWrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  // Calculate dynamic height based on data rows
  useEffect(() => {
    if (!dataPoints || dataPoints.length === 0) {
      setContainerHeight('200px');
      return;
    }

    // Constants for height calculation
    const ROW_HEIGHT = 37; // Height per table row
    const HEADER_HEIGHT = 42; // Header height
    const PADDING = 16; // Container padding
    const MIN_HEIGHT = 200;
    const MAX_HEIGHT = 250;
    const MAX_ROWS_VISIBLE = 15;

    // Calculate height based on number of rows
    const visibleRows = Math.min(dataPoints.length, MAX_ROWS_VISIBLE);
    const calculatedHeight = HEADER_HEIGHT + visibleRows * ROW_HEIGHT + PADDING;

    // UPDATED: Use fixed max height instead of viewport-based
    const finalHeight = Math.max(MIN_HEIGHT, Math.min(calculatedHeight, MAX_HEIGHT));

    setContainerHeight(`${finalHeight}px`);
  }, [dataPoints]);

  if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
    return (
      <div className={styles.noData}>
        <Typography variant="body2" color="textSecondary">
          No data available
        </Typography>
      </div>
    );
  }

  // Extract all unique keys from data points except excluded ones
  const allKeys = new Set();
  dataPoints.forEach((dataPoint) => {
    Object.keys(dataPoint).forEach((key) => {
      if (!excludedFields.includes(key)) {
        allKeys.add(key);
      }
    });
  });

  const headers = Array.from(allKeys);

  return (
    <div
      className={styles.tableContainer}
      ref={containerRef}
      style={{ height: containerHeight }} // Apply dynamic height
    >
      <TableContainer
        component={Paper}
        className={styles.tableWrapper}
        ref={tableWrapperRef}
        style={{
          position: 'relative',
          overflow: 'auto',
          height: '100%',
        }}>
        <Table
          size="small"
          stickyHeader={true}
          style={{
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  className={styles.tableHeaderCell}
                  title={header.replace(/_/g, ' ')}
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'rgba(248, 249, 250, 0.98)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}>
                  {header.replace(/_/g, ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPoints.map((dataPoint, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                className={`${styles.tableRow} ${rowIndex === selectedDataPointIdx ? styles.selectedRow : ''}`}>
                {headers.map((header, cellIndex) => (
                  <TableCell
                    key={`${rowIndex}-${cellIndex}`}
                    className={styles.tableCell}
                    title={
                      dataPoint[header] !== undefined && dataPoint[header] !== null
                        ? typeof dataPoint[header] === 'object'
                          ? JSON.stringify(dataPoint[header])
                          : dataPoint[header].toString()
                        : '-'
                    }>
                    {dataPoint[header] !== undefined && dataPoint[header] !== null
                      ? typeof dataPoint[header] === 'object'
                        ? JSON.stringify(dataPoint[header])
                        : typeof dataPoint[header] === 'number'
                          ? Number.isInteger(dataPoint[header])
                            ? dataPoint[header].toString()
                            : Number(dataPoint[header].toFixed(4)).toString()
                          : dataPoint[header].toString()
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

InsightsDataTable.propTypes = {
  dataPoints: PropTypes.arrayOf(PropTypes.object),
  selectedDataPointIdx: PropTypes.number,
};

export default InsightsDataTable;
