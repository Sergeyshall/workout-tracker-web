import { useCallback, useEffect, useState } from "react";

const initialState = {
  timer: 0,
  isInProgress: false,
  totalTime: 0,
};

const useTimer = (initTime = 0) => {
  const [state, setState] = useState(initialState);
  const { timer, totalTime, isInProgress } = state;

  // Initial timer setup
  useEffect(() => {
    setState((prevState) => ({ ...prevState, totalTime: initTime, timer: 0 }));
  }, [initTime]);

  const timeLeft = totalTime - timer;
  const progress = totalTime > 0 ? timer / totalTime : 0;

  const setTimer = useCallback((totalTime) => {
    setState((prevState) => ({ ...prevState, timer: 0, totalTime }));
  }, []);

  const startTimer = useCallback(() => {
    setState((prevState) => ({ ...prevState, isInProgress: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState((prevState) => ({ ...prevState, isInProgress: false }));
  }, []);

  const stopTimer = useCallback(() => {
    setState((prevState) => ({ ...prevState, timer: 0, isInProgress: false }));
  }, []);

  // Timer — 1 second interval (was 100ms = 10x too fast)
  useEffect(() => {
    let timerId = null;

    if (isInProgress) {
      timerId = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          timer: prevState.timer + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [isInProgress]);

  return {
    timeLeft,
    progress,
    pauseTimer,
    stopTimer,
    startTimer,
    setTimer,
    isInProgress,
  };
};

export default useTimer;
