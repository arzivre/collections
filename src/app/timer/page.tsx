"use client";

import React, { useState, useEffect } from "react";

const formatTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  const formattedTime = [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    seconds > 0 ? `${seconds}s` : null,
  ]
    .filter((part) => part !== null)
    .join(" ");

  return formattedTime || "0s";
};

type History = { sessionId: number; date: string; time: number }[];

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<History>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState<boolean>(false);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Load history from localStorage only once
    if (!isHistoryLoaded) {
      const storedHistory = localStorage.getItem("timerHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory) as History);

        // Check if a session ID exists for the current date
        const currentDate = getCurrentDate();
        const existingSession = (JSON.parse(storedHistory) as History).find(
          (entry) => entry.date === currentDate,
        );

        if (existingSession) {
          setCurrentSessionId(existingSession.sessionId);
        } else {
          setCurrentSessionId(null);
        }
      }
      setIsHistoryLoaded(true);
    }
  }, [isHistoryLoaded]);

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
    const currentDate = getCurrentDate();
    const existingSession = history.find((entry) => entry.date === currentDate);

    if (existingSession) {
      // If a session ID already exists for the current date, use it
      setCurrentSessionId(existingSession.sessionId);
    } else {
      // If no session ID for the current date, create a new session
      setCurrentSessionId(history.length + 1);
    }
  };

  const handlePauseToggle = () => {
    if (isRunning) {
      setIsPaused((prevIsPaused) => !prevIsPaused);
      if (isPaused) {
        const currentDate = getCurrentDate();
        setHistory((prevHistory) => [
          ...prevHistory,
          {
            sessionId: currentSessionId!,
            date: currentDate,
            time: seconds,
          },
        ]);
      }
    }
  };

  const handleReset = () => {
    const currentDate = getCurrentDate();
    if (currentSessionId === null) {
      // If no session ID for the current date, create a new session
      setCurrentSessionId(history.length + 1);
    }
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        sessionId: currentSessionId!,
        date: currentDate,
        time: seconds,
      },
    ]);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleResetLocalStorage = () => {
    localStorage.removeItem("timerHistory");
    setHistory([]);
    setCurrentSessionId(null);
    setIsHistoryLoaded(false);
  };

  return (
    <div className="mx-auto mt-44 flex min-h-screen w-full max-w-xl flex-col items-start gap-4">
      <p>Timer: {formatTime(seconds)}</p>

      <div className="flex w-full items-center justify-between">
        {!isRunning && <button onClick={handleStart}>Start</button>}
        {isRunning && (
          <button onClick={handlePauseToggle}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleResetLocalStorage}>Wipe data</button>
      </div>

      <h2>Timer History:</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            Session {entry.sessionId} - {entry.date} - {formatTime(entry.time)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timer;
