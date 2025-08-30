import { lerp } from "./lerp";

const eventLife = 1000;
const pointerMoveEvents = [] as {
  x: number;
  y: number;
  dx: number;
  dy: number;
  lifetime: number;
}[];
const pointerClickEvents = [] as {
  x: number;
  y: number;
  lifetime: number;
}[];

let lastPos = null as { x: number; y: number } | null;
document.body.onpointermove = (e) => {
  if (lastPos) {
    pointerMoveEvents.push({
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - lastPos.x,
      dy: e.clientY - lastPos.y,
      lifetime: eventLife,
    });
  }
  if (!lastPos) {
    lastPos = { x: e.clientX, y: e.clientY };
  } else {
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
  }
};

document.body.onpointerdown = (e) => {
  pointerClickEvents.push({
    x: e.clientX,
    y: e.clientY,
    lifetime: eventLife,
  });
};

let opacity = 0;
const targetOpacity = 1;

export function tick(ctx: CanvasRenderingContext2D, dt: number) {
  const ageSpan = document.getElementById("age-span")!;
  const birthday = new Date("1998-04-02T00:00:00-08:00");
  const now = new Date();
  const timeElapsed = now.getTime() - birthday.getTime();
  const years = timeElapsed / (1000 * 60 * 60 * 24 * 365.25);
  ageSpan.textContent = years.toFixed(10);

  for (let i = pointerMoveEvents.length - 1; i >= 0; i--) {
    const ev = pointerMoveEvents[i]!;
    ev.lifetime -= dt;
  }
  while (pointerMoveEvents.length > 0 && pointerMoveEvents[0]!.lifetime <= 0) {
    pointerMoveEvents.shift();
  }
  for (let i = pointerClickEvents.length - 1; i >= 0; i--) {
    const ev = pointerClickEvents[i]!;
    ev.lifetime -= dt;
  }
  while (
    pointerClickEvents.length > 0 &&
    pointerClickEvents[0]!.lifetime <= 0
  ) {
    pointerClickEvents.shift();
  }

  ctx.fillStyle = "#fefefe";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#eaeaea";
  ctx.strokeStyle = "#eaeaea";

  // using dt
  opacity = lerp(opacity, targetOpacity, 1 - Math.exp(-0.0005 * dt));
  ctx.globalAlpha = opacity;

  const gridSize = 40;

  // draw text grid
  const canvasRect = ctx.canvas.getBoundingClientRect();
  const cols = Math.ceil(canvasRect.width / gridSize);
  const rows = Math.ceil(canvasRect.height / gridSize);
  ctx.lineWidth = 2;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = col * gridSize + gridSize / 2;
      const y = row * gridSize + gridSize / 2;
      const offset = x + y;

      let pointerOffsetX = 0;
      let pointerOffsetY = 0;
      for (const ev of pointerMoveEvents) {
        const dist = Math.hypot(ev.x - x, ev.y - y);
        const effectDistance = 100;
        if (dist < effectDistance) {
          const effect =
            (1 - dist / effectDistance) ** 2 *
            (ev.lifetime / eventLife) ** 2 *
            0.8;
          pointerOffsetX += ev.dx * effect;
          pointerOffsetY += ev.dy * effect;
        }
      }
      for (const ev of pointerClickEvents) {
        const dist = Math.hypot(ev.x - x, ev.y - y);
        const effectDistance = 150;
        if (dist < effectDistance) {
          const effect =
            (1 - dist / effectDistance) ** 2 *
            (ev.lifetime / eventLife) ** 2 *
            3;
          pointerOffsetX += (x - ev.x) * effect;
          pointerOffsetY += (y - ev.y) * effect;
        }
      }

      const rad = 0.4;
      ctx.save();
      ctx.translate(
        x + pointerOffsetX,
        y - +Math.sin(offset + performance.now() * 0.001) * 5 + pointerOffsetY,
      );
      ctx.rotate((offset + performance.now() * 0.005) * 0.2);
      ctx.strokeRect(
        -(gridSize / 2) * rad,
        -(gridSize / 2) * rad,
        (gridSize / 2) * rad * 2,
        (gridSize / 2) * rad * 2,
      );
      ctx.restore();
    }
  }
}
