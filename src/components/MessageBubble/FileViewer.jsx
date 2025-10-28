import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Viewer,
  Worker,
  SpecialZoomLevel,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import classes from "./FileViewer.module.scss";
import PropTypes from "prop-types";

// Constants
const OFFICE_ONLINE_VIEWER = "https://view.officeapps.live.com/op/view.aspx?src=";
const GOOGLE_DOCS_VIEWER = "https://docs.google.com/gview?embedded=true&url=";
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const MAX_RETRIES = 3;

const FileViewer = ({ open, onClose, fileUrl: initialFileUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [currentFileUrl, setCurrentFileUrl] = useState(initialFileUrl);

  const iframeRef = useRef(null);
  const loadTimerRef = useRef(null);
  const containerRef = useRef(null);
  const retryCountRef = useRef(0);

  // Reset when file changes
  useEffect(() => {
    setCurrentFileUrl(initialFileUrl);
    setUseGoogleViewer(false);
    retryCountRef.current = 0;
    setError(null);
  }, [initialFileUrl]);

  const getFileType = useCallback((url) => {
    if (!url) return null;
    try {
      const cleanUrl = url.split("?")[0];
      const ext = cleanUrl.split(".").pop()?.toLowerCase();
      return ext || null;
    } catch {
      return null;
    }
  }, []);

  const getViewerUrl = useCallback(() => {
    if (!currentFileUrl) return "";

    const isAzureBlob = currentFileUrl.includes("blob.core.windows.net");
    const encodedUrl = encodeURIComponent(currentFileUrl);

    // PPT / PPTX → Google Docs Viewer
    if (["ppt", "pptx"].includes(fileType)) {
      return `${GOOGLE_DOCS_VIEWER}${encodedUrl}`;
    }

    // Azure Blob PDFs → force Google Docs
    if (fileType === "pdf" && (isAzureBlob || useGoogleViewer)) {
      return `${GOOGLE_DOCS_VIEWER}${encodedUrl}`;
    }

    // Normal PDFs → native viewer
    if (fileType === "pdf") {
      return currentFileUrl;
    }

    // Fallback → direct link
    return currentFileUrl;
  }, [currentFileUrl, fileType, useGoogleViewer]);

  // Init detection
  useEffect(() => {
    if (!open || !currentFileUrl) return;

    setLoading(true);
    setError(null);

    const type = getFileType(currentFileUrl);
    setFileType(type);

    // Azure PDFs → Google Docs fallback
    if (type === "pdf" && currentFileUrl.includes("blob.core.windows.net")) {
      setUseGoogleViewer(true);
    }

    setLoading(false);
  }, [open, currentFileUrl, getFileType]);

  const handleElementLoad = useCallback(() => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setLoading(false);
    retryCountRef.current = 0;
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setUseGoogleViewer(false);
    retryCountRef.current = 0;
  }, []);

  const handleElementError = useCallback(() => {
    if (retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;

      if (fileType === "pdf" && !useGoogleViewer) {
        setUseGoogleViewer(true);
      } else {
        setTimeout(() => handleRetry(), 1000);
      }
    } else {
      setError("Failed to load file. Please try downloading instead.");
      setLoading(false);
    }
  }, [fileType, useGoogleViewer, handleRetry]);

  const handleDownload = useCallback(() => {
    if (!currentFileUrl) return;
    window.open(currentFileUrl, "_blank");
  }, [currentFileUrl]);

  const renderViewer = () => {
    if (loading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress size={32} thickness={4} />
          <Typography variant="body1" className={classes.loadingText}>
            {fileType === "pdf"
              ? "Loading PDF..."
              : "Loading presentation..."}
          </Typography>
          {retryCountRef.current > 0 && (
            <Typography variant="body2" className={classes.loadingSubtext}>
              Retry {retryCountRef.current} of {MAX_RETRIES}...
            </Typography>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className={classes.errorContainer}>
          <Typography color="error" className={classes.errorText}>
            {error}
          </Typography>
          <div className={classes.errorActions}>
            <Button
              variant="outlined"
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
              className={classes.retryButton}
            >
              Try Again
            </Button>
            <Button
              variant="contained"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              className={classes.downloadButton}
            >
              Download File
            </Button>
          </div>
        </div>
      );
    }

    // Native PDF Viewer
    if (fileType === "pdf" && !useGoogleViewer) {
      return (
        <div className={classes.pdfContainer} ref={containerRef}>
          <Worker workerUrl={WORKER_URL}>
            <Viewer
              fileUrl={currentFileUrl}
              plugins={[defaultLayoutPluginInstance]}
              onDocumentLoad={handleElementLoad}
              onError={() => setUseGoogleViewer(true)}
              renderLoader={() => null}
              defaultScale={SpecialZoomLevel.PageWidth}
            />
          </Worker>
        </div>
      );
    }

    // Google Docs / Office Online fallback
    return (
      <div className={classes.viewerContainer} ref={containerRef}>
        <div className={classes.iframeContainer}>
          <iframe
            ref={iframeRef}
            src={getViewerUrl()}
            className={classes.viewerFrame}
            onLoad={handleElementLoad}
            onError={handleElementError}
            title="Document Viewer"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
            loading="lazy"
          />
        </div>
      </div>
    );
  };

  if (!open) return null;

  return createPortal(
    <>
      <div
        className={`${classes.overlay} ${open ? classes.visible : ""}`}
        onClick={onClose}
      />
      <div className={`${classes.panel} ${open ? classes.open : ""}`}>
        {open && (
          <div className={classes.tag}>
            <IconButton onClick={onClose} className={classes.closeButton}>
              <CloseIcon />
            </IconButton>
          </div>
        )}

        <div className={classes.content}>
          <div className={classes.header}>
            <Typography variant="h6" className={classes.title}>
              {fileType === "pdf" ? "PDF Viewer" : "Presentation Viewer"}
            </Typography>
            <IconButton
              onClick={handleDownload}
              className={classes.headerDownloadButton}
              title="Download file"
            >
              <DownloadIcon />
            </IconButton>
          </div>
          <div className={classes.viewerContent}>{renderViewer()}</div>
        </div>
      </div>
    </>,
    document.body
  );
};

FileViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileUrl: PropTypes.string.isRequired,
};

export default FileViewer;
