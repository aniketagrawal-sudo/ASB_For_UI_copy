import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, CircularProgress, Button, Divider, IconButton, Alert } from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ThreadsDashboard.module.scss';
import {
  selectSavedThreads,
  selectActiveThreadId,
  selectThreadDetails,
  selectThreadsError,
  setActiveThread,
  clearThreadError,
} from '../../redux/store/threadsSlice';
import { selectUser } from '../../features/auth/authSlice';
import {
  useGetUserThreadsQuery,
  useLazyGetWorkflowStepsQuery,
  useRerunThreadMutation,
  useDeleteThreadMutation,
} from '../../services/threadApi';
import MessageBubble from '../MessageBubble/MessageBubble';

/**
 * SavedThreadsPanel component for displaying and interacting with saved threads.
 * Implements filtering by client/persona and proper right pane organization.
 */
const SavedThreadsPanel = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const userId = String(currentUser?.userId);

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

  // Add delete mutation
  const [deleteThread] = useDeleteThreadMutation();

  // State
  const [selectedThread, setSelectedThread] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Redux state
  const savedThreads = useSelector(selectSavedThreads);
  const threadsError = useSelector(selectThreadsError);
  const activeThreadId = useSelector(selectActiveThreadId);
  const rerunningThreads = useSelector((state) => state.threads.rerunningThreads || {});

  // Filter threads based on client and persona
  const filteredThreads = useMemo(() => {
    if (!savedThreads?.length) return [];

    // If client or persona IDs are not available, show all threads
    if (!currentClientId || !currentPersonaId) return savedThreads;

    return savedThreads.filter((thread) => {
      const threadMetadata = thread.metadata || {};
      return threadMetadata.industry == currentClientId && threadMetadata.persona == currentPersonaId;
    });
  }, [savedThreads, currentClientId, currentPersonaId]);

  // Get selected thread data from Redux store
  const selectedThreadData = useSelector((state) =>
    activeThreadId ? selectThreadDetails(state, activeThreadId) : null,
  );
  // API hooks
  const {
    refetch: refetchThreads,
  } = useGetUserThreadsQuery(undefined, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });
  const [getWorkflowSteps, { isFetching: isFetchingThreadDetails }] = useLazyGetWorkflowStepsQuery();
  const [rerunThread] = useRerunThreadMutation();

  // FIXED: Wrap handleDeleteThread in useCallback with proper dependencies
  const handleDeleteThread = useCallback(
    async (thread) => {
      if (!thread) return;

      try {
        await deleteThread({
          workflowId: thread.workflow_id,
          userId,
          clientId: currentClientId,
          personaId: currentPersonaId,
        }).unwrap();

        // If the deleted thread was selected, clear selection
        if (activeThreadId === thread.workflow_id) {
          dispatch(setActiveThread(null));
          setSelectedThread(null);
        }

        // FIXED: Trigger refetch to update the threads list
        await refetchThreads();
      } catch (error) {
        console.error('Failed to delete thread:', error);
      }
    },
    [deleteThread, userId, currentClientId, currentPersonaId, activeThreadId, dispatch, refetchThreads],
  );

  // Fetch saved threads on component mount
  useEffect(() => {
    dispatch(setActiveThread(null));
    dispatch(clearThreadError());
    setLocalLoading(true);

    refetchThreads()
      .then(() => {
        setInitialLoadComplete(true);
        setHasAttemptedLoad(true);
        setLocalLoading(false);
      })
      .catch(() => {
        setHasAttemptedLoad(true);
        setLocalLoading(false);
      });

    return () => {
      dispatch(setActiveThread(null));
    };
  }, [dispatch, refetchThreads]);

  // Auto-select and load first thread when threads are loaded
  useEffect(() => {
    if (filteredThreads.length > 0 && initialLoadComplete && !activeThreadId) {
      const firstThread = filteredThreads[0];
      handleThreadSelect(firstThread);
    }
  }, [filteredThreads, initialLoadComplete, activeThreadId]);

  // Check if thread data is available in store before calling rerun API
  const hasStoredThreadData = useCallback(
    (threadId) => {
      const threadInStore = savedThreads.find((t) => t.workflow_id === threadId);

      // Check if we have stored results in any of the priority locations
      const hasResults =
        (threadInStore?.results && Array.isArray(threadInStore.results) && threadInStore.results.length > 0) ||
        (threadInStore?.metadata?.lastRunResults &&
          Array.isArray(threadInStore.metadata.lastRunResults) &&
          threadInStore.metadata.lastRunResults.length > 0) ||
        (selectedThreadData?.results &&
          Array.isArray(selectedThreadData.results) &&
          selectedThreadData.results.length > 0) ||
        (selectedThreadData?.metadata?.lastRunResults &&
          Array.isArray(selectedThreadData.metadata.lastRunResults) &&
          selectedThreadData.metadata.lastRunResults.length > 0);

      return hasResults;
    },
    [savedThreads, selectedThreadData],
  );

  
  const handleThreadSelect = useCallback(
    async (thread) => {
      setSelectedThread(thread);
      dispatch(setActiveThread(thread.workflow_id));

      try {
        // Always fetch workflow steps first
        await getWorkflowSteps(thread.workflow_id);

      
      } catch (error) {
        console.error('Error loading thread:', error);
      }
    },
    [dispatch, getWorkflowSteps, hasStoredThreadData],
  );

  // Handle thread rerun
  const handleRerunThread = useCallback(
    async (thread) => {
      if (!thread || !thread.workflow_id) return;

      try {
        await rerunThread({
          workflowId: thread.workflow_id,
          userId,
        }).unwrap();
      } catch (error) {
        console.error('Failed to rerun thread:', error);
      }
    },
    [rerunThread, userId],
  );

  // Check if a thread is currently rerunning
  const isThreadRerunning = useCallback(
    (threadId) => {
      return Boolean(rerunningThreads[threadId]);
    },
    [rerunningThreads],
  );

  // Get workflow steps from the selected thread data
  // const getWorkflowStepsData = useCallback(() => {
  //   if (!selectedThreadData || !selectedThreadData.workflow_steps) {
  //     return [];
  //   }
  //   return selectedThreadData.workflow_steps;
  // }, [selectedThreadData]);
  const getWorkflowStepsData = useCallback(() => {
    if (!selectedThreadData || !selectedThreadData.workflow_steps) {
      return [];
    }
  
    // If it's already an array, return as is
    if (Array.isArray(selectedThreadData.workflow_steps)) {
      return selectedThreadData.workflow_steps;
    }
  
    // If it's an object, convert to array
    return Object.values(selectedThreadData.workflow_steps);
  }, [selectedThreadData]);
  

  // Get latest results from various sources - prioritized
  const getLatestResults = useCallback(() => {
    if (!activeThreadId || !selectedThreadData) {
      return [];
    }

    // PRIORITY 1: Check for latest results from rerun (highest priority)
    if (
      selectedThreadData.results &&
      Array.isArray(selectedThreadData.results) &&
      selectedThreadData.results.length > 0
    ) {
      return selectedThreadData.results;
    }

    // PRIORITY 2: Check for lastRunResults in metadata
    if (
      selectedThreadData.metadata?.lastRunResults &&
      Array.isArray(selectedThreadData.metadata.lastRunResults) &&
      selectedThreadData.metadata.lastRunResults.length > 0
    ) {
      return selectedThreadData.metadata.lastRunResults;
    }

    // PRIORITY 3: Check in savedThreads for the active thread's lastRunResults
    const threadInStore = savedThreads.find((t) => t.workflow_id === activeThreadId);
    if (
      threadInStore?.metadata?.lastRunResults &&
      Array.isArray(threadInStore.metadata.lastRunResults) &&
      threadInStore.metadata.lastRunResults.length > 0
    ) {
      return threadInStore.metadata.lastRunResults;
    }

    return [];
  }, [activeThreadId, selectedThreadData, savedThreads]);

  // FIXED: Render thread list item with stable handleDeleteThread reference
  const renderThreadItem = useCallback(
    (thread) => {
      const isSelected = activeThreadId === thread.workflow_id;
      const isRerunning = isThreadRerunning(thread.workflow_id);

      return (
        <div
          key={thread.workflow_id}
          className={`${classes.threadItem} ${isSelected ? classes.selected : ''}`}
          onClick={() => handleThreadSelect(thread)}>
          {/* Thread Icon - exactly like sidebar chatIcon */}
          <div className={classes.threadIcon}>
            <DescriptionIcon />
          </div>

          {/* Thread Text - exactly like sidebar chatText */}
          <div className={classes.threadText}>
            <span>{thread.workflow_name || 'Untitled Thread'}</span>
            <p>{new Date(thread.timestamp).toLocaleDateString()}</p>
          </div>

          {/* Delete Button - exactly like sidebar deleteButton - NO MORE MENU */}
          <IconButton
            className={classes.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteThread(thread);
            }}
            size="small"
            disabled={isRerunning}>
            <DeleteIcon />
          </IconButton>

          {/* Rerunning indicator */}
          {isRerunning && <CircularProgress size={16} className={classes.clockIcon} />}
        </div>
      );
    },
    [handleThreadSelect, isThreadRerunning, activeThreadId, handleDeleteThread], // Now handleDeleteThread is stable
  );

  // Render thread details with proper organization like the old code
  const renderThreadDetails = () => {
    if (!selectedThread || !activeThreadId) {
      return (
        <Box className={classes.noSelection}>
          <Typography>Select a thread to view details</Typography>
        </Box>
      );
    }

    if (isFetchingThreadDetails || !selectedThreadData) {
      return (
        <Box className={classes.loadingContainer}>
          <CircularProgress size={40} className={classes.spinner} />
          <Typography className={classes.loadingText}>Loading thread details...</Typography>
        </Box>
      );
    }

    const isRerunning = isThreadRerunning(selectedThread.workflow_id);
    const workflowSteps = getWorkflowStepsData();
    
    const results = getLatestResults();

    const formattedDate = new Date(selectedThreadData?.timestamp||selectedThreadData?.workflow_steps.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <>
        <Box className={classes.rightPaneHeader}>
          <div className={classes.threadHeaderInfo}>
            <>
              <Typography variant="h6" className={classes.threadTitle}>
                {selectedThreadData?.workflow_name||selectedThreadData?.workflow_steps.workflow_name}
              </Typography>
              <Typography variant="body2" className={classes.threadDate}>
                {formattedDate}
              </Typography>
            </>
           
          </div>

          <Button
            variant="contained"
            startIcon={isRerunning ? <AccessTimeIcon /> : <RestartAltIcon />}
            className={classes.rerunButton}
            onClick={() => handleRerunThread(selectedThread)}
            disabled={isRerunning}
            data-testid="rerun-thread-button">
            {isRerunning ? 'Running...' : 'Re-run'}
          </Button>
        </Box>

        <Divider className={classes.divider} />

        {/* SCROLLABLE CONTENT - Only this part gets blurred */}
        <Box className={classes.rightPaneContent}>
          {/* Blur overlay - only covers the content area */}
          {isRerunning && (
            <Box className={classes.rerunningOverlay}>
              <CircularProgress size={48} className={classes.spinner} />
              <Typography className={classes.progressText}>Re-processing thread...</Typography>
            </Box>
          )}

          {/* Main content */}
          <Box className={classes.contentBody}>
            {results.length > 0 && (
              <Box className={classes.resultsContainer}>
                {results.map((result, idx) => {
                  // Check if result has the expected structure
                  // if (!result.success || !result.result) {
                  //   return null;
                  // }

                  // Extract result data
                  const resultData = result;
                  console.log("393",results)
                  const matchingStep = workflowSteps[idx] || null;
                  

                  return (
                    
                    <Box key={`result-${idx}`} className={classes.resultItem} mb={2}>
                      {/* Show the original question if we have it */}
                      {resultData.query  && (
                        <MessageBubble
                          message={resultData.query}
                          isUser={true}
                          metadata={{}}
                          id={`user-result-${activeThreadId}-${idx}`}
                          created_at={new Date().toISOString()}
                          previousMessage={null}
                        />
                      )}

                      {/* Show the latest result */}
                      <MessageBubble
                        message={{
    
                          insight: resultData.insight || 'Results processed successfully',
                          visualization: resultData.visualization || null,
                          table: resultData.table || null,
                        }}
                        isUser={false}
                        metadata={{
                          query:resultData.query,
                          sql_query: resultData.sql_query,
                          chart_type: resultData.chart_type,
                          variables: resultData.variables,
                          data_source: resultData.data_source,
                          query_type: resultData.query_type,
                        }}
                       
                        id={`ai-result-${activeThreadId}-${idx}`}
                        created_at={new Date().toISOString()}
                        previousMessage={
                          resultData.query
                            ? {
                                id: `user-result-${activeThreadId}-${idx}`,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                              }
                            : null
                        }
                      />
                      
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Show message if no data available */}
            {workflowSteps.length === 0 && results.length === 0 && (
              <Box className={classes.noDataContainer}>
                <Typography variant="body1" color="textSecondary">
                  No conversation data available for this thread.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </>
    );
  };

  // Choose which threads array to display - show filtered threads only
  const threadsToDisplay = filteredThreads;

  // Show loading spinner during initial data fetch
  if (localLoading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading saved threads...
        </Typography>
      </Box>
    );
  }

  if (savedThreads.length === 0 && initialLoadComplete) {
    return (
      <Box className={classes.noThreadsContainer}>
        <Typography variant="body1" color="textSecondary">
          You haven&apos;t saved any threads yet.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          To save a thread, select messages in a conversation and click &quot;Save&quot;.
        </Typography>
      </Box>
    );
  }

  if (threadsError && hasAttemptedLoad) {
    return (
      <Box className={classes.errorContainer}>
        <Alert severity="error">{threadsError}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => {
            dispatch(clearThreadError());
            setLocalLoading(true);
            refetchThreads().finally(() => setLocalLoading(false));
          }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className={classes.content}>
      <Box className={classes.leftPane}>
        {threadsToDisplay.length > 0 ? (
          threadsToDisplay.map(renderThreadItem)
        ) : (
          <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
            No threads available for the current selection.
          </Typography>
        )}
      </Box>
      <Box className={classes.rightPane}>{renderThreadDetails()}</Box>
    </Box>
  );
};

export default SavedThreadsPanel;
