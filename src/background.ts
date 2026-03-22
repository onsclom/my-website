import { lerp } from "./lerp";
import { sinLUT, SIN_LUT_MASK, SIN_LUT_QUARTER, radToIndex } from "./sinLUT";

const gridSize = 30;

type Square = {
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  velX: number;
  velY: number;
  phaseIndex: number;
  rotPhaseIndex: number;
};

let squares: Square[] = [];
let lastWidth = 0;
let lastHeight = 0;

function allocateSquares(width: number, height: number) {
  const cols = Math.ceil(width / gridSize) + 1;
  const rows = Math.ceil(height / gridSize) + 1;
  const next: Square[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const originX = col * gridSize + gridSize / 2;
      const originY = row * gridSize + gridSize / 2;
      const phase = originX + originY;
      next.push({
        originX,
        originY,
        offsetX: 0,
        offsetY: 0,
        velX: 0,
        velY: 0,
        phaseIndex: radToIndex(phase),
        rotPhaseIndex: radToIndex(phase * 0.05),
      });
    }
  }
  squares = next;
}

type PendingMove = { dx: number; dy: number; px: number; py: number };
let pendingMove: PendingMove | null = null;
let lastPos: { x: number; y: number } | null = null;
let pointerDown: { x: number; y: number } | null = null;

document.body.onpointermove = (e) => {
  if (pointerDown) {
    pointerDown.x = e.clientX;
    pointerDown.y = e.clientY;
  }

  if (lastPos) {
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    if (pendingMove) {
      pendingMove.dx += dx;
      pendingMove.dy += dy;
      pendingMove.px = e.clientX;
      pendingMove.py = e.clientY;
    } else {
      pendingMove = { dx, dy, px: e.clientX, py: e.clientY };
    }
  }
  if (!lastPos) {
    lastPos = { x: e.clientX, y: e.clientY };
  } else {
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
  }
};

document.body.onpointerdown = (e) => {
  pointerDown = { x: e.clientX, y: e.clientY };
  const px = e.clientX;
  const py = e.clientY;
  const effectDistance = 150;
  for (const sq of squares) {
    const dist = Math.hypot(sq.originX - px, sq.originY - py);
    if (dist < effectDistance) {
      const effect = (1 - dist / effectDistance) ** 2 * 12;
      sq.velX += (px - sq.originX) * effect;
      sq.velY += (py - sq.originY) * effect;
    }
  }
};

document.body.onpointerup = () => {
  pointerDown = null;
};

document.body.onpointercancel = () => {
  pointerDown = null;
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
let opacity = prefersReducedMotion ? 1 : 0;
const targetOpacity = 1;
const springK = 40;
const dampC = 7;

export function tick(ctx: CanvasRenderingContext2D, dt: number) {
  const ageSpan = document.getElementById("age-span")!;
  const birthday = new Date("1998-04-02T00:00:00-08:00");
  const now = new Date();
  const timeElapsed = now.getTime() - birthday.getTime();
  const years = timeElapsed / (1000 * 60 * 60 * 24 * 365.25);
  ageSpan.textContent = years.toFixed(10);

  const logicalWidth = ctx.canvas.width / devicePixelRatio;
  const logicalHeight = ctx.canvas.height / devicePixelRatio;
  if (logicalWidth !== lastWidth || logicalHeight !== lastHeight) {
    allocateSquares(logicalWidth, logicalHeight);
    lastWidth = logicalWidth;
    lastHeight = logicalHeight;
  }

  const dtS = dt / 1000;

  if (pointerDown) {
    const { x: px, y: py } = pointerDown;
    const effectDistance = 150;
    for (const sq of squares) {
      const dist = Math.hypot(sq.originX - px, sq.originY - py);
      if (dist < effectDistance) {
        const effect = (1 - dist / effectDistance) ** 2 * 30 * dtS;
        sq.velX += (px - sq.originX) * effect;
        sq.velY += (py - sq.originY) * effect;
      }
    }
  }

  if (pendingMove) {
    const { dx, dy, px, py } = pendingMove;
    pendingMove = null;
    const effectDistance = 100;
    for (const sq of squares) {
      const dist = Math.hypot(sq.originX - px, sq.originY - py);
      if (dist < effectDistance) {
        const effect = (1 - dist / effectDistance) ** 2 * 8;
        sq.velX += dx * effect;
        sq.velY += dy * effect;
      }
    }
  }

  for (const sq of squares) {
    const accX = -springK * sq.offsetX - dampC * sq.velX;
    const accY = -springK * sq.offsetY - dampC * sq.velY;
    sq.velX += accX * dtS;
    sq.velY += accY * dtS;
    sq.offsetX += sq.velX * dtS;
    sq.offsetY += sq.velY * dtS;
  }

  const dark = darkModeQuery.matches;
  ctx.fillStyle = dark ? "#111" : "#fefefe";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = dark ? "#1a1a1a" : "#f8f8f8";
  ctx.strokeStyle = dark ? "#2a2a2a" : "#ddd";

  opacity = lerp(opacity, targetOpacity, 1 - Math.exp(-0.005 * dt));
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 1;

  const half = (gridSize / 2) * 0.4;
  const now2 = performance.now();
  const waveTimeIndex = radToIndex(now2 * 0.001);
  const rotTimeIndex = radToIndex(now2 * 0.00025);

  ctx.beginPath();
  for (const sq of squares) {
    const waveY =
      -(sinLUT[(sq.phaseIndex + waveTimeIndex) & SIN_LUT_MASK] ?? 0) * 5;
    const cx = sq.originX + sq.offsetX;
    const cy = sq.originY + waveY + sq.offsetY;

    const rotIndex = (sq.rotPhaseIndex + rotTimeIndex) & SIN_LUT_MASK;
    const s = sinLUT[rotIndex] ?? 0;
    const c = sinLUT[(rotIndex + SIN_LUT_QUARTER) & SIN_LUT_MASK] ?? 0;
    const hc = half * c;
    const hs = half * s;

    ctx.moveTo(cx - hc + hs, cy - hs - hc);
    ctx.lineTo(cx + hc + hs, cy + hs - hc);
    ctx.lineTo(cx + hc - hs, cy + hs + hc);
    ctx.lineTo(cx - hc - hs, cy - hs + hc);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.1;
}
