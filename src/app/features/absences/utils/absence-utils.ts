export function validateAbsenceDates(startDate: Date, endDate: Date): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  return start >= today && end >= start;
}

export function calculateAbsenceDuration(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function formatAbsenceType(type: string): string {
  const types: Record<string, string> = {
    vacation: 'Congés',
    sick: 'Maladie',
    remote: 'Télétravail',
    other: 'Autre'
  };
  return types[type] || type;
}

export function formatAbsenceStatus(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé'
  };
  return statuses[status] || status;
}