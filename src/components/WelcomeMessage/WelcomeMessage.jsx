import { useMemo, useState } from 'react'; // useMemo is no longer used, can be removed
import { Box, Typography, CircularProgress } from '@mui/material';
import WelcomeIcon from '../../assets/welcomeMessage/WelcomeIcon.png';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import classes from './WelcomeMessage.module.scss';
import { useGetRecommendedQuestionsQuery } from '../../services/recommendationApi';

const WelcomeMessage = ({ userName, previousQueries = [], onQuerySelect, personaId, screenType }) => {
  const [expandRMQueries, setExpandRMQueries] = useState(false);

  // Define a default list for the Top RM Queries section
  const topRmQueries = [
    'Tell me about our market strategy',
    'What are our key performance indicators?',
    'How can we improve customer satisfaction?',
    'What are the current industry trends?',
  ];
  // This useMemo and defaultQueries array were not being used in the JSX.
  // The 'suggestedQueries' from the API call has replaced this logic.
  // const defaultQueries = [ ... ];
  // const displayQueries = useMemo(() => { ... }, [previousQueries]);

  const {
    data: suggestedQueries = [],
    isLoading,
    isError,
  } = useGetRecommendedQuestionsQuery({ personaId, screenType }, { skip: !personaId || !screenType });

  return (
    <Box className={classes.welcomeMessage}>
      <div className={classes.welcomeHeader}>
        <div className={classes.iconWrapper}>
          <img src={WelcomeIcon} alt="Welcome" className={classes.chatIcon} />
        </div>
        <Typography variant="h5" className={classes.greeting}>
          Hey there, {userName}!
        </Typography>
        <Typography variant="body1" className={classes.subtext}>
          Type your queries below to get started
        </Typography>
      </div>

      <div className={`${classes.rmQueriesWrapper} ${expandRMQueries ? classes.expanded : ''}`}>
        <div className={classes.rmQueriesHeader} onClick={() => setExpandRMQueries((prev) => !prev)}>
          <Typography
            variant="subtitle2"
            className={`${classes.rmQueriesTitle} ${expandRMQueries ? classes.activeTitle : ''}`}
          >
            Top RM Queries
            {expandRMQueries ? (
              <ExpandMoreIcon className={classes.rmChevronIcon} />
            ) : (
              <ChevronRightIcon className={classes.rmChevronIcon} />
            )}
          </Typography>
        </div>

        {/* --- MODIFIED SECTION --- */}
        {/* Conditionally render the list of Top RM Queries */}
        {expandRMQueries && (
          <div className={classes.queriesList}> {/* Re-using queriesList style */}
            {topRmQueries.map((query, index) => (
              <div key={index} className={classes.queryItem} onClick={() => onQuerySelect(query)}>
                <Typography
                  variant="body2"
                  className={classes.queryText}
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {query}
                </Typography>
                <ChevronRightIcon className={classes.arrowIcon} />
              </div>
            ))}
          </div>
        )}
        {/* --- END MODIFIED SECTION --- */}

      </div>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!isLoading && !isError && suggestedQueries.length > 0 && (
        <div className={classes.queriesSection}>
          <Typography variant="subtitle2" className={classes.queriesTitle}>
            Quick Start
          </Typography>
          <div className={classes.queriesList}>
            {suggestedQueries.map((query, index) => (
              <div key={index} className={classes.queryItem} onClick={() => onQuerySelect(query)}>
                <Typography
                  variant="body2"
                  className={classes.queryText}
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {query}
                </Typography>
                <ChevronRightIcon className={classes.arrowIcon} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <Typography color="error" sx={{ mt: 1 }}>
          Failed to load suggestions
        </Typography>
      )}
    </Box>
  );
};

WelcomeMessage.propTypes = {
  userName: PropTypes.string.isRequired,
  previousQueries: PropTypes.arrayOf(PropTypes.string),
  onQuerySelect: PropTypes.func.isRequired,
  personaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  screenType: PropTypes.string,
};

export default WelcomeMessage;