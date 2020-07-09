import React, { memo } from "react";
import { Icon, IconButton } from "@material-ui/core";

import "../css/exerciseSet.scss";

const ExerciseSet = (props) => {
  const {
    set: { label, image, reps, time, rest },
    onStartClick,
    onPauseClick,
    onPrevClick,
    onNextClick,
    onStopClick,
  } = props;

  console.log("rendering!!");

  return <div className="exercise-set-wrapper">
    <img src={image} alt={label} width="100%" />
    <div className="set-control-box">
      <p>{label} Reps: {reps} Time: {time} Rest: {rest}</p>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="prev-set"
        onClick={onPrevClick}
      >
        <Icon>skip_previous</Icon>
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="play-set"
        onClick={onStartClick}
      >
        <Icon>play_arrow</Icon>
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="pause-set"
        onClick={onPauseClick}
      >
        <Icon>pause</Icon>
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="stop-set"
        onClick={onStopClick}
      >
        <Icon>stop</Icon>
      </IconButton>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="next-set"
        onClick={onNextClick}
      >
        <Icon>skip_next</Icon>
      </IconButton>
    </div>

  </div>
};

export default memo(ExerciseSet);
