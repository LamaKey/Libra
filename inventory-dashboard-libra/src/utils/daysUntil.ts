export function daysUntil(iso: string) {
    const ms = new Date(iso).getTime() - Date.now();
    return Math.ceil(ms / 86_400_000);   // milliseconds → days
  }
  