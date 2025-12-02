import PropTypes from "prop-types";
import classes from './KpiRepositoryList.module.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSelector } from "react-redux";
import { selectAdminUsageStatsKPIList } from "../../redux/store/adminSlice";

const UsageStatsKpiList = () => {
  const kpiData = useSelector(selectAdminUsageStatsKPIList);
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

export default UsageStatsKpiList;

