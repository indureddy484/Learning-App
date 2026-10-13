import jsPDF from "jspdf";

function drawClock(doc, centerX, centerY, radius, hour, minute) {
  const toRadians = (deg) => (Math.PI / 180) * deg;

  // Outer circle
  doc.setLineWidth(1.2);
  doc.circle(centerX, centerY, radius);

  // Tick marks (minute lines)
  for (let i = 0; i < 60; i++) {
    const angle = toRadians((360 / 60) * i);
    const outerX = centerX + radius * Math.sin(angle);
    const outerY = centerY - radius * Math.cos(angle);
    const innerRadius = i % 5 === 0 ? radius * 0.9 : radius * 0.95;
    const innerX = centerX + innerRadius * Math.sin(angle);
    const innerY = centerY - innerRadius * Math.cos(angle);

    doc.setLineWidth(i % 5 === 0 ? 0.8 : 0.4);
    doc.line(innerX, innerY, outerX, outerY);
  }

  // Hour numbers
  for (let h = 1; h <= 12; h++) {
    const angle = toRadians((360 / 12) * h);
    const x = centerX + radius * 0.78 * Math.sin(angle);
    const y = centerY - radius * 0.78 * Math.cos(angle);
    doc.setFontSize(10);
    doc.text(String(h), x - 2.5, y + 3);
  }

  // Hour hand
  const hourAngle = toRadians((360 / 12) * (hour % 12) + (minute / 60) * 30);
  const hx = centerX + radius * 0.5 * Math.sin(hourAngle);
  const hy = centerY - radius * 0.5 * Math.cos(hourAngle);
  doc.setLineWidth(1.5);
  doc.line(centerX, centerY, hx, hy);

  // Minute hand
  const minuteAngle = toRadians((360 / 60) * minute);
  const mx = centerX + radius * 0.75 * Math.sin(minuteAngle);
  const my = centerY - radius * 0.75 * Math.cos(minuteAngle);
  doc.setLineWidth(1);
  doc.line(centerX, centerY, mx, my);
}

export function generateClockWorksheet(totalCount = 10, clocksPerPage = 2) {
  const doc = new jsPDF();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const blockHeight = 120;

  const clocks = Array.from({ length: totalCount }).map(() => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 12) * 5;
    const correct = `${hour}:${minute.toString().padStart(2, "0")}`;
    const options = new Set([correct]);
    while (options.size < 4) {
      const h = Math.floor(Math.random() * 12) + 1;
      const m = Math.floor(Math.random() * 12) * 5;
      options.add(`${h}:${m.toString().padStart(2, "0")}`);
    }
    return { hour, minute, options: Array.from(options).sort(() => 0.5 - Math.random()) };
  });

  for (let i = 0; i < clocks.length; i++) {
    if (i % clocksPerPage === 0 && i !== 0) {
      doc.addPage();
    }

    const indexInPage = i % clocksPerPage;
    const topOffset = indexInPage * blockHeight + margin;
    const centerY = topOffset + 50;
    const centerX = 40;
    const radius = 30;

    drawClock(doc, centerX, centerY, radius, clocks[i].hour, clocks[i].minute);

    const startX = centerX + 50;
    const startY = centerY - 20;
    const labels = ["A", "B", "C", "D"];
    clocks[i].options.forEach((opt, optIndex) => {
      const x = startX;
      const y = startY + optIndex * 18;
      doc.setDrawColor(0);
      doc.rect(x, y, 60, 14);
      doc.setFontSize(12);
      doc.text(`${labels[optIndex]}. ${opt}`, x + 5, y + 10);
    });

    const isLastClock = i === clocks.length - 1;
    const isLastOfPage = (i + 1) % clocksPerPage === 0;

    if (indexInPage === 0 && !isLastClock && !isLastOfPage) {
      doc.setLineWidth(0.3);
      doc.line(margin, topOffset + blockHeight, pageWidth - margin, topOffset + blockHeight);
    }
  }

  doc.save("ClockWorksheet.pdf");
}