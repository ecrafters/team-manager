export function getCurrentTimestamp(): Date {
  return new Date();
}

export function formatFirebaseDate(date: Date): string {
  return date.toISOString();
}