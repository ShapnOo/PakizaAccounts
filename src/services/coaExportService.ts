import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { Account } from '../types/coa';
import { formatAccountCode } from '../lib/accountCode';
import { COMPANY } from '../constants/accountsTypeTree';

/**
 * Exports Chart of Accounts to Excel (.xlsx)
 */
export const exportCoaToExcel = (accounts: Account[], customFilename?: string) => {
  try {
    if (!accounts || accounts.length === 0) {
      toast.error('No accounts available to export.');
      return;
    }

    // Sort accounts by code
    const sorted = [...accounts].sort((a, b) => a.code.localeCompare(b.code));

    const rows = sorted.map((acc) => ({
      'Level No': formatAccountCode(acc.code),
      'Manual Code': acc.manualCode || '',
      'Account Name': acc.name,
      Level: `Level ${acc.level}`,
      'Level-1 (Class)': acc.path[0] || '',
      'Level-2 (Group)': acc.path[1] || '',
      'Level-3 (Subgroup)': acc.path[2] || '',
      'Level-4 (Control)': acc.path[3] || '',
      'Level-5 (GL Account)': acc.path[4] || '',
      'Level-6 (Sub GL)': acc.path[5] || '',
      'Account Type': acc.accountsType,
      Nature: acc.nature,
      'Is Parent': acc.isParent ? 'Yes' : 'No',
      Company: acc.companyName || COMPANY,
      Currency: acc.defaultCurrency || 'BDT',
      'Details Type': acc.detailsType || '',
      Status: acc.activeStatus,
      Description: acc.description || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws['!cols'] = [
      { wch: 18 }, // Level No
      { wch: 14 }, // Manual Code
      { wch: 32 }, // Account Name
      { wch: 10 }, // Level
      { wch: 22 }, // Level-1
      { wch: 24 }, // Level-2
      { wch: 26 }, // Level-3
      { wch: 26 }, // Level-4
      { wch: 26 }, // Level-5
      { wch: 26 }, // Level-6
      { wch: 24 }, // Account Type
      { wch: 12 }, // Nature
      { wch: 10 }, // Is Parent
      { wch: 26 }, // Company
      { wch: 10 }, // Currency
      { wch: 16 }, // Details Type
      { wch: 12 }, // Status
      { wch: 30 }, // Description
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chart_of_Accounts');

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = customFilename || `Chart_of_Accounts_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success('Chart of Accounts exported to Excel successfully!', {
      description: `Downloaded: ${fileName} (${sorted.length} accounts)`,
    });
  } catch (error) {
    console.error('Failed to export to Excel:', error);
    toast.error('Failed to export Chart of Accounts to Excel.');
  }
};

/**
 * Exports Chart of Accounts to PDF via printable document
 */
export const exportCoaToPdf = (accounts: Account[]) => {
  try {
    if (!accounts || accounts.length === 0) {
      toast.error('No accounts available to export.');
      return;
    }

    const sorted = [...accounts].sort((a, b) => a.code.localeCompare(b.code));
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatted = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const rowsHtml = sorted
      .map(
        (acc, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; border-bottom: 1px solid #e2e8f0; white-space: nowrap; font-size: 10px;">${formatAccountCode(acc.code)}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; font-weight: 600; color: #0f172a;">${acc.path[0] || '—'}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; color: #334155;">${acc.path[1] || '—'}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; color: #334155;">${acc.path[2] || '—'}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; color: #334155;">${acc.path[3] || '—'}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; font-weight: 600; color: #0f172a;">${acc.path[4] || acc.name}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10px; color: #64748b;">${acc.accountsType}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 9.5px;">
            <span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-weight: bold; ${
              acc.activeStatus === 'Active'
                ? 'background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;'
                : 'background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
            }">
              ${acc.activeStatus}
            </span>
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Chart of Accounts - ${COMPANY}</title>
          <style>
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 10px;
              font-size: 11px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 8px;
            }
            .header-title {
              font-size: 20px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #0f172a;
              margin: 0;
            }
            .header-sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 2px;
            }
            .meta-box {
              text-align: right;
              font-size: 10.5px;
              color: #475569;
            }
            .meta-badge {
              display: inline-block;
              background-color: #f1f5f9;
              padding: 3px 8px;
              border-radius: 6px;
              font-weight: 700;
              color: #0f172a;
              border: 1px solid #cbd5e1;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .data-table th {
              background-color: #f1f5f9;
              color: #334155;
              font-weight: 700;
              text-align: left;
              padding: 8px;
              font-size: 9.5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #cbd5e1;
              white-space: nowrap;
            }
            .footer-info {
              margin-top: 15px;
              display: flex;
              justify-content: space-between;
              font-size: 9.5px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 6px;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <h1 class="header-title">${COMPANY}</h1>
                <div class="header-sub">Financial Management & Accounts Suite • Chart of Accounts</div>
              </td>
              <td class="meta-box">
                <div>Report Date: <strong>${dateFormatted}</strong> at <strong>${timeFormatted}</strong></div>
                <div style="margin-top: 4px;">
                  <span class="meta-badge">${sorted.length} Accounts Listed</span>
                </div>
              </td>
            </tr>
          </table>

          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 130px;">Level No</th>
                <th>Level-1 (Class)</th>
                <th>Level-2 (Group)</th>
                <th>Level-3 (Subgroup)</th>
                <th>Level-4 (Control)</th>
                <th>Level-5 (GL Account)</th>
                <th>Account Type</th>
                <th style="text-align: center; width: 70px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer-info">
            <span>Pakiza Accounts • Official Chart of Accounts Statement</span>
            <span>Printed by System User</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Create an invisible iframe to print cleanly without leaving or breaking the current screen
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.id = 'coa-pdf-print-frame';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      toast.info('Preparing Chart of Accounts PDF...', {
        description: 'Print / Save as PDF dialog will open momentarily.',
      });

      // Cleanup iframe after print dialog closes
      setTimeout(() => {
        const existing = document.getElementById('coa-pdf-print-frame');
        if (existing) {
          document.body.removeChild(existing);
        }
      }, 60000);
    } else {
      window.print();
    }
  } catch (error) {
    console.error('Failed to export to PDF:', error);
    toast.error('Failed to export Chart of Accounts to PDF.');
  }
};
