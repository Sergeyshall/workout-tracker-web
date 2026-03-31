import { describe, it, expect } from 'vitest';
import reducer, {
    startWorkoutSession,
    completeSet,
    setCurrentPosition,
    completeWorkout,
    clearHistory,
} from './workoutProgressSlice';

const initialState = {
    active: null,
    history: [],
};

const workoutPayload = {
    workoutName: 'warm-up',
    exercises: [
        {
            name: 'warm-up',
            label: 'Warm-Up',
            sets: [{ time: '1', rest: '0.5' }, { time: '1', rest: '0.5' }],
        },
    ],
};

describe('workoutProgressSlice', () => {
    it('starts a workout session with per-set completion flags', () => {
        const state = reducer(initialState, startWorkoutSession(workoutPayload));

        expect(state.active.workoutName).toBe('warm-up');
        expect(state.active.exercises).toHaveLength(1);
        expect(state.active.exercises[0].sets).toEqual([
            { completed: false },
            { completed: false },
        ]);
    });

    it('marks a set completed and updates current position', () => {
        let state = reducer(initialState, startWorkoutSession(workoutPayload));
        state = reducer(state, completeSet({ exerciseIndex: 0, setIndex: 1 }));
        state = reducer(state, setCurrentPosition({ exerciseIndex: 0, setIndex: 1 }));

        expect(state.active.exercises[0].sets[1].completed).toBe(true);
        expect(state.active.currentExercise).toBe(0);
        expect(state.active.currentSet).toBe(1);
    });

    it('completes workout and pushes it to history', () => {
        let state = reducer(initialState, startWorkoutSession(workoutPayload));
        state = reducer(state, completeSet({ exerciseIndex: 0, setIndex: 0 }));
        state = reducer(state, completeSet({ exerciseIndex: 0, setIndex: 1 }));
        state = reducer(state, completeWorkout());

        expect(state.active).toBeNull();
        expect(state.history).toHaveLength(1);
        expect(state.history[0].completed).toBe(true);
        expect(state.history[0].completedAt).toBeTruthy();
    });

    it('clears history', () => {
        let state = reducer(initialState, startWorkoutSession(workoutPayload));
        state = reducer(state, completeWorkout());
        state = reducer(state, clearHistory());

        expect(state.history).toEqual([]);
    });
});
