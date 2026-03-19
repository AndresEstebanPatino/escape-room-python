import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { SKILL_LABELS } from "../data/rooms";
import { calcTotalScore, calcLevelScore, getBadge, MAX_SCORE_PER_LEVEL, MAX_SCORE_TOTAL } from "../utils/scoring";
import { generateCertificate } from "../utils/certificate";
import { sendResultsEmail } from "../lib/emailService";

export default function Results() {
  const navigate = useNavigate();
  const { playerName, roomResults, startTime, resetGame } = useGame();
  const emailSent = useRef(false);

  const totalScore = calcTotalScore(roomResults);
  const badge = getBadge(totalScore);
  // Calcular tiempo total: usar startTime si existe, o sumar tiempos por sala como fallback
  const totalTime = startTime
    ? Math.floor((Date.now() - startTime) / 1000)
    : roomResults.reduce((s, r) => s + r.timeSeconds, 0);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  const totalHints = roomResults.filter(r => r.usedHint).length;
  const avgAttempts = roomResults.length > 0
    ? (roomResults.reduce((s, r) => s + r.attempts, 0) / roomResults.length).toFixed(1)
    : 0;
  const firstTryCount = roomResults.filter(r => r.attempts === 1).length;

  // Enviar email silenciosamente al montar (una sola vez)
  useEffect(() => {
    if (!emailSent.current && roomResults.length > 0) {
      emailSent.current = true;
      sendResultsEmail(playerName, roomResults, totalTime);
    }
  }, []);

  const handleRestart = () => {
    resetGame();
    navigate("/");
  };

  const levelNames = { 1: "Básico", 2: "Intermedio", 3: "Avanzado" };

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", paddingTop: "3vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.05) } }
      `}</style>

      {/* Badge */}
      <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp 0.6s ease-out" }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
        <h1 style={{ color: "#4ade80", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, margin: "0 0 4px" }}>
          ¡MISIÓN COMPLETADA!
        </h1>
        <p style={{ color: "#6b8f71", fontSize: 14, margin: 0 }}>
          Agente {playerName} · {mins}m {secs}s
        </p>
      </div>

      {/* Rango + Score Total */}
      <div style={{
        background: "rgba(74,222,128,0.02)", border: `2px solid ${badge.color}33`,
        borderRadius: 12, padding: "28px", textAlign: "center", marginBottom: 24,
        animation: "fadeUp 0.8s ease-out"
      }}>
        <p style={{ color: badge.color, fontSize: 24, fontWeight: 900, margin: "0 0 4px" }}>{badge.label}</p>
        <p style={{ color: badge.color, fontSize: 42, fontWeight: 900, margin: "8px 0" }}>
          {totalScore}<span style={{ fontSize: 20, color: "#6b8f71" }}>/{MAX_SCORE_TOTAL}</span>
        </p>
        <div style={{ background: "#0a1a12", borderRadius: 4, height: 10, overflow: "hidden", margin: "12px 0" }}>
          <div style={{
            width: `${(totalScore / MAX_SCORE_TOTAL) * 100}%`, height: "100%",
            background: `linear-gradient(90deg, ${badge.color}88, ${badge.color})`,
            borderRadius: 4, transition: "width 1.5s ease-out"
          }} />
        </div>
        <p style={{ color: "#c5d5c8", fontSize: 14, lineHeight: 1.6, margin: "12px 0 0" }}>{badge.msg}</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24, animation: "fadeUp 1s ease-out" }}>
        {[
          { label: "1er Intento", value: `${firstTryCount}/15`, color: "#4ade80" },
          { label: "Intentos Prom.", value: avgAttempts, color: "#67e8f9" },
          { label: "Pistas Usadas", value: `${totalHints}/15`, color: "#c9a84c" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 8, padding: "16px 8px", textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 900, margin: 0 }}>{s.value}</p>
            <p style={{ color: "#6b8f71", fontSize: 11, margin: "4px 0 0", letterSpacing: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Score por Nivel */}
      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "20px 24px", marginBottom: 24, animation: "fadeUp 1.1s ease-out" }}>
        <h3 style={{ color: "#6b8f71", fontSize: 12, letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>
          Puntuación por Nivel
        </h3>
        {[1, 2, 3].map(lvl => {
          const lvlScore = calcLevelScore(roomResults, lvl);
          const pct = (lvlScore / MAX_SCORE_PER_LEVEL) * 100;
          return (
            <div key={lvl} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#c5d5c8", fontSize: 13 }}>Nivel {lvl}: {levelNames[lvl]}</span>
                <span style={{ color: pct >= 80 ? "#4ade80" : pct >= 50 ? "#67e8f9" : "#fca5a5", fontSize: 13, fontWeight: 700 }}>
                  {lvlScore}/{MAX_SCORE_PER_LEVEL}
                </span>
              </div>
              <div style={{ background: "#0a1a12", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: pct >= 80 ? "linear-gradient(90deg, #22c55e, #4ade80)" : pct >= 50 ? "linear-gradient(90deg, #0891b2, #67e8f9)" : "linear-gradient(90deg, #b45309, #fca5a5)",
                  borderRadius: 4, transition: "width 1s ease-out",
                  transitionDelay: `${lvl * 0.2}s`
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mapa de Habilidades */}
      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "20px 24px", marginBottom: 24, animation: "fadeUp 1.2s ease-out" }}>
        <h3 style={{ color: "#6b8f71", fontSize: 12, letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>
          Mapa de Habilidades
        </h3>
        {roomResults.map((r, i) => {
          const pct = (r.score / 3) * 100;
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#c5d5c8", fontSize: 12 }}>{SKILL_LABELS[r.skill] || r.skill}</span>
                <span style={{ fontSize: 11, color: "#6b8f71" }}>
                  {r.attempts === 1 ? "✓" : `${r.attempts} int.`}
                  {r.usedHint && " 💡"}
                  <span style={{ color: "#4ade80", marginLeft: 6, fontWeight: 700 }}>{r.score}/3</span>
                </span>
              </div>
              <div style={{ background: "#0a1a12", borderRadius: 3, height: 6, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: pct >= 80 ? "linear-gradient(90deg, #22c55e, #4ade80)" : pct >= 50 ? "linear-gradient(90deg, #0891b2, #67e8f9)" : "linear-gradient(90deg, #b45309, #fca5a5)",
                  borderRadius: 3, transition: "width 0.8s ease-out",
                  transitionDelay: `${i * 0.08}s`
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div style={{ padding: "16px 20px", background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, marginBottom: 24, animation: "fadeUp 1.4s ease-out" }}>
        <p style={{ color: "#6b8f71", fontSize: 13, lineHeight: 1.7, margin: 0, textAlign: "center" }}>
          🐍 Este mapa es tu punto de partida, no tu límite.
          <br />El bootcamp está diseñado para que todos avancen, sin importar dónde empiecen.
          <br /><span style={{ color: "#86efac" }}>¡Vamos a construir cosas increíbles juntos!</span>
        </p>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        <button
          onClick={() => generateCertificate(playerName, badge.label)}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #8B7355, #a08960)",
            border: "1px solid #8B7355", borderRadius: 8,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
            letterSpacing: 1, transition: "all 0.3s"
          }}
        >
          🏆 Descargar Certificado
        </button>
        <button onClick={handleRestart} style={{
          width: "100%", padding: "14px",
          background: "transparent", border: "1px solid #1a2e1f",
          borderRadius: 8, color: "#6b8f71", fontSize: 13, cursor: "pointer"
        }}>
          [ REINICIAR PARA OTRO AGENTE ]
        </button>
      </div>
    </div>
  );
}
