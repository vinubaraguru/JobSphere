import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
