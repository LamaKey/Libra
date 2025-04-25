/**
 * Keep only digits and (at most **one**) decimal point.
 * Re-uses the 1st "." and removes any later ones.
 */
export const sanitizeNumberInput = (s: string) =>
    s
      .replace(/[^0-9.]/g, '')          // throw everything but digits / dot
      .replace(/^(\d*\.?\d*).*$/, '$1'); // keep 1st dot only
  