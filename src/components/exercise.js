import React from "react";
import { Link } from "react-router-dom";

const Exercise = (props) => {
  const { exercise, workoutName, exerciseNumber } = props;

  return <Link to={`/workouts/${workoutName}/exercise/${exerciseNumber}/${exercise.name}`}>
    <p>{exercise.label}</p>
    <p>{exercise.description}</p>
    <p>{exercise.image}</p>
    <img src={exercise.image} alt={exercise.label} />
    <p>{exercise.sets.length}</p>
  </Link>
};

export default Exercise;
