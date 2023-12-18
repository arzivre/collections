"use client";

import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<{ date: string; time: number }[]>([]);

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
    localStorage.setItem('timerHistory', JSON.stringify(history));
  }, [history]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePauseToggle = () => {
    if (isRunning) {
      setIsPaused((prevIsPaused) => !prevIsPaused);
      if (isPaused) {
        const currentDate = getCurrentDate();
        setHistory((prevHistory) => [
          ...prevHistory,
          { date: currentDate, time: seconds },
        ]);
      }
    }
  };

  const handleReset = () => {
    const currentDate = getCurrentDate();
    setHistory((prevHistory) => [
      ...prevHistory,
      { date: currentDate, time: seconds },
    ]);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  return (
    <div>
      <p>Timer: {seconds} seconds</p>
      {!isRunning && <button onClick={handleStart}>Start</button>}
      {isRunning && <button onClick={handlePauseToggle}>{isPaused ? 'Resume' : 'Pause'}</button>}
      <button onClick={handleReset}>Reset</button>

      <h2>Timer History:</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.date} - {entry.time} seconds
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timer;
