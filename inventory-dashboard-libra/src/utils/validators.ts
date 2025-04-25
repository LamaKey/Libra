export const required = (v: string | number) =>
  (v ?? "").toString().trim() ? "" : "Required field";

export const positiveNumber = (v: string) => (+v > 0 ? "" : "Must be > 0");

export const dateRequired = (v: string) => (v ? "" : "Choose a date");

export const emailFormat = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Invalid email";
