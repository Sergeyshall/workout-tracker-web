import React, { useEffect, useState } from "react";

const musicPlayerInitState = {
  isOpened: false,
  songData: {},
};

let player;
const playlistId = "PLOIpw4rxNuT6xSJyebE1mSI-3pkkt4fEj"

const MusicPlayer = (props) => {
  const [musicPlayerState, setState] = useState(musicPlayerInitState);

  useEffect(() => {


    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const loadPlaylist = (event) => {
      event.target.cuePlaylist({ list: playlistId, index: 0, startSeconds:0 });
    };

    // 4. The API will call this function when the video player is ready.
    const onPlayerReady = (event) => {
      event.target.playVideo();
    };

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    let done = false;

    const onPlayerStateChange = (event) => {
      const { BUFFERING, CUED, ENDED, PAUSED, PLAYING, UNSTARTED } = window.YT.PlayerState;

      if (event.data === PLAYING) {
        setState({ ...musicPlayerState, songData: player.getVideoData() });
      }

      if (event.data == window.YT.PlayerState.PLAYING && !done) {
        //setTimeout(stopVideo, 6000);

        console.log(event);
        done = true;
      }
    };

    const stopVideo = () => {
      player.stopVideo();
    };

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('music_player', {
        height: '300',
        width: '100%',
        //videoId: 'ew_ryesFmHQ',
        events: {
          'onReady': loadPlaylist,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  }, []);

  const { isOpened, songData: { title, author } } = musicPlayerState;

  const musicPlayerStyle = {
    height: isOpened ? 300 : 0,
  };

  const switchPlayer = () => {
    setState({ ...musicPlayerState, isOpened: !isOpened });
  };

  const startPlayer = () => {
    player.playVideo();
  };

  const stopPlayer = () => {
    player.stopVideo();
  };

  const pausePlayer = () => {
    player.pauseVideo()
  };

  const nextSong = () => {
    player.nextVideo();
  };

  return <div>
    <div className="music-player" style={musicPlayerStyle}>
      <div id="music_player">
        Music Player
      </div>
    </div>
    <p>{author?.replace(" - Topic", " : ")}{title}</p>
    <button onClick={startPlayer}>Play</button>
    <button onClick={pausePlayer}>Pause</button>
    <button onClick={stopPlayer}>Stop</button>
    <button onClick={nextSong}>Next Song</button>
    <button onClick={switchPlayer}>{isOpened ? "Close" : "Open"} Music Player</button>
  </div>
};

export default MusicPlayer;
