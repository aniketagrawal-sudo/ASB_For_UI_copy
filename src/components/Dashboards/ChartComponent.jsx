import { useRef, useState, useEffect,useMemo, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Bar, Doughnut,Line } from 'react-chartjs-2';
import {
  BoxPlotController,
  BoxAndWiskers
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import classes from './HomeDashboard.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setChartFilters, selectChartFilters } from '../../redux/store/dashboardSlice';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

// Register the components you will use from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,BoxPlotController,BoxAndWiskers);

const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'function') {
        newObj[key] = obj[key]; // Functions are copied by reference
      } else {
        newObj[key] = deepClone(obj[key]); // Recurse for nested objects/arrays
      }
    }
  }
  return newObj;
};





// --- All of your original helper functions are preserved below ---

const formatColumnName = (name) => {
  if (name === null || name === undefined) return '';
  return String(name)
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');
};

const detectDataType = (labels, datasets) => {
  const hasDateLabels = labels.some(
    (label) => typeof label === 'string' && (label.match(/\d{4}-\d{2}/) || label.match(/\w{3}\s\d{4}/)),
  );
  if (hasDateLabels) return 'date';
  const hasCategoryLabels = labels.some(
    (label) =>
      typeof label === 'string' &&
      (label.includes('Brand') || label.includes('Competitor') || label.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)),
  );
  if (hasCategoryLabels) return 'category';
  if (datasets.length && datasets[0].data?.every((item) => typeof item === 'number')) {
    return 'numeric';
  }
  return 'unknown';
};

const isJsonArrayOfObjects = (dataPoints) => {
  if (typeof dataPoints === 'string') {
    try {
      const parsed = JSON.parse(dataPoints);
      return Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && !Array.isArray(parsed[0]);
    } catch {
      return false;
    }
  } else if (Array.isArray(dataPoints) && dataPoints.length > 0) {
    return typeof dataPoints[0] === 'object' && !Array.isArray(dataPoints[0]);
  }
  return false;

};

// Helper function to transform array of objects to Chart.js bar chart config
const transformArrayToBarChart = (dataArray, groupByKey, valueKey, categoryKey, visualTitle, activeFilters = [], personaId = null) => {
  if (!dataArray || !dataArray.length) {
    return null;
  }
  const keys = Object.keys(dataArray[0] || {});
  const numericKeys = keys.filter((key) =>
    dataArray.some((item) => !isNaN(parseFloat(item[key])) && isFinite(item[key])),
  );
  const stringKeys = keys.filter((key) =>
    dataArray.some((item) => typeof item[key] === 'string' || typeof item[key] === 'number'),
  );
  const finalValueKey = valueKey || numericKeys[0] || 'value';
  const finalGroupByKey =
    groupByKey || stringKeys.find((k) => k !== finalValueKey && k !== categoryKey) || stringKeys[0] || 'group';
  const finalCategoryKey =
    categoryKey || stringKeys.find((k) => k !== finalValueKey && k !== finalGroupByKey) || stringKeys[1] || 'category';
  if (!finalValueKey || !finalGroupByKey || !finalCategoryKey) {
    return null;
  }
  const isDateCategory =
    finalCategoryKey.toLowerCase().includes('month') ||
    finalCategoryKey.toLowerCase().includes('date') ||
    finalCategoryKey.toLowerCase().includes('year');
  const uniqueGroups = [...new Set(dataArray.map((item) => item[finalGroupByKey]))].filter(
    (val) => val !== null && val !== undefined && val !== '',
  );
  const uniqueCategories = [
    ...new Set(
      dataArray.map((item) => {
        const rawValue = item[finalCategoryKey];
        if (isDateCategory && rawValue) {
          try {
            const date = new Date(rawValue);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              return `${year}-${month}`;
            }
          } catch (e) { /* Fallback */ }
        }
        return rawValue;
      }),
    ),
  ]
    .filter((val) => val !== null && val !== undefined && val !== '')
    .sort();

  // Generate dynamic colors for groups
  const generateColor = (index, groupName) => {
    const colors = [
      { bg: '#4E79A7', border: '#4E79A7' },
      { bg: '#59A14F', border: '#59A14F' },
      { bg: '#F28E2B', border: '#F28E2B' },
      { bg: '#E15759', border: '#E15759' },
      { bg: '#767676', border: '#767676' },
      { bg: '#9467BD', border: '#9467BD' },
      { bg: '#8CA252', border: '#8CA252' },
      { bg: '#D0743C', border: '#D0743C' },
      { bg: '#AB5787', border: '#AB5787' },
      { bg: '#C4A19C', border: '#C4A19C' },
    ];

    if (index < colors.length) {
      return colors[index];
    }

    // Generate color based on group name for consistency
    const hashCode = Array.from(String(groupName || '')).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hashCode % 360;
    return {
      bg: `hsla(${hue}, 70%, 60%, 0.6)`,
      border: `hsla(${hue}, 70%, 45%, 1)`,
    };
  };
  // Create datasets for each group
  const datasets = uniqueGroups.map((group, index) => {
    const groupStr = String(group || '');
    const colors = generateColor(index, groupStr);

    // Get values for this group across all categories (sum multiple matches)
    const data = uniqueCategories.map((category) => { // 'category' is now "YYYY-MM"
      // ✅ 2. MATCH DATA by also converting to YYYY-MM format for comparison
      const matches = dataArray.filter((item) => {
        const itemGroup = String(item[finalGroupByKey] || '');
        if (itemGroup !== String(group || '')) return false;

        let itemCategoryFormatted = String(item[finalCategoryKey] || '');
        if (isDateCategory && item[finalCategoryKey]) {
          try {
            const date = new Date(item[finalCategoryKey]);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              itemCategoryFormatted = `${year}-${month}`;
            }
          } catch (e) {
            /* Fallback to original value */
          }
        }
        // This comparison now works: "2024-10" will match "2024-10"
        return itemCategoryFormatted === String(category || '');
      });


      const sum = matches.reduce((total, item) => {
        const rawValue = item[finalValueKey];
        // Handle null, undefined, and non-numeric values more carefully
        if (rawValue === null || rawValue === undefined || rawValue === '') {
          return total;
        }

        const numericValue = parseFloat(rawValue);
        if (isNaN(numericValue)) {
          console.warn(`Non-numeric value found for ${finalValueKey}:`, rawValue);
          return total;
        }

        return total + numericValue;
      }, 0);

      return sum;
    });

    return {
      label: groupStr,
      data,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: 1,
    };
  });

  // Limit the number of datasets if there are too many
  const maxDatasets = 12;
  

  // const chartTitle = visualTitle || '';
  // const displayTitle = !!visualTitle;
  const filtersText = activeFilters.length ? ` (${activeFilters.join(', ')})` : '';
  const groupByText = groupByKey ? ` by ${formatColumnName(groupByKey)}` : '';
  const shortTitle = visualTitle.split(' by ')[0];

  const chartTitle = `${shortTitle}${groupByText}${filtersText}`;
  const displayTitle = !!chartTitle;
  // --- START: CUSTOM AXIS LOGIC ---
  const lowerCaseVisualTitle = visualTitle.toLowerCase();
  let xAxisTitle = formatColumnName(finalCategoryKey);
  let yAxisOptions = {
    title: {
      display: true,
      text: formatColumnName(finalValueKey),
      font: { size: 11, family: "'Inter', sans-serif" },
    },
    beginAtZero: true,
    ticks: {
      font: { size: 10, family: "'Inter', sans-serif" },
    },
  };

  // 1. Gross Profit Margin Analysis
  if (lowerCaseVisualTitle.includes('gross profit margin')) {
    xAxisTitle = 'Months';
    yAxisOptions.title.text = 'Percentage'; // This line was added
    yAxisOptions.ticks.callback = function(value) {
      return value + '%';
    };
  }

  // 2. Discount/Promotion Value Analysis (Only for Persona 33)
  if ((lowerCaseVisualTitle.includes('discount') || lowerCaseVisualTitle.includes('promotion')) && Number(personaId) === 33) {
    xAxisTitle = 'Months';
    yAxisOptions.title.text = 'Discounts (in USD)';
  }


  // Create the chart configuration
  return {
    type: 'bar',
    data: {
      labels: uniqueCategories,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 11, family: "'Inter', sans-serif" },
          },
        },
        tooltip: {
          callbacks: {
           // Inside options.plugins.tooltip.callbacks
            label: function (context) {
              const value = context.raw;
              let formattedValue = // Use 'let' to allow modification
                typeof value === 'number'
                  ? Math.abs(value) >= 1000
                    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    : value.toFixed(2)
                  : String(value);

              // ✅ Perform the check *before* returning
              if (visualTitle.toLowerCase().includes('gross profit margin')) {
                formattedValue += '%';
              }
              
              return `${context.dataset.label}: ${formattedValue}`;
            },
          },
        },
        title: {
          display: displayTitle,
          text: chartTitle,
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisTitle,
            font: { size: 11, family: "'Inter', sans-serif" },
          },
          ticks: {
            maxRotation: 90,
            minRotation: 45,
            font: { size: 10, family: "'Inter', sans-serif" },
          },
        },
        y: yAxisOptions,

      },
    },
  };
};

