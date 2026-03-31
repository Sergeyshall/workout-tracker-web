import { createSlice } from '@reduxjs/toolkit';

const workoutProgressSlice = createSlice({
    name: 'workoutProgress',
    initialState: {
        // Current active workout session
        active: null,
        // History of completed workouts
        history: [],
    },
    reducers: {
        startWorkoutSession(state, action) {
            const { workoutName, exercises } = action.payload;
            state.active = {
                date: new Date().toISOString(),
                workoutName,
                exercises: exercises.map((exercise) => ({
                    name: exercise.name,
                    label: exercise.label,
                    sets: exercise.sets.map(() => ({
                        completed: false,
                    })),
                })),
                currentExercise: 0,
                currentSet: 0,
                completed: false,
            };
        },
        completeSet(state, action) {
            const { exerciseIndex, setIndex } = action.payload;
            if (state.active) {
                state.active.exercises[exerciseIndex].sets[setIndex].completed = true;
            }
        },
        setCurrentPosition(state, action) {
            const { exerciseIndex, setIndex } = action.payload;
            if (state.active) {
                state.active.currentExercise = exerciseIndex;
                state.active.currentSet = setIndex;
            }
        },
        completeWorkout(state) {
            if (state.active) {
                state.active.completed = true;
                state.history.push({
                    ...state.active,
                    completedAt: new Date().toISOString(),
                });
                state.active = null;
            }
        },
        cancelWorkout(state) {
            state.active = null;
        },
        clearHistory(state) {
            state.history = [];
        },
    },
});

export const {
    startWorkoutSession,
    completeSet,
    setCurrentPosition,
    completeWorkout,
    cancelWorkout,
    clearHistory,
} = workoutProgressSlice.actions;

export default workoutProgressSlice.reducer;
