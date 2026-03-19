import { useState, useEffect, useRef, useCallback } from "react";

const ROOMS = [
  {
    id: 1,
    name: "La Puerta de Entrada",
    icon: "🚪",
    description: "Estás atrapado en el laboratorio de datos. Para abrir la primera puerta, necesitas descifrar qué hace este código...",
    difficulty: "básico",
    skillTested: "variables_tipos",
    puzzle: {
      type: "predict_output",
      code: `x = "42"
y = 7
print(type(x))
print(x * 2)`,
      options: [
        { id: "a", text: "<class 'str'>\n4242", correct: true, level: 3 },
        { id: "b", text: "<class 'int'>\n84", correct: false, level: 1 },
        { id: "c", text: "<class 'str'>\n84", correct: false, level: 2 },
        { id: "d", text: "Error: no se puede multiplicar", correct: false, level: 1 },
      ],
      hint: "Pista: Fíjate en las comillas de x... ¿es un número o un texto?",
      explanation: "x es un string '42', no un entero. type(x) da <class 'str'> y '42' * 2 repite el string: '4242'."
    }
  },
  {
    id: 2,
    name: "El Pasillo de las Listas",
    icon: "📋",
    description: "El pasillo está lleno de estanterías con datos desordenados. Necesitas entender las listas para avanzar...",
    difficulty: "básico",
    skillTested: "listas_indexing",
    puzzle: {
      type: "predict_output",
      code: `frutas = ["mango", "kiwi", "uva", "pera"]
print(frutas[-1])
print(frutas[1:3])`,
      options: [
        { id: "a", text: "pera\n['kiwi', 'uva']", correct: true, level: 3 },
        { id: "b", text: "mango\n['kiwi', 'uva', 'pera']", correct: false, level: 1 },
        { id: "c", text: "pera\n['kiwi', 'uva', 'pera']", correct: false, level: 2 },
        { id: "d", text: "uva\n['kiwi', 'uva']", correct: false, level: 1 },
      ],
      hint: "Pista: Los índices negativos cuentan desde el final. El slicing [1:3] incluye el 1 pero NO el 3.",
      explanation: "frutas[-1] es el último elemento: 'pera'. frutas[1:3] toma índices 1 y 2 (no incluye el 3): ['kiwi', 'uva']."
    }
  },
  {
    id: 3,
    name: "La Sala de los Bucles",
    icon: "🔄",
    description: "Una sala circular donde todo se repite. Solo entendiendo los bucles podrás romper el ciclo...",
    difficulty: "intermedio",
    skillTested: "bucles_logica",
    puzzle: {
      type: "predict_output",
      code: `resultado = []
for i in range(5):
    if i % 2 == 0:
        resultado.append(i ** 2)
print(resultado)`,
      options: [
        { id: "a", text: "[0, 4, 16]", correct: true, level: 3 },
        { id: "b", text: "[1, 9, 25]", correct: false, level: 2 },
        { id: "c", text: "[0, 1, 4, 9, 16]", correct: false, level: 2 },
        { id: "d", text: "[0, 2, 4]", correct: false, level: 1 },
      ],
      hint: "Pista: range(5) genera 0,1,2,3,4. El operador % da el resto de la división. ** es potencia.",
      explanation: "range(5) → 0,1,2,3,4. Los pares (i%2==0) son 0,2,4. Sus cuadrados: 0²=0, 2²=4, 4²=16 → [0, 4, 16]."
    }
  },
  {
    id: 4,
    name: "El Laboratorio de Funciones",
    icon: "⚗️",
    description: "Mezclas peligrosas de funciones por todas partes. ¿Entiendes cómo funcionan los retornos?",
    difficulty: "intermedio",
    skillTested: "funciones_scope",
    puzzle: {
      type: "predict_output",
      code: `def misterio(a, b=[]):
    b.append(a)
    return b

print(misterio(1))
print(misterio(2))`,
      options: [
        { id: "a", text: "[1]\n[1, 2]", correct: true, level: 3 },
        { id: "b", text: "[1]\n[2]", correct: false, level: 2 },
        { id: "c", text: "[1]\n[1, 2, 3]", correct: false, level: 1 },
        { id: "d", text: "Error: argumento inválido", correct: false, level: 1 },
      ],
      hint: "Pista: Ojo con los argumentos mutables por defecto en Python... ¡es una trampa clásica!",
      explanation: "¡El mutable default argument trap! La lista b=[] se crea UNA vez. Cada llamada modifica la MISMA lista. Así que la segunda llamada ya tiene el [1] y le agrega 2."
    }
  },
  {
    id: 5,
    name: "La Cámara de los Diccionarios",
    icon: "🗝️",
    description: "Llaves por todas partes... pero solo las correctas abren la cámara secreta.",
    difficulty: "intermedio",
    skillTested: "diccionarios_comprehensions",
    puzzle: {
      type: "predict_output",
      code: `datos = {"a": 1, "b": 2, "c": 3}
nuevo = {v: k for k, v in datos.items()}
print(nuevo[2])`,
      options: [
        { id: "a", text: "b", correct: true, level: 3 },
        { id: "b", text: "2", correct: false, level: 1 },
        { id: "c", text: "{'b': 2}", correct: false, level: 1 },
        { id: "d", text: "Error: KeyError", correct: false, level: 2 },
      ],
      hint: "Pista: La dict comprehension está invirtiendo claves y valores. Luego busca por el nuevo key.",
      explanation: "La comprehension {v: k for k, v in datos.items()} invierte el diccionario: {1:'a', 2:'b', 3:'c'}. Entonces nuevo[2] = 'b'."
    }
  },
  {
    id: 6,
    name: "La Bóveda Final",
    icon: "🏆",
    description: "El último reto. Solo los verdaderos Pythonistas descifrarán este enigma para escapar...",
    difficulty: "avanzado",
    skillTested: "avanzado_lambda_map",
    puzzle: {
      type: "predict_output",
      code: `nums = [1, 2, 3, 4, 5]
res = list(filter(lambda x: x > 2,
           map(lambda x: x ** 2, nums)))
print(res)`,
      options: [
        { id: "a", text: "[4, 9, 16, 25]", correct: true, level: 3 },
        { id: "b", text: "[9, 16, 25]", correct: false, level: 2 },
        { id: "c", text: "[3, 4, 5]", correct: false, level: 1 },
        { id: "d", text: "[1, 4, 9, 16, 25]", correct: false, level: 2 },
      ],
      hint: "Pista: Primero se ejecuta map (eleva al cuadrado), luego filter filtra los mayores a 2 del resultado.",
      explanation: "map eleva al cuadrado: [1,4,9,16,25]. Luego filter(x>2) quita el 1: [4,9,16,25]. ¡Ojo! El filtro se aplica DESPUÉS del map."
    }
  }
];

