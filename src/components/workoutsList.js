import React, { useState } from 'react';
import {
  withStyles,
  List,
} from "@material-ui/core";

import WorkoutListItem from "./workoutListItem";
import useWorkouts from "../hooks/useWorkouts";

const styles = () => {
  return {
    root: {
      width: '100%',
      margin: '0 20px',
    },
  }
};

const initState = {
  opened: null,
};

const WorkoutsList = (props) => {
  const [state, setState] = useState(initState);
  const { opened } = state;
  const { classes } = props;

  const { workouts, isLoading } = useWorkouts();

  const handleExpandClick = (workoutId) => {
    let { opened } = state;
    opened = opened === workoutId ? null : workoutId;

    setState({ ...state, opened });
  };

  return <List
      component="nav"
      className={classes.root}
    >
      {console.log("render")}
      {isLoading && 'Loading...'}
      {
        workouts.map((workout) => <WorkoutListItem
          key={workout.name}
          workout={workout}
          isOpen={opened === workout.name}
          onExpandClick={handleExpandClick}
        />)
      }
    </List>
};

export default withStyles(styles)(WorkoutsList);