const createDateFilters = (labels) => {
  const filters = [{ text: 'All Time', value: 'all' }];
  const dataPointCount = labels.length;

  if (dataPointCount >= 12) {
    filters.push({ text: 'Last 12M', value: '12m' });
  }

  if (dataPointCount >= 6) {
    filters.push({ text: 'Last 6M', value: '6m' });
  }

  if (dataPointCount >= 3) {
    filters.push({ text: 'Last 3M', value: '3m' });
  }

  // If we have more than a year of data, add YoY option
  if (dataPointCount >= 18) {
    filters.push({ text: 'YoY', value: 'yoy' });
  }

  return filters;
};

const createCategoryFilters = (labels, datasets) => {
  // Start with All
  const filters = [{ text: 'All', value: 'all' }];

  // Check for brand or competitor labels
  const hasBrands = labels.some((label) => label.includes('Brand'));
  const hasCompetitors = labels.some((label) => label.includes('Competitor'));

  if (hasBrands) {
    filters.push({ text: 'Brand Only', value: 'brand' });
  }

  if (hasCompetitors) {
    filters.push({ text: 'Competitors', value: 'competitors' });
  }

  // Add top performing filter if there's more than 3 items
  if (labels.length > 3 && datasets.length > 0) {
    filters.push({ text: 'Top 3', value: 'top3' });
  }

  return filters;
};

const createNumericFilters = (datasets) => {
  const filters = [{ text: 'All Values', value: 'all' }];

  if (!datasets.length || !datasets[0].data?.length) {
    return filters;
  }

  const values = datasets[0].data.filter((v) => v !== null && v !== undefined);
  const hasPositiveValues = values.some((v) => v > 0);
  const hasNegativeValues = values.some((v) => v < 0);

  if (hasPositiveValues && hasNegativeValues) {
    filters.push({ text: 'Positive Only', value: 'positive' });
    filters.push({ text: 'Negative Only', value: 'negative' });
  }

  return filters;
};

