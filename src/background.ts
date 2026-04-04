import {
  startDrone,
  stopDrone,
  setDronePointer,
  getDroneVolume,
} from "./drone";
import { sinLUT, SIN_LUT_MASK, SIN_LUT_QUARTER, radToIndex } from "./sinLUT";

const gridSize = 25;

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
    setDronePointer(e.clientX, e.clientY);
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
  startDrone();
  setDronePointer(e.clientX, e.clientY);
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
  stopDrone();
  pointerDown = null;
};

document.body.onpointercancel = () => {
  stopDrone();
  pointerDown = null;
};

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const springK = 40;
const dampC = 7;

const VERT_SRC = `#version 300 es
in vec2 a_vertex;
in vec4 a_instance; // cx, cy, sinR, cosR

uniform vec2 u_resolution;
uniform float u_half;

void main() {
  float s = a_instance.z;
  float c = a_instance.w;
  vec2 rotated = vec2(
    a_vertex.x * c - a_vertex.y * s,
    a_vertex.x * s + a_vertex.y * c
  );
  vec2 pos = rotated * u_half + a_instance.xy;
  vec2 clip = (pos / u_resolution) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform vec4 u_color;
out vec4 fragColor;
void main() {
  fragColor = u_color;
}
`;

interface GLState {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  instanceBuf: WebGLBuffer;
  uResolution: WebGLUniformLocation;
  uHalf: WebGLUniformLocation;
  uColor: WebGLUniformLocation;
}

let glState: GLState | null = null;
let instanceData = new Float32Array(0);

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function initGL(canvas: HTMLCanvasElement): GLState {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false })!;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const quadBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1,  -1, 1,  1, 1
  ]), gl.STATIC_DRAW);

  const aVertex = gl.getAttribLocation(program, "a_vertex");
  gl.enableVertexAttribArray(aVertex);
  gl.vertexAttribPointer(aVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(aVertex, 0);

  const instanceBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf);

  const aInstance = gl.getAttribLocation(program, "a_instance");
  gl.enableVertexAttribArray(aInstance);
  gl.vertexAttribPointer(aInstance, 4, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(aInstance, 1);

  return {
    gl,
    program,
    instanceBuf,
    uResolution: gl.getUniformLocation(program, "u_resolution")!,
    uHalf: gl.getUniformLocation(program, "u_half")!,
    uColor: gl.getUniformLocation(program, "u_color")!,
  };
}

