import React from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Today as TodayIcon,
  Alarm as AlarmIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const WorkoutListItem = ({ workout, isOpen, onExpandClick }) => {
  const currentDay = new Date().getDay();
  const isToday = workout.day === currentDay;

  return (
    <>
      <ListItemButton
        divider
        component={Link}
        to={`/workouts/${workout.name}`}
      >
        <ListItemIcon>
          <TodayIcon sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText
          primary={workout.label}
          sx={{ color: isToday ? 'success.main' : 'inherit' }}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="expand"
            onClick={() => onExpandClick(workout.name)}
          >
            {isOpen ? (
              <ExpandLessIcon sx={{ color: 'primary.main' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: 'primary.main' }} />
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ bgcolor: 'info.main' }}>
          {workout.exercises.map((exercise, key) => (
            <ListItemButton
              key={key}
              sx={{ pl: 4 }}
              component={Link}
              to={`/workouts/${workout.name}/exercise/${key + 1}`}
            >
              <ListItemIcon>
                <AlarmIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary={exercise.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default WorkoutListItem;
