export default function CodeBlock({ code }) {
  if (!code) return null;
  
  return (
    <pre style={{
      background: "#0a1a12",
      border: "1px solid #1a2e1f",
      borderRadius: 8,
      padding: "16px 20px",
      fontFamily: "'Fira Code', 'SF Mono', monospace",
      fontSize: 14,
      lineHeight: 1.7,
      color: "#d4e8d4",
      overflowX: "auto",
      margin: "16px 0"
    }}>
      {code.split('\n').map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 16 }}>
          <span style={{ color: "#3a5a3a", userSelect: "none", minWidth: 24, textAlign: "right" }}>{i + 1}</span>
          <span>{line}</span>
        </div>
      ))}
    </pre>
  );
}
