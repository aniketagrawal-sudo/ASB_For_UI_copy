/** changes made
v1.1.0 :
  =>introduced to handle the file download and other file operations
**/

export const handleFileDownload = async (fileurl, fileName) => {
  if (!fileName) {
    fileName = extractFilename(fileurl);
  }
  const response = await fetch(fileurl);
  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName || 'document.pdf';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(blobUrl);
};

const extractFilename = (url) => {
  try {
    const fileName = decodeURIComponent(url.split('/').pop().split('?')[0].split('#')[0]);
    return fileName;
  } catch (err) {
    console.error('error while extracting the file name', err);
    return null;
  }
};

export const getFileExtension = (url) => {
  const filename = extractFilename(url);
  if (!filename) return '';

  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const filterByClient = (data, clientId) => {
  if (!Array.isArray(data)) return [];
  return data.filter(item => item.clientId === clientId);
};

export const filterRevenueByClient = (data, clientId) => {
  if (!data || typeof data !== "object") return {};

  const filtered = {};

  Object.entries(data).forEach(([account, details]) => {
    if (details.clientId === clientId) {
      filtered[account] = details;
    }
  });
  return filtered;
};



