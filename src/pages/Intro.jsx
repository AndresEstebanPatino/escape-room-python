import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalText from "../components/common/TerminalText";
import { useGame } from "../context/GameContext";

export default function Intro() {
  const [ready, setReady] = useState(false);
  const { playerName } = useGame();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "15vh" }}>
      <div style={{ background: "rgba(74,222,128,0.02)", border: "1px solid #1a2e1f", borderRadius: 12, padding: "32px 28px" }}>
        <p style={{ color: "#4ade80", fontSize: 16, margin: 0, lineHeight: 1.8 }}>
          <TerminalText
            text={`> Agente ${playerName} identificado.\n> Cargando protocolo de seguridad...\n> Inyección de datos exitosa.\n> Detectadas 15 cámaras de lógica.\n> ACCESO AL NIVEL 1: PERMITIDO.\n> Empieza la misión.`}
            speed={35}
            onDone={() => setReady(true)}
          />
        </p>
      </div>
      {ready && (
        <button
          onClick={() => navigate("/game")}
          style={{ marginTop: 24, width: "100%", padding: "14px", background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "1px solid #4ade80", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", animation: "fadeUp 0.5s ease-out" }}
        >
          [ ENTRAR A LA SALA 1 ]
        </button>
      )}
    </div>
  );
}
