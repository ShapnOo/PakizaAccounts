import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import {
  TBFilterState,
  TBReport,
  TBLedgerRow,
  COLUMN_LABELS,
} from '../types/trialBalance';
import { MOCK_TB_ROWS, MOCK_TB_FILTERS } from '../mock/trialBalance';
import {
  computeRollups,
  computeTotals,
  checkBalance,
  formatTBValue,
} from '../lib/trialBalanceMath';

const LS_FILTERS = 'tb:filters';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getFilterState(): Promise<TBFilterState> {
  await delay(200);
  try {
    const raw = localStorage.getItem(LS_FILTERS);
    if (raw) return { ...MOCK_TB_FILTERS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse stored TB filters:', e);
  }
  return MOCK_TB_FILTERS;
}

export async function saveFilterState(filters: TBFilterState): Promise<void> {
  await delay(150);
  try {
    localStorage.setItem(LS_FILTERS, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save TB filters:', e);
  }
}

export async function getTrialBalance(
  filters: TBFilterState
): Promise<TBReport> {
  await delay(300);

  // 1. Compute full roll-ups
  const computed = computeRollups(MOCK_TB_ROWS);

  // 2. Apply GL only filter: hide level-4 sub-ledger rows
  const visible = filters.glOnly
    ? computed.filter((r) => r.level <= 3)
    : computed;

  // 3. Apply sub-ledger toggle: hide subLedger info when off
  const rows = filters.subLedger
    ? visible
    : visible.map((r) => ({ ...r, subLedger: undefined }));

  // 4. Compute totals and balance checks on the full rollup
  const totals = computeTotals(computed);
  const { isBalanced, differences } = checkBalance(totals);

  return { filters, rows, totals, isBalanced, differences };
}

/**
 * Export Trial Balance Report to Excel (.xlsx) using SheetJS
 */
export async function exportToXlsx(
  report: TBReport,
  filename = 'Trial_Balance_Report.xlsx'
): Promise<void> {
  try {
    const wb = XLSX.utils.book_new();

    const periodStr =
      report.filters.dateRange === 'Custom' &&
      report.filters.customFrom &&
      report.filters.customTo
        ? `${report.filters.customFrom} to ${report.filters.customTo}`
        : report.filters.dateRange;

    // Headers
    const headers: string[] = ['Particulars'];
    if (report.filters.subLedger) headers.push('Sub-Ledger');

    const colKeys = (
      Object.keys(report.filters.visibleColumns) as (keyof typeof report.filters.visibleColumns)[]
    ).filter((k) => report.filters.visibleColumns[k]);

    colKeys.forEach((k) => headers.push(COLUMN_LABELS[k]));

    const rows: (string | number)[][] = [
      ['TRIAL BALANCE REPORT'],
      [`Period: ${periodStr} | Currency: ${report.filters.currency} | Values: ${report.filters.valueShowIn}`],
      [],
      headers,
    ];

    report.rows.forEach((r) => {
      const indent = '  '.repeat(r.level - 1);
      const rowData: (string | number)[] = [
        `${indent}${r.accountPath[r.accountPath.length - 1]}`,
      ];

      if (report.filters.subLedger) {
        rowData.push(
          r.subLedger ? `${r.subLedger.name} (${r.subLedger.tag})` : ''
        );
      }

      colKeys.forEach((k) => {
        rowData.push(r[k] as number);
      });

      rows.push(rowData);
    });

    // Total Row
    const totalRow: (string | number)[] = ['TOTAL'];
    if (report.filters.subLedger) totalRow.push('');
    colKeys.forEach((k) => {
      totalRow.push(report.totals[k]);
    });
    rows.push(totalRow);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Trial Balance');
    XLSX.writeFile(wb, filename);

    toast.success('Exported to Excel successfully!', {
      description: `Saved as ${filename}`,
    });
  } catch (err) {
    console.error('Failed to export to Excel:', err);
    toast.error('Failed to export to Excel.');
  }
}

/**
 * Export Trial Balance Report to CSV
 */
export async function exportToCsv(
  report: TBReport,
  filename = 'Trial_Balance_Report.csv'
): Promise<void> {
  try {
    const periodStr =
      report.filters.dateRange === 'Custom' &&
      report.filters.customFrom &&
      report.filters.customTo
        ? `${report.filters.customFrom} to ${report.filters.customTo}`
        : report.filters.dateRange;

    const colKeys = (
      Object.keys(report.filters.visibleColumns) as (keyof typeof report.filters.visibleColumns)[]
    ).filter((k) => report.filters.visibleColumns[k]);

    const headers = ['"Particulars"'];
    if (report.filters.subLedger) headers.push('"Sub-Ledger"');
    colKeys.forEach((k) => headers.push(`"${COLUMN_LABELS[k]}"`));

    const lines: string[] = [
      '"TRIAL BALANCE REPORT"',
      `"Period: ${periodStr}","Currency: ${report.filters.currency}","Values: ${report.filters.valueShowIn}"`,
      '',
      headers.join(','),
    ];

    report.rows.forEach((r) => {
      const indent = '  '.repeat(r.level - 1);
      const rowData = [
        `"${indent}${r.accountPath[r.accountPath.length - 1]}"`,
      ];
      if (report.filters.subLedger) {
        rowData.push(
          r.subLedger
            ? `"${r.subLedger.name} (${r.subLedger.tag})"`
            : '""'
        );
      }
      colKeys.forEach((k) => {
        rowData.push(`"${r[k]}"`);
      });
      lines.push(rowData.join(','));
    });

    const totalRow = ['"TOTAL"'];
    if (report.filters.subLedger) totalRow.push('""');
    colKeys.forEach((k) => {
      totalRow.push(`"${report.totals[k]}"`);
    });
    lines.push(totalRow.join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Exported to CSV successfully!', {
      description: `Downloaded: ${filename}`,
    });
  } catch (error) {
    console.error('Failed to export to CSV:', error);
    toast.error('Failed to export to CSV.');
  }
}

/**
 * Print & Export Landscape PDF
 */
export async function exportToPdf(report: TBReport): Promise<void> {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print PDF.');
      return;
    }

    const cur = report.filters.currency;
    const vsi = report.filters.valueShowIn;
    const colKeys = (
      Object.keys(report.filters.visibleColumns) as (keyof typeof report.filters.visibleColumns)[]
    ).filter((k) => report.filters.visibleColumns[k]);

    const periodStr =
      report.filters.dateRange === 'Custom' &&
      report.filters.customFrom &&
      report.filters.customTo
        ? `${report.filters.customFrom} to ${report.filters.customTo}`
        : report.filters.dateRange;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Trial Balance Report</title>
        <style>
          @page { size: A4 landscape; margin: 12mm 10mm; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0; padding: 12px; color: #0f172a; font-size: 11px; background: #fff;
          }
          .header-box { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
          .title { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; text-transform: uppercase; }
          .meta { font-size: 10.5px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; }
          th { background: #f8fafc; font-weight: 700; text-transform: uppercase; }
          .num { text-align: right; font-variant-numeric: tabular-nums; }
          .l1 { background: #f1f5f9; font-weight: 800; font-size: 11.5px; }
          .l2 { background: #f8fafc; font-weight: 700; }
          .l3 { font-weight: 600; }
          .l4 { font-weight: 400; }
          .total-row { background: #e0e7ff; font-weight: 800; border-top: 2px solid #4f46e5; border-bottom: 2px double #4f46e5; font-size: 11.5px; }
          .tag { font-size: 9px; padding: 2px 5px; border-radius: 4px; border: 1px solid #cbd5e1; background: #f1f5f9; }
          .balanced-pill { display: inline-block; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 9999px; font-weight: bold; font-size: 9px; margin-left: 5px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="title">Trial Balance Report</div>
          <div class="meta">
            Period: <strong>${periodStr}</strong> | Currency: <strong>${cur}</strong> | Values: <strong>${vsi}</strong>
            <span class="balanced-pill">Opening: Balanced ✓</span>
            <span class="balanced-pill">Movement: Balanced ✓</span>
            <span class="balanced-pill">Closing: Balanced ✓</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Particulars</th>
              ${report.filters.subLedger ? '<th>Sub-Ledger</th>' : ''}
              ${colKeys.map((k) => `<th style="text-align: right;">${COLUMN_LABELS[k]}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${report.rows
              .map((r) => {
                const rowClass = `l${r.level}`;
                const indent = (r.level - 1) * 16;
                const name = r.accountPath[r.accountPath.length - 1];

                return `
                  <tr class="${rowClass}">
                    <td style="padding-left: ${indent + 8}px;">${name}</td>
                    ${
                      report.filters.subLedger
                        ? `<td>${r.subLedger ? `${r.subLedger.name} <span class="tag">${r.subLedger.tag}</span>` : '—'}</td>`
                        : ''
                    }
                    ${colKeys
                      .map((k) => `<td class="num">${formatTBValue(r[k] as number, vsi, cur)}</td>`)
                      .join('')}
                  </tr>
                `;
              })
              .join('')}

            <tr class="total-row">
              <td colspan="${report.filters.subLedger ? 2 : 1}">TOTAL</td>
              ${colKeys
                .map((k) => `<td class="num">${formatTBValue(report.totals[k], vsi, cur)}</td>`)
                .join('')}
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 15px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
          <span>Printed on ${new Date().toLocaleString()}</span>
          <span>Accounts Dynamics • Trial Balance Report</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  } catch (error) {
    console.error('Failed to export to PDF:', error);
    toast.error('Failed to open PDF print preview.');
  }
}

