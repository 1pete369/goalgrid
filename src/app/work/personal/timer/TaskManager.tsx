

import { useState, useRef, useEffect } from "react";

type TaskTimerProps = {
  taskName: string;
  onDelete: () => void;
};

export default function TaskTimer({ taskName, onDelete }: TaskTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout| null>(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current!); // Cleanup on unmount
  }, []);

  const start = () => {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(min).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  return (
    <div className="border p-4 rounded-xl shadow-sm mb-4">
      <h3 className="text-xl font-semibold mb-2">{taskName}</h3>
      <p className="text-2xl font-mono mb-2">{formatTime(seconds)}</p>
      <div className="space-x-2">
        <button onClick={start} className="bg-green-500 text-white px-3 py-1 rounded">Start</button>
        <button onClick={stop} className="bg-yellow-500 text-white px-3 py-1 rounded">Stop</button>
        <button onClick={reset} className="bg-red-500 text-white px-3 py-1 rounded">Reset</button>
        <button onClick={onDelete} className="ml-4 text-gray-500 hover:text-black">🗑</button>
      </div>
    </div>
  );
}
