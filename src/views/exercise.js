import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";

import Title from "../components/title";
import { getWorkOutsAction } from "../actions/workouts";
import LoaderWrapper from "../components/loaderWrapper";
import ExerciseSet from "../components/exerciseSet";

const initTimeStatus = "0:00";
const initialState = {
  set: 0,
  timer: 0,
  timeString: initTimeStatus,
  timerStarted: false,
  restStatus: false,
};
const intervalDuration = 1000;

const Exercise = (props) => {
  const [state, setState] = useState(initialState);
  const { set, timer, timeString, timerStarted, restStatus } = state;

  const { workouts: { workouts, isLoading, lastSuccessTimestamp }, getWorkOuts, match: { params: { id, exerciseNumber } } } = props;
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
    let elapsedSeconds = 0;

    const timerId = setInterval(() => {
      if (timerStarted) {
        elapsedSeconds += 1;

        setState(prevState => ({...prevState, timer: elapsedSeconds}));
      }
    }, intervalDuration);

    return () => clearInterval(timerId);
  }, [timerStarted]);

  const currentWorkout = workouts.find(workout => workout.name === id);
  const exerciseListIndex = parseInt(exerciseNumber, 10) - 1;
  const currentExercise = currentWorkout?.exercises[exerciseListIndex];
  const currentSet = currentExercise?.sets?.[set] || {};
  const setsLength = currentExercise?.sets?.length;

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
      console.log("exercise is over");
      stopSet();
    }
  }, [setsLength, set]);

  const prevSet = () => {
    if (set > 0) {
      setState(prevState => ({ ...prevState, set: set - 1 }));
    }
  };

  const startSet = () => {
    setState(prevState => ({ ...prevState, timerStarted: true }));
  };

  const stopSet = () => {
    setState(prevState => ({ ...prevState, timerStarted: false, timer: 0 }));
  };

  useEffect(() => {
    const restTime = currentSet?.rest * 60;
    let timeLeft = (currentSet?.time * 60 - timer) || 0;
    let isRest = false;

    if (timeLeft < 0) {
      // Add Rest time
      timeLeft += restTime;
      isRest = true;
    }

    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft - minutesLeft * 60;

    const timeString = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    setState(prevState => ({ ...prevState, timeString, restStatus: isRest }));

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
      <button onClick={stopSet}>Stop set</button>
      <p>{restStatus && "Rest: "}{timeString}</p>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);
