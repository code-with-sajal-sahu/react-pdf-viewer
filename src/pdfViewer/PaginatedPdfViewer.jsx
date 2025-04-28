import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  ErrorOutline,
} from "@mui/icons-material";
import "react-pdf/dist/Page/TextLayer.css";
const PaginatedPdfViewer = ({ file, handleComplete = () => {} }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.06);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef();
  const [error, setError] = useState(false);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const updateContainerWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1.06));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const onDocumentLoadError = (err) => {
    console.error("Error loading PDF:", err);
    setError(true);
    setLoading(false);
  };

  useEffect(() => {
    handleComplete();
  }, []);

  return (
    <Box className="pdf-viewer-section" ref={containerRef}>
      {error ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          textAlign="center"
          bgcolor={"white"}
          width={"100%"}
        >
          <ErrorOutline sx={{ fontSize: 80, color: "red", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Failed to load PDF
          </Typography>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
            <Tooltip title="Zoom Out">
              <IconButton
                className="pdf-icon-btn"
                onClick={zoomOut}
                disabled={scale <= 1.08}
              >
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In">
              <IconButton
                className="pdf-icon-btn"
                onClick={zoomIn}
                disabled={scale >= 2.5}
              >
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton className="pdf-icon-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "100vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<CircularProgress />}
              onLoadError={onDocumentLoadError}
              onSourceError={onDocumentLoadError}
            >
              <Page
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={true}
                width={containerWidth * 0.87}
                scale={scale}
                onRenderSuccess={() => setLoading(false)}
              />
            </Document>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <IconButton
              className="pdf-icon-btn"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="body2" color="white">
              Page {pageNumber} of {numPages || "?"}
            </Typography>
            <IconButton
              className="pdf-icon-btn"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PaginatedPdfViewer;
