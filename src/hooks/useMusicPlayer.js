import { useCallback } from 'react';
import { useDispatch } from "react-redux";
import { START_MUSIC_PLAYER_EVENT, STOP_MUSIC_PLAYER_EVENT, PAUSE_MUSIC_PLAYER_EVENT } from "../actions/constants";
import events from "../utils/events";
import { setMusicPlayerPlaylist } from "../actions/musicPlayer";

const useMusicPlayer = () => {
  const dispatch = useDispatch();

  const setPlaylist = (playlist) => {
    dispatch(setMusicPlayerPlaylist(playlist));
  };

  const stopMusicPlayer = useCallback(() => {
    events.emit(STOP_MUSIC_PLAYER_EVENT);
  }, []);

  const startMusicPlayer = useCallback(() => {
    events.emit(START_MUSIC_PLAYER_EVENT);
  }, []);

  const pauseMusicPlayer = useCallback(() => {
    events.emit(PAUSE_MUSIC_PLAYER_EVENT);
  }, []);

  return {
    setPlaylist,
    stopMusicPlayer,
    startMusicPlayer,
    pauseMusicPlayer,
  }
};

export default useMusicPlayer;
