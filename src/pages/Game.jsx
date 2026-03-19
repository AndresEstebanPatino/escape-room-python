import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Timer from "../components/common/Timer";
import CodeBlock from "../components/common/CodeBlock";
import ProgressBar from "../components/game/ProgressBar";
import OptionButton from "../components/game/OptionButton";

export default function Game() {
  const navigate = useNavigate();
  const {
    currentRoom, currentRoomIdx, playerName, startTime, ROOMS,
    registerAttempt, registerHint, finalizeRoom, advanceRoom, startNewRoom,
    currentHintUsed, currentAttempts, currentChoices
  } = useGame();

  const [selectedId, setSelectedId] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Iniciar tracking de la sala al montar o cambiar de sala
  useEffect(() => {
    setSelectedId(null);
    setShowExplanation(false);
    setShowHint(false);
    setLastResult(null);
    startNewRoom();
  }, [currentRoomIdx]);

  const handleSelect = (opt) => {
    if (showExplanation) return;
    setSelectedId(opt.id);
    registerAttempt(opt.id);

    if (!opt.correct) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      return;
    }

    // Correcto: finalizar sala con los datos ya sumados (el intento actual incluido)
    const result = finalizeRoom(
      currentAttempts + 1, 
      [...currentChoices, opt.id], 
      showHint
    );
    setLastResult(result);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const isLevelEnd = (currentRoomIdx + 1) % 5 === 0;
    const isGameOver = currentRoomIdx === ROOMS.length - 1;

    if (isGameOver) navigate("/results");
    else if (isLevelEnd) navigate("/transition");
    else advanceRoom();
  };

  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      registerHint();
    }
  };

  const progress = (currentRoomIdx / ROOMS.length) * 100;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <style>{`
        @keyframes shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-8px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#6b8f71", fontSize: 13 }}>
          Nivel {currentRoom.level_num} · Sala <span style={{ color: "#4ade80" }}>{currentRoom.id}/15</span>
        </span>
        <span style={{ color: "#6b8f71", fontSize: 13 }}>
          ⏱ <Timer startTime={startTime} isRunning={true} />
        </span>
      </div>

      <ProgressBar progress={progress} />

      {/* Room info */}
      <div style={{ animation: "fadeUp 0.5s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 32 }}>{currentRoom.icon}</span>
          <h2 style={{ margin: 0, color: "#4ade80", fontSize: 20 }}>
            Sala {currentRoom.id}/15 — {currentRoom.name}
          </h2>
        </div>
        <p style={{ color: "#6b8f71", fontSize: 14, lineHeight: 1.6, margin: "12px 0 0" }}>
          {currentRoom.description}
        </p>
      </div>

      <CodeBlock code={currentRoom.puzzle.code} />

      {/* Options */}
      <div style={{ display: "grid", gap: 10, animation: shakeWrong ? "shake 0.5s" : "fadeUp 0.6s ease-out" }}>
        {currentRoom.puzzle.options.map(opt => (
          <OptionButton
            key={opt.id} opt={opt} onSelect={handleSelect}
            selectedId={selectedId} revealed={showExplanation}
          />
        ))}
      </div>

      {/* Hint area */}
      <div style={{ marginTop: 16 }}>
        {!showExplanation && (
          <button onClick={handleHint} disabled={showHint} style={{
            background: "transparent", border: "1px solid #1a2e1f", borderRadius: 8,
            padding: "10px 20px", color: showHint ? "#3a4a3a" : "#6b8f71", fontSize: 13, cursor: "pointer"
          }}>
            💡 {showHint ? "Pista descifrada" : "Solicitar Pista"}
          </button>
        )}
        {showHint && !showExplanation && (
          <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(251,191,36,0.04)", border: "1px solid #3a2e10", borderRadius: 8, color: "#c9a84c", fontSize: 13 }}>
            {currentRoom.puzzle.hint}
          </div>
        )}
      </div>

      {/* Explanation + Score feedback */}
      {showExplanation && lastResult && (
        <div style={{ animation: "fadeUp 0.4s ease-out", marginTop: 16 }}>
          <div style={{ padding: "16px 20px", background: "rgba(74,222,128,0.04)", border: "1px solid #1a2e1f", borderRadius: 8, marginBottom: 16 }}>
            <p style={{ color: "#4ade80", fontWeight: 700, margin: "0 0 8px" }}>✅ Decodificación Completa</p>
            <p style={{ color: "#c5d5c8", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>
              {currentRoom.puzzle.explanation}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#6b8f71" }}>
              <span>Intentos: <span style={{ color: lastResult.attempts === 1 ? "#4ade80" : "#fca5a5" }}>{lastResult.attempts}</span></span>
              <span>Pista: <span style={{ color: lastResult.usedHint ? "#c9a84c" : "#4ade80" }}>{lastResult.usedHint ? "Sí" : "No"}</span></span>
              <span>Tiempo: <span style={{ color: "#67e8f9" }}>{lastResult.timeSeconds}s</span></span>
              <span>Puntos: <span style={{ color: "#4ade80", fontWeight: 700 }}>+{lastResult.score}</span>/3</span>
            </div>
          </div>
          <button onClick={handleNext} style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            border: "1px solid #4ade80", borderRadius: 8,
            color: "#fff", fontWeight: 700, cursor: "pointer"
          }}>
            {currentRoomIdx === ROOMS.length - 1 ? "[ VER RESULTADOS 🏆 ]" : "[ CONTINUAR ]"}
          </button>
        </div>
      )}
    </div>
  );
}
