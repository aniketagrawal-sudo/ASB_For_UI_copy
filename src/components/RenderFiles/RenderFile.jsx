import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDownloadIcon from '@mui/icons-material/Download';
import PropTypes from 'prop-types';
import LinearLoader from '../LinearLoader';
import { useLazyGetBlobURLfromFileQuery } from '../../services/conversationApi';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleBusinessContent } from '../../redux/store/conversationSlice';
import { getFileExtension, handleFileDownload } from '../../utils/fileUtils';
import { PREVIEW_ALLOWED_FILETYPES } from '../../utils/constants';

const FileCard = ({ name, url, messageid }) => {
  // Fetching function to get blob URL from API
  const [getBlobURL, { isFetching, isError, error: fileFetchError }] = useLazyGetBlobURLfromFileQuery();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Effect hook to set error message when fetch fails
  useEffect(() => {
    if (isError) {
      if (fileFetchError?.message) setError(fileFetchError?.message);
      else {
        setError('unknown error');
      }
    } else {
      setError('');
    }
  }, [isError, fileFetchError]);

  // Function to fetch blob URL and handle the file
  const handleGetBlob = async (fileUrl) => {
    try {
      setLoading(true);

      // Guard against undefined URLs
      if (!fileUrl) {
        throw new Error('File URL is missing');
      }

      // Extract the file path from the blob URL for the media API
      let filePath = fileUrl;

      // If it's a full Azure blob URL, extract just the file path
      if (fileUrl.includes('blob.core.windows.net')) {
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split('/');

        // Remove the first part (empty) and container name (ai-for-insights)
        const containerIndex = pathParts.findIndex((part) => part === 'ai-for-insights');
        if (containerIndex !== -1 && containerIndex < pathParts.length - 1) {
          // Get the path after the container name and decode it
          filePath = pathParts.slice(containerIndex + 1).join('/');
          // Decode URL-encoded characters
          filePath = decodeURIComponent(filePath);
        }
      }

      // Remove base URL if present (this check should come after URL parsing)
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      if (baseURL && filePath.startsWith(baseURL)) {
        filePath = filePath.replace(baseURL, '');
      }

      // Clean up any leading slashes
      filePath = filePath.replace(/^\/+/, '');

      if (!filePath) {
        throw new Error('File path not found');
      }

      const encodedPath = encodeURIComponent(filePath);
      const { data } = await getBlobURL(`/api/media/${encodedPath}`).unwrap();

      if (!data?.file_url) {
        throw new Error('SAS URL not found in response');
      }

      const sasUrl = data.file_url;

      const fileExtension = getFileExtension(sasUrl);
      if (PREVIEW_ALLOWED_FILETYPES.includes(fileExtension)) {
        dispatch(toggleBusinessContent({ blobUrl: sasUrl, messageid }));
      } else {
        await handleFileDownload(sasUrl, name);
      }
    } catch (error) {
      console.error('Error fetching or processing blob URL:', error);
      setError(error?.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          borderRadius: 2,
          minHeight: 40,
          minWidth: 170,
          maxWidth: 200,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsertDriveFileIcon color="action" />
          <Typography
            component="span"
            variant="caption"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 80,
              py: 1,
            }}>
            {name}
          </Typography>
          {isFetching || loading ? (
            <LinearLoader />
          ) : (
            <IconButton
              onClick={() => {
                // Only handle click if URL is available (file has been processed)
                if (url) {
                  handleGetBlob(url);
                }
              }}
              disabled={!url}>
              <CloudDownloadIcon />
            </IconButton>
          )}
        </Box>
        {error ? (
          <Box>
            <Typography variant="caption" color="error">
              {error || 'Failed to fetch'}
            </Typography>
          </Box>
        ) : null}
      </Paper>
    </>
  );
};

FileCard.propTypes = {
  name: PropTypes.string.isRequired, // name must be a string and required
  url: PropTypes.string.isRequired, // url must be a string and required
  messageid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const FileList = ({ files, messageid }) => {

  return (
    <Box sx={{ display: 'flex', gap: 2, marginTop: 1, flexWrap: 'wrap', maxWidth: '100%' }}>
      {files.map((file, index) => (
        <Tooltip key={index} title={file.file_name || file.name} placement="top" arrow>
          <Box>
            <FileCard name={file.file_name || file.name} url={file.file_url} messageid={messageid} />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

FileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      file_name: PropTypes.string,
      file_url: PropTypes.string,
    }),
  ),
  messageid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FileList;
