import React, { useEffect, useState, useMemo } from "react";
import { Icon, IconButton } from "@material-ui/core";

let player;
const playlistId = "PLOIpw4rxNuT6xSJyebE1mSI-3pkkt4fEj";

const playerStates = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

const MusicPlayer = () => {
  const [isOpened, setIsOpenedState] = useState(false);
  const [songData, setSongDataState] = useState({});
  const [playerState, setPlayerState] = useState(null);
  const { author, title } = songData;

  // Load playlist into the queue
  const loadPlaylist = (id) => {
    player.cuePlaylist({ list: id, index: 0, startSeconds: 0 });
  };

  useEffect(() => {
    // This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Tracking player state change
    const onPlayerStateChange = (event) => {
      const state = event.data;
      setPlayerState(state);

      // Update song data
      if ([playerStates.PLAYING, playerStates.CUED].includes(state)) {
        setSongDataState(player.getVideoData());
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('music_player', {
        height: '300',
        width: '100%',
        events: {
          'onReady': () => loadPlaylist(playlistId),
          'onStateChange': onPlayerStateChange,
        }
      });
    }
  }, []);

  const musicPlayerStyle = {
    height: isOpened ? 300 : 0,
  };

  const switchPlayer = () => {
    setIsOpenedState(!isOpened);
  };

  const play = () => {
    player.playVideo();
  };

  const pause = () => {
    player.pauseVideo()
  };

  const next = () => {
    player.nextVideo();
  };

  const prev = () => {
    player.previousVideo();
  };

  const songTitle = useMemo(() => {
    console.log("clean author");
    const cleanAuthor = author?.replace(" - Topic", " : ");
    return (cleanAuthor + title) || null;
  }, [author, title]);

  return <div className="music-player-wrapper dark-bg">
    <div className="music-player" style={musicPlayerStyle}>
      <div id="music_player">
        Music Player
      </div>
    </div>
    <div className="song-title">{songTitle}</div>
    <IconButton
      edge="start"
      color="inherit"
      aria-label="prev"
      onClick={prev}
    >
      <Icon>skip_previous</Icon>
    </IconButton>
    {playerState === playerStates.PLAYING ? <IconButton
      edge="start"
      color="inherit"
      aria-label="pause"
      onClick={pause}
    >
      <Icon>pause</Icon>
    </IconButton> : <IconButton
      edge="start"
      color="inherit"
      aria-label="play"
      onClick={play}
    >
      <Icon>play_arrow</Icon>
    </IconButton>}
    <IconButton
      edge="start"
      color="inherit"
      aria-label="next"
      onClick={next}
    >
      <Icon>skip_next</Icon>
    </IconButton>
    <IconButton
      edge="start"
      color="inherit"
      aria-label="switchPlayer"
      onClick={switchPlayer}
    >
      <Icon>{isOpened ? "expand_less" : "expand_more"}</Icon>
    </IconButton>
  </div>
};

export default MusicPlayer;
