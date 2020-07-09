import React, { useEffect, useState, useCallback } from "react";

import Title from "../components/title";
import LoaderWrapper from "../components/loaderWrapper";
import ExerciseSet from "../components/exerciseSet";
import Timer from "../components/timer";

import useWorkouts from "../hooks/useWorkouts";
import useMusicPlayer from "../hooks/useMusicPlayer";
import useTimer from "../hooks/useTimer";

const initialState = {
  set: 0,
  restStatus: false,
};

const Exercise = (props) => {
  const { match: { params: { id, exerciseNumber } } } = props;
  const [state, setState] = useState(initialState);
  const { set, restStatus } = state;
  const { isLoading, currentWorkout, currentExercise } = useWorkouts(id, exerciseNumber);
  const { setPlaylist, stopMusicPlayer, startMusicPlayer, pauseMusicPlayer } = useMusicPlayer();

  const currentSet = currentExercise?.sets?.[set] || {};
  const setsLength = currentExercise?.sets?.length;
  const totalTime = restStatus ? currentSet?.rest : currentSet?.time;

  const {
    timeLeft,
    progress,
    setTimer,
    pauseTimer,
    stopTimer,
    startTimer,
  } = useTimer(totalTime * 60);

  const startSet = useCallback(() => {
    startTimer();

    // Start music TODO: Should it be moved to start workout?
    startMusicPlayer();
  }, [startMusicPlayer, startTimer]);

  const prevSet = useCallback(() => {
    if (set > 0) {
      stopTimer();
      setState({ ...initialState, set: set - 1 });

      // Start prev set with a pause
      setTimeout(() => {
        startSet();
      }, 100);
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
    const nextSetNumber = setsLength && set + 1 < setsLength && set + 1;

    if (nextSetNumber) {
      setState({
        ...initialState,
        set: nextSetNumber,
      });

      // Start next set with a pause
      setTimeout(() => {
        startSet();
      }, 100);
    } else {
      // Exercise is over
      alert("exercise is over");

      stopSet();
    }
  }, [setsLength, set, startSet, stopSet, stopTimer]);

  // Control rest phase
  useEffect(() => {
    if (timeLeft < 0 && !restStatus) {
      setTimer(currentSet?.rest * 60);
      setState(prevState => ({ ...prevState, restStatus: true }));
    }
  }, [timeLeft, restStatus, currentSet, setTimer]);

  // Control auto navigation to the next set
  useEffect(() => {
    if (timeLeft < 0 && restStatus) {
      nextSet();
    }
  }, [timeLeft, restStatus, nextSet]);

  // Set music player playlist for the current workout
  useEffect(() => {
    if (currentWorkout) {
      setPlaylist(currentWorkout.playlist);
    }
  }, [currentWorkout, setPlaylist]);

  return <header className="App-header">
    <LoaderWrapper isLoading={isLoading}>
      <Title>
        Exercise {exerciseNumber}: {currentExercise?.label}
      </Title>

      {restStatus && <p>Rest phase</p>}
      <Timer progress={progress} time={timeLeft} />
      <ExerciseSet
        set={currentSet}
        onStartClick={startSet}
        onPauseClick={pauseSet}
        onPrevClick={prevSet}
        onNextClick={nextSet}
        onStopClick={stopSet}
      />
    </LoaderWrapper>
  </header>
};

export default Exercise;
