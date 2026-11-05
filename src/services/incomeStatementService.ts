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
import { getCustomizationState } from './isCustomizationService';
import { buildDisplayLabel } from '../lib/isCustomizationMath';
import type { ISCustomRow } from '../types/isCustomization';

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
    case 'Date Range':
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
  if (filters.compareTo === 'Date Range') {
    const count = Math.max(1, Math.min(filters.noOfDateRanges || 2, 5));
    const fallbackRanges = [
      '01/01/2026 - 31/01/2026',
      '01/02/2026 - 28/02/2026',
      '01/03/2026 - 31/03/2026',
      '01/04/2026 - 30/04/2026',
      '01/05/2026 - 31/05/2026',
    ];

    const dataCols = Array.from({ length: count }, (_, i) => {
      const rangeText = filters.customDateRanges?.[i] || fallbackRanges[i];
      return {
        key: `range-${i + 1}`,
        label: `Range ${i + 1}`,
        subLabel: rangeText,
      };
    });

    return {
      columnGroups: [{ label: `Date Range Comparison (${count} Ranges)` }],
      dataColumns: dataCols,
    };
  }

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

function getSeedValuesForCustomRow(
  row: ISCustomRow,
  rawData: Record<string, number[]>,
  colCount: number
): number[] {
  const code = row.code;
  const labelLower = (row.particulars || '').toLowerCase();

  let seedVals: number[] | undefined;

  if (code === '1' || labelLower.includes('sales revenue')) {
    seedVals = rawData.salesRevenue;
  } else if (code === '2' || labelLower.includes('service revenue')) {
    seedVals = rawData.salesRevenue?.map((v) => Math.round(v * 0.15));
  } else if (code === '3' || labelLower.includes('others operating income')) {
    seedVals = rawData.salesRevenue?.map((v) => Math.round(v * 0.05));
  } else if (code === '4' || labelLower.includes('cost of revenue') || labelLower.includes('cost of goods')) {
    seedVals = rawData.costOfGoods;
  } else if (code === '5' || labelLower.includes('depreciation direct')) {
    seedVals = rawData.costOfGoods?.map((v) => Math.round(v * 0.08));
  } else if (code === '6' || labelLower.includes('others direct expenses')) {
    seedVals = rawData.costOfGoods?.map((v) => Math.round(v * 0.04));
  } else if (code === '7' || labelLower.includes('exchange gain')) {
    seedVals = rawData.exchangeGainLoss;
  } else if (code === '8' || labelLower.includes('scraps')) {
    seedVals = rawData.scrapsRevenue;
  } else if (code === '9' || labelLower.includes('others non-operating')) {
    seedVals = rawData.salesRevenue?.map((v) => Math.round(v * 0.03));
  } else if (code === '10' || labelLower.includes('administrative')) {
    seedVals = rawData.adminExpenses;
  } else if (code === '11' || labelLower.includes('selling and distribution')) {
    seedVals = rawData.sellingExpenses;
  } else if (code === '12' || labelLower.includes('financial expenses')) {
    seedVals = rawData.financialExpenses;
  } else if (code === '13' || labelLower.includes('depreciation indirect')) {
    seedVals = rawData.adminExpenses?.map((v) => Math.round(v * 0.12));
  } else if (code === '14' || labelLower.includes('others indirect')) {
    seedVals = rawData.adminExpenses?.map((v) => Math.round(v * 0.05));
  } else if (code === '15' || labelLower.includes('income tax')) {
    seedVals = rawData.incomeTax;
  } else {
    // Custom user-added line
    const base = Math.max(15000, ((code.charCodeAt(0) || 50) * 1234) % 60000);
    seedVals = Array.from({ length: colCount }, (_, i) => Math.round(base * Math.pow(0.98, i)));
  }

  const values: number[] = [];
  const baseArr = seedVals ?? [50000];
  for (let i = 0; i < colCount; i++) {
    if (i < baseArr.length) {
      values.push(baseArr[i]);
    } else {
      const last = baseArr[baseArr.length - 1] || 0;
      values.push(Math.round(last * Math.pow(0.97, i - baseArr.length + 1)));
    }
  }

  return values;
}

