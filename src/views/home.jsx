import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import useWorkouts from '../hooks/useWorkouts';
import LoaderWrapper from '../components/loaderWrapper';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Home = () => {
  const today = new Date().getDay();
  const { workouts, isLoading, error } = useWorkouts();
  const todayWorkout = workouts.find((w) => w.day === today);
  const activeSession = useSelector((s) => s.workoutProgress.active);
  const history = useSelector((s) => s.workoutProgress.history);
  const lastCompleted = history.length > 0 ? history[history.length - 1] : null;

  if (error) {
    return (
      <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
        <Alert
          severity="error"
          sx={{ width: '100%', mt: 2 }}
          action={(
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          )}
        >
          Failed to load workouts: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
      <LoaderWrapper isLoading={isLoading}>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          {DAYS[today]}'s Workout
        </Typography>

        {todayWorkout ? (
          <Card sx={{ width: '100%', mb: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {todayWorkout.label}
              </Typography>
              <List dense disablePadding>
                {todayWorkout.exercises.map((exercise, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FitnessCenterIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={exercise.label} secondary={`${exercise.sets.length} sets`} />
                  </ListItem>
                ))}
              </List>
              <Button
                component={RouterLink}
                to={`/workouts/${todayWorkout.name}/exercise/1`}
                variant="contained"
                color="success"
                size="large"
                startIcon={<PlayArrowIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ width: '100%', mb: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                No workout scheduled for today. Check the{' '}
                <RouterLink to="/workouts" style={{ color: '#90caf9' }}>workouts list</RouterLink>.
              </Typography>
            </CardContent>
          </Card>
        )}

        {activeSession && (
          <Card sx={{ width: '100%', mb: 2, bgcolor: 'background.paper', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Workout In Progress
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {activeSession.workoutName}
              </Typography>
              <List dense disablePadding>
                {activeSession.exercises.map((ex, i) => {
                  const done = ex.sets.every((s) => s.completed);
                  return (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {done ? (
                          <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
                        ) : (
                          <UncheckedIcon fontSize="small" sx={{ opacity: 0.5 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={ex.label} />
                    </ListItem>
                  );
                })}
              </List>
              <Button
                component={RouterLink}
                to={`/workouts/${activeSession.workoutName}/exercise/${activeSession.currentExercise + 1}`}
                variant="outlined"
                color="warning"
                fullWidth
                sx={{ mt: 1 }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {lastCompleted && (
          <Card sx={{ width: '100%', mb: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <HistoryIcon fontSize="small" />
                <Typography variant="subtitle2">Last Completed</Typography>
              </Stack>
              <Typography variant="body2">
                {lastCompleted.workoutName} &mdash; {new Date(lastCompleted.completedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Button
          component={RouterLink}
          to="/workouts"
          variant="outlined"
          color="primary"
          sx={{ mt: 1 }}
        >
          View All Workouts
        </Button>
      </LoaderWrapper>
    </Box>
  );
};

export default Home;