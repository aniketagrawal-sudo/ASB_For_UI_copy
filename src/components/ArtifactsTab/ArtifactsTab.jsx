import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Tabs, Tab, IconButton, Tooltip, CircularProgress } from '@mui/material';
import MessageChartComponent from '../MessageBubble/MessageChartComponent';
import PushPinIcon from '@mui/icons-material/PushPin';
import DownloadIcon from '@mui/icons-material/Download';
import classes from './ArtifactsTab.module.scss';
import { useGetArtifactsQuery, useUnpinArtifactMutation } from '../../services/artifactsApi';
import { selectUser, selectSelectedIndustry, selectSelectedRole } from '../../features/auth/authSlice';
import { setArtifactsCount } from '../../redux/store/dashboardSlice';
import PptxGenJS from "pptxgenjs";

const ArtifactCard = ({ item, onUnpin }) => {
  const chartRef = useRef(null);

  const handleDownload = () => {
    // This logic needs a way to get the chart instance from MessageChartComponent
    // For now, it's a placeholder.
    console.log("Download clicked for:", item.title);
  };

  return (
    <Paper className={classes.artifactCard} elevation={2}>
      <div className={classes.cardActions}>
        <Tooltip title="Unpin">
          <IconButton size="small" className={classes.pinButton} onClick={() => onUnpin(item.id)}>
            <PushPinIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download PPT">
          <IconButton size="small" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.chartArea}>
        <MessageChartComponent
          ref={chartRef}
          dataPoints={item.content}
          type={item.content?.type || 'line'}
          title={item.title}
        />
      </div>
    </Paper>
  );
};

ArtifactCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    content: PropTypes.object,
  }).isRequired,
  onUnpin: PropTypes.func.isRequired,
};
const ArtifactsTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch(); // Get the dispatch function
  const user = useSelector(selectUser);
  const selectedIndustryName = useSelector(selectSelectedIndustry);
  const selectedRole = useSelector(selectSelectedRole);
  
  const activePersona = user?.industries
    ?.find(i => i.name === selectedIndustryName)
    ?.personas?.find(p => p.name === selectedRole);

  const userId = user?.userId;
  const personaId = activePersona?.id;

  const { data, isLoading, isError } = useGetArtifactsQuery(
    { userId, personaId },
    { skip: !userId || !personaId }
  );
  
  const [unpinArtifact] = useUnpinArtifactMutation();
  const pinnedItems = data?.data || [];

  // --- THIS useEffect UPDATES THE COUNT IN THE SIDEBAR ---
  useEffect(() => {
    if (data) {
      dispatch(setArtifactsCount(pinnedItems.length));
    }
  }, [data, pinnedItems.length, dispatch]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleUnpin = async (artifactId) => {
    try {
      await unpinArtifact({ id: artifactId, userId }).unwrap();
    } catch (err) {
      console.error('Failed to unpin artifact:', err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }
    if (isError) {
      return <Typography color="error" sx={{ textAlign: 'center', p: 4 }}>Failed to load artifacts.</Typography>;
    }
    const items = activeTab === 0 ? pinnedItems : [];
    if (!items || items.length === 0) {
      return (
        <Box className={classes.emptyState}>
          <Typography variant="h6">No Items Found</Typography>
          <Typography color="text.secondary">This section is currently empty.</Typography>
        </Box>
      );
    }
    return (
      <div className={classes.gridContainer}>
        {items.map((item) => (
          <ArtifactCard key={item.id} item={item} onUnpin={handleUnpin} />
        ))}
      </div>
    );
  };

  return (
    <Box className={classes.artifactsContainer}>
      <Tabs value={activeTab} onChange={handleTabChange} className={classes.tabs}>
        <Tab label={`Pinned (${pinnedItems.length})`} />
        <Tab label={`Uploaded (0)`} />
      </Tabs>
      <Box className={classes.content}>{renderContent()}</Box>
    </Box>
  );
};

export default ArtifactsTab;