// Helper function to process function strings in configuration
const processFunctionStrings = (config) => {
  if (!config) return config;

  try {
    // Deep clone the object to avoid mutations
    const processed = JSON.parse(JSON.stringify(config));

    // Process callbacks in tooltip
    if (processed.options?.plugins?.tooltip?.callbacks) {
      const callbacks = processed.options.plugins.tooltip.callbacks;
      Object.keys(callbacks).forEach((key) => {
        if (typeof callbacks[key] === 'string' && callbacks[key].startsWith('function')) {
          try {
            // Convert the function string to an actual function
            // Remove the 'function' keyword and create a new Function
            const functionBody = callbacks[key].replace(/^function\s*\([^)]*\)\s*\{/, '').replace(/\}$/, '');

            const paramNames = callbacks[key]
              .match(/function\s*\(([^)]*)\)/)[1]
              .split(',')
              .map((param) => param.trim());

            callbacks[key] = new Function(...paramNames, functionBody);
          } catch (e) {
            console.error('Error converting callback function:', e);
            // If conversion fails, provide a default handler to avoid errors
            callbacks[key] = () => 'Error in callback';
          }
        }
      });
    }

    return processed;
  } catch (error) {
    console.error('Error processing function strings:', error);
    return config;
  }
};


  const enhanceChartData = (parsedConfig, visualTitle = '') => {
    if (!parsedConfig?.data) return parsedConfig;
  
    const title = visualTitle.toLowerCase();
    const labels = parsedConfig.data.labels || [];
    const datasets = parsedConfig.data.datasets || [];
  
    const dataContext = {
      isLossType:
        title.includes('loss type') ||
        labels.some(
          (l) => String(l).toLowerCase().includes('collision') || String(l).toLowerCase().includes('non-collision'),
        ),
      isTransactionAmount:
        title.includes('transaction amount') ||
        title.includes('cost analysis') ||
        labels.some(
          (l) =>
            String(l).toLowerCase().includes('expense') ||
            String(l).toLowerCase().includes('indemnity') ||
            String(l).toLowerCase().includes('adjustment'),
        ),
      isDate: labels.some((l) => String(l).match(/^\d{4}-\d{2}-\d{2}$/) || String(l).match(/^\d{4}-\d{2}$/)),
      isRatio: title.includes('ratio'),
      isFrequency: title.includes('frequency') || title.includes('count') || title.includes('claims'),
      isCurrency:
        title.includes('amount') ||
        title.includes('cost') ||
        title.includes('$') ||
        datasets.some((d) => d.data && d.data.some((val) => typeof val === 'number' && val > 1000)),
      isCycleTime: title.includes('cycle') || title.includes('time') || title.includes('days'),
    };
  
    const enhancedLabels = labels.map((label) => {
      if (!label) return 'Unknown';
      let formatted = String(label);
      if (dataContext.isDate) {
        try {
          const date = new Date(formatted);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
          }
        } catch { /* Fallback */ }
      }
      formatted = formatted.replace(/[_-]/g, ' ').split(' ').map((word) => word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      if (dataContext.isLossType) {
        if (formatted.toLowerCase().includes('non-collision')) return 'Non-Collision';
        if (formatted.toLowerCase().includes('collision')) return 'Collision';
      }
      if (dataContext.isTransactionAmount) {
        if (formatted.toLowerCase().includes('loss adjustment expense')) return 'Loss Adjustment Expense';
        if (formatted.toLowerCase().includes('indemnity')) return 'Indemnity';
      }
      return formatted;
    });
  
    const enhancedDatasets = datasets.map((dataset, index) => {
      let enhancedDataset = { ...dataset };
      let newLabel = dataset.label || '';
      if (!newLabel || ['Metric Value Over Time', 'Trend Data', 'Value Trend', 'Loss Type Values', 'Cost Types', 'Trend of Values'].includes(newLabel)) {
        if (dataContext.isLossType) newLabel = 'Claims Count';
        else if (dataContext.isTransactionAmount) newLabel = dataContext.isCurrency ? 'Transaction Amount ($)' : 'Transaction Amount';
        else if (dataContext.isRatio) newLabel = 'Loss Ratio';
        else if (dataContext.isFrequency) newLabel = 'Frequency Count';
        else if (dataContext.isCycleTime) newLabel = 'Cycle Time (Days)';
        else {
          const titleWords = visualTitle.split(' ').filter((word) => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()));
          newLabel = titleWords.length > 0 ? titleWords.slice(0, 2).join(' ') : `Data Series ${index + 1}`;
        }
      } else {
        newLabel = newLabel.replace(/[_-]/g, ' ').split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      }
      enhancedDataset.label = newLabel;
      if (!dataset.backgroundColor || dataset.backgroundColor === 'rgba(75, 192, 192, 0.2)' || (Array.isArray(dataset.backgroundColor) && dataset.backgroundColor.length <= 2 && dataset.backgroundColor.every((color) => color === 'rgba(75, 192, 192, 0.2)'))) {
        if (dataContext.isLossType && labels.length === 2) {
          enhancedDataset.backgroundColor = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'];
          enhancedDataset.borderColor = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'];
        } else if (dataContext.isTransactionAmount && labels.length === 2) {
          enhancedDataset.backgroundColor = ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'];
          enhancedDataset.borderColor = ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'];
        } else {
          const colors = [
            { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' }, { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
            { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' }, { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
            { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' }, { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
          ];
          if (Array.isArray(dataset.backgroundColor)) {
            enhancedDataset.backgroundColor = labels.map((_, i) => colors[i % colors.length].bg);
            enhancedDataset.borderColor = labels.map((_, i) => colors[i % colors.length].border);
          } else {
            const colorSet = colors[index % colors.length];
            enhancedDataset.backgroundColor = colorSet.bg;
            enhancedDataset.borderColor = colorSet.border;
          }
        }
      }
      return enhancedDataset;
    });
  
    return { ...parsedConfig, data: { ...parsedConfig.data, labels: enhancedLabels, datasets: enhancedDatasets }, _dataContext: dataContext };
  };

const DEFAULT_FILTERS = {};

const ChartComponent = forwardRef((props, ref) => {
  const { dataPoints, type, isPositive = null, visualTitle = '', personaId = null, visualId, onFilterChange  } = props;
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreenToggle = () => setIsFullscreen(!isFullscreen);
  useImperativeHandle(ref, () => ({
    toggleFullscreen() {
      handleFullscreenToggle();
    }
  }));

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);
  const [isJsonArray, setIsJsonArray] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [groupByKey, setGroupByKey] = useState('');
  const [categoryKey, setCategoryKey] = useState('');
  const [valueKey, setValueKey] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_FILTERS);
  const isTrendChart = type === 'trend';

  useEffect(() => {
    if (!dataPoints) {
      setIsJsonArray(false);
      setJsonData(null);
      setColumns([]);
      setGroupByKey('');
      setCategoryKey('');
      setValueKey('');
      setSelectedItems({});
      return;
    }
  
    if (isJsonArrayOfObjects(dataPoints)) {
      const parsedJsonArray = typeof dataPoints === 'string' ? JSON.parse(dataPoints) : dataPoints;
      setIsJsonArray(true);
      setJsonData(parsedJsonArray);
  
      if (parsedJsonArray.length === 0) return; // Skip empty arrays
  
      const allCols = Object.keys(parsedJsonArray[0]);
      setColumns(allCols);

      const colInfo = allCols.map((col) => {
        const uniqueValues = new Set(parsedJsonArray.map(item => item[col]));
        const isNumeric = parsedJsonArray.every(item => {
          const value = item[col];
          // Treat nulls/undefined as non-blocking for numeric check
          if (value === null || value === undefined || value === '') return true; 
          // Check if the value is a finite number
          return !isNaN(parseFloat(value)) && isFinite(value);
        });
        return {
          name: col,
          uniqueCount: uniqueValues.size,
          isNumeric: isNumeric,
        };
      });

      const findDateColumn = (columns) => {
        // Priority 1: Look for columns with "month" (most specific and desired)
        let bestMatch = columns.find(col => col.toLowerCase().includes('month'));
        if (bestMatch) return bestMatch;

        // Priority 2: Look for columns with "date"
        bestMatch = columns.find(col => col.toLowerCase().includes('date'));
        if (bestMatch) return bestMatch;

        // Priority 3: Fallback to columns with "year"
        bestMatch = columns.find(col => col.toLowerCase().includes('year'));
        return bestMatch; // Returns the match or undefined
      };

      const dateColumn = findDateColumn(allCols);
  
      // Detect value key
      let vKey = colInfo.find(c => c.isNumeric && c.name.toLowerCase().includes('value'))?.name;
      if (!vKey) vKey = colInfo.find(c => c.isNumeric)?.name;
      if (!vKey && colInfo.length > 0) vKey = colInfo[0].name;
      setValueKey(vKey || '');
  
      let gKey, cKey; // To store GroupBy (legend) and Category (x-axis) keys

      // Special logic for Persona 33: Prioritize date for X-axis
      if (Number(personaId) === 33 && dateColumn) {
        cKey = dateColumn; // X-axis is the date column

        // Find a suitable GroupBy key from the remaining non-numeric columns
        const potentialGroupCols = colInfo
          .filter(c => !c.isNumeric && c.name !== cKey && c.name !== vKey)
          .sort((a, b) => a.uniqueCount - b.uniqueCount); // Prioritize low cardinality for grouping
        
        gKey = potentialGroupCols.length > 0 ? potentialGroupCols[0].name : null;

      } else {
        // Default auto-detection logic for all other cases
        const stringCols = colInfo.filter(c => !c.isNumeric).sort((a, b) => a.uniqueCount - b.uniqueCount);

        // GroupBy key (legend/series) - typically low cardinality
        gKey = stringCols.length > 0 ? stringCols[0].name : null;

        // Category key (X-axis) - typically higher cardinality from remaining string columns
        const remainingStringCols = stringCols.filter(c => c.name !== gKey);
        if (remainingStringCols.length > 0) {
          cKey = remainingStringCols.sort((a, b) => b.uniqueCount - a.uniqueCount)[0].name;
        } else if (allCols.length > 1) {
          // Fallback if no other string columns are available
          cKey = allCols.find(c => c !== gKey && c !== vKey) || allCols[0];
        }
      }

      setGroupByKey(gKey || '');
      setCategoryKey(cKey || '');
  
      // Filters
      const targetPersonaIds = [31, 32];
      const applyCustomDefaultFilter = personaId && targetPersonaIds.includes(Number(personaId));
      
      const defaultFilters = {};
      allCols.forEach(col => {
        let uniqueValues = [...new Set(parsedJsonArray.map(item => item[col]))].filter(Boolean);
  
        if (col === dateColumn) uniqueValues.sort((a, b) => new Date(a) - new Date(b));
        else uniqueValues.sort();
  
        const filterObj = {};
        if (uniqueValues.length > 0 && uniqueValues.length <= 100) {
          if (applyCustomDefaultFilter && col === dateColumn) {
            uniqueValues.forEach((value, index) => {
              filterObj[value] = index === uniqueValues.length - 1;
            });
          } else {
            uniqueValues.forEach(value => {
              filterObj[value] = true;
            });
          }
          defaultFilters[col] = filterObj;
        }
      });
  
      setSelectedItems(defaultFilters);

  
    } else {
      // Not a JSON array
      setIsJsonArray(false);
      setJsonData(null);
      setColumns([]);
      setGroupByKey('');
      setCategoryKey('');
      setValueKey('');
      setSelectedItems({});
    }
  }, [dataPoints, personaId]);
  
  // Parse data once
  const parsedData = useMemo(() => {
    if (isJsonArray) {
      if (!jsonData || jsonData.length === 0) return null;

      // Include ALL columns for filters, not just categorical ones (to include dates, etc.)
      const filterCategories = {};
      columns.forEach((col) => {
        const uniqueValues = [...new Set(jsonData.map((item) => item[col]))].filter(Boolean).sort();

        // Only include columns with reasonable number of unique values for filtering
        if (uniqueValues.length > 0 && uniqueValues.length <= 100) {
          filterCategories[col] = uniqueValues;
        }
      });

      return { filterCategories };
    }

    try {
      const parsed = JSON.parse(dataPoints);
      const enhanced = enhanceChartData(parsed, visualTitle);
      return { chartConfig: processFunctionStrings(enhanced) };
    } catch (e) {
      console.error('Error parsing chart data:', e);
      return null;
    }
  }, [dataPoints, visualTitle, isJsonArray, jsonData, columns]);

  


  // Analyze data to determine appropriate filters
  const filterOptions = useMemo(() => {
    // Skip filters for trend cards (isPositive is non-null)
    if (type == 'trend') {
      return null;
    }

    try {
      // Skip filters for donut/doughnut charts
      if (!dataPoints || type === 'donut' || type === 'doughnut') {
        return null;
      }

      // For JSON array data, we're handling filters differently
      if (isJsonArray) {
        return null;
      }

      // Regular Chart.js config format filtering
      const cleanJson =
        typeof dataPoints === 'string' ? dataPoints.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') : dataPoints;

      const parsedConfig = typeof cleanJson === 'string' ? JSON.parse(cleanJson) : cleanJson;

      const labels = parsedConfig?.data?.labels || [];
      const datasets = parsedConfig?.data?.datasets || [];

      // Skip filtering if no labels
      if (!labels.length) return null;

      // Detect data type to create appropriate filters
      const dataType = detectDataType(labels, datasets);

      switch (dataType) {
        case 'date':
          return createDateFilters(labels);
        case 'category':
          return createCategoryFilters(labels, datasets);
        case 'numeric':
          return createNumericFilters(datasets);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error analyzing data for filters:', error);
      return null;
    }
  }, [dataPoints, type, isJsonArray]);

  // Check if filters should be applied
  const shouldApplyFilters = useMemo(() => {
    const basePath = import.meta.env.VITE_BASE_PATH || '';
    const currentPath = window.location.pathname;
    const landingPath = basePath ? `${basePath}/landing` : '/landing';
    return (currentPath === landingPath || currentPath === `${landingPath}/`) && type !== 'trend' && filterOptions;
  }, [type, filterOptions]);

  // Handle filter menu close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 

  // Filter JSON array data based on selections
  const filteredJsonData = useMemo(() => {
    if (!jsonData || !selectedItems) return jsonData;

    return jsonData.filter((item) => {
      // Check all filter categories
      return Object.keys(selectedItems).every((category) => {
        // If this item doesn't have this property, don't filter it out
        if (!item[category]) return true;

        // Check if this value is selected
        return selectedItems[category][item[category]];
      });
    });
  }, [jsonData, selectedItems]);
  
  // Main chart effect
 // Main chart effect
 const finalChartConfig = useMemo(() => {
  try {
    // PATH 1: Handle JSON Array Data
    if (isJsonArray) {
      if (!filteredJsonData || !filteredJsonData.length) {
        return null; // Don't render a chart if there's no data
      }
      const finalGroupByKey = groupByKey || columns[0] || 'group';
      const finalCategoryKey = categoryKey || columns[1] || columns[0] || 'category';
      const finalValueKey = valueKey || columns.find((col) => jsonData.some((item) => !isNaN(parseFloat(item[col])))) || 'value';
      return transformArrayToBarChart(filteredJsonData, finalGroupByKey, finalValueKey, finalCategoryKey, visualTitle, [], personaId);
    }
    
    // PATH 2: Handle standard Chart.js Object/String Data
    else {
      if (!parsedData?.chartConfig) return null;

      const cleanJson = typeof dataPoints === 'string' ? dataPoints.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') : dataPoints;
      if (!cleanJson || (typeof cleanJson === 'object' && Object.keys(cleanJson).length === 0)) return null;

      let parsedConfig = typeof cleanJson === 'string' ? JSON.parse(cleanJson) : cleanJson;
      if (!parsedConfig || !parsedConfig.data) return null;

      parsedConfig = processFunctionStrings(parsedConfig);
      parsedConfig = enhanceChartData(parsedConfig, visualTitle);

      if (type === 'donut' || type === 'doughnut') {
        const datasets = parsedConfig.data.datasets.map((dataset) => ({
          ...dataset,
          rotation: dataset.rotation !== undefined ? dataset.rotation : isTrendChart ? 270 : 0,
          circumference: dataset.circumference !== undefined ? dataset.circumference : isTrendChart ? 180 : 360,
        }));
        return {
          type: 'doughnut',
          data: { ...parsedConfig.data, datasets },
          options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: { top: isTrendChart ? 0 : 10, right: 0, bottom: isTrendChart ? 0 : 10, left: 0 } },
            plugins: {
              legend: {
                display: !isTrendChart, position: 'bottom',
                labels: {
                  font: { size: 10, family: "'Inter', sans-serif" }, usePointStyle: true, boxWidth: 8, padding: 8,
                  generateLabels: (chart) => {
                    const data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                      return data.labels.map((label, i) => {
                        const dataset = data.datasets[0];
                        const backgroundColor = Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[i] : dataset.backgroundColor;
                        return { text: label, fillStyle: backgroundColor, strokeStyle: backgroundColor, lineWidth: 1, hidden: false, index: i };
                      });
                    }
                    return [];
                  },
                },
              },
              tooltip: {
                enabled: true, backgroundColor: 'white', titleColor: '#312e2d', bodyColor: '#666',
                borderColor: 'rgba(0, 0, 0, 0.1)', borderWidth: 1, padding: 8,
                titleFont: { size: 11, family: "'Inter', sans-serif" }, bodyFont: { size: 10, family: "'Inter', sans-serif" },
                titleAlign: 'left', bodyAlign: 'left', displayColors: true, boxWidth: 10, boxHeight: 10,
                callbacks: {
                  title: (context) => context[0].label || 'Value',
                  label: (context) => {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    let formattedValue = value.toLocaleString();
                    if (parsedConfig._dataContext?.isCurrency && value >= 1000) {
                      formattedValue = value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(1)}K`;
                    }
                    return `${percentage}% (${formattedValue})`;
                  },
                },
              },
            },
            radius: '92%',
            cutout: isTrendChart ? '70%' : parsedConfig.options?.cutout && parseInt(parsedConfig.options.cutout) > 80 ? '70%' : parsedConfig.options?.cutout || '50%',
          },
        };
      } else {
        const isBarChart = type === 'bar';
        const { labels, datasets } = parsedConfig.data;
        const filteredData = shouldApplyFilters ? (() => {
          const getFilteredIndices = () => {
            const dataType = detectDataType(labels, datasets);
            switch (dataType) {
              case 'date':
                switch (selectedFilter) {
                  case 'all': return { start: 0, end: labels.length };
                  case '12m': return { start: Math.max(0, labels.length - 12), end: labels.length };
                  case '6m': return { start: Math.max(0, labels.length - 6), end: labels.length };
                  case '3m': return { start: Math.max(0, labels.length - 3), end: labels.length };
                  case 'yoy':
                    const currentYearStart = Math.max(0, labels.length - 12);
                    return { indices: [...Array(Math.min(12, labels.length - currentYearStart)).keys()].map((i) => [i, i + currentYearStart]).flat().filter((i) => i < labels.length) };
                  default: return { start: 0, end: labels.length };
                }
              case 'category':
                switch (selectedFilter) {
                  case 'all': return { start: 0, end: labels.length };
                  case 'brand': return { indices: labels.map((label, idx) => ({ label, idx })).filter(item => item.label.includes('Brand')).map(item => item.idx) };
                  case 'competitors': return { indices: labels.map((label, idx) => ({ label, idx })).filter(item => item.label.includes('Competitor')).map(item => item.idx) };
                  case 'top3':
                    if (datasets.length > 0 && datasets[0].data) {
                      const valuesWithIndices = datasets[0].data.map((value, idx) => ({ value, idx })).sort((a, b) => b.value - a.value).slice(0, 3);
                      return { indices: valuesWithIndices.map(item => item.idx) };
                    }
                    return { start: 0, end: Math.min(3, labels.length) };
                  default: return { start: 0, end: labels.length };
                }
              case 'numeric':
                switch (selectedFilter) {
                  case 'all': return { start: 0, end: labels.length };
                  case 'positive': return { mask: datasets[0].data.map(value => value > 0) };
                  case 'negative': return { mask: datasets[0].data.map(value => value < 0) };
                  default: return { start: 0, end: labels.length };
                }
              default: return { start: 0, end: labels.length };
            }
          };
          const filter = getFilteredIndices();
          if (filter.indices) {
            return {
              labels: filter.indices.map(i => labels[i]),
              datasets: datasets.map(dataset => ({ ...dataset, data: filter.indices.map(i => dataset.data[i]) })),
            };
          } else if (filter.mask) {
            const validIndices = filter.mask.map((isValid, index) => (isValid ? index : -1)).filter(index => index !== -1);
            return {
              labels: validIndices.map(i => labels[i]),
              datasets: datasets.map(dataset => ({ ...dataset, data: validIndices.map(i => dataset.data[i]) })),
            };
          }
          return {
            labels: labels.slice(filter.start, filter.end),
            datasets: datasets.map(dataset => ({ ...dataset, data: dataset.data.slice(filter.start, filter.end) })),
          };
        })() : parsedConfig.data;
        const hasTitle = parsedConfig.options?.plugins?.title?.display && parsedConfig.options?.plugins?.title?.text;
        return {
          type: isBarChart ? 'bar' : 'line',
          data: {
            labels: filteredData.labels,
            datasets: filteredData.datasets.map(dataset => ({
              ...dataset,
              borderColor: type === 'trend' ? (isPositive !== null ? (isPositive ? '#2e7d32' : '#d32f2f') : '#f0ad4e') : dataset.borderColor,
              backgroundColor: type === 'trend' ? (isPositive !== null ? (isPositive ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)') : 'rgba(255, 193, 7, 0.1)') : dataset.backgroundColor,
              fill: dataset.fill ?? true, tension: type === 'trend' ? 0 : 0, borderWidth: dataset.borderWidth || 2,
              pointRadius: type === 'trend' ? 0 : dataset.pointRadius || 3, pointHoverRadius: type === 'trend' ? 3 : dataset.pointHoverRadius || 6,
              barThickness: isBarChart ? dataset.barThickness || 'flex' : undefined, maxBarThickness: isBarChart ? dataset.maxBarThickness || 32 : undefined,
            })),
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: isTrendChart ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: shouldApplyFilters ? (hasTitle ? 45 : 35) : hasTitle ? 25 : 10, right: 10, bottom: 10, left: 10 } },
            plugins: {
              legend: {
                display: !isTrendChart, position: 'bottom', align: 'center',
                labels: { font: { size: 11, family: "'Inter', sans-serif" }, usePointStyle: true, boxWidth: 10, padding: 10 },
              },
              tooltip: {
                enabled: true, mode: 'index', intersect: false, backgroundColor: 'white', titleColor: '#312e2d',
                bodyColor: '#666', borderColor: 'rgba(0, 0, 0, 0.1)', borderWidth: 1, padding: 8,
                titleFont: { size: 11, family: "'Inter', sans-serif" }, bodyFont: { size: 10, family: "'Inter', sans-serif" },
                titleAlign: 'left', bodyAlign: 'left', displayColors: true, boxWidth: 10, boxHeight: 10,
                callbacks: {
                  title: (tooltipItems) => { const title = tooltipItems[0].label || ''; return title.length > 20 ? title.substring(0, 18) + '...' : title; },
                  label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    let value = context.parsed.y;
                    if (value !== null && value !== undefined) {
                      if (parsedConfig._dataContext?.isCurrency) {
                        if (Math.abs(value) >= 1000000) value = `$${(value / 1000000).toFixed(1)}M`;
                        else if (Math.abs(value) >= 1000) value = `$${(value / 1000).toFixed(1)}K`;
                        else value = `$${value.toLocaleString()}`;
                      } else if (parsedConfig._dataContext?.isCycleTime) {
                        value = `${value} days`;
                      } else {
                        if (Math.abs(value) >= 1000000) value = `${(value / 1000000).toFixed(1)}M`;
                        else if (Math.abs(value) >= 1000) value = `${(value / 1000).toFixed(1)}K`;
                        else value = value.toLocaleString();
                      }
                      label += value;
                    }
                    return label;
                  },
                },
              },
              title: hasTitle && !isTrendChart ? {
                display: true, text: parsedConfig.options.plugins.title.text,
                font: { size: 12, family: "'Inter', sans-serif", weight: 'normal' },
                padding: { top: 10, bottom: 10 },
              } : undefined,
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  display: true, color: '#666666',
                  font: { size: isTrendChart ? 8 : 10, family: "'Inter', sans-serif" },
                  maxRotation: 45, maxTicksLimit: isTrendChart ? 4 : undefined,
                  callback: function(value) { return this.getLabelForValue(value); },
                },
                title: {
                  display: !isTrendChart && parsedConfig.options?.scales?.x?.title?.display,
                  text: parsedConfig.options?.scales?.x?.title?.text || '',
                  font: { size: 11, family: "'Inter', sans-serif" },
                },
              },
              y: {
                display: !isTrendChart, grid: { display: !isTrendChart },
                ticks: {
                  color: '#666666', font: { size: 10, family: "'Inter', sans-serif" },
                  callback: (value) => {
                    if (parsedConfig._dataContext?.isCurrency) {
                      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
                      return `$${value.toLocaleString()}`;
                    } else if (parsedConfig._dataContext?.isCycleTime) {
                      return `${value} days`;
                    } else {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toLocaleString();
                    }
                  },
                },
                title: {
                  display: !isTrendChart && parsedConfig.options?.scales?.y?.title?.display,
                  text: parsedConfig.options?.scales?.y?.title?.text || (parsedConfig._dataContext?.isCurrency ? 'Amount ($)' : parsedConfig._dataContext?.isCycleTime ? 'Days' : 'Value'),
                  font: { size: 11, family: "'Inter', sans-serif" },
                },
                suggestedMin: isTrendChart ? (() => {
                  const values = filteredData.datasets[0].data;
                  if (!values || !values.length) return 0;
                  const min = Math.min(...values.filter((v) => v !== null && v !== undefined));
                  return min > 1 ? min * 0.9 : min - 0.1;
                })() : undefined,
                suggestedMax: isTrendChart ? (() => {
                  const values = filteredData.datasets[0].data;
                  if (!values || !values.length) return 100;
                  const max = Math.max(...values.filter((v) => v !== null && v !== undefined));
                  return max * 1.1;
                })() : undefined,
              },
            },
          },
        };
      }
    }
  } catch (error) {
    console.error('Error creating final chart config:', error);
    return null;
  }

  
}, [
  dataPoints, type, isPositive, isTrendChart, selectedFilter, shouldApplyFilters,
  filterOptions, visualTitle, isJsonArray, jsonData, filteredJsonData,
  groupByKey, categoryKey, valueKey, personaId, parsedData, columns
]);

useEffect(() => {
  // Only run if the callback and ID are provided
  if (!onFilterChange || !visualId) {
    return;
  }

  let newTitle = visualTitle;

  // Case 1: JSON array data with GroupBy and advanced filters
  if (isJsonArray) {
    if (groupByKey) {
      const baseTitle = visualTitle.split(' by ')[0];
      // Example: "Claim Count" -> "Claim Count by Loss Type"
      newTitle = `${baseTitle} by ${formatColumnName(groupByKey)}`;
    }

    // Check if any advanced filters are active.
    const isFiltered = parsedData?.filterCategories && Object.keys(selectedItems).some(category => {
      const allItemsForCategory = parsedData.filterCategories[category] || [];
      const selectedForCategory = Object.keys(selectedItems[category] || {}).filter(key => selectedItems[category][key]);
      return selectedForCategory.length > 0 && selectedForCategory.length < allItemsForCategory.length;
    });

    if (isFiltered) {
      newTitle += ' (Filtered)';
    }
  }
  // Case 2: Standard Chart.js config with simple dropdown filter
  else if (shouldApplyFilters && filterOptions && selectedFilter !== 'all') {
    const filterText = filterOptions.find(f => f.value === selectedFilter)?.text;
    if (filterText) {
      // Example: "Loss Ratio Trends" -> "Loss Ratio Trends (Last 6M)"
      newTitle = `${visualTitle} (${filterText})`;
    }
  }

  // Call the parent's handler function with the new title
  onFilterChange(visualId, newTitle);

}, [
  visualTitle, 
  groupByKey, 
  selectedItems, 
  selectedFilter, 
  isJsonArray, 
  filterOptions, 
  onFilterChange, 
  visualId, 
  parsedData, 
  shouldApplyFilters
]);





  // Handle filter button click
  const handleFilterButtonClick = (e) => {
    e.stopPropagation();
    setShowFilterMenu(!showFilterMenu);
  };

  // Filter option selection handler
  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilterMenu(false);
  };

  // NEW: Handle JSON array-specific filtering
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };
  const handleGroupByChange = (event) => {
    setGroupByKey(event.target.value);
  };

  const toggleFilterItem = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category]
        ? {
            ...prev[category],
            [item]: !prev[category][item],
          }
        : { [item]: true },
    }));
  };

  const selectAllInCategory = (category, selected) => {
    if (!parsedData?.filterCategories?.[category]) return;

    const newValues = {};
    parsedData.filterCategories[category].forEach((item) => {
      newValues[item] = selected;
    });

    setSelectedItems((prev) => ({
      ...prev,
      [category]: newValues,
    }));
  };

  // Apply consistent container style for all chart types
  const containerStyle = useMemo(() => {
    return {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    };
  }, []);

  // Enhanced styles with better spacing, animations, and visual hierarchy
  const enhancedStyles = {
    // Standard filter button - more prominent and positioned on the left
    filterButton: {
      position: 'absolute',
      top: '2px',
      left: '35px', // Changed from right to left
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      padding: '4px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
      fontFamily: "'Inter', sans-serif",
      cursor: 'pointer',
      color: '#312e2d',
      zIndex: 5,
      // boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#f8f8f8',
      },
    },

    // Filter menu with improved styling and animation - positioned on the left
    filterMenu: {
      position: 'absolute',
      top: '38px',
      left: '10px',
      transform: 'translateX(50%)',
       // Changed from right to left
      width: '150px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      zIndex: 10,
      animation: 'fadeIn 0.2s ease-out',
      maxHeight: '300px',
      overflowY: 'auto',
    },

    // Individual filter items with better visual feedback
    filterItem: (isSelected) => ({
      padding: '10px 14px',
      fontSize: '12px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: isSelected ? 'rgba(247, 144, 29, 0.1)' : 'white',
      color: isSelected ? '#f7901d' : '#312e2d',
      borderLeft: isSelected ? '3px solid #f7901d' : '3px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: isSelected ? 'rgba(247, 144, 29, 0.15)' : '#f9f9f9',
      },
    }),

    // Advanced filter button - now positioned on the left with TuneIcon
    advancedFilterButton: {
      position: 'absolute',
      top: '10px',
      left: '10px', // Changed from right to left
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '500',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      zIndex: 10,
      // boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      color: filterPanelOpen ? '#f7901d' : '#312e2d',
      '&:hover': {
        backgroundColor: '#f8f8f8',
      },
    },

    // Side panel slides from left instead of right
    filterPanel: {
      width: '250px', // Fixed width side panel
      height: '100%',
      background: 'white',
      padding: '16px',
      paddingTop: '0px', // Space for title and close button
      borderRight: '1px solid #e0e0e0', // Changed from borderLeft
      position: 'absolute',
      top: 0,
      left: filterPanelOpen ? 0 : '-250px', // Slide in from left instead of right
      overflow: 'hidden',
      overflowY: 'auto',
      transition: 'left 0.3s ease-in-out', // Changed from right to left
      zIndex: 5,
      // boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)', // Changed shadow direction
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },

    // Chart wrapper adjusts margin-left instead of width
    chartWrapperAdjusted: {
      marginLeft: filterPanelOpen ? '250px' : '0', // Use margin instead of width
      width: filterPanelOpen ? 'calc(100% - 250px)' : '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
    },

    // Section headers for filter groups
    filterSectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '4px',
      borderBottom: '1px solid #f0f0f0',
    },

    // Button group for filter actions
    filterActionButtons: {
      display: 'flex',
      gap: '6px',
    },

    // Action button styling - improved appearance
    filterActionButton: {
      padding: '4px 8px',
      fontSize: '10px',
      background: '#f8f8f8',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#666',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },

    // Checkbox group with better spacing and aesthetics
    checkboxGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginLeft: '4px',
      maxHeight: '150px',
      overflowY: 'auto',
      padding: '6px',
      borderRadius: '6px',
      background: '#fafafa',
      // boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    },

    // Tab-style buttons for switching groupBy options
    groupByButton: (isActive) => ({
      textTransform: 'capitalize',
      minWidth: 0,
      fontSize: '11px',
      padding: '5px 10px',
      borderRadius: '4px',
      border: isActive ? '1px solid #f7901d' : '1px solid #e0e0e0',
      background: isActive ? 'rgba(247, 144, 29, 0.1)' : 'white',
      color: isActive ? '#f7901d' : '#666',
      fontWeight: isActive ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),

    // Group by button container
    groupByContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px',
    },

    // Title for filter panel
    filterPanelTitle: {
      fontSize: '14px',
      fontWeight: '600',
      // marginBottom: '12px',
      padding: '12px 0 12px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky', // Make sticky
      top: 0, // Stick to the top of the panel
      minHeight: '44px', // Ensures enough height for sticky
      borderBottom: '1px solid #f0f0f0', // Visual separation
      borderTop: '1px solid #f0f0f0', // Visual separation
      background: 'white',
      zIndex: 10000,
    },

    // Close button for filter panel
    closeButton: {
      cursor: 'pointer',
      color: '#666',
      fontSize: '18px',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: '#333',
      },
    },

    // NEW: Styles for filter-like Select components
    selectFilter: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '500',
        color: '#312e2d',
        backgroundColor: 'white',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#c0c0c0',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#f7901d',
          borderWidth: '1px',
        },
      },
      '& .MuiInputLabel-root': {
        fontSize: '12px',
        fontFamily: "'Inter', sans-serif",
        color: '#666',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#f7901d',
      },
    },

    menuItemStyle: {
      padding: '10px 14px',
      fontSize: '12px',
      fontFamily: "'Inter', sans-serif",
      color: '#312e2d',
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: '#f9f9f9',
      },
      '&.Mui-selected': {
        backgroundColor: 'rgba(247, 144, 29, 0.1)',
        color: '#f7901d',
        fontWeight: '600',
        '&:hover': {
          backgroundColor: 'rgba(247, 144, 29, 0.15)',
        },
      },
    },
  }; // Dynamically include ALL columns for grouping (dates, strings, etc.)
  
  const groupableColumns = useMemo(() => {
    if (!isJsonArray || !columns.length || !jsonData) return [];

    return columns.filter((c) => {
      const uniqueValues = [...new Set(jsonData.map((item) => item[c]))].filter(Boolean);
      // Include all columns that have reasonable number of unique values for grouping
      return uniqueValues.length > 0 && uniqueValues.length <= 100;
    });
  }, [isJsonArray, columns, jsonData]);

  const chartComponents = {
    bar: Bar,
    doughnut: Doughnut,
    line: Line,
    donut: Doughnut,
    trend: Line,
  };
  const ChartComponentToRender = chartComponents[type] || Bar;


  return (
    <div className={classes.chartContainer} ref={containerRef} style={containerStyle}>
      
      {/* JSON Array Data Advanced Filter Button with enhanced styling (Left side) */}
      {!filterPanelOpen && isJsonArray && parsedData?.filterCategories && (
        <div style={enhancedStyles.advancedFilterButton} onClick={toggleFilterPanel}>
          <TuneIcon style={{ fontSize: 10, padding: 0 }} />
        </div>
      )}

      {/* Standard filter button with enhanced styling (Left side) */}
      {shouldApplyFilters && filterOptions && (
        <>
          <div style={enhancedStyles.filterButton} onClick={handleFilterButtonClick}>
            <FilterListIcon style={{ fontSize: 16 }} />
            {filterOptions.find((f) => f.value === selectedFilter)?.text || 'Filter'}
            <span style={{ fontSize: '10px' }}>{showFilterMenu ? '▲' : '▼'}</span>
          </div>

          {showFilterMenu && (
            <div style={enhancedStyles.filterMenu} ref={filterMenuRef}>
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  style={enhancedStyles.filterItem(selectedFilter === option.value)}
                  onClick={() => handleFilterSelect(option.value)}>
                  {option.text}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Chart wrapper that adjusts with margin for left panel */}
      <div
        className={classes.chartWrapper}
        data-chart-type={type}
        data-is-trend={isTrendChart ? 'true' : 'false'}
        style={enhancedStyles.chartWrapperAdjusted}>
          {finalChartConfig ? (
          <ChartComponentToRender
            options={finalChartConfig.options}
            data={finalChartConfig.data}
          />
        ) : (
          <Typography variant="caption">No data to display</Typography>
        )}
         
      </div>
      <Dialog
        open={isFullscreen}
        onClose={handleFullscreenToggle}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            style: {
              height: '60vh',
              width: '95vw',
            },
          },
        }}
      >
        <DialogTitle>
          {visualTitle}
          <IconButton
            aria-label="close"
            onClick={handleFullscreenToggle}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
          {finalChartConfig && (
            <ChartComponentToRender
              options={{
                ...finalChartConfig.options,
                maintainAspectRatio: false, // Ensure it fills the dialog
              }}
              data={finalChartConfig.data}
            />
          )}
        </DialogContent>


      </Dialog>

      {/* Side panel filter UI (now on left side) */}
      {isJsonArray && parsedData?.filterCategories && (
        <Box style={enhancedStyles.filterPanel} sx={{ p: 0 }}>
          <div style={enhancedStyles.filterPanelTitle}>
            <span>Chart Filters</span>
            <span style={enhancedStyles.closeButton} onClick={toggleFilterPanel}>
              ×
            </span>
          </div>{' '}
          {/* Dynamic Group By Configuration */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography variant="caption" style={{ fontWeight: '600', fontSize: '12px' }}>
              Chart Configuration
            </Typography>
            {/* Group By Selector - Include ALL columns */}
            <FormControl fullWidth size="small" sx={enhancedStyles.selectFilter}>
              <InputLabel>Group By</InputLabel>
              <Select value={groupByKey} label="Group By" onChange={handleGroupByChange}>
                {groupableColumns.map((col) => (
                  <MenuItem key={col} value={col} sx={enhancedStyles.menuItemStyle}>
                    {formatColumnName(col)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Filter Categories with enhanced UI */}
          {Object.keys(parsedData.filterCategories).map((category) => (
            <Box key={category} sx={{ mb: 2 }}>
              <div style={enhancedStyles.filterSectionHeader}>
                <Typography
                  variant="caption"
                  style={{ fontWeight: '600', fontSize: '12px', textTransform: 'capitalize' }}>
                  {category.replace('_', ' ')}:
                </Typography>
                <div style={enhancedStyles.filterActionButtons}>
                  <button style={enhancedStyles.filterActionButton} onClick={() => selectAllInCategory(category, true)}>
                    All
                  </button>
                  <button
                    style={enhancedStyles.filterActionButton}
                    onClick={() => selectAllInCategory(category, false)}>
                    None
                  </button>
                </div>
              </div>

              {/* Display count of selected items */}
              <Typography
                variant="caption"
                style={{ fontSize: '10px', color: '#666', marginBottom: '6px', display: 'block' }}>
                {Object.values(selectedItems[category] || {}).filter(Boolean).length} of{' '}
                {parsedData.filterCategories[category].length} selected
              </Typography>

              <FormGroup style={enhancedStyles.checkboxGroup}>
                {parsedData.filterCategories[category].map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        size="small"
                        checked={!!selectedItems[category]?.[item]}
                        onChange={() => toggleFilterItem(category, item)}
                        sx={{
                          padding: '2px',
                          color: '#bdbdbd',
                          '&.Mui-checked': { color: '#f7901d' },
                        }}
                      />
                    }
                    label={
                      <Typography variant="caption" style={{ fontSize: '11px' }}>
                        {formatColumnName(item)}
                      </Typography>
                    }
                    style={{ margin: '0', minWidth: '110px' }}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
});

ChartComponent.propTypes = {
  dataPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]).isRequired,
  type: PropTypes.string.isRequired,
  isPositive: PropTypes.bool,
  visualTitle: PropTypes.string,
  personaId: PropTypes.number,
  visualId: PropTypes.string, // Add new prop
  onFilterChange: PropTypes.func, 
};

ChartComponent.defaultProps = {
  type: 'bar',
  isPositive: null,
  visualTitle: '',
  personaId: null,
  visualId: null, // Add default
  onFilterChange: null, // Add default
};

export default ChartComponent;