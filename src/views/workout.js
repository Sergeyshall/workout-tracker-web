import React from "react";

import Title from "../components/title";
import LoaderWrapper from "../components/loaderWrapper";
import Exercise from "../components/exercise";

import useWorkouts from "../hooks/useWorkouts";

const Workout = (props) => {
  const { match: { params: { id } } } = props;
  const { currentWorkout, isLoading } = useWorkouts(id);

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

export default Workout;
