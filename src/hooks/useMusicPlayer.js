import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  setMusicPlayerPlaylist,
  playMusic,
  pauseMusic,
  stopMusic,
} from '../slices/musicPlayerSlice';

const useMusicPlayer = () => {
  const dispatch = useDispatch();

  const setPlaylist = useCallback(
    (playlist) => dispatch(setMusicPlayerPlaylist(playlist)),
    [dispatch]
  );

  const startMusicPlayer = useCallback(
    () => dispatch(playMusic()),
    [dispatch]
  );

  const pauseMusicPlayer = useCallback(
    () => dispatch(pauseMusic()),
    [dispatch]
  );

  const stopMusicPlayer = useCallback(
    () => dispatch(stopMusic()),
    [dispatch]
  );

  return {
    setPlaylist,
    stopMusicPlayer,
    startMusicPlayer,
    pauseMusicPlayer,
  };
};

export default useMusicPlayer;
