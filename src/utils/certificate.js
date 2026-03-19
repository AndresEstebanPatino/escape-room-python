import { jsPDF } from "jspdf";

/**
 * Genera un certificado PDF landscape profesional y con contenido relevante.
 */
export function generateCertificate(playerName, badgeLabel) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 297
  const H = doc.internal.pageSize.getHeight();  // 210
  const cx = W / 2;

  // --- Paleta ---
  const DARK   = [26, 58, 37];
  const GOLD   = [139, 115, 85];
  const GRAY   = [102, 102, 102];
  const LGRAY  = [160, 160, 160];
  const BORDER = [45, 90, 61];
  const ACCENT = [74, 222, 128];
  const BG     = [247, 250, 247];

  // --- Fondo ---
  doc.setFillColor(...BG);
  doc.rect(0, 0, W, H, "F");

  // --- Franja superior decorativa ---
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 5, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 5, W, 1.5, "F");

  // --- Franja inferior decorativa ---
  doc.setFillColor(...GOLD);
  doc.rect(0, H - 6.5, W, 1.5, "F");
  doc.setFillColor(...DARK);
  doc.rect(0, H - 5, W, 5, "F");

  // --- Borde doble ---
  const m = 14;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.rect(m, m, W - m * 2, H - m * 2);
  doc.setLineWidth(0.3);
  doc.rect(m + 3.5, m + 3.5, W - (m + 3.5) * 2, H - (m + 3.5) * 2);

  // --- Esquinas decorativas ---
  const cLen = 14;
  const cOff = m + 7;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.7);
  [[cOff, cOff, 1, 1], [W - cOff, cOff, -1, 1], [cOff, H - cOff, 1, -1], [W - cOff, H - cOff, -1, -1]].forEach(([x, y, dx, dy]) => {
    doc.line(x, y, x + cLen * dx, y);
    doc.line(x, y, x, y + cLen * dy);
  });

  // === CONTENIDO ===
  let y = 30;

  // --- Marca superior ---
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.4);
  doc.line(cx - 35, y, cx + 35, y);
  doc.setFillColor(...ACCENT);
  doc.circle(cx - 37, y, 0.8, "F");
  doc.circle(cx + 37, y, 0.8, "F");
  y += 10;

  // --- Título ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...DARK);
  doc.text("CERTIFICADO DE LOGRO", cx, y, { align: "center" });
  y += 7;

  // Subtítulo 
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text("PYTHON ESCAPE ROOM  \u00B7  BOOTCAMP DE INTELIGENCIA ARTIFICIAL", cx, y, { align: "center" });
  y += 5;

  // Línea separadora
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(cx - 55, y, cx + 55, y);
  y += 11;

  // --- Bloque de certificación ---
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text("Se certifica que el/la participante", cx, y, { align: "center" });
  y += 12;

  // --- Nombre ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...DARK);
  doc.text(playerName.toUpperCase(), cx, y, { align: "center" });
  y += 5;

  // Línea bajo el nombre
  const nw = Math.min(doc.getTextWidth(playerName.toUpperCase()) + 30, 160);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(cx - nw / 2, y, cx + nw / 2, y);
  y += 11;

  // --- Cuerpo descriptivo ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text("ha superado con éxito los 3 niveles del Python Escape Room,", cx, y, { align: "center" });
  y += 6;
  doc.text("demostrando competencia en los siguientes dominios de programación:", cx, y, { align: "center" });
  y += 10;

  // --- Las 3 áreas en columnas ---
  const areas = [
    { title: "NIVEL 1: BÁSICO", items: "Variables, Tipos, Listas,\nOperadores, Strings, Booleanos" },
    { title: "NIVEL 2: INTERMEDIO", items: "Bucles, Funciones, Scope,\nComprehensions, Excepciones" },
    { title: "NIVEL 3: AVANZADO", items: "Diccionarios, Lambda/Map,\nSets, POO, *args" }
  ];

  const colW = 70;
  const colGap = 12;
  const startX = cx - (colW * 3 + colGap * 2) / 2;

  areas.forEach((area, i) => {
    const x = startX + i * (colW + colGap) + colW / 2;

    // Título del nivel
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...BORDER);
    doc.text(area.title, x, y, { align: "center" });

    // Items
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...LGRAY);
    const lines = area.items.split("\n");
    lines.forEach((line, li) => {
      doc.text(line, x, y + 5 + li * 4, { align: "center" });
    });
  });

  y += 18;

  // --- Línea separadora ---
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.3);
  doc.line(cx - 55, y, cx + 55, y);
  y += 9;

  // --- Rango obtenido ---
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text("Obteniendo el rango de", cx, y, { align: "center" });
  y += 9;

  // Badge (sin emojis que jsPDF no puede renderizar)
  const badgeClean = badgeLabel.replace(/[\u{1F000}-\u{1FFFF}]/gu, "").trim();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...DARK);
  doc.text(badgeClean, cx, y, { align: "center" });
  y += 14;

  // === FOOTER ===
  // Línea decorativa
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(cx - 55, y, cx + 55, y);
  y += 8;

  // Fecha y firma en dos columnas
  const fecha = formatDate(new Date());

  // Columna izquierda: fecha
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(fecha, cx - 45, y, { align: "center" });
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(cx - 75, y - 5, cx - 15, y - 5);

  // Columna derecha: firma
  doc.text("Bootcamp IA \u00B7 Día 1", cx + 45, y, { align: "center" });
  doc.line(cx + 15, y - 5, cx + 75, y - 5);

  // Labels bajo las líneas
  doc.setFontSize(7);
  doc.setTextColor(...LGRAY);
  doc.text("FECHA", cx - 45, y + 4, { align: "center" });
  doc.text("ORGANIZACIÓN", cx + 45, y + 4, { align: "center" });

  // --- Guardar ---
  const safeName = playerName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  doc.save(`certificado-escape-room-${safeName}.pdf`);
}

function formatDate(date) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
}
