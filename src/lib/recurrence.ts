import { Cadence, CADENCES } from '../types/recurringJournal';

export function computeNextRun(
  startsOn: string,
  cadence: Cadence,
  fromDate: Date = new Date()
): string {
  if (!startsOn) return '';
  const start = new Date(startsOn);
  if (isNaN(start.getTime())) return '';

  let next = new Date(start);

  // If start is in the future, first run is start date
  if (next >= fromDate) {
    return next.toISOString().slice(0, 10);
  }

  // Walk forward by cadence until next >= today
  let guard = 0;
  while (next < fromDate && guard < 1000) {
    guard++;
    switch (cadence) {
      case 'Day':
        next.setDate(next.getDate() + 1);
        break;
      case 'Week':
        next.setDate(next.getDate() + 7);
        break;
      case 'Month':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'Quarter':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'Year':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
  }

  return next.toISOString().slice(0, 10);
}

export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return '';
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return '';

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export function cadenceLabel(c: Cadence): string {
  return CADENCES.find((x) => x.value === c)?.description ?? c;
}
