import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoaderWrapper = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return <>{children}</>;
};

export default LoaderWrapper;
