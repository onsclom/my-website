import { tick } from "./background";

import { startLoop } from "./canvas-render-loop";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

startLoop(canvas, tick);
