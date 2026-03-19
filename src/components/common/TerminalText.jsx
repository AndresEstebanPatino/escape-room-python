import { useState, useEffect, useRef } from "react";

export default function TerminalText({ text, speed = 30, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  
  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(prev => prev + text[idx.current]);
        idx.current++;
      } else {
        clearInterval(interval);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return (
    <span>
      {displayed}
      <span style={{ animation: "blink 1s step-end infinite" }}>▊</span>
    </span>
  );
}
