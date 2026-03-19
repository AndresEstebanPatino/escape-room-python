/**
 * Sistema de puntuación del Escape Room
 * 
 * 1er intento sin pista: 3 pts | con pista: 2 pts
 * 2do intento sin pista: 2 pts | con pista: 1.5 pts
 * 3er intento sin pista: 1 pt  | con pista: 0.5 pts
 * 4to intento sin pista: 0.5   | con pista: 0.25 pts
 * 
 * Max por sala: 3 | Max por nivel: 15 (5 salas) | Max total: 45 (15 salas)
 */

const SCORE_TABLE = {
  1: { noPista: 3,   conPista: 2 },
  2: { noPista: 2,   conPista: 1.5 },
  3: { noPista: 1,   conPista: 0.5 },
  4: { noPista: 0.5, conPista: 0.25 },
};

export function calcRoomScore(attempts, usedHint) {
  const attempt = Math.min(attempts, 4);
  const row = SCORE_TABLE[attempt];
  if (!row) return 0;
  return usedHint ? row.conPista : row.noPista;
}

export function calcTotalScore(roomResults) {
  return roomResults.reduce((sum, r) => sum + r.score, 0);
}

export function calcLevelScore(roomResults, levelNum) {
  return roomResults
    .filter(r => r.levelNum === levelNum)
    .reduce((sum, r) => sum + r.score, 0);
}

/**
 * Badges basados en porcentaje del total (45 pts)
 * 83%+ (37.5+) → Pythonista Avanzado
 * 56%+ (25+)   → Constructor Intermedio  
 * 28%+ (12.5+) → Explorador Curioso
 * <28%         → Nuevo Aventurero
 */
export function getBadge(totalScore) {
  if (totalScore >= 37.5) return {
    label: "🧙 Pythonista Avanzado",
    color: "#ffd700",
    msg: "Dominas Python con soltura. Estás listo/a para IA a fondo. ¡Impresionante!"
  };
  if (totalScore >= 25) return {
    label: "🔧 Constructor Intermedio",
    color: "#67e8f9",
    msg: "Tienes una base sólida. Algunos conceptos avanzados por pulir, pero vas genial."
  };
  if (totalScore >= 12.5) return {
    label: "🌱 Explorador Curioso",
    color: "#86efac",
    msg: "Conoces lo básico y eso es un gran comienzo. El bootcamp te va a dar superpoderes."
  };
  return {
    label: "🚀 Nuevo Aventurero",
    color: "#fca5a5",
    msg: "¡Perfecto punto de partida! Cada experto fue principiante. Vas a aprender muchísimo."
  };
}

export const MAX_SCORE_PER_ROOM = 3;
export const MAX_SCORE_PER_LEVEL = 15; // 5 salas × 3 pts
export const MAX_SCORE_TOTAL = 45;     // 15 salas × 3 pts
