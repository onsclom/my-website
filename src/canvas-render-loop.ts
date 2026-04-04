// easy way to test if simulation is framerate indepedent
// 0 uses requestAnimationFrame, otherwise fixed timestep
const FIXED_FPS = 0;

let lastTime = performance.now();

export function startLoop(
  canvas: HTMLCanvasElement,
  tick: (canvas: HTMLCanvasElement, dt: number) => void,
) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    runTickStep(canvas, tick);
    window.addEventListener("resize", () => runTickStep(canvas, tick));
    return;
  }

  if (FIXED_FPS) {
    setInterval(() => {
      runTickStep(canvas, tick);
    }, 1000 / FIXED_FPS);
  } else {
    startRafLoop(canvas, tick);
  }
}

function startRafLoop(
  canvas: HTMLCanvasElement,
  tick: (canvas: HTMLCanvasElement, dt: number) => void,
) {
  runTickStep(canvas, tick);
  requestAnimationFrame(() => startRafLoop(canvas, tick));
}

function runTickStep(
  canvas: HTMLCanvasElement,
  tick: (canvas: HTMLCanvasElement, dt: number) => void,
) {
  const now = performance.now();
  const maxDt = 100;
  const dt = Math.min(maxDt, now - lastTime);

  lastTime = now;

  const canvasRect = canvas.getBoundingClientRect();
  const newW = canvasRect.width * devicePixelRatio;
  const newH = canvasRect.height * devicePixelRatio;
  if (canvas.width !== newW || canvas.height !== newH) {
    canvas.width = newW;
    canvas.height = newH;
  }

  tick(canvas, dt);
}