const SKILL_LABELS = {
  variables_tipos: "Variables y Tipos",
  listas_indexing: "Listas e Indexación",
  bucles_logica: "Bucles y Lógica",
  funciones_scope: "Funciones y Scope",
  diccionarios_comprehensions: "Diccionarios",
  avanzado_lambda_map: "Funcional (lambda/map)"
};

function TerminalText({ text, speed = 30, onDone }) {
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
  }, [text]);
  return <span>{displayed}<span style={{ animation: "blink 1s step-end infinite" }}>▊</span></span>;
}

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#0a0a0f",
      border: "1px solid #1a3a2a",
      borderRadius: 8,
      padding: "16px 20px",
      fontFamily: "'Fira Code', 'SF Mono', 'Consolas', monospace",
      fontSize: 14,
      lineHeight: 1.7,
      color: "#e0ffe0",
      overflowX: "auto",
      margin: "16px 0",
      boxShadow: "0 0 20px rgba(0,255,100,0.05), inset 0 0 30px rgba(0,0,0,0.3)"
    }}>
      {code.split('\n').map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 16 }}>
          <span style={{ color: "#2a5a3a", userSelect: "none", minWidth: 24, textAlign: "right" }}>{i + 1}</span>
          <span>{line}</span>
        </div>
      ))}
    </pre>
  );
}

