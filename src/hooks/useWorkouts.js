import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkouts } from '../slices/workoutsSlice';

const useWorkouts = (workoutName, exerciseNumber) => {
  const lastSuccessTimestamp = useSelector((s) => s.workouts.lastSuccessTimestamp);
  const workouts = useSelector((s) => s.workouts.workouts);
  const isLoading = useSelector((s) => s.workouts.isLoading);
  const error = useSelector((s) => s.workouts.error);
  const dispatch = useDispatch();

  const currentWorkout = workouts.find((w) => w.name === workoutName);
  const exerciseIndex = parseInt(exerciseNumber, 10) - 1;
  const currentExercise = currentWorkout?.exercises[exerciseIndex];

  useEffect(() => {
    if (!lastSuccessTimestamp) {
      dispatch(fetchWorkouts());
    }
  }, [lastSuccessTimestamp, dispatch]);

  return {
    isLoading,
    error,
    workouts,
    lastSuccessTimestamp,
    currentWorkout,
    currentExercise,
  };
};

export default useWorkouts;
