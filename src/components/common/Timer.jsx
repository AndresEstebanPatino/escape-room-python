import { useState, useEffect } from "react";

export default function Timer({ startTime, isRunning }) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isRunning]);
  
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  
  return <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>;
}