function Timer({ startTime, isRunning }) {
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

export default function EscapeRoom() {
  const [screen, setScreen] = useState("welcome");
  const [playerName, setPlayerName] = useState("");
  const [currentRoom, setCurrentRoom] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const room = ROOMS[currentRoom];

  const handleStart = () => {
    if (!playerName.trim()) return;
    setStartTime(Date.now());
    setScreen("intro");
  };

  const handleAnswer = (option) => {
    if (showExplanation) return;
    setSelectedOption(option.id);
    if (!option.correct) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      return;
    }
    setShowExplanation(true);
    setAnswers(prev => [...prev, {
      room: room.id,
      skill: room.skillTested,
      correct: true,
      level: option.level,
      hintUsed: showHint,
      timeSpent: Math.floor((Date.now() - startTime) / 1000)
    }]);
  };

  const nextRoom = () => {
    if (currentRoom < ROOMS.length - 1) {
      setCurrentRoom(prev => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      setScreen("results");
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const getScore = () => {
    let total = 0;
    answers.forEach(a => { total += a.level * (a.hintUsed ? 0.5 : 1); });
    return total;
  };

  const getLevel = () => {
    const score = getScore();
    const max = ROOMS.length * 3;
    const pct = score / max;
    if (pct >= 0.85) return { label: "🧙 Pythonista Avanzado", color: "#ffd700", desc: "Dominas Python con soltura. Listo/a para IA a fondo." };
    if (pct >= 0.6) return { label: "🔧 Constructor Intermedio", color: "#00ddff", desc: "Buena base. Algunos conceptos avanzados por pulir." };
    if (pct >= 0.35) return { label: "🌱 Explorador Curioso", color: "#66ff66", desc: "Conoces lo básico. El bootcamp te va a dar superpoderes." };
    return { label: "🚀 Nuevo Aventurero", color: "#ff8866", desc: "¡Perfecto punto de partida! Vas a aprender muchísimo." };
  };

  const getSkillMap = () => {
    return answers.map(a => ({
      skill: SKILL_LABELS[a.skill] || a.skill,
      score: a.level * (a.hintUsed ? 0.5 : 1),
      max: 3
    }));
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(170deg, #030808 0%, #061210 30%, #0a0f1a 70%, #050a08 100%)",
    color: "#c8e6c9",
    fontFamily: "'Courier New', monospace",
    padding: "20px",
    position: "relative",
    overflow: "hidden"
  };

  const scanlineOverlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 100,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,30,10,0.03) 2px, rgba(0,30,10,0.03) 4px)"
  };

  // WELCOME SCREEN
  if (screen === "welcome") {
    return (
      <div style={containerStyle}>
        <div style={scanlineOverlay} />
        <style>{`
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes glitch { 0%,100% { text-shadow: 2px 0 #0f0, -2px 0 #0ff } 25% { text-shadow: -2px 2px #0f0, 2px -2px #f00 } 50% { text-shadow: 2px -2px #0ff, -2px 2px #0f0 } 75% { text-shadow: -2px 0 #f00, 2px 0 #0ff } }
          @keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(0,255,100,0.2) } 50% { box-shadow: 0 0 40px rgba(0,255,100,0.4) } }
          @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
          @keyframes scan { 0% { top: -10% } 100% { top: 110% } }
        `}</style>
        <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "8vh", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>🐍</div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#00ff66",
            textShadow: "0 0 30px rgba(0,255,100,0.3), 0 0 60px rgba(0,255,100,0.1)",
            letterSpacing: 2, margin: "0 0 4px", animation: "glitch 4s infinite",
            fontFamily: "'Courier New', monospace"
          }}>
            PYTHON ESCAPE ROOM
          </h1>
          <p style={{ color: "#3a7a4a", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 40px" }}>
            BootCamp IA · Día 1
          </p>
          <div style={{
            background: "rgba(0,255,100,0.03)", border: "1px solid #1a3a2a", borderRadius: 12,
            padding: "32px 28px", textAlign: "left", marginBottom: 32,
            animation: "fadeUp 0.8s ease-out"
          }}>
            <p style={{ color: "#4a9a5a", fontSize: 14, margin: "0 0 8px", letterSpacing: 1 }}>
              {">"} TRANSMISIÓN INTERCEPTADA...
            </p>
            <p style={{ color: "#8abf8a", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
              Has sido capturado en un laboratorio secreto de IA. Para escapar, debes atravesar <span style={{ color: "#00ff66", fontWeight: 700 }}>6 salas</span> resolviendo puzzles de Python. Cada sala pone a prueba una habilidad diferente. No hay penalización por fallar — ¡pero hay pistas si las necesitas!
            </p>
            <p style={{ color: "#5a8a5a", fontSize: 13, margin: 0, fontStyle: "italic" }}>
              Esto NO es un examen. Es para conocer tu punto de partida. 🎯
            </p>
          </div>
          <div style={{ animation: "fadeUp 1s ease-out" }}>
            <label style={{ color: "#3a7a4a", fontSize: 12, letterSpacing: 2, display: "block", marginBottom: 8 }}>
              IDENTIFICACIÓN DE AGENTE
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleStart()}
              placeholder="Tu nombre..."
              style={{
                width: "100%", boxSizing: "border-box", padding: "14px 18px",
                background: "rgba(0,255,100,0.05)", border: "1px solid #1a4a2a",
                borderRadius: 8, color: "#00ff66", fontSize: 16,
                fontFamily: "'Courier New', monospace", outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={e => e.target.style.borderColor = "#00ff66"}
              onBlur={e => e.target.style.borderColor = "#1a4a2a"}
            />
            <button
              onClick={handleStart}
              disabled={!playerName.trim()}
              style={{
                marginTop: 16, width: "100%", padding: "14px",
                background: playerName.trim() ? "linear-gradient(135deg, #00aa44, #008833)" : "#1a2a1a",
                border: "1px solid #00ff66", borderRadius: 8,
                color: playerName.trim() ? "#fff" : "#3a5a3a", fontSize: 16, fontWeight: 700,
                fontFamily: "'Courier New', monospace", cursor: playerName.trim() ? "pointer" : "not-allowed",
                letterSpacing: 2, textTransform: "uppercase",
                transition: "all 0.3s",
                animation: playerName.trim() ? "pulse 2s infinite" : "none"
              }}
            >
              [ INICIAR ESCAPE ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // INTRO SCREEN
  if (screen === "intro") {
    return (
      <div style={containerStyle}>
        <div style={scanlineOverlay} />
        <style>{`
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        `}</style>
        <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "15vh" }}>
          <div style={{
            background: "rgba(0,255,100,0.03)", border: "1px solid #1a3a2a",
            borderRadius: 12, padding: "32px 28px"
          }}>
            <p style={{ color: "#00ff66", fontSize: 16, margin: 0, lineHeight: 1.8 }}>
              <TerminalText
                text={`> Agente ${playerName} identificado.\n> Cargando laboratorio...\n> 6 salas detectadas.\n> Nivel de seguridad: MÁXIMO.\n> Buena suerte, ${playerName}. La necesitarás.`}
                speed={35}
                onDone={() => setIntroReady(true)}
              />
            </p>
          </div>
          {introReady && (
            <button
              onClick={() => setScreen("game")}
              style={{
                marginTop: 24, width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #00aa44, #008833)",
                border: "1px solid #00ff66", borderRadius: 8,
                color: "#fff", fontSize: 16, fontWeight: 700,
                fontFamily: "'Courier New', monospace", cursor: "pointer",
                letterSpacing: 2, animation: "fadeUp 0.5s ease-out"
              }}
            >
              [ ENTRAR A LA SALA 1 ]
            </button>
          )}
        </div>
      </div>
    );
  }

  // GAME SCREEN
  if (screen === "game") {
    const progress = ((currentRoom) / ROOMS.length) * 100;
    return (
      <div style={containerStyle}>
        <div style={scanlineOverlay} />
        <style>{`
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-8px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }
          @keyframes correctPulse { 0% { box-shadow: 0 0 0 rgba(0,255,100,0) } 50% { box-shadow: 0 0 30px rgba(0,255,100,0.3) } 100% { box-shadow: 0 0 0 rgba(0,255,100,0) } }
        `}</style>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#3a7a4a", fontSize: 13 }}>Agente: <span style={{ color: "#00ff66" }}>{playerName}</span></span>
            <span style={{ color: "#3a7a4a", fontSize: 13 }}>
              ⏱ <Timer startTime={startTime} isRunning={screen === "game"} />
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ background: "#0a1a10", borderRadius: 4, height: 6, marginBottom: 24, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: "linear-gradient(90deg, #00aa44, #00ff66)",
              borderRadius: 4, transition: "width 0.5s ease-out",
              boxShadow: "0 0 10px rgba(0,255,100,0.3)"
            }} />
          </div>

          {/* Room header */}
          <div style={{ animation: "fadeUp 0.5s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 32 }}>{room.icon}</span>
              <div>
                <h2 style={{ margin: 0, color: "#00ff66", fontSize: 20, fontFamily: "'Courier New', monospace" }}>
                  Sala {room.id}/6 — {room.name}
                </h2>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: room.difficulty === "avanzado" ? "rgba(255,100,50,0.15)" : room.difficulty === "intermedio" ? "rgba(0,200,255,0.15)" : "rgba(0,255,100,0.15)",
                  color: room.difficulty === "avanzado" ? "#ff8866" : room.difficulty === "intermedio" ? "#00ddff" : "#66ff66",
                  border: `1px solid ${room.difficulty === "avanzado" ? "#663322" : room.difficulty === "intermedio" ? "#1a4a5a" : "#1a4a2a"}`
                }}>
                  {room.difficulty}
                </span>
              </div>
            </div>
            <p style={{ color: "#6a9a6a", fontSize: 14, lineHeight: 1.6, margin: "12px 0 0" }}>
              {room.description}
            </p>
          </div>

          {/* Code block */}
          <CodeBlock code={room.puzzle.code} />

          {/* Options */}
          <div style={{
            display: "grid", gap: 10,
            animation: shakeWrong ? "shake 0.5s" : "fadeUp 0.6s ease-out"
          }}>
            <p style={{ color: "#4a8a4a", fontSize: 13, margin: "0 0 4px", letterSpacing: 1 }}>{">"} ¿Qué imprime este código?</p>
            {room.puzzle.options.map(opt => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.correct;
              const revealed = showExplanation;
              let bg = "rgba(0,255,100,0.03)";
              let border = "#1a3a2a";
              let textColor = "#b0d0b0";
              if (revealed && isCorrect) { bg = "rgba(0,255,100,0.12)"; border = "#00ff66"; textColor = "#00ff66"; }
              else if (isSelected && !isCorrect && !revealed) { bg = "rgba(255,50,50,0.08)"; border = "#663333"; textColor = "#ff6666"; }
              else if (isSelected && !revealed) { bg = "rgba(0,255,100,0.08)"; border = "#2a5a3a"; }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt)}
                  disabled={showExplanation}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", background: bg,
                    border: `1px solid ${border}`, borderRadius: 8,
                    color: textColor, fontSize: 14,
                    fontFamily: "'Courier New', monospace",
                    cursor: showExplanation ? "default" : "pointer",
                    transition: "all 0.2s", textAlign: "left",
                    animation: revealed && isCorrect ? "correctPulse 1s" : "none"
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: revealed && isCorrect ? "#00aa44" : "rgba(0,255,100,0.08)",
                    border: `1px solid ${revealed && isCorrect ? "#00ff66" : "#1a3a2a"}`,
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    color: revealed && isCorrect ? "#fff" : "#4a8a4a"
                  }}>
                    {revealed && isCorrect ? "✓" : opt.id.toUpperCase()}
                  </span>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.5 }}>{opt.text}</pre>
                </button>
              );
            })}
          </div>

          {/* Hint */}
          {!showExplanation && (
            <button
              onClick={useHint}
              disabled={showHint}
              style={{
                marginTop: 16, padding: "10px 20px",
                background: "transparent", border: "1px solid #2a3a2a",
                borderRadius: 8, color: showHint ? "#3a5a3a" : "#5a8a5a",
                fontSize: 13, fontFamily: "'Courier New', monospace",
                cursor: showHint ? "default" : "pointer"
              }}
            >
              💡 {showHint ? "Pista usada" : "Pedir pista (sin penalización grave)"}
            </button>
          )}
          {showHint && !showExplanation && (
            <div style={{
              marginTop: 12, padding: "12px 16px",
              background: "rgba(255,200,50,0.05)", border: "1px solid #4a3a1a",
              borderRadius: 8, color: "#ccaa44", fontSize: 13, lineHeight: 1.6
            }}>
              💡 {room.puzzle.hint}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div style={{ animation: "fadeUp 0.4s ease-out" }}>
              <div style={{
                marginTop: 16, padding: "16px 20px",
                background: "rgba(0,255,100,0.05)", border: "1px solid #1a4a2a",
                borderRadius: 8
              }}>
                <p style={{ color: "#00ff66", fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>✅ ¡Sala desbloqueada!</p>
                <p style={{ color: "#8abf8a", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  {room.puzzle.explanation}
                </p>
              </div>
              <button
                onClick={nextRoom}
                style={{
                  marginTop: 16, width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #00aa44, #008833)",
                  border: "1px solid #00ff66", borderRadius: 8,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "'Courier New', monospace", cursor: "pointer",
                  letterSpacing: 1
                }}
              >
                {currentRoom < ROOMS.length - 1 ? `[ AVANZAR A SALA ${currentRoom + 2} → ]` : "[ VER RESULTADOS 🏆 ]"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const level = getLevel();
    const skills = getSkillMap();
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;

    return (
      <div style={containerStyle}>
        <div style={scanlineOverlay} />
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes glow { 0%,100% { text-shadow: 0 0 20px rgba(0,255,100,0.3) } 50% { text-shadow: 0 0 40px rgba(0,255,100,0.6) } }
        `}</style>
        <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "4vh" }}>
          <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp 0.6s ease-out" }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>🎉</div>
            <h1 style={{
              color: "#00ff66", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, margin: "0 0 4px",
              fontFamily: "'Courier New', monospace", animation: "glow 2s infinite"
            }}>
              ¡ESCAPE COMPLETADO!
            </h1>
            <p style={{ color: "#4a8a4a", fontSize: 14, margin: 0 }}>
              Agente {playerName} · Tiempo: {mins}m {secs}s · Pistas: {hintsUsed}/6
            </p>
          </div>

          {/* Level badge */}
          <div style={{
            background: "rgba(0,255,100,0.03)", border: `1px solid ${level.color}33`,
            borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 24,
            animation: "fadeUp 0.8s ease-out"
          }}>
            <div style={{ fontSize: 18, color: level.color, fontWeight: 700, marginBottom: 8 }}>
              {level.label}
            </div>
            <p style={{ color: "#8abf8a", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              {level.desc}
            </p>
          </div>

          {/* Skill breakdown */}
          <div style={{
            background: "rgba(0,255,100,0.03)", border: "1px solid #1a3a2a",
            borderRadius: 12, padding: "20px 24px", animation: "fadeUp 1s ease-out"
          }}>
            <h3 style={{ color: "#4a9a5a", fontSize: 13, letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>
              Mapa de Habilidades
            </h3>
            {skills.map((s, i) => {
              const pct = (s.score / s.max) * 100;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#8abf8a", fontSize: 13 }}>{s.skill}</span>
                    <span style={{ color: pct >= 80 ? "#00ff66" : pct >= 50 ? "#00ddff" : "#ff8866", fontSize: 13, fontWeight: 700 }}>
                      {s.score}/{s.max}
                    </span>
                  </div>
                  <div style={{ background: "#0a1a10", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: pct >= 80 ? "linear-gradient(90deg, #00aa44, #00ff66)" : pct >= 50 ? "linear-gradient(90deg, #0088aa, #00ddff)" : "linear-gradient(90deg, #aa4422, #ff8866)",
                      borderRadius: 4, transition: "width 1s ease-out",
                      transitionDelay: `${i * 0.15}s`
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message */}
          <div style={{
            marginTop: 24, padding: "16px 20px",
            background: "rgba(0,255,100,0.03)", border: "1px solid #1a3a2a",
            borderRadius: 12, animation: "fadeUp 1.2s ease-out"
          }}>
            <p style={{ color: "#6a9a6a", fontSize: 13, lineHeight: 1.7, margin: 0, textAlign: "center" }}>
              🐍 Este mapa es tu punto de partida, no tu límite.
              <br />El bootcamp está diseñado para que todos avancen, sin importar dónde empiecen.
              <br /><span style={{ color: "#4a8a4a" }}>¡Vamos a construir cosas increíbles juntos!</span>
            </p>
          </div>

          {/* Restart */}
          <button
            onClick={() => {
              setScreen("welcome"); setPlayerName(""); setCurrentRoom(0);
              setAnswers([]); setSelectedOption(null); setShowHint(false);
              setShowExplanation(false); setHintsUsed(0); setStartTime(null); setIntroReady(false);
            }}
            style={{
              marginTop: 20, width: "100%", padding: "12px",
              background: "transparent", border: "1px solid #1a3a2a",
              borderRadius: 8, color: "#3a7a4a", fontSize: 13,
              fontFamily: "'Courier New', monospace", cursor: "pointer"
            }}
          >
            [ REINICIAR PARA OTRO AGENTE ]
          </button>
        </div>
      </div>
    );
  }
}
