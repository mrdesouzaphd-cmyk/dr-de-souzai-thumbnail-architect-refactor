/**
 * src/skills/table.js – Table transform skill + PNG canvas exporter.
 * Combines hookScore + hypeScore into a final composite score,
 * and provides JSON / PNG export utilities.
 * @module skills/table
 */

const THEMES = {
  tech:    { bg: '#0f0f1a', gradient: ['#7c3aed','#4f46e5'], text: '#e2e8f0', accent: '#06b6d4', bar: '#7c3aed' },
  finance: { bg: '#0a1628', gradient: ['#15803d','#ca8a04'], text: '#f0fdf4', accent: '#fbbf24', bar: '#15803d' },
  health:  { bg: '#0d1f1f', gradient: ['#0f766e','#0891b2'], text: '#f0fdfa', accent: '#a7f3d0', bar: '#0f766e' },
  gaming:  { bg: '#0a0a0a', gradient: ['#dc2626','#7f1d1d'], text: '#fef2f2', accent: '#f87171', bar: '#dc2626' },
  education: { bg: '#0c1445', gradient: ['#1d4ed8','#ea580c'], text: '#eff6ff', accent: '#fb923c', bar: '#1d4ed8' },
  general: { bg: '#111827', gradient: ['#374151','#1f2937'], text: '#f9fafb', accent: '#d1d5db', bar: '#6b7280' },
};

export function tableTransform(hook, { topic, niche, style }) {
  if (!hook || typeof hook.text !== 'string') {
    throw new TypeError('tableTransform: hook must have a text property');
  }
  const hookScore = typeof hook.hookScore === 'number' ? hook.hookScore : 40;
  const hypeScore = typeof hook.hypeScore === 'number' ? hook.hypeScore : 40;
  const composite = Math.round(hookScore * 0.6 + hypeScore * 0.4);
  const score     = Math.max(0, Math.min(100, composite));
  return {
    text:        hook.text,
    formula:     hook.formula,
    score,
    _hookScore:  hookScore,
    _hypeScore:  hypeScore,
    _powerWords: hook.powerWords ?? [],
    _hypeEmoji:  hook.hypeEmoji  ?? '',
  };
}

export function exportJSON(result) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `thumbnail-headlines-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPNG({ headline, niche }) {
  const canvas = document.createElement('canvas');
  renderThumbnailCanvas(canvas, { headline, niche });
  const a    = document.createElement('a');
  a.href     = canvas.toDataURL('image/png');
  a.download = 'thumbnail-placeholder.png';
  a.click();
}

export function renderThumbnailCanvas(canvas, { headline, niche }) {
  canvas.width  = 1280;
  canvas.height = 720;
  const ctx   = canvas.getContext('2d');
  const theme = THEMES[niche] ?? THEMES.general;
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, 1280, 720);
  const grd = ctx.createLinearGradient(0, 0, 1280, 720);
  grd.addColorStop(0, theme.gradient[0] + '99');
  grd.addColorStop(1, theme.gradient[1] + '66');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let x = 0; x < 1280; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,720); ctx.stroke(); }
  for (let y = 0; y < 720;  y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1280,y); ctx.stroke(); }
  ctx.fillStyle = theme.bar;
  ctx.fillRect(0, 0, 12, 720);
  ctx.fillStyle = theme.accent + '88';
  ctx.fillRect(0, 680, 1280, 40);
  ctx.font      = 'bold 22px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'right';
  ctx.fillText('Dr. De SouzAI • Thumbnail Architect', 1260, 40);
  ctx.font      = 'bold 18px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = theme.accent;
  ctx.textAlign = 'left';
  ctx.fillText(niche.toUpperCase(), 40, 50);
  ctx.fillStyle  = theme.text;
  ctx.textAlign  = 'center';
  const lines  = wrapText(ctx, headline, 1180, 72);
  const lineH  = 90;
  const startY = (720 - lines.length * lineH) / 2 + 20;
  lines.forEach((line, i) => {
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
    ctx.font = 'bold 72px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = theme.text;
    ctx.fillText(line, 640, startY + i * lineH);
  });
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
  ctx.font      = 'bold 24px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('Thumbnail Placeholder – Dr. De SouzAI', 640, 700);
}

function wrapText(ctx, text, maxWidth, fontSize) {
  ctx.font = `bold ${fontSize}px "Segoe UI", system-ui, sans-serif`;
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) { lines.push(current); current = word; }
    else { current = test; }
  }
  if (current) lines.push(current);
  return lines;
}
