import { Icon } from "@material-ui/core";
import React from "react";
import { connect } from 'react-redux';
import { getWorkOutsAction } from "../actions/workouts";

class Workouts extends React.Component {

  componentDidMount() {
    const { getWorkOuts } = this.props;

    getWorkOuts();
  }

  render() {
    const { workouts, isLoading } = this.props;

    const workoutsList = workouts.map((workout, key) => {
      return <li key={key}>{workout.label}</li>;
    });

    return <header className="App-header">
      <Icon className="App-logo">fitness_center</Icon>
      <p>
        Workouts view {isLoading && 'Loading...'}
      </p>
      {workoutsList}
    </header>
  }
}

const mapStateToProps = state => {
  return {
    workouts: state.workouts.workouts,
    isLoading: state.workouts.isLoading,
  };
};

const mapDispatchToProps = dispatch => ({
  getWorkOuts: () => getWorkOutsAction(),
});

export default connect(mapStateToProps, mapDispatchToProps())(Workouts);
