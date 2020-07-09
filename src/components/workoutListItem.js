import React from "react";
import {
  Collapse,
  Icon,
  IconButton, List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ThemeProvider, withStyles
} from "@material-ui/core";
import {Link} from "react-router-dom";

import theme from "../theme";

const styles = () => {
  return {
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

const WorkoutListItem = (props) => {
  const { classes, workout, isOpen, onExpandClick } = props;
  const currentDay = new Date().getDay();
  const expandClickHandler = () => onExpandClick(workout.name);

  return <ThemeProvider theme={theme}>
    <ListItem
      button
      divider
      component={Link}
      to={`/workouts/${workout.name}`}
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
          onClick={expandClickHandler}
          data-name={workout.name}
        >
          <Icon
            className={classes.icon}
          >
            {isOpen ? "expand_less" : "expand_more"}
          </Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Collapse
      in={isOpen}
      timeout="auto"
      unmountOnExit
      className={classes.exercises}
    >
      <List component="div" disablePadding>
        {
          workout.exercises.map((exercise, key) => <ListItem
              key={key}
              button
              className={classes.nested}
              component={Link}
              to={`/workouts/${workout.name}`}
            >
              <ListItemIcon>
                <Icon className={classes.icon}>alarm</Icon>
              </ListItemIcon>
              <ListItemText primary={exercise.label} />
            </ListItem>
          )
        }
      </List>
    </Collapse>
  </ThemeProvider>;
};

export default withStyles(styles)(WorkoutListItem);
