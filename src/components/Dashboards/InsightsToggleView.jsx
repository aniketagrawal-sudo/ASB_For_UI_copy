import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import PropTypes from 'prop-types';
import styles from './InsightsToggleView.module.scss';

const InsightsToggleView = ({ activeView, onChange }) => {
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      onChange(newView);
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <ToggleButtonGroup
        value={activeView}
        exclusive
        onChange={handleViewChange}
        size="small"
        aria-label="data view toggle"
        className={styles.viewToggle}>
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
    </div>
  );
};

InsightsToggleView.propTypes = {
  activeView: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InsightsToggleView;
