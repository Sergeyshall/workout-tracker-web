import React from "react";

const ExerciseSet = (props) => {
  const { set: { label, image, reps, time, rest } } = props;

  return <div>
    <p>{label}</p>
    <img src={image} alt={label} width="100%" />
    <p>Reps: {reps}</p>
    <p>Time: {time}</p>
    <p>Rest: {rest}</p>
  </div>
};

export default ExerciseSet;
