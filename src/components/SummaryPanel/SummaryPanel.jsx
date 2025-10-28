import { Typography, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useSelector } from 'react-redux';
import { selectHomeSummary } from '../../redux/store/dashboardSlice';
import PropTypes from 'prop-types';
import classes from './SummaryPanel.module.scss';

const getIconForSummary = (title) => {
  const icons = {
    trend: <ShowChartIcon className={classes.icon} />,
    share: <PieChartIcon className={classes.icon} />,
    increase: <TrendingUpIcon className={classes.positiveIcon} />,
    decrease: <TrendingDownIcon className={classes.negativeIcon} />,
    default: <InsightsIcon className={classes.icon} />,
  };

  if (!title) return icons.default;

  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes('trend')) return icons.trend;
  if (lowercaseTitle.includes('share')) return icons.share;
  if (lowercaseTitle.includes('increase') || lowercaseTitle.includes('growth')) return icons.increase;
  if (lowercaseTitle.includes('decrease') || lowercaseTitle.includes('decline')) return icons.decrease;
  return icons.default;
};

const SummaryPanel = ({ open, onClose }) => {
  const summaryRawData = useSelector(selectHomeSummary);
  const summaryData = summaryRawData?.[0]?.home_exec_summary
    ? JSON.parse(summaryRawData[0].home_exec_summary)
    : [];

  const getTitleFromItem = (item) => item?.title || item?.visual_title || 'Untitled';
  const getSummaryFromItem = (item) => item?.summary || item?.visual_summary || 'No summary available';

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.overlay} ${open ? classes.visible : ''}`}
          onClick={onClose}
        />
      </Fade>
      <div
        className={`${classes.panel} ${open ? classes.open : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.tag}>
          <IconButton onClick={onClose} className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.content}>
          <div className={classes.header}>
            <Typography variant="h6" className={classes.title}>
              Summary
            </Typography>
          </div>

          <div className={classes.summaryContent}>
            {summaryData?.map((item, index) => (
              <div
                key={index}
                className={classes.summaryCard}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className={classes.cardHeader}>
                  <div className={classes.iconWrapper}>
                    {getIconForSummary(getTitleFromItem(item))}
                  </div>
                  <Typography variant="subtitle1" className={classes.cardTitle}>
                    {getTitleFromItem(item)}
                  </Typography>
                </div>
                <div className={classes.cardContent}>
                  <Typography variant="body2" className={classes.cardSummary}>
                    {getSummaryFromItem(item)}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

SummaryPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SummaryPanel;
