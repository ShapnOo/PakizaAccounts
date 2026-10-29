import { DisplayedBy } from '../types/incomeStatement';

/**
 * Generate fiscal years going backwards from current FY (e.g. 2026-2027)
 */
export function generateFiscalYears(n: number): string[] {
  const currentEndYear = 2027;
  const safeCount = Math.max(1, Math.min(n, 10));
  const years: string[] = [];

  for (let i = safeCount - 1; i >= 0; i--) {
    const end = currentEndYear - i;
    years.push(`${end - 1}-${end}`);
  }
  return years;
}

/**
 * Generate sub-periods for a fiscal year based on DisplayedBy (Quarter, Month, Year)
 */
export function generateSubPeriods(
  fy: string,
  displayedBy: DisplayedBy
): { key: string; label: string; subLabel?: string }[] {
  const parts = fy.split('-');
  const startYear = parts[0] || '2025';
  const endYear = parts[1] || '2026';
  const shortStart = startYear.slice(-2);
  const shortEnd = endYear.slice(-2);
  const suffix = `(${shortStart}-${shortEnd})`;

  if (displayedBy === 'Year') {
    return [{ key: fy, label: fy, subLabel: 'FY' }];
  }

  if (displayedBy === 'Month') {
    const months = [
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    ];
    return months.map((m) => ({
      key: `${fy}-${m}`,
      label: m,
      subLabel: suffix,
    }));
  }

  // Default: Quarter (4 quarters)
  return [
    { key: `${fy}-Q1`, label: 'Jul-Sep', subLabel: suffix },
    { key: `${fy}-Q2`, label: 'Oct-Dec', subLabel: suffix },
    { key: `${fy}-Q3`, label: 'Jan-Mar', subLabel: suffix },
    { key: `${fy}-Q4`, label: 'Apr-Jun', subLabel: suffix },
  ];
}
