import React, { useEffect } from "react";
import ProgressBar from "progressbar.js";

import { getTimeString } from "../utils";

let bar = null;

const Timer = (props) => {

  const { time, progress } = props;

  useEffect(() => {
    if (bar) {
      setTimeout(() => {
        bar.setText(getTimeString(time));
        bar.set(progress);
      }, 0);
    }
  }, [time, progress]);

  useEffect(() => {
    bar = new ProgressBar.Circle("#timer-container", {
      color: '#2196f3',
      trailColor: '#4c515a',
      strokeWidth: 10,
      trailWidth: 10,
      text: {
        autoStyleContainer: true
      },
    });
    bar.setText('0:00');
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';
    bar.text.style.color = '#fff';
  }, []);

  return <div id="timer-container" />
};

export default Timer;
