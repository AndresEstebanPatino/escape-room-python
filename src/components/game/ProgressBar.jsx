export default function ProgressBar({ progress }) {
  return (
    <div style={{ background: "#0a1a12", borderRadius: 4, height: 6, marginBottom: 24, overflow: "hidden" }}>
      <div style={{
        width: `${progress}%`, height: "100%",
        background: "linear-gradient(90deg, #22c55e, #4ade80)",
        transition: "width 0.5s ease-out"
      }} />
    </div>
  );
}
