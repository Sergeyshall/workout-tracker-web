import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Title from '../components/title';
import LoaderWrapper from '../components/loaderWrapper';
import Exercise from '../components/exercise';
import useWorkouts from '../hooks/useWorkouts';
import { startWorkoutSession, completeWorkout } from '../slices/workoutProgressSlice';

const Workout = () => {
  const { id } = useParams();
  const { currentWorkout, isLoading, error } = useWorkouts(id);
  const dispatch = useDispatch();
  const activeSession = useSelector((s) => s.workoutProgress.active);
  const isActiveForThis = activeSession?.workoutName === id;

  const completedSets = isActiveForThis
    ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0)
    : 0;
  const totalSets = isActiveForThis
    ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    : 0;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const allDone = totalSets > 0 && completedSets === totalSets;

  const handleStart = () => {
    if (currentWorkout) {
      dispatch(startWorkoutSession({
        workoutName: currentWorkout.name,
        exercises: currentWorkout.exercises,
      }));
    }
  };

  const handleComplete = () => {
    dispatch(completeWorkout());
  };

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
          Failed to load workout: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
      <LoaderWrapper isLoading={isLoading}>
        <Title>{currentWorkout?.label} Workout</Title>

        {isActiveForThis && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{completedSets}/{totalSets} sets</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              color={allDone ? 'success' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {currentWorkout?.exercises?.map((exercise, key) => (
          <Exercise
            key={key}
            exercise={exercise}
            exerciseNumber={key + 1}
            workoutName={currentWorkout.name}
          />
        ))}

        {!isActiveForThis && currentWorkout && (
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={handleStart}
            component={RouterLink}
            to={`/workouts/${currentWorkout.name}/exercise/1`}
            sx={{ mt: 1, mb: 2 }}
          >
            Start Workout
          </Button>
        )}

        {allDone && (
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CheckCircleIcon />}
            onClick={handleComplete}
            component={RouterLink}
            to="/"
            sx={{ mt: 1, mb: 2 }}
          >
            Complete Workout
          </Button>
        )}
      </LoaderWrapper>
    </Box>
  );
};

export default Workout;
