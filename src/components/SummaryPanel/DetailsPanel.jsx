import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Fade, Box, Typography, Paper, IconButton, Tooltip, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import Chart from 'chart.js/auto';
import { selectInsightDetails, selectInsightsDashboardLoading } from '../../redux/store/dashboardSlice';
import { selectSelectedIndustry, selectUser } from '../../features/auth/authSlice';
import classes from './DetailsPanel.module.scss';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const excludedFields = ['data_point_idx', 'anomaly_details', 'anomaly_details_status', 'data_point_title'];

const getAnomalyTypeColor = (anomalyType) => {
  switch (anomalyType?.toLowerCase()) {
    case 'negative':
      return classes.negativeValue;
    case 'positive':
      return classes.positiveValue;
    default:
      return classes.normalValue;
  }
};

const ChartComponent = ({ dataPoints }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const resizeChart = useCallback(() => {
    if (!chartRef.current || !containerRef.current) return;
    requestAnimationFrame(() => {
      chartRef.current.resize();
    });
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(resizeChart);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [resizeChart]);

  useEffect(() => {
    if (!canvasRef.current || !dataPoints) return;

    // Clear any previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    try {
      let chartType = 'bar';
      let chartData;

      if (typeof dataPoints === 'string') {
        try {
          const parsedData = JSON.parse(dataPoints);
          chartData = parsedData.data;
          chartType = parsedData.type || chartType;
        } catch (err) {
          console.error('Failed to parse chart data:', err);
          return;
        }
      } else if (typeof dataPoints === 'object') {
        if (dataPoints.data) {
          chartData = dataPoints.data;
          chartType = dataPoints.type || chartType;
        } else if (Array.isArray(dataPoints)) {
          // Auto-generate chart data from array of objects
          const samplePoint = dataPoints[0] || {};
          const numericFields = [];
          const categoryField =
            Object.keys(samplePoint).find(
              (key) => typeof samplePoint[key] === 'string' && !excludedFields.includes(key),
            ) || 'Category';

          Object.keys(samplePoint).forEach((key) => {
            if (typeof samplePoint[key] === 'number' && !excludedFields.includes(key)) {
              numericFields.push(key);
            }
          });

          const labels = dataPoints.map((item) => item[categoryField] || 'Unknown');
          const datasets = numericFields.map((field, index) => ({
            label: field.replace(/_/g, ' '),
            data: dataPoints.map((item) => item[field]),
            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 80 + 100) % 255}, ${(index * 120 + 50) % 255}, 0.6)`,
            borderColor: `rgba(${(index * 50) % 255}, ${(index * 80 + 100) % 255}, ${(index * 120 + 50) % 255}, 1)`,
            borderWidth: 1,
          }));

          chartData = { labels, datasets };
        }
      }

      if (!chartData) {
        console.error('Unable to determine chart data format');
        return;
      }
      // if (chartType === 'bar' && chartData?.datasets) {
      //           chartData.datasets.forEach(dataset => {
      //           if (Array.isArray(dataset.backgroundColor) && dataset.backgroundColor.length > 1) {
      //              // Use the first color for all bars to match the legend
      //               dataset.backgroundColor = dataset.backgroundColor[0];
      //            }
      //          });
      //        }

      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" },
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              padding: 10,
              bodyFont: {
                family: "'Articulat CF', 'Inter', 'Poppins', sans-serif",
              },
              titleFont: {
                family: "'Articulat CF', 'Inter', 'Poppins', sans-serif",
                weight: 600,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" },
              },
            },
          },
        },
      });

      resizeChart();
    } catch (error) {
      console.error('Chart creation error:', error);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dataPoints, resizeChart]);

  return (
    <div ref={containerRef} className={classes.chartWrapper}>
      <canvas ref={canvasRef} />
    </div>
  );
};

ChartComponent.propTypes = {
  dataPoints: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]).isRequired,
};

// Enhanced Table component with anomaly type highlighting ONLY for selected row
const TableComponent = ({ dataPoints, selectedDataPoint }) => {
  const tableWrapperRef = useRef(null);
  const [tableHeight, setTableHeight] = useState('auto');

  // Dynamically calculate table height based on content
  useEffect(() => {
    if (!tableWrapperRef.current || !dataPoints) return;

    const rowCount = dataPoints?.length || 0;
    const rowHeight = 37; // Approximate height of each row in pixels
    const headerHeight = 38; // Approximate height of the header
    const padding = 16; // Additional padding

    // Calculate height based on content (header + rows + padding)
    const contentHeight = headerHeight + rowCount * rowHeight + padding;

    // Get container constraints if available
    let availableHeight = 400; // Default max height
    if (tableWrapperRef.current.parentElement) {
      const containerRect = tableWrapperRef.current.parentElement.getBoundingClientRect();
      availableHeight = containerRect.height || 400;
    }

    // Use available space but don't make it too small for few rows
    const minHeight = Math.min(200, contentHeight);

    // Determine final height - use content height but stay within container bounds
    const finalHeight = Math.min(contentHeight, availableHeight);

    setTableHeight(`${Math.max(minHeight, finalHeight)}px`);
  }, [dataPoints]);

  if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
    return (
      <div className={classes.noData}>
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
    <div className={classes.tableContainer}>
      <div ref={tableWrapperRef} className={classes.tableWrapper} style={{ height: tableHeight }}>
        <table className={classes.table}>
          <thead className={classes.tableHead}>
            <tr>
              {headers.map((header) => (
                <th key={header} className={classes.tableHeaderCell}>
                  {header.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((dataPoint, rowIndex) => {
              // Only apply anomaly color class to the selected row
              const isSelected = selectedDataPoint === dataPoint;
              const anomalyColorClass = isSelected ? getAnomalyTypeColor(dataPoint.anomaly_type) : '';

              return (
                <tr
                  key={rowIndex}
                  className={`${classes.tableRow} ${isSelected ? classes.selectedRow : ''} ${anomalyColorClass}`}>
                  {headers.map((header) => (
                    <td key={header} className={classes.tableCell}>
                      {dataPoint[header] !== undefined && dataPoint[header] !== null
                        ? typeof dataPoint[header] === 'object'
                          ? JSON.stringify(dataPoint[header])
                          : typeof dataPoint[header] === 'number'
                            ? Number.isInteger(dataPoint[header])
                              ? dataPoint[header].toString()
                              : Number(dataPoint[header].toFixed(4)).toString()
                            : dataPoint[header].toString()
                        : '-'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  dataPoints: PropTypes.array.isRequired,
  selectedDataPoint: PropTypes.object,
};

// Enhanced DetailsPanel component with client-specific handling
const DetailsPanel = ({ open, onClose, selectedInsightId }) => {
  const insightDetails = useSelector(selectInsightDetails);
  console.log('insightDetails', insightDetails);
  // Use specific loading state for insights dashboard
  const isInsightsLoading = useSelector(selectInsightsDashboardLoading);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [activeView, setActiveView] = useState('visualization');
  const [isDownloading, setIsDownloading] = useState(false);

  // Get client ID to determine if this is a Pharmaceutical client (ID 4) or client ID 3
  const user = useSelector(selectUser);
  const selectedIndustry = useSelector(selectSelectedIndustry);

  // Determine client ID from selected industry
  const clientId = useMemo(() => {
    if (!user?.industries || !selectedIndustry) return null;
    const industry = user.industries.find((ind) => ind.name === selectedIndustry);
    return industry?.id || null;
  }, [user?.industries, selectedIndustry]);

  // Check if client is Pharmaceutical (ID 4) or client ID 3, which don't need insight details
  const isSpecialClient = useMemo(() => clientId === 4, [clientId]);

  const selectedInsightData = useMemo(
    () => insightDetails?.find((detail) => String(detail.insight_id) === String(selectedInsightId)),
    [insightDetails, selectedInsightId],
  );
console.log('selectedInsightData', selectedInsightData);
  const dataPoints = useMemo(() => selectedInsightData?.data || [], [selectedInsightData]);
  console.log('DATAPOINTS', dataPoints);

  const anomaly_type = useMemo(() => selectedDataPoint?.anomaly_type || 'normal', [selectedDataPoint]);

  const anomaly_details = useMemo(() => selectedDataPoint?.anomaly_details || {}, [selectedDataPoint]);

  // Get the filename for download based on insight data
  const downloadFileName = useMemo(() => {
    if (!selectedInsightData) return 'insight_table_data';

    // Use insight ID or first data point for filename
    const insightId = selectedInsightData.insight_id || 'unknown';
    const firstDataPoint = dataPoints[0];

    if (firstDataPoint) {
      const visualTitle =
        firstDataPoint?.anomaly_details?.visual_title ||
        firstDataPoint?.anomaly_details?.title ||
        firstDataPoint?.data_point_title;

      if (visualTitle) {
        // Clean the filename by removing special characters and replacing spaces with underscores
        const cleanTitle = visualTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
        return `${cleanTitle}`;
      }
    }
    return `insight_${insightId}_table`;
  }, [selectedInsightData, dataPoints]);

  useEffect(() => {
    if (open && dataPoints.length > 0) {
      setSelectedDataPoint(dataPoints[0]);
    } else if (!open) {
      setSelectedDataPoint(null);
      setActiveView('visualization');
    }
  }, [open, dataPoints]);

  useEffect(() => {
    // Reset the selected data point and view when panel is closed
    if (!open) {
      setSelectedDataPoint(null);
      setActiveView('visualization');
    }
  }, [open]);

  const handleToggleChange = (event, newView) => {
    if (newView !== null) {
      setActiveView(newView);
    }
  };

  const handleDownloadPDF = async () => {
    // Download the entire table as PDF with guaranteed color support
    if (!dataPoints || dataPoints.length === 0) return;

    try {
      setIsDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for UI state to update

      // Download as PDF with colors
      downloadPDF(dataPoints, downloadFileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // PDF download function with perfect color preservation
  const downloadPDF = (data, filename) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data available for PDF download');
      return;
    }

    // Get all unique headers from the data
    const allKeys = new Set();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!excludedFields.includes(key)) {
          allKeys.add(key);
        }
      });
    });

    const headers = Array.from(allKeys);

    // Create new PDF document
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation for better table fit

    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Export with Anomaly Highlighting', 14, 20);

    // Add generation date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    // Prepare table data
    const tableHeaders = headers.map((header) => header.replace(/_/g, ' '));
    const tableData = data.map((row) => {
      return headers.map((header) => {
        let value = row[header];
        if (value === undefined || value === null) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      });
    });

    // Define colors for anomaly types (RGB values)
    const getRowColor = (anomalyType) => {
      switch (anomalyType?.toLowerCase()) {
        case 'negative':
          return [255, 205, 210]; // Light red RGB equivalent of #FFCDD2
        case 'positive':
          return [200, 230, 201]; // Light green RGB equivalent of #C8E6C9
        default:
          return [255, 249, 196]; // Light yellow RGB equivalent of #FFF9C4
      }
    };

    // Create table with autoTable plugin
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [240, 240, 240], // Light gray header
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: false, // Disable default alternating rows
      },
      didParseCell: function (hookData) {
        // Color rows based on anomaly type
        if (hookData.row.index >= 0 && hookData.row.index < data.length) {
          const rowData = data[hookData.row.index];
          if (rowData && rowData.anomaly_type) {
            const bgColor = getRowColor(rowData.anomaly_type);
            hookData.cell.styles.fillColor = bgColor;
          }
        }
      },
      margin: { top: 35, right: 14, bottom: 20, left: 14 },
    });

    // Add color legend
    const finalY = doc.lastAutoTable?.finalY || doc.autoTable?.previous?.finalY || 100;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Color Legend:', 14, finalY + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Green legend
    doc.setFillColor(200, 230, 201);
    doc.rect(14, finalY + 20, 5, 4, 'F');
    doc.text('Green = Positive Anomaly', 22, finalY + 23);

    // Red legend
    doc.setFillColor(255, 205, 210);
    doc.rect(14, finalY + 27, 5, 4, 'F');
    doc.text('Red = Negative Anomaly', 22, finalY + 30);

    // Yellow legend
    doc.setFillColor(255, 249, 196);
    doc.rect(14, finalY + 34, 5, 4, 'F');
    doc.text('Yellow = Normal/Other', 22, finalY + 37);

    // Save the PDF
    doc.save(`${filename}.pdf`);
    console.log(`PDF file "${filename}.pdf" downloaded with ${data.length} rows and perfect color highlighting`);
  };

  // Handle loading state and special client cases
  if (isInsightsLoading) {
    return (
      <>
        <Fade in={open}>
          <div className={`${classes.overlay} ${open ? classes.visible : ''}`} onClick={onClose} />
        </Fade>
        <div className={`${classes.panel} ${open ? classes.open : ''}`}>
          <div className={classes.tag}>
            <IconButton onClick={onClose} className={classes.closeButton} aria-label="close details">
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            <div className={classes.header}>
              <div className={classes.titleSection}>
                <Typography variant="h6" className={classes.headerTitle}>
                  Loading Insight Details...
                </Typography>
              </div>
            </div>
            <div className={classes.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <CircularProgress size={48} thickness={4} sx={{ color: '#f7901d', mb: 2 }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Loading insight details...
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Handle case where client doesn't need details or details aren't available
  if (isSpecialClient) {
    return (
      <>
        <Fade in={open}>
          <div className={`${classes.overlay} ${open ? classes.visible : ''}`} onClick={onClose} />
        </Fade>
        <div className={`${classes.panel} ${open ? classes.open : ''}`}>
          <div className={classes.tag}>
            <IconButton onClick={onClose} className={classes.closeButton} aria-label="close details">
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            <div className={classes.header}>
              <div className={classes.titleSection}>
                <Typography variant="h6" className={classes.headerTitle}>
                  Insight Overview
                </Typography>
              </div>
            </div>
            <div className={classes.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                <InfoIcon sx={{ fontSize: 48, color: '#f7901d', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Detailed View Not Available
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Detailed analysis view is not available for this industry configuration.
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Handle case where insight details are missing
  if (!selectedInsightData || !selectedDataPoint) {
    return (
      <>
        <Fade in={open}>
          <div className={`${classes.overlay} ${open ? classes.visible : ''}`} onClick={onClose} />
        </Fade>
        <div className={`${classes.panel} ${open ? classes.open : ''}`}>
          <div className={classes.tag}>
            <IconButton onClick={onClose} className={classes.closeButton} aria-label="close details">
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            <div className={classes.header}>
              <div className={classes.titleSection}>
                <Typography variant="h6" className={classes.headerTitle}>
                  No Details Available
                </Typography>
              </div>
            </div>
            <div className={classes.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                <InfoIcon sx={{ fontSize: 48, color: '#f7901d', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  No data available for this insight.
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Fade in={open}>
        <div className={`${classes.overlay} ${open ? classes.visible : ''}`} onClick={onClose} />
      </Fade>

      <div className={`${classes.panel} ${open ? classes.open : ''}`}>
        <div className={classes.tag}>
          <IconButton onClick={onClose} className={classes.closeButton} aria-label="close details">
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.content}>
          <div className={classes.header}>
            <div className={classes.titleSection}>
              <Typography variant="h6" className={classes.headerTitle}>
                Insight Overview
              </Typography>
            </div>
          </div>

          <div className={classes.mainContent}>
            <div className={classes.leftPane}>
              {dataPoints.map((point, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  className={`${classes.dataPoint} ${selectedDataPoint === point ? classes.selected : ''}`}
                  onClick={() => setSelectedDataPoint(point)}>
                  <Typography className={classes.dataTitle}>
                    {point.data_point_title || point.anomaly_details?.visual_title || `Data Point ${index + 1}`}
                  </Typography>
                  <div className={`${classes.dataValue} ${getAnomalyTypeColor(point.anomaly_type)}`}>
                    {point.anomaly_details?.value ||
                      point.awareness_score?.toFixed(2) ||
                      point.acv_distribution_pct?.toFixed(2) ||
                      '-'}
                  </div>
                </Paper>
              ))}
            </div>

            <div className={classes.middlePane}>
              <div className={`${classes.metricContainer} ${getAnomalyTypeColor(anomaly_type)}`}>
                <Typography variant="h6" className={classes.metricTitle}>
                  {anomaly_details.visual_title || anomaly_details.title || 'Detail View'}
                </Typography>
                <Typography className={classes.brief}>{anomaly_details.brief || 'No description available'}</Typography>
              </div>
              <div className={classes.viewToggleContainer}>
                <ToggleButtonGroup
                  value={activeView}
                  exclusive
                  onChange={handleToggleChange}
                  size="small"
                  aria-label="data view toggle"
                  className={classes.viewToggle}>
                  <ToggleButton value="visualization" aria-label="visualization view">
                    <Tooltip title="Show Chart">
                      <BarChartIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="table view">
                    <Tooltip title="Show Table">
                      <TableChartIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>

                <Tooltip title="Download entire table as PDF with color highlighting">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={isDownloading ? <CircularProgress size={16} thickness={4} /> : <DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className={classes.downloadButton}
                    sx={{
                      marginLeft: '8px',
                      textTransform: 'none',
                      fontSize: '0.5rem',
                      padding: '1px 2px',
                      minWidth: 'auto',
                      borderColor: 'transparent !important',
                      color: '#f7901d',
                      visibility: activeView === 'table' && dataPoints.length > 0 ? 'visible' : 'hidden',
                      '&:hover': {
                        backgroundColor: 'transparent !important',
                      },
                    }}>
                    {isDownloading ? 'Downloading...' : ''}
                  </Button>
                </Tooltip>
              </div>
              <div className={`${classes.chartSection} ${activeView === 'table' ? classes.tableView : ''}`}>
                {activeView === 'visualization' && anomaly_details.data_points ? (
                  <ChartComponent dataPoints={anomaly_details.data_points} />
                ) : activeView === 'table' ? (
                  <TableComponent dataPoints={dataPoints} selectedDataPoint={selectedDataPoint} />
                ) : (
                  <div className={classes.noChart}>
                    <Typography variant="body2" color="textSecondary">
                      No chart data available
                    </Typography>
                  </div>
                )}
              </div>
              <div className={classes.highlightsSection}>
                {anomaly_details.key_highlights?.map((highlight, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    className={classes.highlight}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}>
                    <Typography className={`${classes.highlightTitle} ${getAnomalyTypeColor(anomaly_type)}`}>
                      {highlight.title}
                    </Typography>
                    <Typography className={classes.highlightValue}>{highlight.highlight}</Typography>
                  </Paper>
                ))}
              </div>
            </div>

            <div className={classes.rightPane}>
              <Typography variant="h6" className={classes.recommendationsTitle}>
                Recommendations
              </Typography>
              <div className={classes.recommendationsList}>
                {anomaly_details.recommendations?.map((recommendation, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    className={classes.recommendationItem}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}>
                    <Typography>{recommendation}</Typography>
                  </Paper>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DetailsPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedInsightId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default DetailsPanel;
