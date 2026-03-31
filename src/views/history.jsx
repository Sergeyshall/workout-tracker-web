import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  LocalFireDepartment as StreakIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { clearHistory } from '../slices/workoutProgressSlice';

const getStreak = (history) => {
  if (history.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = [...new Set(
    history.map((h) => {
      const d = new Date(h.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )].sort((a, b) => b - a);

  // Check if last workout was today or yesterday
  const diffFromToday = (today.getTime() - uniqueDays[0]) / (1000 * 60 * 60 * 24);
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const diff = (uniqueDays[i] - uniqueDays[i + 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const History = () => {
  const dispatch = useDispatch();
  const history = useSelector((s) => s.workoutProgress.history);
  const streak = getStreak(history);

  const sortedHistory = [...history].reverse();

  return (
    <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        Workout History
      </Typography>

      {streak > 0 && (
        <Card sx={{ width: '100%', mb: 2, bgcolor: 'background.paper', borderLeft: '4px solid #ff9800' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StreakIcon sx={{ color: '#ff9800' }} />
            <Typography variant="h6">
              {streak} day streak!
            </Typography>
          </CardContent>
        </Card>
      )}

      {sortedHistory.length === 0 ? (
        <Alert severity="info" sx={{ width: '100%' }}>
          No completed workouts yet. Start your first workout from the home page!
        </Alert>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
            {sortedHistory.length} workout{sortedHistory.length !== 1 ? 's' : ''} completed
          </Typography>
          <List sx={{ width: '100%' }}>
            {sortedHistory.map((entry, i) => {
              const completedSets = entry.exercises.reduce(
                (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
                0
              );
              const totalSets = entry.exercises.reduce(
                (sum, ex) => sum + ex.sets.length,
                0
              );
              const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
              const date = new Date(entry.completedAt);

              return (
                <Card key={i} sx={{ width: '100%', mb: 1, bgcolor: 'background.paper' }}>
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FitnessCenterIcon fontSize="small" sx={{ opacity: 0.7 }} />
                        <Typography variant="subtitle2">
                          {entry.workoutName}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${pct}%`}
                        size="small"
                        color={pct === 100 ? 'success' : 'default'}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </List>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm('Clear all workout history?')) {
                dispatch(clearHistory());
              }
            }}
            sx={{ mt: 1, mb: 2 }}
          >
            Clear History
          </Button>
        </>
      )}
    </Box>
  );
};

export default History;
