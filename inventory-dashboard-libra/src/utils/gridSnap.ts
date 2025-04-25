// grid 40 px, origin (0,0) top-left of canvas  (fits designs)
export const CELL = 40;
export function snap(v: number) {
  return Math.round(v / CELL) * CELL;
}
