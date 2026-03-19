import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { calcLevelScore, MAX_SCORE_PER_LEVEL } from "../utils/scoring";

export default function Transition() {
  const navigate = useNavigate();
  const { currentRoomIdx, advanceRoom, roomResults } = useGame();

  const currentLevel = Math.floor(currentRoomIdx / 5) + 1;
  const levelResults = roomResults.filter(r => r.levelNum === currentLevel);
  const levelScore = calcLevelScore(roomResults, currentLevel);
  const firstTries = levelResults.filter(r => r.attempts === 1).length;
  const hintsUsed = levelResults.filter(r => r.usedHint).length;
  const avgTime = levelResults.length > 0 
    ? Math.round(levelResults.reduce((s, r) => s + r.timeSeconds, 0) / levelResults.length) 
    : 0;

  const handleNextLevel = () => {
    advanceRoom();
    navigate("/game");
  };

  const levelNames = { 1: "Básico", 2: "Intermedio", 3: "Avanzado" };
  const scorePct = (levelScore / MAX_SCORE_PER_LEVEL) * 100;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "10vh", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔓</div>
      <h2 style={{ color: "#4ade80", margin: "0 0 4px", fontSize: 24 }}>
        Nivel {currentLevel}: {levelNames[currentLevel]} — Completado
      </h2>
      <p style={{ color: "#6b8f71", fontSize: 16, marginBottom: 32 }}>
        Nivel {currentLevel + 1}: {levelNames[currentLevel + 1]} — Desbloqueado
      </p>

      {/* Score del nivel */}
      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
        <p style={{ color: "#6b8f71", fontSize: 11, letterSpacing: 2, margin: "0 0 8px", textTransform: "uppercase" }}>Puntuación del Nivel</p>
        <p style={{ color: "#4ade80", fontSize: 36, fontWeight: 900, margin: "0 0 12px" }}>
          {levelScore}<span style={{ fontSize: 18, color: "#6b8f71" }}>/{MAX_SCORE_PER_LEVEL}</span>
        </p>
        <div style={{ background: "#0a1a12", borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            width: `${scorePct}%`, height: "100%",
            background: scorePct >= 80 ? "linear-gradient(90deg, #22c55e, #4ade80)" : scorePct >= 50 ? "linear-gradient(90deg, #0891b2, #67e8f9)" : "linear-gradient(90deg, #b45309, #fca5a5)",
            borderRadius: 4, transition: "width 1s ease-out"
          }} />
        </div>
      </div>

      {/* Desglose */}
      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "20px 24px", textAlign: "left", marginBottom: 32 }}>
        <h3 style={{ color: "#4ade80", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginTop: 0, marginBottom: 16 }}>Desglose</h3>
        {[
          { label: "Aciertos al 1er intento", value: `${firstTries}/5`, color: firstTries >= 4 ? "#4ade80" : firstTries >= 2 ? "#67e8f9" : "#fca5a5" },
          { label: "Pistas utilizadas", value: hintsUsed, color: hintsUsed <= 1 ? "#4ade80" : hintsUsed <= 3 ? "#c9a84c" : "#fca5a5" },
          { label: "Tiempo promedio/sala", value: `${avgTime}s`, color: "#67e8f9" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", color: "#c5d5c8", fontSize: 14 }}>
            <span>{item.label}</span>
            <span style={{ color: item.color, fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}

        {/* Detalle por sala */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a2e1f" }}>
          <p style={{ color: "#6b8f71", fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>DETALLE POR SALA</p>
          {levelResults.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#6b8f71" }}>
              <span>Sala {r.roomId}</span>
              <span>
                <span style={{ color: r.attempts === 1 ? "#4ade80" : "#fca5a5" }}>{r.attempts} int.</span>
                {r.usedHint && <span style={{ color: "#c9a84c", marginLeft: 8 }}>💡</span>}
                <span style={{ color: "#4ade80", marginLeft: 8 }}>+{r.score}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleNextLevel} style={{
        width: "100%", padding: "16px",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        border: "1px solid #4ade80", borderRadius: 8,
        color: "#fff", fontWeight: 700, cursor: "pointer", letterSpacing: 2
      }}>
        [ ENTRAR AL NIVEL {currentLevel + 1} ]
      </button>
    </div>
  );
}
