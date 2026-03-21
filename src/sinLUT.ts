const SIN_LUT_SIZE = 2048;
export const SIN_LUT_MASK = SIN_LUT_SIZE - 1;
export const SIN_LUT_QUARTER = SIN_LUT_SIZE / 4;
const SIN_LUT_SCALE = SIN_LUT_SIZE / (Math.PI * 2);

export const sinLUT = new Float32Array(SIN_LUT_SIZE);
for (let i = 0; i < SIN_LUT_SIZE; i++) {
  sinLUT[i] = Math.sin((i / SIN_LUT_SIZE) * Math.PI * 2);
}

export function radToIndex(x: number): number {
  return ((x * SIN_LUT_SCALE) | 0) & SIN_LUT_MASK;
}
