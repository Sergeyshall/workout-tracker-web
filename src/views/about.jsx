import React from 'react';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const About = () => (
  <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
    <InfoIcon sx={{ fontSize: 48, mt: 3, mb: 1, opacity: 0.7 }} />
    <Typography variant="h5" gutterBottom>
      Workout Tracker
    </Typography>
    <Card sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
      <CardContent>
        <Typography variant="body1" paragraph>
          A simple, fast workout tracker to follow guided exercises with a timer and set progression.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Version 0.2.0
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Built by Shalapuda Sergey
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

export default About;