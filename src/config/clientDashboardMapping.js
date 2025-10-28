/**
 * Client-specific dashboard visibility mapping
 * Defines which dashboard types are available for each client/industry
 */

export const CLIENT_DASHBOARD_MAPPING = {
  // CPG Industry (clientId: 2) - Both dashboards available
  2: {
    microstrategy: true,
    powerbi: true,
    defaultDashboard: 'mstr', // Default to MicroStrategy
  },

  // Insurance Industry (clientId: 3) - Only Power BI
  3: {
    microstrategy: false,
    powerbi: true,
    defaultDashboard: 'powerbi',
  },

  // Pharmaceutical Industry (clientId: 4) - Only Power BI
  4: {
    microstrategy: false,
    powerbi: true,
    defaultDashboard: 'powerbi',
  },
};

/**
 * Get dashboard configuration for a specific client
 * @param {number} clientId - Client ID from user data
 * @returns {Object} Dashboard configuration
 */
export const getDashboardConfigForClient = (clientId) => {
  return (
    CLIENT_DASHBOARD_MAPPING[clientId] || {
      microstrategy: true,
      powerbi: true,
      defaultDashboard: 'mstr',
    }
  );
};

/**
 * Get available dashboard count for a client
 * @param {number} clientId - Client ID from user data
 * @returns {number} Number of available dashboards
 */
export const getAvailableDashboardCount = (clientId) => {
  const config = getDashboardConfigForClient(clientId);
  let count = 0;
  if (config.microstrategy) count++;
  if (config.powerbi) count++;
  return count;
};
