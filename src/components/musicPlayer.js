import React, { useEffect, useState, useMemo } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { connect } from "react-redux";

import { PAUSE_MUSIC_PLAYER_EVENT, START_MUSIC_PLAYER_EVENT, STOP_MUSIC_PLAYER_EVENT } from "../actions/constants";
import events from "../utils/events";
import { toggleMusicPlayer } from "../actions/musicPlayer";

let player = null;

// Default playlist
const playlistId = "PLOIpw4rxNuT6xSJyebE1mSI-3pkkt4fEj";

/*
 * const UNSTARTED = -1,
 *       ENDED = 0,
 */
const BUFFERING = 3,
//      PAUSED = 2,
      CUED = 5,
      PLAYING = 1;

const initState = {
  isExpanded: true,
  song: {},
  state: null,
  readyToPlay: false,
};

const MusicPlayer = (props) => {
  const [playerState, setState] = useState(initState);
  const { isOpen, toggleMusicPlayer, playlist } = props;


  const { song: { author, title }, state, isExpanded, readyToPlay } = playerState;


  // Load playlist into the queue
  const loadPlaylist = (id) => {
    player.cuePlaylist({ list: id, index: 0, startSeconds: 0 });
  };

  const switchPlayer = () => {
    setState(prevState => ({ ...prevState, isExpanded: !isExpanded }));
  };

  const play = () => {
    player.playVideo();
  };

  const pause = () => {
    player.pauseVideo()
  };

  const stop = () => {
    player.stopVideo()
  };

  const next = () => {
    player.nextVideo();
  };

  const prev = () => {
    player.previousVideo();
  };

  // Component mount
  useEffect(() => {
    // This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Tracking player state change
    const onPlayerStateChange = (event) => {
      const state = event.data;

      const stateUpdate = {
        state,
      };

      // Show song status
      if (state === BUFFERING) {
        stateUpdate.song = {};
      }

      // Update song data and readyToPlay
      if ([PLAYING, CUED].includes(state)) {
        stateUpdate.song = player.getVideoData();
        stateUpdate.readyToPlay = true;
      }

      setState(prevState => ({ ...prevState, ...stateUpdate }));
    };

    const hidePlayerWithTimeout = (seconds) => {
      setTimeout(() => {
        setState(prevState => ({ ...prevState, isExpanded: false }));
        toggleMusicPlayer();
      }, 1000 * seconds);
    };

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('music_player', {
        height: '300',
        width: '100%',
        playerVars: {
          playsinline: 1,
        },
        events: {
          'onReady': () => {
            loadPlaylist(playlistId);

            /*
             * Hide player with a timeout. Timeout required to be able player fully load the data
             * hidden player is not loading the data in iframe properly
             */
            hidePlayerWithTimeout(1);
          },
          'onStateChange': onPlayerStateChange,
        }
      });
    };

    // Subscribe to app music player control events
    events.on(START_MUSIC_PLAYER_EVENT, () => {
      play();
    });

    events.on(STOP_MUSIC_PLAYER_EVENT, () => {
      stop();
    });

    events.on(PAUSE_MUSIC_PLAYER_EVENT, () => {
      pause();
    });
  }, [toggleMusicPlayer]);

  // Update playlist
  useEffect(() => {
    if (playlist && readyToPlay) {
      console.log(playlist);
      loadPlaylist(playlist);
    }
  }, [playlist, readyToPlay]);

  const songTitle = useMemo(() => {
    const cleanAuthor = author?.replace(" - Topic", " : ");
    return cleanAuthor + title || "Loading...";
  }, [author, title]);


  const musicPlayerStyle = {
    height: isExpanded ? 300 : 0,
  };

  const musicPlayerWrapperStyle = {
    height: isOpen ? 60 + musicPlayerStyle.height : 0,
  };

  return <div
    className="music-player-wrapper dark-bg"
    style={musicPlayerWrapperStyle}
  >
    <div className="music-player" style={musicPlayerStyle}>
      <div id="music_player">
        Music Player
      </div>
    </div>
    <div className="song-title">{songTitle}</div>
    {readyToPlay ? <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="prev"
        onClick={prev}
      >
        <Icon>skip_previous</Icon>
      </IconButton>
      {state === PLAYING && <IconButton
        edge="start"
        color="inherit"
        aria-label="pause"
        onClick={pause}
      >
        <Icon fontSize="large">pause</Icon>
      </IconButton>}
      {state !== PLAYING && readyToPlay && <IconButton
        edge="start"
        color="inherit"
        aria-label="play"
        onClick={play}
        className={state === BUFFERING ? "player-buffering-button" : null}
      >
        <Icon fontSize="large">play_arrow</Icon>
      </IconButton>}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="next"
        onClick={next}
      >
        <Icon>skip_next</Icon>
      </IconButton>
    </>
    : <IconButton
      edge="start"
      color="inherit"
      aria-label="loading"
    >
      <Icon fontSize="large">cloud_download</Icon>
    </IconButton>}
    <IconButton
      edge="start"
      color="inherit"
      aria-label="switchPlayer"
      onClick={switchPlayer}
    >
      <Icon>{isExpanded ? "expand_less" : "expand_more"}</Icon>
    </IconButton>
  </div>
};

const mapStateToProps = (state) => {
  const { isOpen, playlist } = state.musicPlayer;

  return {
    isOpen,
    playlist,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMusicPlayer: () => dispatch(toggleMusicPlayer()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
