import React, { useState, useMemo } from 'react';
import { Box, Tab, Tabs, Badge, Typography } from '@mui/material';
import QueueingPanel from './QueueingPanel';
import SavedThreadsPanel from './SavedThreadsPanel';
import classes from './ThreadsDashboard.module.scss';
import { useSelector } from 'react-redux';
import { selectSavedThreads } from '../../redux/store/threadsSlice';
import { selectQueuedMessages, selectRunningMessages } from '../../redux/store/queueSlice';
import { selectUser } from '../../features/auth/authSlice';

// Configuration constants
const THREAD_POLL_INTERVAL = 10000; // 10 seconds between polls
const MAX_POLL_RETRIES = 60; // 1 minute max polling time

const ThreadsDashboard = () => {
  // Get user data from Redux
  const currentUser = useSelector(selectUser);
  const savedThreads = useSelector(selectSavedThreads);
  const queuedMessages = useSelector(selectQueuedMessages);
  const runningMessages = useSelector(selectRunningMessages);

  // Get current client and persona IDs
  const currentClientId = useMemo(() => {
    if (!currentUser?.industries || !currentUser.selectedIndustry) return null;
    const industry = currentUser.industries.find((ind) => ind.name === currentUser.selectedIndustry);
    return industry?.id || null;
  }, [currentUser]);

  const currentPersonaId = useMemo(() => {
    if (!currentUser?.industries || !currentUser.selectedIndustry || !currentUser.selectedRole) return null;
    const persona = currentUser.industries
      .find((ind) => ind.name === currentUser.selectedIndustry)
      ?.personas.find((p) => p.name === currentUser.selectedRole);
    return persona?.id || null;
  }, [currentUser]);

  // Filter threads based on client and persona
  const filteredThreadsCount = useMemo(() => {
    if (!savedThreads?.length) return 0;

    if (!currentClientId || !currentPersonaId) return savedThreads.length;

    const filtered = savedThreads.filter((thread) => {
      const threadMetadata = thread.metadata || {};
      return threadMetadata.industry == currentClientId && threadMetadata.persona == currentPersonaId;
    });

    return filtered.length;
  }, [savedThreads, currentClientId, currentPersonaId]);

  // Local state
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0 = Saved Threads, 1 = Queuing

  // Calculate total message count for queueing tab
  const totalQueueCount = React.useMemo(() => {
    // Count all unique message IDs from both queued and running messages
    const uniqueIds = new Set();

    // Add messages from queued state
    if (queuedMessages) {
      Object.values(queuedMessages).forEach((ids) => {
        if (Array.isArray(ids)) {
          ids.forEach((id) => id && uniqueIds.add(id));
        }
      });
    }

    // Add messages from running state
    if (runningMessages) {
      Object.values(runningMessages).forEach((ids) => {
        if (Array.isArray(ids)) {
          ids.forEach((id) => id && uniqueIds.add(id));
        }
      });
    }

    return uniqueIds.size;
  }, [queuedMessages, runningMessages]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };

  return (
    <Box className={classes.container}>
      {/* IMPROVED: Enhanced header similar to InsightsDashboard */}
      <Box className={classes.header}>
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          className={classes.tabs}
          TabIndicatorProps={{
            className: classes.tabIndicator,
          }}>
          <Tab
            className={classes.tab}
            label={
              <Box className={classes.tabLabelContainer}>
                <Typography className={classes.tabText}>Saved Threads</Typography>
                {filteredThreadsCount > 0 && <Badge badgeContent={filteredThreadsCount} className={classes.badge} />}
              </Box>
            }
            data-testid="saved-threads-tab"
          />
          <Tab
            className={classes.tab}
            label={
              <Box className={classes.tabLabelContainer}>
                <Typography className={classes.tabText}>Queuing</Typography>
                {totalQueueCount > 0 && <Badge badgeContent={totalQueueCount} className={classes.badge} />}
              </Box>
            }
            data-testid="queuing-tab"
          />
        </Tabs>
      </Box>

      {/* Content area */}
      <Box className={classes.contentArea}>
        {activeTabIndex === 0 ? (
          <SavedThreadsPanel />
        ) : (
          <QueueingPanel pollInterval={THREAD_POLL_INTERVAL} maxRetries={MAX_POLL_RETRIES} />
        )}
      </Box>
    </Box>
  );
};

export default ThreadsDashboard;
