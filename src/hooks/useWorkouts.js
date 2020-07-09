import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getWorkOutsAction } from "../actions/workouts";

/**
 * Custom hook implements Workouts data management
 *
 * @param workoutName {string} - workout name
 * @param exerciseNumber {number} - exercise number
 * @returns {{isLoading, currentWorkout: *, currentExercise: *, workouts, lastSuccessTimestamp}}
 */
const useWorkouts = (workoutName, exerciseNumber) => {
  const lastSuccessTimestamp = useSelector(state => state.workouts.lastSuccessTimestamp);
  const workouts = useSelector(state => state.workouts.workouts);
  const isLoading = useSelector(state => state.workouts.isLoading);
  const dispatch = useDispatch();

  const currentWorkout = workouts.find(workout => workout.name === workoutName);
  const exerciseIndex = parseInt(exerciseNumber, 10) - 1;
  const currentExercise = currentWorkout?.exercises[exerciseIndex];

  // Initial data loading on component mount
  useEffect(() => {
    // No timestamp for data
    if (!lastSuccessTimestamp) {
      // Dispatch data fetching
      dispatch(getWorkOutsAction());
    }
  }, [lastSuccessTimestamp, dispatch]);

  return {
    isLoading,
    workouts,
    lastSuccessTimestamp,
    currentWorkout,
    currentExercise,
  }
};

export default useWorkouts;
