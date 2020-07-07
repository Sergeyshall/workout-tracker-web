import { TOGGLE_MUSIC_PLAYER, SET_MUSIC_PLAYER_PLAYLIST } from './constants';

const toggleMusicPlayer = () => ({
  type: TOGGLE_MUSIC_PLAYER,
});

const setMusicPlayerPlaylist = (playList) => ({
  type: SET_MUSIC_PLAYER_PLAYLIST,
  payload: playList,
});

export {
  toggleMusicPlayer,
  setMusicPlayerPlaylist,
}
