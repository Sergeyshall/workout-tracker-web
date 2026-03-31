import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Chip, Button, Alert } from '@mui/material';
import {
  NavigateNext as NextIcon,
} from '@mui/icons-material';

import Title from '../components/title';
import LoaderWrapper from '../components/loaderWrapper';
import ExerciseSet from '../components/exerciseSet';
import Timer from '../components/timer';

import useWorkouts from '../hooks/useWorkouts';
import useMusicPlayer from '../hooks/useMusicPlayer';
import useTimer from '../hooks/useTimer';
import {
  startWorkoutSession,
  completeSet,
  setCurrentPosition,
  completeWorkout,
} from '../slices/workoutProgressSlice';

const initialState = {
  set: 0,
  restStatus: false,
};

const Exercise = () => {
  const { id, exerciseNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const { set, restStatus } = state;
  const {
    isLoading,
    error,
    currentWorkout,
    currentExercise,
  } = useWorkouts(id, exerciseNumber);
  const { setPlaylist, stopMusicPlayer, startMusicPlayer, pauseMusicPlayer } = useMusicPlayer();

  const activeSession = useSelector((s) => s.workoutProgress.active);
  const exerciseIndex = parseInt(exerciseNumber, 10) - 1;

  const currentSet = currentExercise?.sets?.[set] || {};
  const setsLength = currentExercise?.sets?.length || 0;
  const totalTime = restStatus ? currentSet?.rest : currentSet?.time;

  const {
    timeLeft,
    progress,
    setTimer,
    pauseTimer,
    stopTimer,
    startTimer,
  } = useTimer(totalTime * 60);

  // Ensure a workout session exists
  useEffect(() => {
    if (currentWorkout && !activeSession) {
      dispatch(startWorkoutSession({
        workoutName: currentWorkout.name,
        exercises: currentWorkout.exercises,
      }));
    }
  }, [currentWorkout, activeSession, dispatch]);

  // Track current position
  useEffect(() => {
    if (activeSession) {
      dispatch(setCurrentPosition({ exerciseIndex, setIndex: set }));
    }
  }, [exerciseIndex, set, activeSession, dispatch]);

  const startSet = useCallback(() => {
    startTimer();
    startMusicPlayer();
  }, [startMusicPlayer, startTimer]);

  const prevSet = useCallback(() => {
    if (set > 0) {
      stopTimer();
      setState({ ...initialState, set: set - 1 });
      setTimeout(() => startSet(), 100);
    }
  }, [stopTimer, set, startSet]);

  const stopSet = useCallback(() => {
    stopTimer();
    stopMusicPlayer();
  }, [stopMusicPlayer, stopTimer]);

  const pauseSet = useCallback(() => {
    pauseTimer();
    pauseMusicPlayer();
  }, [pauseTimer, pauseMusicPlayer]);

  const nextSet = useCallback(() => {
    stopTimer();

    // Mark current set as completed
    if (activeSession) {
      dispatch(completeSet({ exerciseIndex, setIndex: set }));
    }

    const nextSetNumber = setsLength && set + 1 < setsLength ? set + 1 : null;

    if (nextSetNumber !== null) {
      setState({ ...initialState, set: nextSetNumber });
      setTimeout(() => startSet(), 100);
    } else {
      // Exercise completed — navigate to next exercise or finish
      stopSet();
      const totalExercises = currentWorkout?.exercises?.length || 0;
      const nextExercise = exerciseIndex + 2; // 1-indexed
      if (nextExercise <= totalExercises) {
        navigate(`/workouts/${id}/exercise/${nextExercise}`);
        setState(initialState);
      } else {
        // All exercises done
        dispatch(completeWorkout());
        navigate(`/workouts/${id}`);
      }
    }
  }, [setsLength, set, startSet, stopSet, stopTimer, activeSession, exerciseIndex, dispatch, currentWorkout, id, navigate]);

  // Control rest phase
  useEffect(() => {
    if (timeLeft < 0 && !restStatus) {
      setTimer(currentSet?.rest * 60);
      setState((prevState) => ({ ...prevState, restStatus: true }));
    }
  }, [timeLeft, restStatus, currentSet, setTimer]);

  // Auto-advance after rest
  useEffect(() => {
    if (timeLeft < 0 && restStatus) {
      nextSet();
    }
  }, [timeLeft, restStatus, nextSet]);

  // Set music player playlist
  useEffect(() => {
    if (currentWorkout) {
      setPlaylist(currentWorkout.playlist);
    }
  }, [currentWorkout, setPlaylist]);

  // Reset set state when exercise changes
  useEffect(() => {
    setState(initialState);
    stopTimer();
  }, [exerciseNumber, stopTimer]);

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
          Failed to load exercise: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="App-header" sx={{ px: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
      <LoaderWrapper isLoading={isLoading}>
        <Title>
          Exercise {exerciseNumber}: {currentExercise?.label}
        </Title>

        {restStatus && (
          <Chip label="Rest Phase" color="info" sx={{ mb: 1 }} />
        )}

        <Timer progress={progress} time={timeLeft} />

        <ExerciseSet
          set={currentSet}
          setNumber={set + 1}
          totalSets={setsLength}
          onStartClick={startSet}
          onPauseClick={pauseSet}
          onPrevClick={prevSet}
          onNextClick={nextSet}
          onStopClick={stopSet}
        />

        {currentWorkout && exerciseIndex + 2 <= (currentWorkout.exercises?.length || 0) && (
          <Button
            variant="outlined"
            color="primary"
            endIcon={<NextIcon />}
            onClick={() => {
              stopSet();
              navigate(`/workouts/${id}/exercise/${exerciseIndex + 2}`);
            }}
            sx={{ mt: 2 }}
          >
            Skip to Next Exercise
          </Button>
        )}
      </LoaderWrapper>
    </Box>
  );
};

export default Exercise;
