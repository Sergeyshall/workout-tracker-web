import React, { memo } from 'react';
import { IconButton, Box, Typography, Chip, Stack } from '@mui/material';
import {
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import '../css/exerciseSet.scss';

const ExerciseSet = ({
  set: { label, image, reps, time, rest },
  setNumber,
  totalSets,
  onStartClick,
  onPauseClick,
  onPrevClick,
  onNextClick,
  onStopClick,
}) => {
  return (
    <div className="exercise-set-wrapper">
      <img
        src={image || '/img/dummy-img.jpg'}
        alt={label}
        width="100%"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/img/dummy-img.jpg';
        }}
      />
      <div className="set-control-box">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {label}
        </Typography>
        {totalSets > 0 && (
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            Set {setNumber} of {totalSets}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mb: 1, justifyContent: 'center' }}>
          <Chip label={`${reps} reps`} size="small" />
          <Chip label={`${time} min`} size="small" />
          <Chip label={`${rest} min rest`} size="small" />
        </Stack>
        <Box>
          <IconButton color="inherit" aria-label="previous set" onClick={onPrevClick}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="play set" onClick={onStartClick}>
            <PlayArrowIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="pause set" onClick={onPauseClick}>
            <PauseIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="stop set" onClick={onStopClick}>
            <StopIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="next set" onClick={onNextClick}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </div>
    </div>
  );
};

export default memo(ExerciseSet);
