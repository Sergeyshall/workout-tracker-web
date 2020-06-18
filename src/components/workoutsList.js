import React from 'react';
import {
  withStyles,
  Icon,
  IconButton,
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Collapse,
  ThemeProvider,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { connect } from 'react-redux';

import theme from "../theme";
import { getWorkOutsAction } from "../actions/workouts";

const styles = () => {
  return {
    root: {
      width: '100%',
      margin: '0 20px',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    exercises: {
      backgroundColor: theme.palette.info.main,
    },
    currentDayHighlight: {
      color: theme.palette.success.main,
    },
    icon: {
      color: theme.palette.primary.main,
    }
  }
};

class WorkoutsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: null,
      currentDay: (new Date()).getDay(),
    }
  }

  componentDidMount() {
    const { getWorkOuts } = this.props;

    // Get workouts data
    getWorkOuts();
  }

  handleExpandClick(workoutId) {
    this.setState({ opened: workoutId });
  }

  render() {
    const { classes, workouts, isLoading } = this.props;
    const { opened, currentDay } = this.state;

    const WorkoutListItem = ({ workout }) => <ThemeProvider theme={theme}>
      <ListItem
        button
        divider
      >
        <ListItemIcon>
          <Icon className={classes.icon}>today</Icon>
        </ListItemIcon>
        <ListItemText
          className={`${workout.day === currentDay && classes.currentDayHighlight}`}
          primary={workout.label}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="expand"
            onClick={() => this.handleExpandClick(workout.name)}
          >
            <Icon
              className={classes.icon}
            >
              {opened === workout.name ? "expand_less" : "expand_more"}
            </Icon>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse
        in={opened === workout.name}
        timeout="auto"
        unmountOnExit
        className={classes.exercises}
      >
        <List component="div" disablePadding>
          {
            workout.exercises.map((exercise, key) => (
              <ListItem key={key} button className={classes.nested}>
                <ListItemIcon>
                  <Icon className={classes.icon}>alarm</Icon>
                </ListItemIcon>
                <ListItemText primary={exercise.label} />
              </ListItem>)
            )
          }
        </List>
      </Collapse>
    </ThemeProvider>;

    return <List
      component="nav"
      className={classes.root}
    >
      {isLoading && 'Loading...'}
      {
        workouts.map((workout) => <WorkoutListItem
          key={workout.name}
          workout={workout}
        />)
      }
    </List>
  }
}

const mapStateToProps = state => ({
  workouts: state.workouts.workouts,
  isLoading: state.workouts.isLoading,
});

const mapDispatchToProps = dispatch => ({
  getWorkOuts: () => dispatch(getWorkOutsAction()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WorkoutsList));
