import { useCallback, useEffect, useState } from "react";

const intervalDuration = 100;

const initialState = {
  timer: 0,
  isInProgress: false,
  totalTime: 0,
};

const useTimer = (initTime = 0) => {
  // Initial timer setup
  useEffect(() => {
    setState(prevState => ({ ...prevState, totalTime: initTime }));
  }, [initTime]);

  const [state, setState] = useState(initialState);
  const { timer, totalTime, isInProgress } = state;

  const timeLeft = totalTime - timer;
  const progress = (totalTime - timeLeft) / totalTime;

  const setTimer = useCallback((totalTime) => {
    setState(prevState => ({ ...prevState, timer: 0, totalTime }));
  }, []);

  const startTimer = useCallback(() => {
    setState(prevState => ({ ...prevState, isInProgress: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prevState => ({ ...prevState, isInProgress: false }));
  }, []);

  const stopTimer = useCallback(() => {
    setState(prevState => ({ ...prevState, timer: 0, isInProgress: false }));
  }, []);

  // Timer
  useEffect(() => {
    let timerId;

    if (isInProgress) {
      timerId = setInterval(() => {
        if (isInProgress) {
          setState(prevState => ({
            ...prevState,
            timer: prevState.timer + 1,
          }));
        }
      }, intervalDuration);
    }

    return () => clearInterval(timerId);
  }, [isInProgress, totalTime]);

  return {
    timeLeft,
    progress,
    pauseTimer,
    stopTimer,
    startTimer,
    setTimer,
  }
};

export default useTimer;
