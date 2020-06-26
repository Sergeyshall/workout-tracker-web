import { combineReducers } from "redux";
import drawerMenu from './drawerMenu';
import workouts from "./workouts";
import musicPlayer from "./musicPlayer";

const rootReducer = combineReducers({
  drawerMenu,
  workouts,
  musicPlayer,
});

export default rootReducer;