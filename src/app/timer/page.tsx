"use client";

import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const tick = () => {
      if (!isPaused && isRunning) {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }
    };

    if (isRunning) {
      timerId = setInterval(tick, 1000);
    }

    return () => clearInterval(timerId);
  }, [isPaused, isRunning]);

  useEffect(() => {
    // Save history to localStorage
    localStorage.setItem("timerHistory", JSON.stringify(history));
  }, [history]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePauseToggle = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const handleReset = () => {
    setHistory([...history, seconds]);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4">
      <p>Timer: {seconds} seconds</p>
      {!isRunning && <button onClick={handleStart}>Start</button>}
      {isRunning && (
        <button onClick={handlePauseToggle}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}
      <button onClick={handleReset}>Reset</button>

      <h2>Timer History:</h2>
      <ul>
        {history.map((time, index) => (
          <li key={index}>{time} seconds</li>
        ))}
      </ul>
    </div>
  );
};

export default Timer;
