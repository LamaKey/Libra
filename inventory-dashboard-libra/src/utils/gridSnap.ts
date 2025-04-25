export const CELL = 40;
export function snap(v: number) {
  return Math.round(v / CELL) * CELL;
}
