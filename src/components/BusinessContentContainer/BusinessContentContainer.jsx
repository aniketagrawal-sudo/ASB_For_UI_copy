import { Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessContent, toggleBusinessContent } from '../../redux/store/conversationSlice';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import classes from './BusinessContentContainer.module.scss';
import LinearLoader from '../LinearLoader';
import { getFileExtension, handleFileDownload } from '../../utils/fileUtils';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

//added this new component to show the business content in a separate panel

const BusinessContentContainer = () => {
  const dispatch = useDispatch();
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState();

  const { fileurl } = useSelector(getBusinessContent);
  const fileExtension = getFileExtension(fileurl);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const downloadFile = async () => {
    try {
      if (error) {
        setError('');
      }
      await handleFileDownload(fileurl);
    } catch (err) {
      console.error('Error while downaloding the file', err);
      setError('Unable to download the file');
    }
  };
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className={classes.container}>
      {/* Header */}
      <div className={classes.businessContentHeader}>
        <Typography variant="subtitle2" className={classes.businessContentHeaderTitle}>
          Business Context
        </Typography>
        <div>
          <IconButton
            size="small"
            onClick={downloadFile}
            aria-label="Close"
            className={classes.businessContentHeaderIcon}>
            <DownloadIcon fontSize="small" sx={{ color: '#f7901d' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => dispatch(toggleBusinessContent())}
            aria-label="Close"
            className={classes.businessContentHeaderIcon}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <Divider />

      {/* Content */}
      <div className={classes.content}>
        <>
          {fileExtension === 'pdf' && (
            <>
              {fileurl ? (
                <Document
                  file={fileurl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<LinearLoader />}
                  error="Failed to load PDF.">
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
              ) : (
                <Typography variant="body2" className={classes.noFileText}>
                  No PDF file available.
                </Typography>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default BusinessContentContainer;
