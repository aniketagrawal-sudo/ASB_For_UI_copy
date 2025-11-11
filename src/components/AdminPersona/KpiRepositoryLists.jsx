import PropTypes from "prop-types";
import classes from './KpiRepositoryList.module.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const KpiRepositoryLists = () => {
  const kpiData = [
    {
      title: "Total KPI",
      value: 25,
      changeText: "3 more than Previous Month",
      isPositive: true,
    },
    {
      title: "Assigned KPIs",
      value: 19,
      changeText: "3 more than Previous Month",
      isPositive: true,
    },
    {
      title: "Unassigned KPIs",
      value: 6,
      changeText: "2 less than Previous Month",
      isPositive: false,
    },
    {
      title: "Categories",
      value: 3,
      changeText: "No New Categories since March",
      isPositive: false,
    },
  ];

  // Inner component for KPI Card
  const KPICard = ({ title, value, changeText, isPositive }) => {
    return (
      <div className={classes["kpi-card"]}>
        <h3 className={classes["kpi-title"]}>{title}</h3>
        <p className={classes["kpi-value"]}>{value}</p>
        <p
          className={`${classes["kpi-change"]} ${
            isPositive ? classes["positive"] : classes["negative"]
          }`}
        >
         {isPositive ? <ArrowUpwardIcon sx={{fontSize: '12px'}} /> : <ArrowDownwardIcon sx={{fontSize: '12px'}}/>}
          <span className={classes["kpi-change-text"]}>({changeText})</span>
        </p>
      </div>
    );
  };

  KPICard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.string.isRequired,
    changeText: PropTypes.string.isRequired,
    isPositive: PropTypes.bool.isRequired,
  };

  return (
    <main className={classes["kpi-list"]}>
      <div className={classes["kpi-grid"]}>
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </main>
  );
};

export default KpiRepositoryLists;

