"use client";

import React, { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const tick = () => {
      if (!isPaused) {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }
    };

    // eslint-disable-next-line prefer-const
    timerId = setInterval(tick, 1000);

    return () => clearInterval(timerId);
  }, [isPaused]);

  const handlePauseToggle = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const handleReset = () => {
    setSeconds(0);
  };

  return (
    <div>
      <p>Timer: {seconds} seconds</p>
      <button onClick={handlePauseToggle}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Timer;
