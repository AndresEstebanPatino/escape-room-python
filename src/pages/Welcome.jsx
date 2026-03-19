import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

export default function Welcome() {
  const { playerName, setPlayerName, setStartTime } = useGame();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!playerName.trim()) return;
    setStartTime(Date.now());
    navigate("/intro");
  };

  const containerStyle = {
    maxWidth: 560, margin: "0 auto", paddingTop: "8vh", textAlign: "center",
    animation: "fadeUp 0.8s ease-out"
  };

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: 64, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>🐍</div>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#4ade80", letterSpacing: 2, margin: "0 0 4px" }}>
        PYTHON ESCAPE ROOM
      </h1>
      <p style={{ color: "#6b8f71", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 40px" }}>
        Operación: Infiltración de Datos
      </p>

      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "32px 28px", textAlign: "left", marginBottom: 32, lineHeight: 1.7 }}>
        <p style={{ color: "#6b8f71", fontSize: 13, margin: "0 0 8px", letterSpacing: 1 }}>
          {">"} TRANSMISIÓN INTERCEPTADA...
        </p>
        <p style={{ color: "#c5d5c8", fontSize: 15, marginBottom: 16 }}>
          Has despertado en un laboratorio de IA de alta seguridad. El código a tu alrededor es la única forma de salir. Las puertas no responden a la fuerza, solo a la <span style={{ color: "#4ade80", fontWeight: 700 }}>lógica de Python</span>.
        </p>
        <p style={{ color: "#c5d5c8", fontSize: 15, marginBottom: 16 }}>
          Atraviesa <span style={{ color: "#4ade80", fontWeight: 700 }}>3 niveles</span> de seguridad. Desde simples variables hasta estructuras de datos complejas. No hay penalización por fallar, pero tu honor como programador está en juego.
        </p>
        <p style={{ color: "#6b8f71", fontSize: 13, margin: 0, fontStyle: "italic" }}>
          Objetivo: Demostrar tu nivel técnico para ser reclutado en la resistencia. 🎯
        </p>
      </div>

      <div style={{ animation: "fadeUp 1s ease-out" }}>
        <label style={{ color: "#6b8f71", fontSize: 11, letterSpacing: 2, display: "block", marginBottom: 8, fontWeight: 700 }}>
          ASIGNACIÓN DE NÉMESIS: INTRODUCE TU SEUDÓNIMO
        </label>
        <input
          type="text" value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleStart()}
          placeholder="Ej: Agent_42"
          style={{ width: "100%", boxSizing: "border-box", padding: "14px 18px", background: "rgba(74,222,128,0.04)", border: "1px solid #1a2e1f", borderRadius: 8, color: "#4ade80", fontSize: 16, fontFamily: "monospace", outline: "none" }}
        />
        <button
          onClick={handleStart} disabled={!playerName.trim()}
          style={{ marginTop: 16, width: "100%", padding: "14px", background: playerName.trim() ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#111a12", border: "1px solid #4ade80", borderRadius: 8, color: playerName.trim() ? "#fff" : "#3a4a3a", fontWeight: 700, cursor: playerName.trim() ? "pointer" : "not-allowed", letterSpacing: 2, transition: "all 0.3s" }}
        >
          [ INICIAR ESCAPE ]
        </button>
      </div>
    </div>
  );
}
