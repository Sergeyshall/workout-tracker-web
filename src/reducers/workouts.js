import { GET_WORKOUTS_STARTED, GET_WORKOUTS_SUCCESS, GET_WORKOUTS_ERROR } from "../actions/constants";

const defaultState = {
  workouts: [],
};

const workouts = (state = defaultState, action) => {
  const newState = {...state};

  switch (action.type) {
    case GET_WORKOUTS_STARTED:
      newState.isLoading = true;

      return newState;
    case GET_WORKOUTS_ERROR:
      newState.isLoading = false;
      newState.error = action.payload.error.message;

      return newState;
    case GET_WORKOUTS_SUCCESS:
      newState.isLoading = false;
      newState.workouts = action.payload.workouts;
      newState.lastSuccessTimestamp = new Date().getTime();

      return newState;
    default:
      return state;
  }
};

export default workouts;
