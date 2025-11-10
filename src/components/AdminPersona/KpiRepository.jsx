
import classes from './KpiRepository.module.scss';
import KpiRepositoryLists from './KpiRepositoryLists';
import KpiRepositoryTable from './KpiRepositoryTable';

const KpiRepository = () => {
  return (
    <div className={classes.kpiMainContainer}>
        <KpiRepositoryLists />
        <KpiRepositoryTable />
    </div>
  )
}

export default KpiRepository