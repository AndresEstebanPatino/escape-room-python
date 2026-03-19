import { SKILL_LABELS } from "../data/rooms";
import { calcLevelScore, calcTotalScore, getBadge, MAX_SCORE_PER_LEVEL, MAX_SCORE_TOTAL } from "../utils/scoring";

/**
 * Genera el cuerpo del reporte en texto plano formateado para el email.
 */
export function buildReport(playerName, roomResults, totalTimeSeconds) {
  const totalScore = calcTotalScore(roomResults);
  const badge = getBadge(totalScore);
  const badgeClean = badge.label.replace(/[\u{1F000}-\u{1FFFF}]/gu, "").trim();
  const mins = Math.floor(totalTimeSeconds / 60);
  const secs = totalTimeSeconds % 60;
  const totalHints = roomResults.filter(r => r.usedHint).length;
  const avgAttempts = roomResults.length > 0
    ? (roomResults.reduce((s, r) => s + r.attempts, 0) / roomResults.length).toFixed(1)
    : "0";

  const now = new Date();
  const fecha = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const levelNames = { 1: "BÁSICO", 2: "INTERMEDIO", 3: "AVANZADO" };
  const sep = "═".repeat(45);
  const sepLight = "─".repeat(30);

  let body = "";

  // Header
  body += `${sep}\n`;
  body += `REPORTE ESCAPE ROOM — ${playerName.toUpperCase()}\n`;
  body += `Fecha: ${fecha}\n`;
  body += `${sep}\n\n`;

  // Resumen
  body += `RESUMEN\n`;
  body += `${sepLight}\n`;
  body += `Score total: ${totalScore}/${MAX_SCORE_TOTAL}\n`;
  body += `Badge: ${badgeClean}\n`;
  body += `Tiempo total: ${mins}m ${secs}s\n`;
  body += `Pistas usadas: ${totalHints}/${roomResults.length}\n`;
  body += `Intentos promedio: ${avgAttempts}\n\n`;

  // Detalle por nivel
  body += `DETALLE POR NIVEL\n`;
  body += `${sepLight}\n\n`;

  for (let lvl = 1; lvl <= 3; lvl++) {
    const lvlScore = calcLevelScore(roomResults, lvl);
    const lvlRooms = roomResults.filter(r => r.levelNum === lvl);

    body += `NIVEL ${lvl} — ${levelNames[lvl]} (${lvlScore}/${MAX_SCORE_PER_LEVEL} pts)\n`;

    lvlRooms.forEach(r => {
      const skillName = SKILL_LABELS[r.skill] || r.skill;
      body += `  Sala ${r.roomId} - ${skillName}:\n`;
      body += `    Intentos: ${r.attempts} | Pista: ${r.usedHint ? "Sí" : "No"} | Puntos: ${r.score}/3 | Tiempo: ${r.timeSeconds}s\n`;
      body += `    Opciones elegidas: [${r.chosenOptions.map(o => o.toUpperCase()).join(", ")}]\n`;
    });

    body += `\n`;
  }

  // Análisis automático
  body += `ANÁLISIS AUTOMÁTICO\n`;
  body += `${sepLight}\n`;
  body += generateAnalysis(roomResults, totalScore);

  return body;
}

/**
 * Genera un análisis textual automático basado en los datos del jugador.
 */
function generateAnalysis(roomResults, totalScore) {
  const levelScores = {};
  const levelNames = { 1: "básico", 2: "intermedio", 3: "avanzado" };

  for (let lvl = 1; lvl <= 3; lvl++) {
    levelScores[lvl] = calcLevelScore(roomResults, lvl);
  }

  // Fortalezas (salas con score 3)
  const fortalezas = roomResults
    .filter(r => r.score === 3)
    .map(r => SKILL_LABELS[r.skill] || r.skill);

  // Debilidades (salas con peor score)
  const sorted = [...roomResults].sort((a, b) => a.score - b.score);
  const peores = sorted.slice(0, 3).filter(r => r.score < 2);

  // Sala con más intentos
  const maxAttempts = [...roomResults].sort((a, b) => b.attempts - a.attempts)[0];

  let analysis = "";

  // Rendimiento por nivel
  for (let lvl = 1; lvl <= 3; lvl++) {
    const pct = (levelScores[lvl] / MAX_SCORE_PER_LEVEL) * 100;
    if (pct >= 80) {
      analysis += `Muestra buen dominio de conceptos ${levelNames[lvl]}s (${levelScores[lvl]}/${MAX_SCORE_PER_LEVEL}). `;
    } else if (pct >= 50) {
      analysis += `Nivel ${levelNames[lvl]} parcialmente dominado (${levelScores[lvl]}/${MAX_SCORE_PER_LEVEL}). `;
    } else {
      analysis += `Necesita refuerzo en nivel ${levelNames[lvl]} (${levelScores[lvl]}/${MAX_SCORE_PER_LEVEL}). `;
    }
  }

  analysis += "\n";

  // Dificultades
  if (maxAttempts && maxAttempts.attempts > 2) {
    const skillName = SKILL_LABELS[maxAttempts.skill] || maxAttempts.skill;
    analysis += `Mayor dificultad en: ${skillName} (${maxAttempts.attempts} intentos). `;
  }

  // Recomendaciones
  if (peores.length > 0) {
    const nombres = peores.map(r => SKILL_LABELS[r.skill] || r.skill).join(", ");
    analysis += `Se recomienda reforzar: ${nombres}. `;
  }

  analysis += "\n";

  // Fortalezas
  if (fortalezas.length > 0) {
    analysis += `Fortalezas: ${fortalezas.join(", ")}.\n`;
  } else {
    analysis += `No obtuvo puntuación máxima en ninguna sala. Se recomienda una revisión general de los conceptos.\n`;
  }

  return analysis;
}
