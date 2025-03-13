import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TimerIcon, PauseIcon, PlayIcon, CheckCircle } from "lucide-react"

type TaskTimerProps = {
  duration: number // Duration in minutes
  onComplete: () => void // Callback when timer completes
}

export default function TaskTimer({ duration, onComplete }: TaskTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onComplete()
      setIsRunning(false)
    }

    return () => clearInterval(timer)
  }, [isRunning, timeLeft, onComplete])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
      <Button
        className="p-2"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
      </Button>
      {timeLeft === 0 && <CheckCircle size={18} className="text-green-500" />}
    </div>
  )
}
