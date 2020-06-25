import React, { useEffect } from "react";
import { connect } from "react-redux";

import Title from "../components/title";
import { getWorkOutsAction } from "../actions/workouts";
import LoaderWrapper from "../components/loaderWrapper";
import Exercise from "../components/exercise";

const Workout = (props) => {
  const { workouts: { workouts, isLoading, lastSuccessTimestamp }, getWorkOuts, match: { params: { id } } } = props;
  const shouldLoadData = !lastSuccessTimestamp || workouts.length === 0;

  useEffect(() => {
    if (shouldLoadData) {
      console.log("Load workout");
      // Initial data loading
      getWorkOuts();
    }
  }, [shouldLoadData, getWorkOuts]);

  const currentWorkout = workouts.find(workout => workout.name === id);

  const exercisesList = currentWorkout?.exercises?.map((exercise, key) => {
    return <Exercise
      key={key}
      exercise={exercise}
      exerciseNumber={key + 1}
      workoutName={currentWorkout.name}
    />
  });

  return <header className="App-header">
    <LoaderWrapper isLoading={isLoading}>
      <Title>
        {`${currentWorkout?.label} workout!`}
      </Title>
      {exercisesList}
    </LoaderWrapper>
  </header>
};

const mapStateToProps = (state) => ({
  workouts: state.workouts,
});

const mapDispatchToProps = dispatch => ({
  getWorkOuts: () => dispatch(getWorkOutsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
