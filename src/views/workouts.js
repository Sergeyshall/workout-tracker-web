import React from "react";

import Title from "../components/title";
import WorkoutsList from "../components/workoutsList";

class Workouts extends React.Component {
  render() {
    return <header className="App-header">
      <Title>
        Workouts list
      </Title>
      <WorkoutsList />
    </header>
  }
}

export default Workouts;
