export const MESSAGE_TYPES = {
  COMBINED: 'combined',
  INSIGHT: 'insight',
  VISUALIZATION: 'visualization',
  TABLE: 'table',
  FILE: 'file',
  ERROR: 'error'
};

export const parseMessage = (message) => {
  try {
    // Handle if message is already an object
    let messageObj;
    try {
      messageObj = typeof message === 'string' ? JSON.parse(message) : message;
    } catch (error) {
      return { type: MESSAGE_TYPES.INSIGHT, content: message };
    }

    // Check if message has multiple content types
    const hasMultipleTypes = [
      messageObj.insight,
      messageObj.visualization,
      messageObj.table,
      messageObj.result?.file_url
    ].filter(Boolean).length > 0;

    if (hasMultipleTypes) {
      return {
        type: MESSAGE_TYPES.COMBINED,
        content: {
          insight: messageObj.insight,
          visualization: messageObj.visualization,
          table: messageObj.table,
          fileUrl: messageObj.result?.file_url
        }
      };
    }

    // Handle error messages
    if (messageObj.error) {
      return { type: MESSAGE_TYPES.ERROR, content: messageObj.error };
    }

    // Handle single content types
    if (messageObj.insight) {
      return { type: MESSAGE_TYPES.INSIGHT, content: messageObj.insight };
    }
    if (messageObj.visualization) {
      return { type: MESSAGE_TYPES.VISUALIZATION, content: messageObj.visualization };
    }
    if (messageObj.table) {
      return { type: MESSAGE_TYPES.TABLE, content: messageObj.table };
    }
    if (messageObj.result?.file_url) {
      return { type: MESSAGE_TYPES.FILE, content: { fileUrl: messageObj.result.file_url }};
    }

    // Default case
    return { type: MESSAGE_TYPES.INSIGHT, content: message };
  } catch (error) {
    console.error('Message parsing error:', error);
    return { type: MESSAGE_TYPES.INSIGHT, content: message };
  }
};