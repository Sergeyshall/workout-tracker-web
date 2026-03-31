import React, { useState } from 'react';
import { List, Alert } from '@mui/material';
import WorkoutListItem from './workoutListItem';
import useWorkouts from '../hooks/useWorkouts';
import LoaderWrapper from './loaderWrapper';

const WorkoutsList = () => {
  const [opened, setOpened] = useState(null);
  const { workouts, isLoading, error } = useWorkouts();

  const handleExpandClick = (workoutId) => {
    setOpened((prev) => (prev === workoutId ? null : workoutId));
  };

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>Failed to load workouts: {error}</Alert>;
  }

  return (
    <LoaderWrapper isLoading={isLoading}>
      <List component="nav" sx={{ width: '100%', mx: '20px' }}>
        {workouts.map((workout) => (
          <WorkoutListItem
            key={workout.name}
            workout={workout}
            isOpen={opened === workout.name}
            onExpandClick={handleExpandClick}
          />
        ))}
      </List>
    </LoaderWrapper>
  );
};

export default WorkoutsList;
