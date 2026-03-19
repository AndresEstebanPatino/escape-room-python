export default function OptionButton({ opt, onSelect, selectedId, revealed }) {
  const isSelected = selectedId === opt.id;
  const isCorrect = opt.correct;
  
  let bg = "rgba(74,222,128,0.02)";
  let border = "#1a2e1f";
  let textColor = "#c5d5c8";
  
  if (revealed && isCorrect) { bg = "rgba(74,222,128,0.1)"; border = "#4ade80"; textColor = "#4ade80"; }
  else if (isSelected && !isCorrect && !revealed) { bg = "rgba(255,50,50,0.08)"; border = "#663333"; textColor = "#fca5a5"; }

  return (
    <button
      onClick={() => onSelect(opt)}
      disabled={revealed}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", background: bg,
        border: `1px solid ${border}`, borderRadius: 8,
        color: textColor, fontSize: 14,
        fontFamily: "'Courier New', monospace",
        cursor: revealed ? "default" : "pointer",
        transition: "all 0.2s", textAlign: "left"
      }}
    >
      <span style={{
        width: 28, height: 28, borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: revealed && isCorrect ? "#22c55e" : "rgba(74,222,128,0.06)",
        border: `1px solid ${revealed && isCorrect ? "#4ade80" : "#1a2e1f"}`,
        fontSize: 13, fontWeight: 700, flexShrink: 0,
        color: revealed && isCorrect ? "#fff" : "#6b8f71"
      }}>
        {revealed && isCorrect ? "✓" : opt.id.toUpperCase()}
      </span>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.5 }}>
        {opt.text}
      </pre>
    </button>
  );
}
