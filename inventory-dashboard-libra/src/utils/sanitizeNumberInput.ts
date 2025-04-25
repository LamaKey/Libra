export const sanitizeNumberInput = (s: string) =>
  s.replace(/[^0-9.]/g, "").replace(/^(\d*\.?\d*).*$/, "$1");
