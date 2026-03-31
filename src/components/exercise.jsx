import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';

const Exercise = ({ exercise, workoutName, exerciseNumber }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        mb: 2,
        bgcolor: 'background.paper',
      }}
    >
      <CardActionArea component={Link} to={`/workouts/${workoutName}/exercise/${exerciseNumber}`}>
        {exercise.image && (
          <CardMedia
            component="img"
            height="140"
            image={exercise.image || '/img/dummy-img.jpg'}
            alt={exercise.label}
            sx={{ objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/img/dummy-img.jpg';
            }}
          />
        )}
        <CardContent>
          <Typography variant="h6" component="div">
            {exerciseNumber}. {exercise.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {exercise.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Exercise;