function evaluateFormula(
  formula: string,
  valuesByCode: Map<string, number[]>,
  colCount: number
): number[] | null {
  const trimmed = formula.trim().replace(/\s+/g, '');
  const tokens = trimmed.split(/([+\-])/).filter(Boolean);
  const result = new Array(colCount).fill(0);

  let currentOp = '+';
  for (const token of tokens) {
    if (token === '+' || token === '-') {
      currentOp = token;
    } else {
      const operand = valuesByCode.get(token.toUpperCase());
      if (!operand) {
        return null;
      }
      for (let i = 0; i < colCount; i++) {
        if (currentOp === '+') {
          result[i] += operand[i];
        } else {
          result[i] -= operand[i];
        }
      }
    }
  }

  return result;
}

export async function getIncomeStatementData(filters: ISFilterState): Promise<{
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  rows: ISRow[];
}> {
  await delay(300);

  // 1. Build column structure
  const { columnGroups, dataColumns } = buildColumns(filters);

  // 2. Select mock data slice
  const dataKey = `${filters.reportType}::${dataKeyFor(filters.compareTo)}`;
  const rawData = MOCK_IS_DATA[dataKey] ?? {};

  // 3. Try to load customized structure from isCustomizationService
  try {
    const customState = await getCustomizationState();
    const activeCustom =
      filters.reportType === 'Comprehensive'
        ? customState.comprehensive
        : customState.summary;

    if (activeCustom?.rows && activeCustom.rows.length > 0) {
      const customRows = activeCustom.rows;
      const valuesByCode = new Map<string, number[]>();

      // A. Populate child rows
      customRows.forEach((r) => {
        if (r.kind !== 'parent') {
          const vals = getSeedValuesForCustomRow(r, rawData, dataColumns.length);
          valuesByCode.set(r.code.toUpperCase(), vals);
        }
      });

      // B. Multi-pass parent formula evaluation
      const parents = customRows.filter((r) => r.kind === 'parent');
      for (let pass = 0; pass < 5; pass++) {
        let progress = false;
        for (const p of parents) {
          if (valuesByCode.has(p.code.toUpperCase())) continue;

          if (p.formula && p.formula.trim()) {
            const res = evaluateFormula(p.formula, valuesByCode, dataColumns.length);
            if (res) {
              valuesByCode.set(p.code.toUpperCase(), res);
              progress = true;
            }
          } else {
            // Implicit formula: sum children
            const children = customRows.filter((r) => r.parentCode === p.code);
            if (children.length > 0) {
              const sum = new Array(dataColumns.length).fill(0);
              children.forEach((c) => {
                const cVals = valuesByCode.get(c.code.toUpperCase());
                if (cVals) {
                  for (let i = 0; i < dataColumns.length; i++) sum[i] += cVals[i];
                }
              });
              valuesByCode.set(p.code.toUpperCase(), sum);
              progress = true;
            }
          }
        }
        if (!progress) break;
      }

      // C. Build final ISRows
      const rows: ISRow[] = customRows.map((r) => {
        const isParent = r.kind === 'parent';
        const vals = valuesByCode.get(r.code.toUpperCase()) ?? new Array(dataColumns.length).fill(0);

        return {
          id: r.id,
          key: r.code,
          label: buildDisplayLabel(r),
          level: isParent ? 0 : 1,
          isSectionHeader: isParent,
          isBold: isParent,
          isFormula: Boolean(isParent && r.formula),
          letterCode: isParent ? (r.code as any) : undefined,
          values: vals,
          formula: r.formula,
        };
      });

      return { columnGroups, dataColumns, rows };
    }
  } catch (err) {
    console.warn('Failed to load custom structure, using static fallback:', err);
  }

  // Fallback to static seed
  const rowDefs =
    filters.reportType === 'Comprehensive' ? COMPREHENSIVE_ROWS : SUMMARY_ROWS;

  const rows: ISRow[] = rowDefs.map((def) => {
    const seedVals = rawData[def.key] ?? [];
    const values: number[] = [];

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

