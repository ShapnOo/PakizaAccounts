import { FilterRange } from '../types/journalEntry';

export function isDateInRange(
  dateStr: string,
  range: FilterRange,
  customFrom?: string,
  customTo?: string
): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (range) {
    case 'today':
      return d >= startOfDay && d <= endOfDay;

    case 'this-week': {
      const dayOfWeek = now.getDay(); // 0 is Sunday
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return d >= startOfWeek && d <= endOfWeek;
    }

    case 'this-month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return d >= startOfMonth && d <= endOfMonth;
    }

    case 'this-quarter': {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
      const endOfQuarter = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
      return d >= startOfQuarter && d <= endOfQuarter;
    }

    case 'this-year': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return d >= startOfYear && d <= endOfYear;
    }

    case 'custom': {
      if (customFrom && customTo) {
        const from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return d >= from && d <= to;
      }
      if (customFrom) {
        const from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        return d >= from;
      }
      if (customTo) {
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return d <= to;
      }
      return true;
    }

    default:
      return true;
  }
}
