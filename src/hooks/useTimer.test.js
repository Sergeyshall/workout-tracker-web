import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useTimer from './useTimer';

describe('useTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with zero time left', () => {
        const { result } = renderHook(() => useTimer(0));
        expect(result.current.timeLeft).toBe(0);
        expect(result.current.progress).toBe(0);
        expect(result.current.isInProgress).toBe(false);
    });

    it('counts at 1-second intervals (not 100ms)', () => {
        const { result } = renderHook(() => useTimer(60));

        act(() => result.current.startTimer());

        // After 1 second, timer should be at 1
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.timeLeft).toBe(59);

        // After 10 seconds total, timer should be at 10 (not 100)
        act(() => vi.advanceTimersByTime(9000));
        expect(result.current.timeLeft).toBe(50);
    });

    it('pauses and resumes', () => {
        const { result } = renderHook(() => useTimer(60));

        act(() => result.current.startTimer());
        act(() => vi.advanceTimersByTime(5000));
        expect(result.current.timeLeft).toBe(55);

        act(() => result.current.pauseTimer());
        act(() => vi.advanceTimersByTime(5000));
        expect(result.current.timeLeft).toBe(55); // unchanged

        act(() => result.current.startTimer());
        act(() => vi.advanceTimersByTime(5000));
        expect(result.current.timeLeft).toBe(50);
    });

    it('stops and resets to zero', () => {
        const { result } = renderHook(() => useTimer(60));

        act(() => result.current.startTimer());
        act(() => vi.advanceTimersByTime(10000));
        expect(result.current.timeLeft).toBe(50);

        act(() => result.current.stopTimer());
        expect(result.current.timeLeft).toBe(60);
        expect(result.current.isInProgress).toBe(false);
    });

    it('reports progress as a fraction', () => {
        const { result } = renderHook(() => useTimer(100));

        act(() => result.current.startTimer());
        act(() => vi.advanceTimersByTime(50000));
        expect(result.current.progress).toBeCloseTo(0.5);
    });
});