export function tick(canvas: HTMLCanvasElement, dt: number) {
  const ageSpan = document.getElementById("age-span")!;
  const birthday = new Date("1998-04-02T00:00:00-08:00");
  const now = new Date();
  const timeElapsed = now.getTime() - birthday.getTime();
  const years = timeElapsed / (1000 * 60 * 60 * 24 * 365.25);
  ageSpan.textContent = years.toFixed(10);

  if (!glState) glState = initGL(canvas);
  const { gl } = glState;

  const logicalWidth = canvas.width / devicePixelRatio;
  const logicalHeight = canvas.height / devicePixelRatio;
  if (logicalWidth !== lastWidth || logicalHeight !== lastHeight) {
    allocateSquares(logicalWidth, logicalHeight);
    lastWidth = logicalWidth;
    lastHeight = logicalHeight;
  }

  const dtS = dt / 1000;

  if (pointerDown) {
    const { x: px, y: py } = pointerDown;
    const effectDist2 = 150 * 150;
    const invEffectDist = 1 / 150;
    for (const sq of squares) {
      const ddx = sq.originX - px;
      const ddy = sq.originY - py;
      const dist2 = ddx * ddx + ddy * ddy;
      if (dist2 < effectDist2) {
        const t = 1 - Math.sqrt(dist2) * invEffectDist;
        const effect = t * t * 30 * dtS;
        sq.velX += (px - sq.originX) * effect;
        sq.velY += (py - sq.originY) * effect;
      }
    }
  }

  if (pendingMove) {
    const { dx, dy, px, py } = pendingMove;
    pendingMove = null;
    const effectDist2 = 100 * 100;
    const invEffectDist = 1 / 100;
    for (const sq of squares) {
      const ddx = sq.originX - px;
      const ddy = sq.originY - py;
      const dist2 = ddx * ddx + ddy * ddy;
      if (dist2 < effectDist2) {
        const t = 1 - Math.sqrt(dist2) * invEffectDist;
        const effect = t * t * 8;
        sq.velX += dx * effect;
        sq.velY += dy * effect;
      }
    }
  }

  const droneVol = getDroneVolume();
  const now2 = performance.now();
  const waveTimeIndex = radToIndex(now2 * 0.001);

  const pnx = pointerDown ? pointerDown.x / logicalWidth : 0.5;
  const pny = pointerDown ? pointerDown.y / logicalHeight : 0.5;
  const waveAngleIdx = radToIndex((pnx - 0.5) * Math.PI);
  const waveDirX = sinLUT[waveAngleIdx]!;
  const waveDirY = sinLUT[(waveAngleIdx + SIN_LUT_QUARTER) & SIN_LUT_MASK]!;
  const freqScale = 0.8 + pny * 0.4;
  const pointerPhaseOffset = radToIndex((pnx + pny) * 20);

  const waveStrength = droneVol * 128000;
  const waveForceY = waveStrength * dtS;
  const waveForceX = waveForceY * waveDirX * 0.5;
  const spatialScaleX = waveDirX * freqScale;
  const spatialScaleY = waveDirY * freqScale;

  for (const sq of squares) {
    if (waveStrength > 0.1) {
      const spatialPhase =
        sq.originX * spatialScaleX + sq.originY * spatialScaleY;
      const idx =
        (radToIndex(spatialPhase) + waveTimeIndex + pointerPhaseOffset) &
        SIN_LUT_MASK;
      const wave = sinLUT[idx]!;
      sq.velY += wave * waveForceY;
      sq.velX += wave * waveForceX;
    }

    const accX = -springK * sq.offsetX - dampC * sq.velX;
    const accY = -springK * sq.offsetY - dampC * sq.velY;
    sq.velX += accX * dtS;
    sq.velY += accY * dtS;
    sq.offsetX += sq.velX * dtS;
    sq.offsetY += sq.velY * dtS;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  const dark = darkModeQuery.matches;

  if (dark) {
    gl.clearColor(0x11 / 255, 0x11 / 255, 0x11 / 255, 1);
  } else {
    gl.clearColor(0xfe / 255, 0xfe / 255, 0xfe / 255, 1);
  }
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(glState.program);
  gl.uniform2f(glState.uResolution, logicalWidth, logicalHeight);

  // Build instance data: [cx, cy, sin, cos] per square
  const count = squares.length;
  if (instanceData.length < count * 4) {
    instanceData = new Float32Array(count * 4);
  }

  const half = (gridSize / 2) * 0.4;
  const rotTimeIndex = radToIndex(now2 * 0.00025);

  let i = 0;
  for (const sq of squares) {
    const cx = sq.originX + sq.offsetX;
    const cy = sq.originY + sq.offsetY;
    const rotIndex = (sq.rotPhaseIndex + rotTimeIndex) & SIN_LUT_MASK;
    instanceData[i] = cx;
    instanceData[i + 1] = cy;
    instanceData[i + 2] = sinLUT[rotIndex]!;
    instanceData[i + 3] = sinLUT[(rotIndex + SIN_LUT_QUARTER) & SIN_LUT_MASK]!;
    i += 4;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, glState.instanceBuf);
  gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.DYNAMIC_DRAW);

  const strokeHalf = half + 1.0;
  gl.uniform1f(glState.uHalf, strokeHalf);
  if (dark) {
    gl.uniform4f(glState.uColor, 0x2a / 255, 0x2a / 255, 0x2a / 255, 1);
  } else {
    gl.uniform4f(glState.uColor, 0xdd / 255, 0xdd / 255, 0xdd / 255, 1);
  }
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);

  gl.uniform1f(glState.uHalf, half);
  if (dark) {
    gl.uniform4f(glState.uColor, 0x1a / 255, 0x1a / 255, 0x1a / 255, 1);
  } else {
    gl.uniform4f(glState.uColor, 0xf8 / 255, 0xf8 / 255, 0xf8 / 255, 1);
  }
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
}
