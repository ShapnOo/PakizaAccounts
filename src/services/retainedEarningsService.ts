import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import {
  DateRange,
  RetainedEarningsReport,
} from '../types/retainedEarnings';
import {
  MOCK_RE_FILTERS,
  MOCK_MOVEMENT,
  MOCK_EQUITY,
} from '../mock/retainedEarnings';
import { computeReport, formatBDT } from '../lib/retainedEarningsMath';

const LS_FILTERS = 're:filters';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getFilterState(): Promise<{
  dateRange: DateRange;
  customFrom?: string;
  customTo?: string;
}> {
  await delay(200);
  try {
    const raw = localStorage.getItem(LS_FILTERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored RE filters:', e);
  }
  return MOCK_RE_FILTERS;
}

export async function saveFilterState(s: {
  dateRange: DateRange;
  customFrom?: string;
  customTo?: string;
}): Promise<void> {
  await delay(150);
  try {
    localStorage.setItem(LS_FILTERS, JSON.stringify(s));
  } catch (e) {
    console.error('Failed to save RE filters:', e);
  }
}

export async function getRetainedEarningsReport(
  dateRange: DateRange,
  customFrom?: string,
  customTo?: string
): Promise<RetainedEarningsReport> {
  await delay(300);
  return computeReport(
    MOCK_MOVEMENT,
    MOCK_EQUITY,
    dateRange,
    customFrom,
    customTo
  );
}

/**
 * Export Retained Earnings Report to Excel (.xlsx) using SheetJS
 */
export async function exportToXlsx(
  report: RetainedEarningsReport,
  filename = 'Retained_Earnings_Statement.xlsx'
): Promise<void> {
  try {
    const wb = XLSX.utils.book_new();

    const periodStr =
      report.dateRange === 'Custom' && report.customFrom && report.customTo
        ? `${report.customFrom} to ${report.customTo}`
        : report.dateRange;

    const rows: (string | number)[][] = [
      ['STATEMENT OF RETAINED EARNINGS'],
      [`Period: ${periodStr} | Currency: BDT (৳)`],
      [],
      ['RETAINED EARNINGS MOVEMENT', '', '', 'EQUITY SNAPSHOT', ''],
      ['Particulars', 'Amount (BDT)', '', 'Particulars', 'Amount (BDT)'],
    ];

    const maxRows = Math.max(report.movement.length, report.equity.length + 1);

    for (let i = 0; i < maxRows; i++) {
      const m = report.movement[i];
      let eLabel = '';
      let eAmount: string | number = '';

      if (i < report.equity.length) {
        eLabel = report.equity[i].label;
        eAmount = report.equity[i].amount;
      } else if (i === report.equity.length) {
        eLabel = 'Total Equity';
        eAmount = report.totals.totalEquity;
      }

      rows.push([
        m ? m.label : '',
        m ? m.amount : '',
        '',
        eLabel,
        eAmount,
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Retained Earnings');
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
 * Export Retained Earnings Report to CSV
 */
export async function exportToCsv(
  report: RetainedEarningsReport,
  filename = 'Retained_Earnings_Statement.csv'
): Promise<void> {
  try {
    const periodStr =
      report.dateRange === 'Custom' && report.customFrom && report.customTo
        ? `${report.customFrom} to ${report.customTo}`
        : report.dateRange;

    const lines: string[] = [];
    lines.push('"STATEMENT OF RETAINED EARNINGS"');
    lines.push(`"Period: ${periodStr}","Currency: BDT (৳)"`);
    lines.push('');
    lines.push(
      '"MOVEMENT PARTICULARS","AMOUNT (BDT)","","EQUITY PARTICULARS","AMOUNT (BDT)"'
    );

    const maxRows = Math.max(report.movement.length, report.equity.length + 1);
    for (let i = 0; i < maxRows; i++) {
      const m = report.movement[i];
      let eLabel = '';
      let eAmount: string | number = '';

      if (i < report.equity.length) {
        eLabel = report.equity[i].label;
        eAmount = report.equity[i].amount;
      } else if (i === report.equity.length) {
        eLabel = 'Total Equity';
        eAmount = report.totals.totalEquity;
      }

      lines.push(
        `"${m ? m.label : ''}","${m ? m.amount : ''}","","${eLabel}","${eAmount}"`
      );
    }

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
  } catch (err) {
    console.error('Failed to export to CSV:', err);
    toast.error('Failed to export to CSV.');
  }
}

/**
 * Print & Export Landscape/Portrait PDF
 */
export async function exportToPdf(
  report: RetainedEarningsReport
): Promise<void> {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print PDF.');
      return;
    }

    const periodStr =
      report.dateRange === 'Custom' && report.customFrom && report.customTo
        ? `${report.customFrom} to ${report.customTo}`
        : report.dateRange;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Retained Earnings Statement</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 15mm;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 15px;
            color: #0f172a;
            font-size: 12px;
            background: #fff;
          }
          .header-box {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 10px;
          }
          .title {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #0f172a;
            margin: 0 0 5px 0;
            text-transform: uppercase;
          }
          .subtitle {
            font-size: 12px;
            color: #64748b;
          }
          .panels-container {
            display: flex;
            gap: 20px;
          }
          .panel {
            flex: 1;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            overflow: hidden;
          }
          .movement-panel {
            flex: 1.4;
          }
          .equity-panel {
            flex: 1;
          }
          .panel-title {
            background: #f8fafc;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            border-bottom: 1px solid #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #334155;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px 12px;
            font-size: 11.5px;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 600;
            text-align: left;
            color: #475569;
          }
          .num {
            text-align: right;
            font-variant-numeric: tabular-nums;
          }
          .indent {
            padding-left: 24px;
          }
          .prefix-add {
            color: #059669;
            font-weight: 600;
          }
          .prefix-less {
            color: #e11d48;
            font-weight: 600;
          }
          .closing-row {
            background-color: #eef2ff;
            font-weight: bold;
            border-top: 2px solid #cbd5e1;
          }
          .total-equity-row {
            background-color: #f8fafc;
            font-weight: bold;
            border-top: 2px solid #cbd5e1;
          }
          .linked-tag {
            font-size: 9px;
            background: #dcfce7;
            color: #166534;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 6px;
            font-weight: 600;
          }
          .footer-note {
            margin-top: 25px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="title">Statement of Retained Earnings</div>
          <div class="subtitle">Period: <strong>${periodStr}</strong> • Currency: <strong>BDT (৳)</strong></div>
        </div>

        <div class="panels-container">
          <!-- Left: Movement Panel -->
          <div class="panel movement-panel">
            <div class="panel-title">Retained Earnings Movement</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">Particulars</th>
                  <th style="width: 40%; text-align: right;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${report.movement
                  .map((m) => {
                    const isClosing = m.rowType === 'closing';
                    const isAdd = m.rowType === 'add';
                    const isLess = m.rowType === 'less';
                    const isIndent = isAdd || isLess;

                    let labelHtml = m.label;
                    if (isAdd) {
                      labelHtml = `<span class="prefix-add">Add:</span> ${m.label.replace('Add: ', '')}`;
                    } else if (isLess) {
                      labelHtml = `<span class="prefix-less">Less:</span> ${m.label.replace('Less: ', '')}`;
                    }

                    return `
                      <tr class="${isClosing ? 'closing-row' : ''}">
                        <td class="${isIndent ? 'indent' : ''}">
                          ${labelHtml}
                          ${isClosing ? '<span class="linked-tag">→ Equity</span>' : ''}
                        </td>
                        <td class="num">${formatBDT(m.amount)}</td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>

          <!-- Right: Equity Panel -->
          <div class="panel equity-panel">
            <div class="panel-title">Equity Snapshot</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">Particulars</th>
                  <th style="width: 40%; text-align: right;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${report.equity
                  .map((e) => {
                    const isLinked = e.source === 'linked';
                    return `
                      <tr>
                        <td>
                          ${e.label}
                          ${isLinked ? '<span class="linked-tag">← Linked</span>' : ''}
                        </td>
                        <td class="num">${formatBDT(e.amount)}</td>
                      </tr>
                    `;
                  })
                  .join('')}
                <tr class="total-equity-row">
                  <td>Total Equity</td>
                  <td class="num">${formatBDT(report.totals.totalEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer-note">
          <span>Printed on ${new Date().toLocaleString()}</span>
          <span>Accounts Dynamics • Retained Earnings Statement (Reconciled ✓)</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
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

