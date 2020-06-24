import React, { useEffect } from "react";
import { connect } from "react-redux";

import Title from "../components/title";
import { getWorkOutsAction } from "../actions/workouts";
import LoaderWrapper from "../components/loaderWrapper";

const Exercise = (props) => {
  const { workouts: { workouts, isLoading, lastSuccessTimestamp }, getWorkOuts, match: { params: { id, exerciseNumber } } } = props;
  const shouldLoadData = !lastSuccessTimestamp;

  useEffect(() => {
    if (shouldLoadData) {
      console.log("Load workout");
      // Initial data loading
      getWorkOuts();
    }
  }, [shouldLoadData, getWorkOuts]);

  const currentWorkout = workouts.find(workout => workout.name === id);

  const exerciseListIndex = parseInt(exerciseNumber, 10) - 1;
  const currentExercise = currentWorkout?.exercises[exerciseListIndex];
  const sets = currentExercise?.sets?.map(({ label, image, reps, time, rest }, key) => {
    return <div
      key={key}
    >
      <p>{label}</p>
      <img src={image} alt={label} width="100%" />
      <p>Reps: {reps}</p>
      <p>Time: {time}</p>
      <p>Rest: {rest}</p>
    </div>
  });


  console.log(currentExercise, isLoading);

  return <header className="App-header">
    <LoaderWrapper isLoading={isLoading}>
      <Title>
        Exercise {exerciseNumber}: {currentExercise?.label}
      </Title>
      {sets}

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
