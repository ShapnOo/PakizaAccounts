import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { BSFilterState, BSTreeRow } from '../types/balanceSheet';
import { MOCK_BS_ROWS, MOCK_BS_FILTERS } from '../mock/balanceSheet';
import { generateYears, computeRollups, formatValue } from '../lib/balanceSheetMath';
import { delay } from '../lib/delay';

const LS_FILTERS = 'bs:filters';

export async function getFilterState(): Promise<BSFilterState> {
  await delay(300);
  try {
    const raw = localStorage.getItem(LS_FILTERS);
    if (!raw) return MOCK_BS_FILTERS;
    const parsed = JSON.parse(raw);
    return { ...MOCK_BS_FILTERS, ...parsed };
  } catch {
    return MOCK_BS_FILTERS;
  }
}

export async function saveFilterState(s: BSFilterState): Promise<void> {
  await delay(200);
  try {
    localStorage.setItem(LS_FILTERS, JSON.stringify(s));
  } catch (e) {
    console.error('Failed to save BS filter state to localStorage:', e);
  }
}

export async function getBalanceSheetData(
  filters: BSFilterState
): Promise<{ years: string[]; rows: BSTreeRow[] }> {
  await delay(300);

  // Generate dynamic year columns based on compareWith & numberOfYears
  let years: string[] = [];
  if (filters.compareWith === 'None') {
    years = [filters.asOn || '2026-10-17'];
  } else if (filters.compareWith === 'Budget') {
    years = [filters.asOn || '2026-10-17', 'Budget Target'];
  } else if (filters.compareWith === 'Custom Period') {
    years = [
      filters.asOn || '2026-10-17',
      filters.customStartDate && filters.customEndDate
        ? `${filters.customStartDate} to ${filters.customEndDate}`
        : 'Comparative Period',
    ];
  } else {
    // Default: Previous Years
    years = generateYears(filters.asOn, filters.numberOfYears);
  }

  // Compute rollups
  const computed = computeRollups(MOCK_BS_ROWS, years.length);

  // If subLedger toggle is false, keep rows but clear subLedger for display
  const rows = filters.subLedger
    ? computed
    : computed.map((r) => ({ ...r, subLedger: undefined }));

  return { years, rows };
}

export async function exportToXlsx(
  flatRows: Record<string, any>[],
  years: string[],
  filename: string = 'Balance_Sheet.xlsx'
): Promise<void> {
  try {
    if (!flatRows || flatRows.length === 0) {
      toast.error('No Balance Sheet data available to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(flatRows);

    // Set column widths
    const colWidths: { wch: number }[] = [
      { wch: 38 }, // Particulars
      { wch: 10 }, // Level
      { wch: 28 }, // Sub-Ledger
    ];
    years.forEach(() => {
      colWidths.push({ wch: 18 });
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance_Sheet');

    XLSX.writeFile(wb, filename);
    toast.success('Balance Sheet exported to Excel successfully!', {
      description: `Downloaded: ${filename}`,
    });
  } catch (error) {
    console.error('Failed to export Balance Sheet to Excel:', error);
    toast.error('Failed to export Balance Sheet to Excel.');
  }
}

export async function exportToCsv(
  flatRows: Record<string, any>[],
  _years: string[],
  filename: string = 'Balance_Sheet.csv'
): Promise<void> {
  try {
    if (!flatRows || flatRows.length === 0) {
      toast.error('No Balance Sheet data available to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(flatRows);
    const csvContent = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Balance Sheet exported to CSV successfully!', {
      description: `Downloaded: ${filename}`,
    });
  } catch (error) {
    console.error('Failed to export Balance Sheet to CSV:', error);
    toast.error('Failed to export Balance Sheet to CSV.');
  }
}

export async function exportToPdf(
  years: string[],
  rows: BSTreeRow[],
  filters: BSFilterState
): Promise<void> {
  try {
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const headerYearsHtml = years
      .map(
        (y) => `
        <th style="padding: 6px 10px; border-bottom: 2px solid #cbd5e1; text-align: right; font-size: 10px; text-transform: uppercase;">
          <div>${y}</div>
          <div style="font-size: 8px; font-weight: normal; color: #64748b; text-transform: none; margin-top: 1px;">(As on)</div>
        </th>`
      )
      .join('');

    const rowsHtml = rows
      .map((r, idx) => {
        const indentPx = (r.level - 1) * 16 + (r.level === 5 ? 12 : 0);
        const isHeader = r.isParent && r.level === 1;
        const isTotal = r.isTotal;

        let bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        let weight = r.isParent || isTotal ? 'bold' : 'normal';
        let borderTop = isTotal ? '2px solid #cbd5e1' : '1px solid #e2e8f0';

        if (isHeader) {
          bg = '#f1f5f9';
        }

        const subLedgerText =
          r.subLedger && r.subLedger.name !== 'Undefined'
            ? `${r.subLedger.name} (${r.subLedger.tag})`
            : '—';

        const valuesHtml = r.values
          .map((v) => {
            const fmt = formatValue(
              v,
              filters.currency,
              filters.showInPercent,
              null,
              filters.valueShowIn
            );
            return `<td style="padding: 6px 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 10px; color: ${
              fmt.isNegative ? '#e11d48' : '#0f172a'
            };">${fmt.text}</td>`;
          })
          .join('');

        return `
        <tr style="background-color: ${bg}; font-weight: ${weight}; border-top: ${borderTop};">
          <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; padding-left: ${
            10 + indentPx
          }px;">${r.label}</td>
          ${
            filters.subLedger
              ? `<td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-size: 9.5px; color: #475569;">${subLedgerText}</td>`
              : ''
          }
          ${valuesHtml}
        </tr>`;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Balance Sheet Report</title>
          <style>
            @page { size: landscape; margin: 12mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 12px; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; }
            .header-title { font-size: 20px; font-weight: 800; text-transform: uppercase; margin: 0; }
            .header-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            .data-table th { background-color: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px; font-size: 10px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <h1 class="header-title">Pakiza Accounts</h1>
                <div class="header-sub">Balance Sheet Report (As on ${filters.asOn}) • Currency: ${filters.currency}</div>
              </td>
              <td style="text-align: right; font-size: 10px; color: #475569;">
                <div>Printed: <strong>${dateFormatted}</strong></div>
              </td>
            </tr>
          </table>

          <table class="data-table">
            <thead>
              <tr>
                <th>Particulars</th>
                ${filters.subLedger ? '<th>Sub-Ledger</th>' : ''}
                ${headerYearsHtml}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.id = 'bs-pdf-print-frame';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      toast.info('Preparing Balance Sheet PDF for printing...');
      setTimeout(() => {
        const existing = document.getElementById('bs-pdf-print-frame');
        if (existing) {
          document.body.removeChild(existing);
        }
      }, 60000);
    } else {
      window.print();
    }
  } catch (error) {
    console.error('Failed to export to PDF:', error);
    toast.error('Failed to export Balance Sheet to PDF.');
  }
}

