import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';

const STORAGE_KEY = 'workout-tracker-profile';

const defaultProfile = { name: '', restTimeMinutes: '0.5' };

const Profile = () => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [saved, setSaved] = useState(false);
  const history = useSelector((s) => s.workoutProgress.history);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = JSON.stringify({ profile, history }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout-tracker-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
      <Avatar sx={{ width: 64, height: 64, mt: 3, mb: 1, bgcolor: 'primary.main' }}>
        <AccountCircleIcon sx={{ fontSize: 48 }} />
      </Avatar>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Card sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Your Name"
              variant="outlined"
              size="small"
              fullWidth
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <TextField
              label="Default Rest Time (minutes)"
              variant="outlined"
              size="small"
              type="number"
              inputProps={{ min: 0, step: 0.5 }}
              fullWidth
              value={profile.restTimeMinutes}
              onChange={(e) => setProfile({ ...profile, restTimeMinutes: e.target.value })}
            />
            <Button variant="contained" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Preferences'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Data
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
            Workouts completed: {history.length}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleExport}>
            Export Data (JSON)
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;