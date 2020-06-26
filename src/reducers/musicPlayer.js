import { TOGGLE_MUSIC_PLAYER} from "../actions/constants";

const defaultState = {
  isOpen: false,
};

const musicPlayer = (state = defaultState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case TOGGLE_MUSIC_PLAYER:
      newState.isOpen = !newState.isOpen;

      return newState;
    default:
      return state;
  }
};

export default musicPlayer;
