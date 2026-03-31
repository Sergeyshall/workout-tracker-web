import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWorkoutsWithExercises } from '../core';

export const fetchWorkouts = createAsyncThunk(
    'workouts/fetch',
    async () => {
        return await getWorkoutsWithExercises();
    }
);

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: {
        workouts: [],
        isLoading: false,
        error: null,
        lastSuccessTimestamp: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkouts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWorkouts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.workouts = action.payload;
                state.lastSuccessTimestamp = Date.now();
            })
            .addCase(fetchWorkouts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default workoutsSlice.reducer;
