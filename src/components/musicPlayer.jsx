import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import {
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  CloudDownload as CloudDownloadIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  toggleMusicPlayer,
  clearMusicCommand,
} from '../slices/musicPlayerSlice';

const DEFAULT_PLAYLIST_ID = 'PLOIpw4rxNuT6xSJyebE1mSI-3pkkt4fEj';

const BUFFERING = 3;
const CUED = 5;
const PLAYING = 1;

const MusicPlayer = () => {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { isOpen, playlist, command } = useSelector((s) => s.musicPlayer);

  const [playerState, setPlayerState] = useState({
    isExpanded: true,
    song: {},
    state: null,
    readyToPlay: false,
  });

  const { song: { author, title }, state, isExpanded, readyToPlay } = playerState;

  const loadPlaylist = (id) => {
    playerRef.current?.cuePlaylist({ list: id, index: 0, startSeconds: 0 });
  };

  // Mount: load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.dataset.wtYoutubeApi = '1';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    let collapseTimerId = null;

    if (firstScriptTag?.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    const onPlayerStateChange = (event) => {
      const ytState = event.data;
      const update = { state: ytState };

      if (ytState === BUFFERING) {
        update.song = {};
      }
      if ([PLAYING, CUED].includes(ytState)) {
        update.song = playerRef.current.getVideoData();
        update.readyToPlay = true;
      }
      setPlayerState((prev) => ({ ...prev, ...update }));
    };

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('music_player', {
        height: '300',
        width: '100%',
        playerVars: { playsinline: 1 },
        events: {
          onReady: () => {
            loadPlaylist(DEFAULT_PLAYLIST_ID);
            collapseTimerId = setTimeout(() => {
              setPlayerState((prev) => ({ ...prev, isExpanded: false }));
              dispatch(toggleMusicPlayer());
            }, 1000);
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT?.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (collapseTimerId) {
        clearTimeout(collapseTimerId);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
      if (tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, [dispatch]);

  // React to music commands from Redux (replaces EventEmitter)
  useEffect(() => {
    if (!command || !playerRef.current) return;
    switch (command) {
      case 'play':
        playerRef.current.playVideo();
        break;
      case 'pause':
        playerRef.current.pauseVideo();
        break;
      case 'stop':
        playerRef.current.stopVideo();
        break;
    }
    dispatch(clearMusicCommand());
  }, [command, dispatch]);

  // Update playlist
  useEffect(() => {
    if (playlist && readyToPlay) {
      loadPlaylist(playlist);
    }
  }, [playlist, readyToPlay]);

  const songTitle = useMemo(() => {
    if (!author && !title) return 'Loading...';
    const cleanAuthor = author?.replace(' - Topic', ' : ') || '';
    return `${cleanAuthor}${title || ''}`;
  }, [author, title]);

  const musicPlayerStyle = {
    height: isExpanded ? 300 : 0,
  };

  const musicPlayerWrapperStyle = {
    height: isOpen ? 60 + musicPlayerStyle.height : 0,
  };

  const play = () => playerRef.current?.playVideo();
  const pause = () => playerRef.current?.pauseVideo();

  return (
    <div className="music-player-wrapper dark-bg" style={musicPlayerWrapperStyle}>
      <div className="music-player" style={musicPlayerStyle}>
        <div id="music_player">Music Player</div>
      </div>
      <div className="song-title">{songTitle}</div>
      {readyToPlay ? (
        <>
          <IconButton
            color="inherit"
            aria-label="previous track"
            onClick={() => playerRef.current?.previousVideo()}
          >
            <SkipPreviousIcon />
          </IconButton>
          {state === PLAYING ? (
            <IconButton color="inherit" aria-label="pause" onClick={pause}>
              <PauseIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="play"
              onClick={play}
              className={state === BUFFERING ? 'player-buffering-button' : undefined}
            >
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            aria-label="next track"
            onClick={() => playerRef.current?.nextVideo()}
          >
            <SkipNextIcon />
          </IconButton>
        </>
      ) : (
        <IconButton color="inherit" aria-label="loading">
          <CloudDownloadIcon fontSize="large" />
        </IconButton>
      )}
      <IconButton
        color="inherit"
        aria-label="toggle player"
        onClick={() =>
          setPlayerState((prev) => ({ ...prev, isExpanded: !prev.isExpanded }))
        }
      >
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </div>
  );
};

export default MusicPlayer;
