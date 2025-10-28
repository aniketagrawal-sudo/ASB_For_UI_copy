import { useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import WelcomeIcon from '../../assets/welcomeMessage/WelcomeIcon.png';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PropTypes from 'prop-types';
import classes from './WelcomeMessage.module.scss';
import { useGetRecommendedQuestionsQuery } from '../../services/recommendationApi';

const WelcomeMessage = ({
  userName,
  previousQueries = [],
  onQuerySelect,
  personaId,
  screenType,
}) => {
  // Default queries to show if previous queries are empty
  const defaultQueries = [
    'Tell me about our market strategy',
    'What are our key performance indicators?',
    'How can we improve customer satisfaction?',
    'What are the current industry trends?',
  ];

  // ✅ Show only 2 previous queries, fallback to defaults if needed
  const displayQueries = useMemo(() => {
    return [...previousQueries]
      .slice(0, 2)
      .concat(defaultQueries.slice(previousQueries.length))
      .slice(0, 2);
  }, [previousQueries]);

  // ✅ Fetch suggested questions via RTK Query
  const {
    data: suggestedQueries = [],
    isLoading,
    isError,
  } = useGetRecommendedQuestionsQuery(
    { personaId, screenType },
    { skip: !personaId || !screenType } // skip if props are missing
  );

  return (
    <Box className={classes.welcomeMessage}>
      {/* Header */}
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

      {/* Previous Queries Section */}
      {/* {displayQueries.length > 0 && (
        <div className={classes.queriesSection}>
          <Typography variant="subtitle2" className={classes.queriesTitle}>
            Previous Queries
          </Typography>
          <div className={classes.queriesList}>
            {displayQueries.map((query, index) => (
              <div
                key={index}
                className={classes.queryItem}
                onClick={() => onQuerySelect(query)}
              >
                <Typography variant="body2" className={classes.queryText}>
                  {query}
                </Typography>
                <ChevronRightIcon className={classes.arrowIcon} />
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Suggested Questions Section */}
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
              <div
                key={index}
                className={classes.queryItem}
                onClick={() => onQuerySelect(query)}
              >
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

      {/* Error State */}
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