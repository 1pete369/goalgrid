export default function generateFullYearSVG(year = 2025) {
  const startDate = new Date(`${year}-01-01`);
  const oneDayMs = 1000 * 60 * 60 * 24;

  let currentDate = startDate;
  const baseX = 40;
  const baseY = 40;
  const boxSize = 11;
  const boxGap = 2;
  const dayHeight = boxSize + boxGap;
  const weekWidth = boxSize + boxGap;

  const rects: string[] = [];
  const monthLabels: Map<number, string> = new Map();
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Helper
  function getWeekNumber(date: Date, baseYear: number) {
    const janFirst = new Date(baseYear, 0, 1);
    const diff = date.getTime() - janFirst.getTime();
    const daysSinceStart = Math.floor(diff / oneDayMs);
    return Math.floor((daysSinceStart + janFirst.getDay() - 1) / 7);
  }

  while (currentDate.getFullYear() === year) {
    const day = currentDate.getDay();
    const weekdayIndex = (day + 6) % 7; // Make Monday = 0

    const weekNumber = getWeekNumber(currentDate, year);
    const x = baseX + weekNumber * weekWidth;
    const y = baseY + weekdayIndex * dayHeight;

    const dateStr = currentDate.toISOString().split("T")[0];

    rects.push(
      `<rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" fill="#20242C90" rx="2" ry="2" id="${dateStr}" />`
    );

    // Store month label position
    const month = currentDate.getMonth();
    if (!monthLabels.has(month)) {
      monthLabels.set(
        month,
        `<text x="${x}" y="${baseY - 10}" font-size="10" fill="#999" font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif">${currentDate.toLocaleString('default', { month: 'short' })}</text>`
      );
    }

    currentDate = new Date(currentDate.getTime() + oneDayMs);
  }

  const weekdayLabels = weekdays.map((d, i) => {
    const y = baseY + i * dayHeight + 9;
    return `<text x="${baseX - 15}" y="${y}" font-size="10" fill="#999" font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif">${d}</text>`;
  });

  // Final SVG string
  const svg = `
<svg width="1000" height="140" xmlns="http://www.w3.org/2000/svg" style="background:#0D1117" shape-rendering="crispEdges" text-rendering="geometricPrecision">
  ${Array.from(monthLabels.values()).join('\n')}
  ${weekdayLabels.join('\n')}
  ${rects.join('\n')}
</svg>`.trim();

  console.log(svg);
}
