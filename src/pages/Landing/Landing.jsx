import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser, setCurrentPage } from '../../features/auth/authSlice';
import {
  setLoading,
  setReportsCount,
  selectQueryResults,
  selectHomeDashboardLoading,
  selectInsightsDashboardLoading,
  resetQueryExecutionState,
  setInsightQueryResult,
} from '../../redux/store/dashboardSlice';
import SidePanel from './Components/SidePanel';
import MainPanel from './Components/MainPanel';
import {
  useGetHomeScreenDataQuery,
  useGetHomeSummaryQuery,
  useGetInsightsScreenDataQuery,
  useGetInsightDetailsQuery,
  useExecuteInsightQueryMutation,
} from '../../services/dashboardApi';
import classes from './Landing.module.scss';
import { preloadMicroStrategyLibrary } from '../../utils/microStrategyLoader';
import { getAvailableDashboardCount } from '../../config/clientDashboardMapping';

const POLLING_INTERVAL = 30000;
const MAX_POLL_COUNT = 10;
const QUERY_EXECUTION_CONFIG = {
  // Parallel execution settings with 3-second staggered starts
  DELAY_BETWEEN_CALLS: 3000, // 3 seconds between starting each query (not waiting for completion)

  // Timeout settings
  QUERY_TIMEOUT: 600000, // 60 seconds timeout per query
  MAX_RETRIES: 2, // Maximum retry attempts for failed queries
};

