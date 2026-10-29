import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import {
  RPFilterState,
  RPStatementData,
} from '../types/receiptPayment';
import {
  MOCK_RP_FILTERS,
  MOCK_OPENING_BREAKDOWN,
  MOCK_RECEIPT_TRANSACTIONS,
  MOCK_PAYMENT_TRANSACTIONS,
} from '../mock/receiptPayment';
import {
  calculateRPStatement,
  formatRPValue,
  formatShortDate,
} from '../lib/receiptPaymentMath';

const FILTER_STORAGE_KEY = 'rp:filter-state';

export function getStoredRPFilters(): RPFilterState {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...MOCK_RP_FILTERS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load stored RP filters:', e);
  }
  return MOCK_RP_FILTERS;
}

export function saveStoredRPFilters(filters: RPFilterState): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save RP filters:', e);
  }
}

export async function fetchReceiptPaymentData(
  filters: RPFilterState
): Promise<RPStatementData> {
  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  return calculateRPStatement(
    filters,
    MOCK_OPENING_BREAKDOWN,
    MOCK_RECEIPT_TRANSACTIONS,
    MOCK_PAYMENT_TRANSACTIONS
  );
}

/**
 * Export Statement to Microsoft Excel (.xlsx) using SheetJS
 */
export async function exportRPToXlsx(
  statement: RPStatementData,
  filters: RPFilterState
): Promise<void> {
  try {
    const isComprehensive = filters.reportType === 'Comprehensive';
    const wb = XLSX.utils.book_new();

    const rows: (string | number)[][] = [
      ['STATEMENT OF RECEIPT AND PAYMENTS'],
      [`Report Type: ${filters.reportType} | Currency: ${filters.currency} | Values: ${filters.valueShowIn}`],
      [`Period: ${filters.startDate} to ${filters.endDate}`],
      [],
    ];

    if (isComprehensive) {
      rows.push([
        'RECEIPT', '', '', '', '',
        'PAYMENT', '', '', '', ''
      ]);
      rows.push([
        'Date', 'Voucher No', 'Particulars', 'Opposite Accounts', 'Amount',
        'Date', 'Voucher No', 'Particulars', 'Opposite Accounts', 'Amount'
      ]);

      // Opening block (receipt side)
      rows.push([statement.receiptOpening.title, '', '', '', statement.receiptOpening.total, '', '', '', '', '']);
      statement.receiptOpening.breakdown.forEach((b) => {
        rows.push(['', '', '', b.label, b.amount, '', '', '', '', '']);
      });

      // Rows
      const maxRows = Math.max(statement.receiptTransactions.length, statement.paymentTransactions.length);
      for (let i = 0; i < maxRows; i++) {
        const rcpt = statement.receiptTransactions[i];
        const pmt = statement.paymentTransactions[i];
        rows.push([
          rcpt ? formatShortDate(rcpt.date) : '',
          rcpt ? rcpt.voucherNo : '',
          rcpt ? rcpt.particulars : '',
          rcpt ? rcpt.oppositeAccounts : '',
          rcpt ? rcpt.amount : '',
          pmt ? formatShortDate(pmt.date) : '',
          pmt ? pmt.voucherNo : '',
          pmt ? pmt.particulars : '',
          pmt ? pmt.oppositeAccounts : '',
          pmt ? pmt.amount : '',
        ]);
      }

      // Totals & Closing block
      rows.push([
        'Total Debit', '', '', '', statement.totalDebit,
        'Total Credit', '', '', '', statement.totalCredit
      ]);

      // Closing block on payment side
      rows.push(['', '', '', '', '', statement.paymentClosing.title, '', '', '', statement.paymentClosing.total]);
      statement.paymentClosing.breakdown.forEach((b) => {
        rows.push(['', '', '', '', '', '', '', '', b.label, b.amount]);
      });

      // Grand totals
      rows.push([
        'Grand Total Receipt', '', '', '', statement.grandTotalReceipt,
        'Grand Total Payment', '', '', '', statement.grandTotalPayment
      ]);
    } else {
      // Summary mode
      rows.push([
        'RECEIPT', '',
        'PAYMENT', ''
      ]);
      rows.push([
        'Opposite Accounts', 'Amount',
        'Opposite Accounts', 'Amount'
      ]);

      // Opening block
      rows.push([statement.receiptOpening.title, statement.receiptOpening.total, '', '']);
      statement.receiptOpening.breakdown.forEach((b) => {
        rows.push([b.label, b.amount, '', '']);
      });

      const maxRows = Math.max(statement.receiptSummaryItems.length, statement.paymentSummaryItems.length);
      for (let i = 0; i < maxRows; i++) {
        const rcpt = statement.receiptSummaryItems[i];
        const pmt = statement.paymentSummaryItems[i];
        rows.push([
          rcpt ? rcpt.oppositeAccounts : '',
          rcpt ? rcpt.amount : '',
          pmt ? pmt.oppositeAccounts : '',
          pmt ? pmt.amount : '',
        ]);
      }

      rows.push([
        'Total Debit', statement.totalDebit,
        'Total Credit', statement.totalCredit
      ]);

      rows.push(['', '', statement.paymentClosing.title, statement.paymentClosing.total]);
      statement.paymentClosing.breakdown.forEach((b) => {
        rows.push(['', '', b.label, b.amount]);
      });

      rows.push([
        'Grand Total Receipt', statement.grandTotalReceipt,
        'Grand Total Payment', statement.grandTotalPayment
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Receipt & Payment');

    const filename = `Receipt_Payment_Statement_${filters.startDate}_to_${filters.endDate}.xlsx`;
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
 * Export Statement to CSV
 */
export async function exportRPToCsv(
  statement: RPStatementData,
  filters: RPFilterState
): Promise<void> {
  try {
    const isComprehensive = filters.reportType === 'Comprehensive';
    const lines: string[] = [];

    lines.push(`"RECEIPT AND PAYMENTS STATEMENT"`);
    lines.push(`"Report Type: ${filters.reportType}","Currency: ${filters.currency}","Period: ${filters.startDate} to ${filters.endDate}"`);
    lines.push('');

    if (isComprehensive) {
      lines.push('"RECEIPT DATE","VOUCHER NO","PARTICULARS","OPPOSITE ACCOUNT","AMOUNT","PAYMENT DATE","VOUCHER NO","PARTICULARS","OPPOSITE ACCOUNT","AMOUNT"');
      
      // Opening
      lines.push(`"${statement.receiptOpening.title}","","","","${statement.receiptOpening.total}","","","","",""`);
      statement.receiptOpening.breakdown.forEach((b) => {
        lines.push(`"","","","${b.label}","${b.amount}","","","","",""`);
      });

      const maxRows = Math.max(statement.receiptTransactions.length, statement.paymentTransactions.length);
      for (let i = 0; i < maxRows; i++) {
        const r = statement.receiptTransactions[i];
        const p = statement.paymentTransactions[i];
        const rFields = r
          ? `"${formatShortDate(r.date)}","${r.voucherNo}","${r.particulars}","${r.oppositeAccounts}","${r.amount}"`
          : '"","","","",""';
        const pFields = p
          ? `"${formatShortDate(p.date)}","${p.voucherNo}","${p.particulars}","${p.oppositeAccounts}","${p.amount}"`
          : '"","","","",""';
        lines.push(`${rFields},${pFields}`);
      }

      lines.push(`"Total Debit","","","","${statement.totalDebit}","Total Credit","","","","${statement.totalCredit}"`);
      lines.push(`"","","","","","${statement.paymentClosing.title}","","","","${statement.paymentClosing.total}"`);
      statement.paymentClosing.breakdown.forEach((b) => {
        lines.push(`"","","","","","","","","${b.label}","${b.amount}"`);
      });
      lines.push(`"Grand Total Receipt","","","","${statement.grandTotalReceipt}","Grand Total Payment","","","","${statement.grandTotalPayment}"`);
    } else {
      lines.push('"RECEIPT OPPOSITE ACCOUNT","AMOUNT","PAYMENT OPPOSITE ACCOUNT","AMOUNT"');
      lines.push(`"${statement.receiptOpening.title}","${statement.receiptOpening.total}","",""`);
      statement.receiptOpening.breakdown.forEach((b) => {
        lines.push(`"${b.label}","${b.amount}","",""`);
      });

      const maxRows = Math.max(statement.receiptSummaryItems.length, statement.paymentSummaryItems.length);
      for (let i = 0; i < maxRows; i++) {
        const r = statement.receiptSummaryItems[i];
        const p = statement.paymentSummaryItems[i];
        lines.push(`"${r?.oppositeAccounts || ''}","${r?.amount || ''}","${p?.oppositeAccounts || ''}","${p?.amount || ''}"`);
      }

      lines.push(`"Total Debit","${statement.totalDebit}","Total Credit","${statement.totalCredit}"`);
      lines.push(`"","","${statement.paymentClosing.title}","${statement.paymentClosing.total}"`);
      statement.paymentClosing.breakdown.forEach((b) => {
        lines.push(`"","","${b.label}","${b.amount}"`);
      });
      lines.push(`"Grand Total Receipt","${statement.grandTotalReceipt}","Grand Total Payment","${statement.grandTotalPayment}"`);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const filename = `Receipt_Payment_${filters.startDate}_to_${filters.endDate}.csv`;
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
export async function exportRPToPdf(
  statement: RPStatementData,
  filters: RPFilterState
): Promise<void> {
  try {
    const isComprehensive = filters.reportType === 'Comprehensive';
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print PDF.');
      return;
    }

    const cur = filters.currency;
    const vsi = filters.valueShowIn;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt and Payments Statement</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 10mm;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 10px;
            color: #0f172a;
            font-size: 11px;
            background: #fff;
          }
          .header-box {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 8px;
          }
          .title {
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #0f172a;
            margin: 0 0 4px 0;
            text-transform: uppercase;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #475569;
            margin-top: 4px;
          }
          .meta-pill {
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th, td {
            padding: 5px 6px;
            border: 1px solid #cbd5e1;
            font-size: 10.5px;
            vertical-align: middle;
          }
          th {
            background-color: #f8fafc;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .receipt-header {
            background-color: #ecfdf5;
            color: #065f46;
            text-align: center;
            font-weight: 800;
          }
          .payment-header {
            background-color: #fff1f2;
            color: #9f1239;
            text-align: center;
            font-weight: 800;
          }
          .num {
            text-align: right;
            font-variant-numeric: tabular-nums;
          }
          .bold {
            font-weight: 700;
          }
          .section-bg {
            background-color: #f1f5f9;
          }
          .total-row {
            background-color: #f8fafc;
            font-weight: 700;
            border-top: 2px solid #94a3b8;
          }
          .grand-total-row {
            background-color: #e0f2fe;
            font-weight: 800;
            border-top: 2px solid #0284c7;
            border-bottom: 2px double #0284c7;
            font-size: 11.5px;
          }
          .balanced-pill {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 2px 8px;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="title">Receipt and Payments Statement</div>
          <div class="meta-info">
            <div>
              <span class="meta-pill">Report: <strong>${filters.reportType}</strong></span>
              <span class="meta-pill">Currency: <strong>${filters.currency}</strong></span>
              <span class="meta-pill">Value in: <strong>${filters.valueShowIn}</strong></span>
            </div>
            <div>
              <span class="meta-pill">Period: <strong>${formatShortDate(filters.startDate)} to ${formatShortDate(filters.endDate)}</strong></span>
              <span class="balanced-pill">Balanced ✓</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th colspan="${isComprehensive ? 5 : 2}" class="receipt-header">RECEIPT (DEBIT)</th>
              <th colspan="${isComprehensive ? 5 : 2}" class="payment-header">PAYMENT (CREDIT)</th>
            </tr>
            <tr>
              ${
                isComprehensive
                  ? `
                    <th style="width: 10%;">Date</th>
                    <th style="width: 11%;">Voucher No</th>
                    <th style="width: 15%;">Particulars</th>
                    <th style="width: 14%;">Opposite Account</th>
                    <th style="width: 12%; text-align: right;">Amount</th>
                    <th style="width: 10%;">Date</th>
                    <th style="width: 11%;">Voucher No</th>
                    <th style="width: 15%;">Particulars</th>
                    <th style="width: 14%;">Opposite Account</th>
                    <th style="width: 12%; text-align: right;">Amount</th>
                  `
                  : `
                    <th style="width: 35%;">Opposite Account</th>
                    <th style="width: 15%; text-align: right;">Amount</th>
                    <th style="width: 35%;">Opposite Account</th>
                    <th style="width: 15%; text-align: right;">Amount</th>
                  `
              }
            </tr>
          </thead>
          <tbody>
            <!-- Opening Balance Row on Receipt Side -->
            <tr class="section-bg bold">
              <td colspan="${isComprehensive ? 4 : 1}">${statement.receiptOpening.title}</td>
              <td class="num">${formatRPValue(statement.receiptOpening.total, cur, vsi).text}</td>
              <td colspan="${isComprehensive ? 5 : 2}" style="background-color: #fafafa;"></td>
            </tr>
            ${statement.receiptOpening.breakdown
              .map(
                (b) => `
              <tr>
                ${isComprehensive ? `<td></td><td></td><td></td>` : ''}
                <td style="padding-left: 20px; color: #475569;">${b.label}</td>
                <td class="num">${formatRPValue(b.amount, cur, vsi).text}</td>
                <td colspan="${isComprehensive ? 5 : 2}"></td>
              </tr>
            `
              )
              .join('')}

            <!-- Transaction Rows -->
            ${
              isComprehensive
                ? Array.from({
                    length: Math.max(
                      statement.receiptTransactions.length,
                      statement.paymentTransactions.length
                    ),
                  })
                    .map((_, i) => {
                      const r = statement.receiptTransactions[i];
                      const p = statement.paymentTransactions[i];
                      return `
                    <tr>
                      <td>${r ? formatShortDate(r.date) : ''}</td>
                      <td>${r ? r.voucherNo : ''}</td>
                      <td>${r ? r.particulars : ''}</td>
                      <td>${r ? r.oppositeAccounts : ''}</td>
                      <td class="num">${r ? formatRPValue(r.amount, cur, vsi).text : ''}</td>
                      <td>${p ? formatShortDate(p.date) : ''}</td>
                      <td>${p ? p.voucherNo : ''}</td>
                      <td>${p ? p.particulars : ''}</td>
                      <td>${p ? p.oppositeAccounts : ''}</td>
                      <td class="num">${p ? formatRPValue(p.amount, cur, vsi).text : ''}</td>
                    </tr>
                  `;
                    })
                    .join('')
                : Array.from({
                    length: Math.max(
                      statement.receiptSummaryItems.length,
                      statement.paymentSummaryItems.length
                    ),
                  })
                    .map((_, i) => {
                      const r = statement.receiptSummaryItems[i];
                      const p = statement.paymentSummaryItems[i];
                      return `
                    <tr>
                      <td>${r ? r.oppositeAccounts : ''}</td>
                      <td class="num">${r ? formatRPValue(r.amount, cur, vsi).text : ''}</td>
                      <td>${p ? p.oppositeAccounts : ''}</td>
                      <td class="num">${p ? formatRPValue(p.amount, cur, vsi).text : ''}</td>
                    </tr>
                  `;
                    })
                    .join('')
            }

            <!-- Totals Rows -->
            <tr class="total-row">
              <td colspan="${isComprehensive ? 4 : 1}">Total Debit (Receipts)</td>
              <td class="num">${formatRPValue(statement.totalDebit, cur, vsi).text}</td>
              <td colspan="${isComprehensive ? 4 : 1}">Total Credit (Payments)</td>
              <td class="num">${formatRPValue(statement.totalCredit, cur, vsi).text}</td>
            </tr>

            <!-- Closing Balance Block on Payment Side -->
            <tr class="section-bg bold">
              <td colspan="${isComprehensive ? 5 : 2}" style="background-color: #fafafa;"></td>
              <td colspan="${isComprehensive ? 4 : 1}">${statement.paymentClosing.title}</td>
              <td class="num">${formatRPValue(statement.paymentClosing.total, cur, vsi).text}</td>
            </tr>
            ${statement.paymentClosing.breakdown
              .map(
                (b) => `
              <tr>
                <td colspan="${isComprehensive ? 5 : 2}"></td>
                ${isComprehensive ? `<td></td><td></td><td></td>` : ''}
                <td style="padding-left: 20px; color: #475569;">${b.label}</td>
                <td class="num">${formatRPValue(b.amount, cur, vsi).text}</td>
              </tr>
            `
              )
              .join('')}

            <!-- Grand Totals -->
            <tr class="grand-total-row">
              <td colspan="${isComprehensive ? 4 : 1}">Grand Total Receipt</td>
              <td class="num">${formatRPValue(statement.grandTotalReceipt, cur, vsi).text}</td>
              <td colspan="${isComprehensive ? 4 : 1}">Grand Total Payment</td>
              <td class="num">${formatRPValue(statement.grandTotalPayment, cur, vsi).text}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 15px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
          <span>Generated on ${new Date().toLocaleString()}</span>
          <span>Accounts Dynamics • Receipts & Payments Statement</span>
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
