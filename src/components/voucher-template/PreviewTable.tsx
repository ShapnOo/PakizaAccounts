import React from 'react';
import { TableColumnConfig } from '../../types/voucherTemplate';
import { formatCurrency, formatNumber } from '../../lib/format';

interface PreviewTableProps {
  columns: Record<string, TableColumnConfig>;
  columnOrder: string[];
  showBorder: boolean;
  fontSize: number;
  textColor: string;
  themeColor?: string;
  previewLines: any[];
}

// Relative default column weight to distribute 100% table width intelligently
const getBaseWeight = (key: string): number => {
  switch (key) {
    case 'accounts':
      return 15;
    case 'description':
      return 14;
    case 'subsidiary':
      return 11;
    case 'costCenter':
      return 9;
    case 'reference':
      return 8;
    case 'employee':
      return 8;
    case 'vehicles':
      return 7;
    case 'debit':
    case 'credit':
      return 7.5;
    case 'debitBDT':
    case 'creditBDT':
      return 8.5;
    case 'currency':
      return 5;
    case 'exchangeRate':
      return 5;
    default:
      return 8; // Custom fields or other dynamic columns
  }
};

export const PreviewTable: React.FC<PreviewTableProps> = ({
  columns,
  columnOrder,
  showBorder,
  fontSize,
  textColor,
  themeColor,
  previewLines,
}) => {
  const activeHeaderColor = themeColor || textColor;

  // Filter visible columns in the specified order
  const visibleColKeys = columnOrder.filter((key) => columns[key]?.visible);
  const totalCols = visibleColKeys.length;

  const isNumericCol = (key: string) => {
    return (
      key === 'debit' ||
      key === 'credit' ||
      key === 'debitBDT' ||
      key === 'creditBDT' ||
      key === 'exchangeRate'
    );
  };

  const getCellValue = (line: any, key: string) => {
    switch (key) {
      case 'accounts':
        return line.accountHead;
      case 'costCenter':
        return line.costCenter || '—';
      case 'subsidiary':
        return line.subsidiary || '—';
      case 'employee':
        return line.employee || '—';
      case 'vehicles':
        return line.vehicles || '—';
      case 'reference':
        return line.reference || '—';
      case 'description':
        return line.description || '—';
      case 'currency':
        return line.currency || 'BDT';
      case 'exchangeRate':
        return line.exchangeRate || 1;
      case 'debit':
        return line.debit > 0 ? formatNumber(line.debit) : '—';
      case 'credit':
        return line.credit > 0 ? formatNumber(line.credit) : '—';
      case 'debitBDT':
        return line.debitBDT > 0 ? formatCurrency(line.debitBDT) : '—';
      case 'creditBDT':
        return line.creditBDT > 0 ? formatCurrency(line.creditBDT) : '—';
      default:
        // Dynamic custom fields
        return line[key] || 'INV-2026-01';
    }
  };

  // Adaptive density and padding based on visible column count
  const isDense = totalCols >= 13;
  const isMedium = totalCols >= 8;

  const cellPaddingClass = isDense
    ? 'py-1 px-1'
    : isMedium
    ? 'py-1.2 px-1.5'
    : 'py-1.5 px-2';

  // Responsive font size auto-scaling for high column counts
  const effectiveFontSize = isDense
    ? Math.min(fontSize, 7.5)
    : isMedium
    ? Math.min(fontSize, 8.5)
    : fontSize;

  const headerFontSize = Math.max(6, effectiveFontSize - 0.5);

  // Calculate 100% proportional column widths so table never overflows
  const slWeight = isDense ? 3 : isMedium ? 3.5 : 4;
  const colWeights = visibleColKeys.map((key) => {
    const customWidth = columns[key]?.width;
    return typeof customWidth === 'number' && customWidth > 0
      ? customWidth
      : getBaseWeight(key);
  });
  const sumWeights = slWeight + colWeights.reduce((a, b) => a + b, 0);

  const slWidthPercent = (slWeight / sumWeights) * 100;
  const colWidthPercents: Record<string, number> = {};
  visibleColKeys.forEach((key, idx) => {
    colWidthPercents[key] = (colWeights[idx] / sumWeights) * 100;
  });

  const borderClass = showBorder
    ? 'border border-slate-900/70'
    : 'border-y border-slate-300 dark:border-border';

  const cellBorderClass = showBorder
    ? 'border border-slate-900/60'
    : 'border-b border-slate-200 dark:border-border/60';

  return (
    <div className="w-full overflow-hidden">
      <table
        className={`w-full table-fixed border-collapse ${borderClass}`}
        style={{
          fontSize: `${effectiveFontSize}px`,
          color: textColor,
        }}
      >
        <colgroup>
          <col style={{ width: `${slWidthPercent.toFixed(2)}%` }} />
          {visibleColKeys.map((key) => (
            <col
              key={key}
              style={{ width: `${colWidthPercents[key].toFixed(2)}%` }}
            />
          ))}
        </colgroup>

        <thead>
          <tr className="bg-slate-100/90 dark:bg-muted font-bold">
            <th
              className={`text-center font-bold break-words whitespace-normal leading-[1.15] ${cellBorderClass} ${cellPaddingClass}`}
              style={{ fontSize: `${headerFontSize}px`, color: activeHeaderColor }}
            >
              #
            </th>
            {visibleColKeys.map((key) => {
              const cfg = columns[key];
              const isNum = isNumericCol(key);
              const alignClass = cfg?.align
                ? cfg.align === 'Center'
                  ? 'text-center'
                  : cfg.align === 'Right'
                  ? 'text-right'
                  : 'text-left'
                : isNum
                ? 'text-right'
                : 'text-left';

              return (
                <th
                  key={key}
                  className={`font-bold uppercase tracking-tight break-words whitespace-normal leading-[1.15] hyphens-auto ${cellBorderClass} ${alignClass} ${cellPaddingClass}`}
                  style={{ fontSize: `${headerFontSize}px`, color: activeHeaderColor }}
                >
                  {cfg.label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {previewLines.map((line, idx) => {
            const isZebra = idx % 2 === 1;
            return (
              <tr
                key={idx}
                className={isZebra ? 'bg-slate-50/50 dark:bg-muted/15' : 'bg-transparent'}
              >
                <td
                  className={`text-center font-mono ${cellBorderClass} ${cellPaddingClass} text-slate-500`}
                >
                  {idx + 1}
                </td>
                {visibleColKeys.map((key) => {
                  const val = getCellValue(line, key);
                  const cfg = columns[key];
                  const isNum = isNumericCol(key);
                  const alignClass = cfg?.align
                    ? cfg.align === 'Center'
                      ? 'text-center'
                      : cfg.align === 'Right'
                      ? 'text-right'
                      : 'text-left'
                    : isNum
                    ? 'text-right'
                    : 'text-left';

                  return (
                    <td
                      key={key}
                      className={`${cellBorderClass} ${alignClass} ${cellPaddingClass} ${
                        isNum
                          ? 'font-mono tabular-nums whitespace-nowrap overflow-hidden text-ellipsis'
                          : 'break-words whitespace-normal leading-snug'
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
