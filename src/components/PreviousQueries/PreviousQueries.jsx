import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import classes from './PreviousQueries.module.scss';
import { getArchivedConversation } from '../../redux/store/conversationSlice';

const PreviousQueries = ({ onSelectQuery }) => {
  // Access the archived data from Redux store
  const archivedData = useSelector(getArchivedConversation);

  // Get the latest 4 conversations
  const latestConversations = useMemo(() => {
    if (!archivedData || Object.keys(archivedData).length === 0) return [];

    try {
      // Combine conversations from all categories
      const allConversations = [
        ...(archivedData['This Week'] || []),
        ...(archivedData['Last Week'] || []),
        ...(archivedData['Previous'] || []),
      ];

      // Exit early if no conversations
      if (allConversations.length === 0) {
        return [];
      }

      // Create a new array to avoid mutating the original
      return (
        [...allConversations]
          // Sort by created_at timestamp, newest first
          .sort((a, b) => {
            // Extract timestamps, with fallbacks
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

            // Sort newest first (descending order)
            return timeB - timeA;
          })
          // Take only the 4 most recent
          .slice(0, 4)
          .map((conv) => {
            // Extract question from title
            let fullQuestion = conv.title || 'Untitled Conversation';

            // Remove ellipsis if present
            if (fullQuestion.endsWith('...')) {
              if (fullQuestion.startsWith("How does Brand's market share")) {
                fullQuestion = "How does Brand's market share compare to its competitors?";
              } else {
                fullQuestion = fullQuestion.replace(/\.\.\.$/, '');
              }
            }

            return {
              Question: fullQuestion,
              id: conv.id,
              timestamp: String(conv.created_at || ''),
            };
          })
      );
    } catch (error) {
      console.error('Error processing archived data:', error);
      return [];
    }
  }, [archivedData]);

  // Fall back to dummy data if no conversations are available
  const queries =
    latestConversations.length > 0
      ? latestConversations
      : [
          { Question: "How does Brand's market share compare to its competitors?" },
          { Question: "How does Brand's advocacy score compare to competitors?" },
          { Question: 'How is the pricing landscape for my brand compared to the competitor?' },
          { Question: "How did Brand's Real Internal Growth (RIG) change from 2023 to 2024?" },
        ];

  return (
    <div className={classes.previousQueriesContainer}>
      <div className={classes.titleContainer}>
        <Typography variant="h6" className={classes.previousQueriesTitle}>
          Previous Queries
        </Typography>
      </div>

      <div className={classes.queriesGrid}>
        {queries.map((query, index) => (
          <div key={index} className={classes.queryItem} onClick={() => onSelectQuery(query.Question)}>
            <p className={classes.queryText}>{query.Question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

PreviousQueries.propTypes = {
  onSelectQuery: PropTypes.func.isRequired,
};

export default PreviousQueries;
