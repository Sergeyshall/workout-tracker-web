import { SET_MUSIC_PLAYER_PLAYLIST, TOGGLE_MUSIC_PLAYER } from "../actions/constants";

const defaultState = {
  isOpen: true,
  playlist: null,
};

const musicPlayer = (state = defaultState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case TOGGLE_MUSIC_PLAYER:
      newState.isOpen = !newState.isOpen;

      return newState;
    case SET_MUSIC_PLAYER_PLAYLIST:
      newState.playlist = action.payload;

      return newState;
    default:
      return state;
  }
};

export default musicPlayer;
