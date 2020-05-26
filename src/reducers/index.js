import { combineReducers } from "redux";
import drawerMenu from './drawerMenu';
import workouts from "./workouts";

const rootReducer = combineReducers({
  drawerMenu,
  workouts,
});

export default rootReducer;