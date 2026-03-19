import emailjs from "@emailjs/browser";
import { buildReport } from "./reportBuilder";
import { getBadge, calcTotalScore } from "../utils/scoring";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Envía el reporte del jugador al formador de forma silenciosa.
 * - Si falla, loguea en consola como backup.
 * - Nunca lanza errores al usuario.
 */
export async function sendResultsEmail(playerName, roomResults, totalTimeSeconds) {
  const reportBody = buildReport(playerName, roomResults, totalTimeSeconds);

  // Si no hay credenciales configuradas, guardar en consola y salir
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.log("📧 EmailJS no configurado. Reporte guardado en consola como backup:");
    console.log(reportBody);
    return;
  }

  try {
    const totalScore = calcTotalScore(roomResults);
    const badge = getBadge(totalScore);
    const badgeClean = badge.label.replace(/[\u{1F000}-\u{1FFFF}]/gu, "").trim();

    // EmailJS template params — el template debe tener {{subject}}, {{message}} como mínimo
    // Variables disponibles: subject, player_name, badge, score, message
    const mins = Math.floor(totalTimeSeconds / 60);
    const secs = totalTimeSeconds % 60;

    const templateParams = {
      subject: `🐍 Escape Room — Resultado de ${playerName || "Anónimo"}`,
      player_name: playerName || "Anónimo",
      badge: badgeClean,
      score: `${totalScore}/45`,
      time: `${mins}m ${secs}s`,
      message: reportBody
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
    console.log("📧 Reporte enviado exitosamente.");

  } catch (error) {
    // Fallo silencioso: guardar backup en consola
    console.warn("📧 Error al enviar email. Backup del reporte:");
    console.log(reportBody);
    console.error("Detalle del error:", error?.text || error?.message || error);
  }
}
