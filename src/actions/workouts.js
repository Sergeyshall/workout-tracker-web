import { getWorkoutsWithExercises } from "../core";
import { GET_WORKOUTS_STARTED, GET_WORKOUTS_SUCCESS, GET_WORKOUTS_ERROR } from "./types";

const getWorkOutsActionSuccess = data => ({
  type: GET_WORKOUTS_SUCCESS,
  payload: { workouts: data },
});

const getWorkOutsActionStarted = () => ({
  type: GET_WORKOUTS_STARTED,
});

const getWorkOutsActionError = error => ({
  type: GET_WORKOUTS_ERROR,
  payload: {
    error,
  }
});

const getWorkOutsAction = () => {
  return async dispatch => {
    dispatch(getWorkOutsActionStarted());

    try {
      const data = await getWorkoutsWithExercises();

      dispatch(getWorkOutsActionSuccess(data));
    } catch (error) {
      dispatch(getWorkOutsActionError(error))
    }
  }
};

export {
  getWorkOutsAction,
}
