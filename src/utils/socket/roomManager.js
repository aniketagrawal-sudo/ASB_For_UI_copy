/**
 * Azure-optimized reference counting system for socket rooms
 * Prevents premature disconnection with grace periods and enhanced error handling
 * Compatible with Azure Load Balancer and App Services
 */

// Track active rooms and their reference counts
const activeRooms = new Map();

// Azure-specific: Add grace period for connection drops (common in Azure environments)
const AZURE_DISCONNECT_GRACE_PERIOD = 5000; // Increased to 5 seconds for Azure reliability
const pendingDisconnects = new Map();

// Track room activity for monitoring
const roomActivity = {
  totalRegistrations: 0,
  totalUnregistrations: 0,
  lastActivity: Date.now(),
};

/**
 * Register a component's interest in a room
 * @param {string} roomId - The conversation ID
 * @param {string} componentId - Unique identifier for the requesting component
 * @returns {boolean} Success status
 */
export const registerRoomUsage = (roomId, componentId) => {
  if (!roomId || !componentId) return false;

  const roomKey = String(roomId);
  roomActivity.totalRegistrations++;
  roomActivity.lastActivity = Date.now();

  // Cancel any pending disconnect for this room
  if (pendingDisconnects.has(roomKey)) {
    clearTimeout(pendingDisconnects.get(roomKey));
    pendingDisconnects.delete(roomKey);
  }

  if (!activeRooms.has(roomKey)) {
    activeRooms.set(roomKey, new Set([componentId]));
  } else {
    activeRooms.get(roomKey).add(componentId);
  }

  return true;
};

/**
 * Unregister a component's interest in a room with Azure-optimized grace period
 * @param {string} roomId - The conversation ID
 * @param {string} componentId - Unique identifier for the requesting component
 * @returns {boolean} Whether this was the last reference
 */
export const unregisterRoomUsage = (roomId, componentId) => {
  if (!roomId || !componentId) return true;

  const roomKey = String(roomId);
  roomActivity.totalUnregistrations++;
  roomActivity.lastActivity = Date.now();

  if (!activeRooms.has(roomKey)) return true;

  const roomUsers = activeRooms.get(roomKey);
  roomUsers.delete(componentId);

  const isLastReference = roomUsers.size === 0;

  if (isLastReference) {
    // In Azure, network events can cause temporary disconnections
    // Add a grace period before actually removing the room

    // Cancel any existing pending disconnect for this room
    if (pendingDisconnects.has(roomKey)) {
      clearTimeout(pendingDisconnects.get(roomKey));
    }

    // Set up a new pending disconnect with grace period
    const disconnectTimer = setTimeout(() => {
      try {
        // Double-check that the room is still empty after the grace period
        if (activeRooms.has(roomKey) && activeRooms.get(roomKey).size === 0) {
          activeRooms.delete(roomKey);
        }
        pendingDisconnects.delete(roomKey);
      } catch (error) {
        console.error(`Error in roomManager disconnect timer for ${roomKey}:`, error);
        // Safety cleanup
        if (activeRooms.has(roomKey) && activeRooms.get(roomKey).size === 0) {
          activeRooms.delete(roomKey);
        }
        pendingDisconnects.delete(roomKey);
      }
    }, AZURE_DISCONNECT_GRACE_PERIOD);

    pendingDisconnects.set(roomKey, disconnectTimer);
  }

  return isLastReference;
};

/**
 * Check if a room is still in use
 * @param {string} roomId - The conversation ID
 * @param {string} [componentId] - Optional component ID to check specific usage
 * @returns {boolean} Whether the room is in use
 */
export const isRoomInUse = (roomId, componentId) => {
  if (!roomId) return false;

  const roomKey = String(roomId);
  if (!activeRooms.has(roomKey)) return false;

  // If componentId is provided, check if that specific component is using the room
  if (componentId) {
    return activeRooms.get(roomKey).has(componentId);
  }

  // Otherwise check if any component is using it
  return activeRooms.get(roomKey).size > 0;
};

/**
 * Get the number of components using a room
 * @param {string} roomId - The conversation ID
 * @returns {number} Reference count
 */
export const getRoomReferenceCount = (roomId) => {
  if (!roomId) return 0;

  const roomKey = String(roomId);
  return activeRooms.has(roomKey) ? activeRooms.get(roomKey).size : 0;
};

/**
 * Get all components currently using a room
 * @param {string} roomId - The conversation ID
 * @returns {Array<string>} Array of component IDs
 */
export const getRoomUsers = (roomId) => {
  if (!roomId) return [];

  const roomKey = String(roomId);
  return activeRooms.has(roomKey) ? Array.from(activeRooms.get(roomKey)) : [];
};

/**
 * Cleanup all room registrations
 * @returns {void}
 */
export const cleanupAllRooms = () => {
  // Clear all pending disconnect timers
  pendingDisconnects.forEach((timer) => clearTimeout(timer));
  pendingDisconnects.clear();

  // Clear all room registrations
  activeRooms.clear();

};

/**
 * Detect and recover from potential stuck state
 * Important for Azure where network interruptions can leave references hanging
 * @returns {boolean} Whether any recovery action was taken
 */
export const recoverStuckRooms = () => {
  let recoveryPerformed = false;

  // Clean up any empty rooms that might have been stuck
  activeRooms.forEach((users, roomKey) => {
    if (users.size === 0) {
      console.warn(`Recovering stuck empty room: ${roomKey}`);
      activeRooms.delete(roomKey);
      recoveryPerformed = true;
    }
  });

  // Clean up any pending disconnects that might be stuck
  pendingDisconnects.forEach((timer, roomKey) => {
    // Check if the timer is more than 30 seconds old (should never happen)
    if (Date.now() - roomActivity.lastActivity > 30000) {
      console.warn(`Recovering stuck pending disconnect for room: ${roomKey}`);
      clearTimeout(timer);
      pendingDisconnects.delete(roomKey);
      recoveryPerformed = true;
    }
  });

  return recoveryPerformed;
};

/**
 * Log the current room usage state for debugging
 * Useful for troubleshooting Azure connection issues
 */
export const logRoomUsage = () => {

  // Check for potential memory leaks - many rooms with few users
  const potentialLeaks =
    activeRooms.size > 10 &&
    Array.from(activeRooms.values()).filter((users) => users.size === 1).length > activeRooms.size * 0.8;

  if (potentialLeaks) {
    console.warn('POTENTIAL MEMORY LEAK DETECTED: Many single-user rooms');
  }

  // Return potential issues for automated monitoring
  return {
    activeRooms: activeRooms.size,
    pendingDisconnects: pendingDisconnects.size,
    potentialLeaks,
    referenceCount: Array.from(activeRooms.values()).reduce((sum, users) => sum + users.size, 0),
  };
};
