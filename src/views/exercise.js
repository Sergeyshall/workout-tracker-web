import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";

import Title from "../components/title";
import { getWorkOutsAction } from "../actions/workouts";
import { setMusicPlayerPlaylist } from "../actions/musicPlayer";
import LoaderWrapper from "../components/loaderWrapper";
import ExerciseSet from "../components/exerciseSet";
import Timer from "../components/timer";

import events from "../utils/events";
import { START_MUSIC_PLAYER_EVENT, STOP_MUSIC_PLAYER_EVENT, PAUSE_MUSIC_PLAYER_EVENT } from "../actions/constants";
import { getTimeString } from "../utils";

const initialState = {
  set: 0,
  timer: 0,
  timeLeft: 0,
  progress: 0,
  timerStarted: false,
  restStatus: false,
  prevTimer: 0,
};
const intervalDuration = 1000;

const Exercise = (props) => {
  const [state, setState] = useState(initialState);
  const { set, timer, timeLeft, progress, timerStarted, restStatus, prevTimer } = state;

  const {
    workouts: { workouts, isLoading, lastSuccessTimestamp },
    getWorkOuts,
    setMusicPlaylist,
    match: { params: { id, exerciseNumber } }
  } = props;
  const shouldLoadData = !lastSuccessTimestamp;

  // Initial data loading on component mount
  useEffect(() => {
    if (shouldLoadData) {
      // Initial data loading
      getWorkOuts();
    }
  }, [shouldLoadData, getWorkOuts]);

  // Timer
  useEffect(() => {
    let elapsedSeconds = prevTimer;

    const timerId = setInterval(() => {
      if (timerStarted) {
        elapsedSeconds += 1;

        setState(prevState => ({...prevState, timer: elapsedSeconds}));
      }
    }, intervalDuration);

    return () => clearInterval(timerId);
  }, [timerStarted, prevTimer]);

  const currentWorkout = workouts.find(workout => workout.name === id);
  const exerciseListIndex = parseInt(exerciseNumber, 10) - 1;
  const currentExercise = currentWorkout?.exercises[exerciseListIndex];
  const currentSet = currentExercise?.sets?.[set] || {};
  const setsLength = currentExercise?.sets?.length;

  useEffect(() => {
    // Set music player playlist for the current workout
    if (currentWorkout) {
      setMusicPlaylist(currentWorkout.playlist);
    }

  }, [currentWorkout, setMusicPlaylist]);

  const nextSet = useCallback(() => {
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

      // Stop music TODO: Should it be moved to stop workout?
      events.emit(STOP_MUSIC_PLAYER_EVENT);
      stopSet();
    }
  }, [setsLength, set]);

  const prevSet = () => {
    if (set > 0) {
      setState({ ...initialState, set: set - 1 });

      // Start prev set with a pause
      setTimeout(() => {
        startSet();
      }, 100);
    }
  };

  const startSet = () => {
    setState(prevState => ({ ...prevState, timerStarted: true }));

    // Start music TODO: Should it be moved to start workout?
    events.emit(START_MUSIC_PLAYER_EVENT);
  };

  const stopSet = () => {
    setState(prevState => ({ ...prevState, timerStarted: false, timer: 0, prevTimer: 0 }));
    events.emit(STOP_MUSIC_PLAYER_EVENT);
  };

  const pauseSet = () => {
    setState(prevState => ({ ...prevState, timerStarted: false, prevTimer: timer }));
    events.emit(PAUSE_MUSIC_PLAYER_EVENT);
  };

  useEffect(() => {
    const setTime = currentSet?.time * 60;
    const restTime = currentSet?.rest * 60;
    let timeLeft = setTime - timer || 0;
    let isRest = false;

    if (timeLeft < 0) {
      // Add Rest time
      timeLeft += restTime;
      isRest = true;
    }

    // Set time progress in %
    const progressTotalTime = isRest ? restTime : setTime;
    const progress = (progressTotalTime - timeLeft) / progressTotalTime;

    const timeString = getTimeString(timeLeft);
    setState(prevState => ({ ...prevState, timeString, timeLeft, progress, restStatus: isRest }));

    // Rest time is over (set is over)
    if (timeLeft < 0) {
      nextSet();
    }
  }, [timer, currentSet, nextSet]);

  return <header className="App-header">
    <LoaderWrapper isLoading={isLoading}>
      <Title>
        Exercise {exerciseNumber}: {currentExercise?.label}
      </Title>
      <button onClick={startSet}>Start set</button>
      <button onClick={pauseSet}>Pause set</button>
      <button onClick={stopSet}>Stop set</button>
      {restStatus && <p>Rest phase</p>}
      <Timer progress={progress} time={timeLeft} />
      <ExerciseSet set={currentSet} />
      <button onClick={prevSet}>Prev Set</button>
      <button onClick={nextSet}>Next Set</button>
    </LoaderWrapper>
  </header>
};

const mapStateToProps = (state) => ({
  workouts: state.workouts,
});

const mapDispatchToProps = dispatch => ({
  getWorkOuts: () => dispatch(getWorkOutsAction()),
  setMusicPlaylist: (playlist) => dispatch(setMusicPlayerPlaylist(playlist)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);
