import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import {
  ISFilterState,
  ISRow,
  ISColumnGroup,
  CompareMode,
  COMPREHENSIVE_ROWS,
  SUMMARY_ROWS,
} from '../types/incomeStatement';
import { MOCK_IS_FILTERS, MOCK_IS_DATA } from '../mock/incomeStatement';
import { generateFiscalYears, generateSubPeriods } from '../lib/fiscalYearMath';
import { computeRollups, formatValue } from '../lib/incomeStatementMath';
import { delay } from '../lib/delay';

const LS_FILTERS = 'is:filters';

export async function getFilterState(): Promise<ISFilterState> {
  await delay(300);
  try {
    const raw = localStorage.getItem(LS_FILTERS);
    if (!raw) return MOCK_IS_FILTERS;
    return { ...MOCK_IS_FILTERS, ...JSON.parse(raw) };
  } catch {
    return MOCK_IS_FILTERS;
  }
}

export async function saveFilterState(s: ISFilterState): Promise<void> {
  await delay(200);
  try {
    localStorage.setItem(LS_FILTERS, JSON.stringify(s));
  } catch (e) {
    console.error('Failed to save IS filter state:', e);
  }
}

function dataKeyFor(mode: CompareMode): string {
  switch (mode) {
    case 'Previous Period':
      return 'periods';
    case 'Company':
      return 'companies';
    case 'Cost Center':
      return 'cost-centers';
    case 'Budget':
      return 'budget';
    default:
      return 'periods';
  }
}

export function buildColumns(filters: ISFilterState): {
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
} {
  if (filters.compareTo === 'Company') {
    const companies =
      filters.selectedCompanies && filters.selectedCompanies.length > 0
        ? filters.selectedCompanies
        : ['Pakiza Software Ltd.', 'Pakiza Knit Composite Ltd.'];
    const cols = companies.map((c) => ({
      key: c,
      label: c,
    }));
    return {
      columnGroups: [{ label: 'Companies' }],
      dataColumns: cols,
    };
  }

  if (filters.compareTo === 'Cost Center') {
    const costCenters =
      filters.selectedCostCenters && filters.selectedCostCenters.length > 0
        ? filters.selectedCostCenters
        : ['Cripton ERP', 'Business Innovation'];
    const cols = costCenters.map((c) => ({
      key: c,
      label: c,
    }));
    return {
      columnGroups: [{ label: 'Cost Centers' }],
      dataColumns: cols,
    };
  }

  if (filters.compareTo === 'Budget') {
    return {
      columnGroups: [{ label: 'Budget Analysis' }],
      dataColumns: [
        { key: 'actual', label: 'Actual' },
        { key: 'budget', label: 'Budget Target' },
        { key: 'variance', label: 'Variance' },
      ],
    };
  }

  // Previous Period: generate fiscal years × sub-periods
  const yearCols = generateFiscalYears(filters.noOfPeriod);
  const columnGroups = yearCols.map((fy) => ({
    label: fy,
    subColumns: generateSubPeriods(fy, filters.displayedBy),
  }));
  const dataColumns = columnGroups.flatMap((g) => g.subColumns ?? []);
  return { columnGroups, dataColumns };
}

export async function getIncomeStatementData(filters: ISFilterState): Promise<{
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  rows: ISRow[];
}> {
  await delay(300);

  // 1. Build column structure
  const { columnGroups, dataColumns } = buildColumns(filters);

  // 2. Select row definitions
  const rowDefs =
    filters.reportType === 'Comprehensive' ? COMPREHENSIVE_ROWS : SUMMARY_ROWS;

  // 3. Select mock data slice
  const dataKey = `${filters.reportType}::${dataKeyFor(filters.compareTo)}`;
  const rawData = MOCK_IS_DATA[dataKey] ?? {};

  // 4. Instantiate rows with values
  const rows: ISRow[] = rowDefs.map((def) => {
    const seedVals = rawData[def.key] ?? [];
    const values: number[] = [];

    // Ensure array length matches dataColumns.length
    for (let i = 0; i < dataColumns.length; i++) {
      if (i < seedVals.length) {
        values.push(seedVals[i]);
      } else {
        const last = seedVals[seedVals.length - 1] || 0;
        values.push(Math.round(last * Math.pow(0.97, i - seedVals.length + 1)));
      }
    }

    return {
      id: def.key,
      key: def.key,
      label: def.label,
      level: def.level,
      isSectionHeader: def.isSectionHeader,
      isBold: def.isBold,
      isFormula: ['grossProfit', 'netProfitBeforeTax', 'netProfitAfterTax'].includes(def.key),
      letterCode: def.letterCode as any,
      values,
      formula:
        def.key === 'grossProfit'
          ? 'A-B'
          : def.key === 'netProfitBeforeTax'
          ? 'C+D-E'
          : def.key === 'netProfitAfterTax'
          ? 'F-G'
          : undefined,
    };
  });

  // 5. Compute formula rollups
  computeRollups(rows, dataColumns.length);

  return { columnGroups, dataColumns, rows };
}

