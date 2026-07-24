import { formatCareerLength, formatMoney } from '@/lib/utils';
import type { GameState, PlayerRanks } from '@/types/game';

const END_LABELS: Record<string, string> = {
  retirement: 'Aposentadoria',
  burnout: 'Burnout',
  bankruptcy: 'Falência',
  company_sale: 'Venda da empresa',
  billionaire: 'Bilionário',
  death: 'Fim inesperado',
};

async function waitForFonts(): Promise<void> {
  if (!document.fonts?.ready) return;
  try {
    await document.fonts.ready;
  } catch {
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function setFont(
  ctx: CanvasRenderingContext2D,
  weight: string,
  size: number,
  family: string,
) {
  ctx.font = `${weight} ${size}px ${family}`;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  weight: string,
  family: string,
): number {
  let size = maxSize;
  while (size > minSize) {
    setFont(ctx, weight, size, family);
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  setFont(ctx, weight, minSize, family);
  return minSize;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0]!;

  for (let i = 1; i < words.length; i++) {
    const word = words[i]!;
    const next = `${current} ${word}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function fillWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = wrapLines(ctx, text, maxWidth);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

export async function renderResultCard(
  game: GameState,
  ranks?: PlayerRanks | null,
): Promise<Blob> {
  await waitForFonts();

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível');

  const { player, career, score } = game;
  const endLabel = END_LABELS[career.endReason ?? ''] ?? 'Fim';

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b1210');
  bg.addColorStop(0.45, '#07100e');
  bg.addColorStop(1, '#050a09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(30, 51, 44, 0.55)';
  ctx.lineWidth = 1;
  for (let x = 48; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 48; y < H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const glow = ctx.createRadialGradient(W * 0.5, 180, 20, W * 0.5, 220, 520);
  glow.addColorStop(0, 'rgba(61, 214, 140, 0.22)');
  glow.addColorStop(1, 'rgba(61, 214, 140, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 700);

  const pad = 64;
  const inset = 56;
  const contentX = pad + inset;
  const contentW = W - pad * 2 - inset * 2;
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 28);
  ctx.fillStyle = 'rgba(13, 26, 22, 0.92)';
  ctx.fill();
  ctx.strokeStyle = '#1e332c';
  ctx.lineWidth = 2;
  ctx.stroke();

  let y = pad + 72;

  ctx.fillStyle = '#3dd68c';
  setFont(ctx, '600', 28, '"IBM Plex Mono", monospace');
  ctx.fillText('DEPLOY SEXTA', contentX, y);
  y += 28;
  ctx.fillStyle = '#8aa396';
  setFont(ctx, '400', 22, '"IBM Plex Mono", monospace');
  ctx.fillText('FIM DE CARREIRA', contentX, y);

  y += 70;
  ctx.fillStyle = '#e8f2ec';
  const titleSize = fitFontSize(
    ctx,
    endLabel,
    contentW,
    68,
    40,
    '800',
    'Syne, sans-serif',
  );
  setFont(ctx, '800', titleSize, 'Syne, sans-serif');
  const titleLines = wrapLines(ctx, endLabel, contentW);
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, contentX, y);
    y += titleSize + 8;
  }
  y += 12;

  ctx.fillStyle = '#8aa396';
  const subtitle = `${player.name}  ·  ${formatCareerLength(career.monthsPlayed)}`;
  const subSize = fitFontSize(
    ctx,
    subtitle,
    contentW,
    30,
    20,
    '400',
    '"IBM Plex Mono", monospace',
  );
  setFont(ctx, '400', subSize, '"IBM Plex Mono", monospace');
  ctx.fillText(subtitle, contentX, y);

  y += 70;
  const scoreLabel = `SCORE  ${score ?? 0}`;
  setFont(ctx, '600', 26, '"IBM Plex Mono", monospace');
  const scoreW = Math.max(280, ctx.measureText(scoreLabel).width + 48);
  roundRect(ctx, contentX, y - 36, scoreW, 56, 12);
  ctx.fillStyle = 'rgba(61, 214, 140, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(61, 214, 140, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#3dd68c';
  setFont(ctx, '600', 26, '"IBM Plex Mono", monospace');
  ctx.fillText(scoreLabel, contentX + 22, y);

  y += 100;
  const metrics: [string, string][] = [
    ['Maior salário', formatMoney(career.peakSalary)],
    ['Patrimônio', formatMoney(player.wealth)],
    ['Empresas', String(player.companyHistory.length)],
    ['Projetos', String(player.projects.length)],
  ];

  const gap = 24;
  const colW = (contentW - gap) / 2;
  metrics.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx = contentX + col * (colW + gap);
    const my = y + row * 120;
    roundRect(ctx, mx, my, colW, 96, 14);
    ctx.fillStyle = '#07100e';
    ctx.fill();
    ctx.strokeStyle = '#1e332c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#8aa396';
    setFont(ctx, '400', 20, '"IBM Plex Mono", monospace');
    ctx.fillText(label.toUpperCase(), mx + 24, my + 36);
    ctx.fillStyle = '#e8f2ec';
    const valueSize = fitFontSize(
      ctx,
      value,
      colW - 48,
      34,
      22,
      '700',
      '"IBM Plex Mono", monospace',
    );
    setFont(ctx, '700', valueSize, '"IBM Plex Mono", monospace');
    ctx.fillText(value, mx + 24, my + 72);
  });

  y += 280;

  if (ranks && (ranks.wealth || ranks.longevity || ranks.salary)) {
    const ranksText = [
      ranks.wealth != null ? `#${ranks.wealth} patrimônio` : null,
      ranks.longevity != null ? `#${ranks.longevity} longevidade` : null,
      ranks.salary != null ? `#${ranks.salary} salário` : null,
    ]
      .filter(Boolean)
      .join('  ·  ');

    const ranksSize = fitFontSize(
      ctx,
      ranksText,
      contentW - 48,
      26,
      18,
      '400',
      '"IBM Plex Mono", monospace',
    );
    setFont(ctx, '400', ranksSize, '"IBM Plex Mono", monospace');
    const rankLines = wrapLines(ctx, ranksText, contentW - 48);
    const boxH = 70 + rankLines.length * (ranksSize + 8);

    roundRect(ctx, contentX, y, contentW, boxH, 14);
    ctx.fillStyle = 'rgba(61, 214, 140, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(61, 214, 140, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#3dd68c';
    setFont(ctx, '600', 22, '"IBM Plex Mono", monospace');
    ctx.fillText('POSIÇÃO MUNDIAL', contentX + 24, y + 40);

    ctx.fillStyle = '#e8f2ec';
    setFont(ctx, '400', ranksSize, '"IBM Plex Mono", monospace');
    fillWrappedText(
      ctx,
      ranksText,
      contentX + 24,
      y + 78,
      contentW - 48,
      ranksSize + 8,
    );
    y += boxH + 40;
  }

  if (player.achievements.length > 0) {
    const footerTop = H - pad - 110;
    ctx.fillStyle = '#3dd68c';
    setFont(ctx, '600', 22, '"IBM Plex Mono", monospace');
    ctx.fillText('CONQUISTAS', contentX, y);
    y += 36;
    ctx.fillStyle = '#8aa396';
    setFont(ctx, '400', 24, '"IBM Plex Mono", monospace');
    const ach = player.achievements.join('  ·  ');
    const lines = wrapLines(ctx, ach, contentW);
    for (const line of lines) {
      if (y > footerTop) break;
      ctx.fillText(line, contentX, y);
      y += 34;
    }
  }

  ctx.fillStyle = '#8aa396';
  setFont(ctx, '400', 22, '"IBM Plex Mono", monospace');
  ctx.fillText('deploysexta  ·  carreira roguelike tech', contentX, H - pad - 72);
  ctx.fillStyle = '#3dd68c';
  setFont(ctx, '400', 20, '"IBM Plex Mono", monospace');
  const playUrl = (window.location.origin + window.location.pathname).replace(
    /^https?:\/\//,
    '',
  );
  const urlSize = fitFontSize(
    ctx,
    playUrl,
    contentW,
    20,
    14,
    '400',
    '"IBM Plex Mono", monospace',
  );
  setFont(ctx, '400', urlSize, '"IBM Plex Mono", monospace');
  ctx.fillText(playUrl, contentX, H - pad - 40);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem'))),
      'image/png',
    );
  });
}

export async function shareResultOnWhatsApp(
  game: GameState,
  ranks?: PlayerRanks | null,
): Promise<void> {
  const blob = await renderResultCard(game, ranks);
  const file = new File([blob], 'deploy-sexta-resultado.png', {
    type: 'image/png',
  });

  if (typeof navigator.share !== 'function') {
    throw new Error(
      'Seu navegador não permite encaminhar imagem. Abra no celular (Chrome/Safari).',
    );
  }

  const data: ShareData = {
    files: [file],
    title: 'Deploy Sexta',
  };

  try {
    if (navigator.canShare && !navigator.canShare(data)) {
      throw new Error(
        'Este navegador não permite encaminhar imagem. Abra no celular para enviar no WhatsApp.',
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('encaminhar imagem')) throw err;
  }

  await navigator.share(data);
}