function Landing() {
  const dispatch = useDispatch();
  const userFromState = useSelector(selectUser);

  // State and Refs
  const pollingTimeoutRef = useRef(null);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollCountRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  // Dashboard readiness states
  const [homeDashboardReady, setHomeDashboardReady] = useState(false);
  const [insightsDashboardReady, setInsightsDashboardReady] = useState(false);
  const [executingQueries, setExecutingQueries] = useState(false);
  const [currentProcessingInsight, setCurrentProcessingInsight] = useState(null);

  // CRITICAL: Refs to prevent duplicate executions
  const queryExecutionInProgress = useRef(false);
  const processedInsights = useRef(new Set());
  const lastExecutionTime = useRef(0);

  // Add mutation for insight query execution
  const [executeInsightQuery] = useExecuteInsightQueryMutation();

  // Get Redux query results state
  const queryResults = useSelector(selectQueryResults);

  // Use separate loading states for home and insights
  const homeLoading = useSelector(selectHomeDashboardLoading);
  const insightsLoading = useSelector(selectInsightsDashboardLoading);

  // Get persona and client IDs
  const personaId = userFromState?.industries
    ?.flatMap((industry) => industry.personas.find((p) => p.name === userFromState.selectedRole))
    .find((p) => p)?.id;

  const clientId = useMemo(() => {
    if (!userFromState?.industries || !userFromState.selectedIndustry) return null;
    const industry = userFromState.industries.find((ind) => ind.name === userFromState.selectedIndustry);
    return industry?.clientId || null;
  }, [userFromState?.industries, userFromState?.selectedIndustry]);

  // API queries
  const {
    data: homeScreenData,
    refetch: refetchHome,
    isLoading: isHomeLoading,
    isSuccess: homeScreenSuccess,
    error: homeScreenError,
  } = useGetHomeScreenDataQuery(
    { personaId, userId: userFromState?.userId || '', clientId: clientId || '' },
    { skip: !personaId || !userFromState?.userId || !clientId },
  );

  const {
    data: homeSummaryData,
    refetch: refetchSummary,
    isLoading: isSummaryLoading,
    isSuccess: homeSummarySuccess,
    error: homeSummaryError,
  } = useGetHomeSummaryQuery(personaId, { skip: !personaId });

  const {
    data: insightsScreenData,
    refetch: refetchInsights,
    isLoading: isInsightsLoading,
    isSuccess: insightsScreenSuccess,
    error: insightsScreenError,
  } = useGetInsightsScreenDataQuery(personaId, { skip: !personaId });

  const {
    data: insightDetailsData,
    refetch: refetchDetails,
    isLoading: isDetailsLoading,
    isSuccess: insightDetailsSuccess,
    error: insightDetailsError,
  } = useGetInsightDetailsQuery(personaId, {
    skip: !personaId || clientId === 4,
  });

  // Calculate loading states
  const isAnyQueryLoading = isHomeLoading || isSummaryLoading || isInsightsLoading || isDetailsLoading;
  const homeHasErrors = homeScreenError || homeSummaryError;
  const insightsHasErrors = insightsScreenError || insightDetailsError;

  const executeQueriesSequentially = useCallback(
    async (insights) => {
      // GUARD: Prevent duplicate execution
      if (queryExecutionInProgress.current) {
        return [];
      }

      // GUARD: Prevent rapid consecutive executions (minimum 5 seconds between batches)
      const now = Date.now();
      if (now - lastExecutionTime.current < 5000) {
        return [];
      }

      if (!insights?.length) {
        return [];
      }

      // Mark execution as in progress
      queryExecutionInProgress.current = true;
      lastExecutionTime.current = now;
      setExecutingQueries(true);

      try {
        // Filter insights that need query execution (no data from Azure Search)
        const insightsNeedingExecution = insights.filter((insight) => {
          // Check if already processed in this session
          if (processedInsights.current.has(insight.insight_id)) {
            return false;
          }

          const hasAzureSearchData =
            insight.query_result && Array.isArray(insight.query_result) && insight.query_result.length > 0;

          const hasValidQuery = insight.sql_query && insight.has_query;

          // Check if already has data from Redux store
          const queryState = queryResults[insight.insight_id];
          const hasReduxData = queryState?.data && Array.isArray(queryState.data) && queryState.data.length > 0;

          // Only execute if no Azure Search data, no Redux data, and has valid query
          return !hasAzureSearchData && !hasReduxData && hasValidQuery;
        });

        if (insightsNeedingExecution.length === 0) {
          return [];
        }

        // Start all queries with 3-second staggered delays (parallel execution)
        const DELAY_BETWEEN_STARTS = QUERY_EXECUTION_CONFIG.DELAY_BETWEEN_CALLS; // 3000ms
        const queryPromises = [];

        insightsNeedingExecution.forEach((insight, index) => {
          // Create a promise that starts after the specified delay
          const delayedQueryPromise = new Promise((resolve) => {
            setTimeout(async () => {
              try {
                // Double-check if this insight was processed during execution
                if (processedInsights.current.has(insight.insight_id)) {
                  resolve({ success: true, insight_id: insight.insight_id, skipped: true });
                  return;
                }

                // Mark as being processed
                processedInsights.current.add(insight.insight_id);

                // Update current processing insight for UI
                setCurrentProcessingInsight(insight.insight_title);

                // Execute the query
                const result = await executeInsightQuery({
                  insightId: insight.insight_id,
                  sql_query: insight.sql_query,
                }).unwrap();

                if (result.success === true) {
                  dispatch(
                    setInsightQueryResult({
                      insightId: result.data.insight_id,
                      data: result.data.query_result || [],
                      executionTime: result.data.query_execution_time,
                    }),
                  );
                }

                resolve({ success: true, insight_id: insight.insight_id, result });
              } catch (error) {
                console.error(`Query execution failed for insight ${insight.insight_id}:`, error);
                resolve({ success: false, insight_id: insight.insight_id, error: error.message });
              }
            }, index * DELAY_BETWEEN_STARTS); // Stagger starts by 3 seconds each
          });

          queryPromises.push(delayedQueryPromise);
        });

        const results = await Promise.all(queryPromises);
        return results;
      } catch (error) {
        console.error('Error in parallel query execution:', error);
        return [];
      } finally {
        setExecutingQueries(false);
        setCurrentProcessingInsight(null);
        queryExecutionInProgress.current = false;
      }
    },
    [executeInsightQuery, queryResults, dispatch],
  );

  // FIXED: Queue management effect with proper dependency control and duplicate prevention
  useEffect(() => {
    // GUARD: Only proceed if dashboard is ready and we have data
    if (!insightsDashboardReady || !insightsScreenData || queryExecutionInProgress.current) {
      return;
    }

    // GUARD: Don't execute during initial loading
    if (isAnyQueryLoading) {
      return;
    }

    // Identify pending insights
    const pendingInsights = insightsScreenData.filter((insight) => {
      if (!insight?.sql_query?.trim() || !insight.has_query) return false;

      // Skip if already processed
      if (processedInsights.current.has(insight.insight_id)) return false;

      // Check Azure Search data
      const hasAzureSearchData =
        insight.query_result && Array.isArray(insight.query_result) && insight.query_result.length > 0;

      // Check Redux data
      const queryState = queryResults[insight.insight_id];
      const hasReduxData = queryState?.data && Array.isArray(queryState.data) && queryState.data.length > 0;

      return !hasAzureSearchData && !hasReduxData;
    });

    if (pendingInsights.length > 0) {
      executeQueriesSequentially(pendingInsights);
    }
  }, [insightsDashboardReady, insightsScreenData, isAnyQueryLoading, executeQueriesSequentially, queryResults]);

  // Reset processed insights when persona changes
  useEffect(() => {
    if (personaId) {
      processedInsights.current.clear();
      queryExecutionInProgress.current = false;
    }
  }, [personaId]);

  // Set reports count immediately when clientId changes
  useEffect(() => {
    if (clientId) {
      const availableCount = getAvailableDashboardCount(clientId);
      dispatch(setReportsCount(availableCount));
    } else {
      dispatch(setReportsCount(0));
    }
  }, [clientId, dispatch]);

  // Dashboard readiness effects
  useEffect(() => {
    const homeReady = homeScreenSuccess && homeSummarySuccess && !homeHasErrors;
    if (homeReady !== homeDashboardReady) {
      setHomeDashboardReady(homeReady);
    }
  }, [homeScreenSuccess, homeSummarySuccess, homeHasErrors, homeDashboardReady]);

  useEffect(() => {
    const insightsReady =
      clientId === 4
        ? insightsScreenSuccess && !insightsScreenError
        : insightsScreenSuccess && insightDetailsSuccess && !insightsHasErrors;

    if (insightsReady !== insightsDashboardReady) {
      setInsightsDashboardReady(insightsReady);
    }
  }, [
    insightsScreenSuccess,
    insightDetailsSuccess,
    insightsHasErrors,
    insightsDashboardReady,
    clientId,
    insightsScreenError,
  ]);

  // MicroStrategy preload
  useEffect(() => {
    if (!window.microstrategy) {
      preloadMicroStrategyLibrary();
    } else {
      window.mstrPreloaded = true;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!personaId) return;

      if (isFirstLoadRef.current) {
        // Set both loading states
        dispatch(setLoading({ home: true, insights: true }));
      }

      try {
        const promises = [refetchHome(), refetchSummary(), refetchInsights()];

        // Only add refetchDetails if not clientId 4
        if (clientId !== 4) {
          promises.push(refetchDetails());
        }

        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Initial data fetch failed:', error);
      } finally {
        if (isFirstLoadRef.current) {
          setTimeout(() => {
            // Turn off both loading states
            dispatch(setLoading({ home: false, insights: false }));
            isFirstLoadRef.current = false;
          }, 1000);
        }
      }
    };

    if (personaId) {
      fetchInitialData();
    }
  }, [personaId, dispatch, refetchHome, refetchSummary, refetchInsights, refetchDetails, clientId]);

  // Polling cleanup
  const cleanupPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  const pollData = useCallback(
    async (isRefresh = false) => {
      if (!personaId) return;

      try {
        if (isAnyQueryLoading && !isRefresh) return;

        // Set loading states individually at first
        dispatch(setLoading({ home: true, insights: true }));

        if (!isRefresh) {
          pollCountRef.current += 1;
          if (pollCountRef.current >= MAX_POLL_COUNT) {
            setShouldPoll(false);
            setIsPolling(false);
          }
        }

        // Create separate promises for each request
        const homePromise = refetchHome();
        const summaryPromise = refetchSummary();
        const insightsPromise = refetchInsights();

        // Create array for Promise.allSettled
        const promises = [homePromise, summaryPromise, insightsPromise];

        // Only add refetchDetails if not clientId 4
        if (clientId !== 4) {
          const detailsPromise = refetchDetails();
          promises.push(detailsPromise);
        }

        // Wait for all to complete
        const results = await Promise.allSettled(promises);

        // Reset loading states individually after completion
        dispatch(setLoading({ home: false }));
        dispatch(setLoading({ insights: false }));
      } catch (error) {
        console.error('Polling error:', error);
        setShouldPoll(false);
        setIsPolling(false);

        // Ensure loading states are reset even on error
        dispatch(setLoading({ home: false, insights: false }));
      }
    },
    [personaId, isAnyQueryLoading, dispatch, refetchHome, refetchSummary, refetchInsights, refetchDetails, clientId],
  );

  // Setup polling
  const setupPolling = useCallback(() => {
    if (!personaId || !shouldPoll) return;

    const poll = () => {
      if (!shouldPoll) {
        setIsPolling(false);
        return;
      }

      pollData(false).then(() => {
        if (shouldPoll && pollCountRef.current < MAX_POLL_COUNT) {
          pollingTimeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
        } else {
          setIsPolling(false);
          setShouldPoll(false);
        }
      });
    };

    setIsPolling(true);
    poll();
    return cleanupPolling;
  }, [personaId, shouldPoll, pollData, cleanupPolling]);

  // Setup polling effect
  useEffect(() => {
    if (shouldPoll) {
      const cleanup = setupPolling();
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [shouldPoll, setupPolling]);

  // Visibility change effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupPolling();
        setIsPolling(false);
        setShouldPoll(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupPolling();
    };
  }, [cleanupPolling]);

  // Cleanup on unmount
  useEffect(() => {
    const insightsSet = processedInsights.current;
    return () => {
      cleanupPolling();
      dispatch(resetQueryExecutionState());
      // Reset execution state on unmount
      queryExecutionInProgress.current = false;
      insightsSet.clear();
    };
  }, [dispatch, cleanupPolling]);

  // Set current page
  useEffect(() => {
    dispatch(setCurrentPage('home'));
  }, [dispatch]);

  // FIXED: Handle refresh with proper state reset
  const handleRefresh = async () => {
    cleanupPolling();
    pollCountRef.current = 0;
    setIsPolling(true);
    setExecutingQueries(false);
    setCurrentProcessingInsight(null);

    // Reset execution state for refresh
    queryExecutionInProgress.current = false;
    processedInsights.current.clear();

    try {
      await pollData(true);
      setShouldPoll(true);
      setupPolling();
    } catch (error) {
      console.error('Refresh failed:', error);
      setIsPolling(false);
      setShouldPoll(false);
    }
  };

  if (!userFromState?.selectedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      <div className={classes.contentWrapper}>
        <div className={classes.sidePanel}>
          <SidePanel
            selectedRole={userFromState.selectedRole}
            onRefresh={handleRefresh}
            isPolling={isPolling}
            executingQueries={executingQueries}
            dashboardsReady={{
              home: homeDashboardReady,
              insights: insightsDashboardReady,
            }}
            dashboardsLoading={{
              home: homeLoading,
              insights: insightsLoading,
            }}
          />
        </div>
        <div className={classes.mainPanel}>
          <MainPanel
            dashboardsReady={{
              home: homeDashboardReady,
              insights: insightsDashboardReady,
            }}
            dashboardsLoading={{
              home: homeLoading,
              insights: insightsLoading,
            }}
            executingQueries={executingQueries}
            currentProcessingInsight={currentProcessingInsight}
          />
        </div>
      </div>
    </Container>
  );
}

export default Landing;
