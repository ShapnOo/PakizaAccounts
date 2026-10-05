import { ChequeFor } from '../types/chequePrepare';

/**
 * Builds live auto-narration according to the workbook template:
 * Template: Being the amount paid to {Name} [{Cheque for}] CQ No. {Cheque No} CQ date: {M/D/YYYY}
 */
export function buildAutoNarration(line: {
  name?: string;
  chequeFor?: ChequeFor;
  chequeNo: string;
  chequeDate: string;
}): string {
  const name = (line.name || '').trim();
  const forTag = line.chequeFor ? `[${line.chequeFor}]` : '';
  const no = (line.chequeNo || '').trim();

  let dateStr = '';
  if (line.chequeDate) {
    // Attempt parsing either YYYY-MM-DD or standard Date
    const parts = line.chequeDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        dateStr = `${month}/${day}/${year}`;
      }
    }
    if (!dateStr) {
      const d = new Date(line.chequeDate);
      if (!isNaN(d.getTime())) {
        dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      }
    }
  }

  const parts = ['Being the amount paid to'];
  if (name) parts.push(name);
  if (forTag) parts.push(forTag);
  if (no) parts.push(`CQ No. ${no}`);
  if (dateStr) parts.push(`CQ date: ${dateStr}`);

  return parts.join(' ').trim();
}
