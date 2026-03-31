import React, { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';
import { getTimeString } from '../utils';

const Timer = ({ time, progress }) => {
  const barRef = useRef(null);

  useEffect(() => {
    barRef.current = new ProgressBar.Circle('#timer-container', {
      color: '#2196f3',
      trailColor: '#4c515a',
      strokeWidth: 10,
      trailWidth: 10,
      text: { autoStyleContainer: true },
    });
    barRef.current.setText('0:00');
    barRef.current.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    barRef.current.text.style.fontSize = '2rem';
    barRef.current.text.style.color = '#fff';

    return () => {
      barRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.setText(getTimeString(Math.max(0, time)));
      barRef.current.set(Math.min(1, Math.max(0, progress)));
    }
  }, [time, progress]);

  return <div id="timer-container" />;
};

export default Timer;