export async function exportToXlsx(
  flatRows: Record<string, any>[],
  filename: string = 'Income_Statement.xlsx'
): Promise<void> {
  try {
    if (!flatRows || flatRows.length === 0) {
      toast.error('No Income Statement data available to export.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(flatRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Income_Statement');

    XLSX.writeFile(wb, filename);
    toast.success('Income Statement exported to Excel successfully!', {
      description: `Downloaded: ${filename}`,
    });
  } catch (error) {
    console.error('Failed to export to Excel:', error);
    toast.error('Failed to export Income Statement to Excel.');
  }
}

export async function exportToCsv(
  flatRows: Record<string, any>[],
  filename: string = 'Income_Statement.csv'
): Promise<void> {
  try {
    if (!flatRows || flatRows.length === 0) {
      toast.error('No Income Statement data available to export.');
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

    toast.success('Income Statement exported to CSV successfully!', {
      description: `Downloaded: ${filename}`,
    });
  } catch (error) {
    console.error('Failed to export to CSV:', error);
    toast.error('Failed to export Income Statement to CSV.');
  }
}

export async function exportToPdf(
  dataColumns: { key: string; label: string; subLabel?: string }[],
  rows: ISRow[],
  filters: ISFilterState
): Promise<void> {
  try {
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const isPeriodMode = filters.compareTo === 'Previous Period';

    const headerColsHtml = dataColumns
      .map(
        (c) => `
        <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; text-align: right; font-size: 10px;">
          <div>${c.label}</div>
          ${c.subLabel ? `<div style="font-size: 8px; font-weight: normal; color: #64748b;">${c.subLabel}</div>` : ''}
        </th>`
      )
      .join('');

    const rowsHtml = rows
      .map((r, idx) => {
        const isHeader = r.isSectionHeader;
        const isFormula = r.isFormula;
        const totalVal = r.values.reduce((acc, curr) => acc + curr, 0);

        let bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        let weight = isHeader || isFormula ? 'bold' : 'normal';
        let borderTop = isFormula ? '2px solid #cbd5e1' : '1px solid #e2e8f0';

        if (isHeader) bg = '#f1f5f9';
        if (isFormula) bg = '#eef2ff';

        const totalCellHtml = `<td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 10px;">${
          isHeader
            ? '—'
            : formatValue(totalVal, filters.currency, filters.showInPercent, null, filters.valueShowIn).text
        }</td>`;

        const valuesHtml = r.values
          .map((v) => {
            if (isHeader) {
              return `<td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #e2e8f0; font-size: 10px; color: #cbd5e1;">—</td>`;
            }
            const fmt = formatValue(
              v,
              filters.currency,
              filters.showInPercent,
              totalVal,
              filters.valueShowIn
            );
            return `<td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #e2e8f0; font-size: 10px; color: ${
              fmt.isNegative ? '#e11d48' : '#0f172a'
            };">${fmt.text}</td>`;
          })
          .join('');

        return `
        <tr style="background-color: ${bg}; font-weight: ${weight}; border-top: ${borderTop};">
          <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; padding-left: ${
            r.level === 1 ? 24 : 10
          }px;">
            ${r.letterCode ? `[${r.letterCode}] ` : ''}${r.label}
          </td>
          ${isPeriodMode ? totalCellHtml + valuesHtml : valuesHtml + totalCellHtml}
        </tr>`;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Statement Report</title>
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
                <div class="header-sub">Income Statement (${filters.reportType}) • Mode: ${filters.compareTo} • Currency: ${filters.currency}</div>
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
                ${isPeriodMode ? '<th style="text-align: right;">Total</th>' : ''}
                ${headerColsHtml}
                ${!isPeriodMode ? '<th style="text-align: right;">Total</th>' : ''}
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
    printFrame.id = 'is-pdf-print-frame';

    document.body.appendChild(printFrame);
    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
      toast.info('Preparing Income Statement PDF for printing...');
      setTimeout(() => {
        const existing = document.getElementById('is-pdf-print-frame');
        if (existing) {
          document.body.removeChild(existing);
        }
      }, 60000);
    } else {
      window.print();
    }
  } catch (error) {
    console.error('Failed to export to PDF:', error);
    toast.error('Failed to export Income Statement to PDF.');
  }
}

