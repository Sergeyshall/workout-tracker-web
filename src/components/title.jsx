import React from 'react';
import { Typography } from '@mui/material';

const Title = ({ children }) => (
  <Typography variant="h5" sx={{ mt: 2.5, mb: 1 }}>
    {children}
  </Typography>
);

export default Title;
