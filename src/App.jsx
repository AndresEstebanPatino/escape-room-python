import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Welcome from "./pages/Welcome";
import Intro from "./pages/Intro";
import Game from "./pages/Game";
import Transition from "./pages/Transition";
import Results from "./pages/Results";

const Layout = ({ children }) => {
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(170deg, #070f0b 0%, #0a1a12 30%, #0c1810 70%, #070f0b 100%)",
    color: "#c5d5c8",
    fontFamily: "'Courier New', monospace",
    padding: "20px",
    position: "relative",
    overflowX: "hidden"
  };

  const scanlineOverlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 100,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,30,10,0.01) 2px, rgba(0,30,10,0.01) 4px)"
  };

  const animations = (
    <style>{`
      @keyframes blink { 50% { opacity: 0 } }
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    `}</style>
  );

  return (
    <div style={containerStyle}>
      <div style={scanlineOverlay} />
      {animations}
      <div style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <Router basename="/escape-room-python">
        <Layout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/game" element={<Game />} />
            <Route path="/transition" element={<Transition />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Layout>
      </Router>
    </GameProvider>
  );
}

export default App;
