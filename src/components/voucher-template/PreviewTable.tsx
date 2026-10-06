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
        return 'INV-2026-01';
    }
  };

  const borderClass = showBorder
    ? 'border border-slate-900/70'
    : 'border-y border-slate-300 dark:border-border';

  const cellBorderClass = showBorder
    ? 'border border-slate-900/60'
    : 'border-b border-slate-200 dark:border-border/60';

  return (
    <div className="overflow-x-auto w-full">
      <table
        className={`w-full border-collapse ${borderClass}`}
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      >
        <thead>
          <tr className="bg-slate-100/90 dark:bg-muted font-bold">
            <th
              className={`py-1.5 px-2 text-center w-8 ${cellBorderClass}`}
              style={{ fontSize: `${fontSize - 0.5}px`, color: activeHeaderColor }}
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
                  className={`py-1.5 px-2 font-bold uppercase tracking-tight whitespace-nowrap ${cellBorderClass} ${alignClass}`}
                  style={{ fontSize: `${fontSize - 0.5}px`, color: activeHeaderColor }}
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
                  className={`py-1 px-2 text-center font-mono ${cellBorderClass} text-slate-500`}
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
                      className={`py-1.5 px-2 ${cellBorderClass} ${alignClass} ${
                        isNum ? 'font-mono tabular-nums' : ''
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
