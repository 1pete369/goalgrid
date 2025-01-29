"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import shadcn button component
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(1500); // Default 25 mins
  const [isActive, setIsActive] = useState<boolean>(false); // Timer active state
  const [mode, setMode] = useState<"Pomodoro" | "Custom" | "Stopwatch">("Pomodoro"); // Timer mode
  const [customTime, setCustomTime] = useState<number>(0); // Custom mode input (in minutes)
  const [message, setMessage] = useState<string>(""); // Message display

  // Start or pause the timer
  const toggleTimer = () => {
    if (timeLeft === 0) return; // Prevent starting if time is 0
    setIsActive(!isActive);
    setMessage("");
  };

  // Reset the timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "Pomodoro" ? 1500 : customTime * 60 || 0); // Reset time based on mode
    setMessage("");
  };

  // Timer countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setMessage("⏰ Time's up! Great job. Take a break or start again.");
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Format time as MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle mode change
  const handleModeChange = (newMode: "Pomodoro" | "Custom" | "Stopwatch") => {
    setMode(newMode);
    setIsActive(false);
    setMessage("");
    if (newMode === "Pomodoro") setTimeLeft(1500); // 25 mins
    if (newMode === "Stopwatch") setTimeLeft(0); // Stopwatch starts at 0
    if (newMode === "Custom" && customTime > 0) setTimeLeft(customTime * 60); // Custom time
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg bg-gray-900 border border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Focus Timer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-5xl font-mono text-blue-400 my-4">{formatTime(timeLeft)}</div>
          {message && (
            <div className="text-center text-green-400 text-sm font-medium mb-4">{message}</div>
          )}
          <div className="flex gap-4 mb-6">
            <Button variant={isActive ? "destructive" : "default"} onClick={toggleTimer}>
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="secondary" onClick={resetTimer}>
              Reset
            </Button>
          </div>
          <div className="w-full">
            <Select value={mode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-full">
                <span className="text-white">{mode}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pomodoro">Pomodoro (25 mins)</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
                <SelectItem value="Stopwatch">Stopwatch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode === "Custom" && (
            <div className="mt-4 w-full">
              <label htmlFor="customTime" className="block text-sm mb-2">
                Custom Time (minutes):
              </label>
              <Input
                id="customTime"
                type="number"
                min="1"
                placeholder="Enter time in minutes"
                value={customTime || ""}
                onChange={(e) => setCustomTime(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-xs text-gray-400">
          Stay focused and productive 💪
        </CardFooter>
      </Card>
    </div>
  );
};

export default FocusTimer;
