import React from 'react';
import { formatCurrency } from '../../../lib/format';

interface CurrencySummaryItem {
  currency: string;
  debitCur: number;
  creditCur: number;
  debitBDT: number;
  creditBDT: number;
}

interface CurrencySummaryBlockProps {
  summary: CurrencySummaryItem[];
  totals: {
    debitBDT: number;
    creditBDT: number;
  };
  borderStyle?: 'hairline' | 'grid' | 'double-rule';
  primaryColor?: string;
  accentColor?: string;
}

export const CurrencySummaryBlock: React.FC<CurrencySummaryBlockProps> = ({
  summary,
  totals,
  borderStyle = 'hairline',
  accentColor = '#4f46e5',
}) => {
  const isGrid = borderStyle === 'grid';
  const isDoubleRule = borderStyle === 'double-rule';

  return (
    <div className="my-3 font-sans">
      <div className="flex items-baseline justify-between mb-1">
        <h4
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          Currency Summary
        </h4>
        <span className="text-[9px] text-slate-500 italic">
          Base currency: BDT. Currency amounts are converted to BDT at each line's rate.
        </span>
      </div>

      <table
        className={`w-full text-[10px] border-collapse ${
          isGrid
            ? 'border border-slate-200'
            : isDoubleRule
            ? 'border-t-2 border-b-2 border-slate-400'
            : 'border-b border-slate-200'
        }`}
      >
        <thead>
          <tr
            className={`${
              isGrid
                ? 'bg-slate-100/70 border-b border-slate-200'
                : isDoubleRule
                ? 'border-b-2 border-slate-300 font-semibold'
                : 'border-b border-slate-200 text-slate-500 font-medium'
            }`}
          >
            <th className={`py-1 px-2 text-left ${isGrid ? 'border-r border-slate-200' : ''}`}>
              Cur.
            </th>
            <th className={`py-1 px-2 text-right ${isGrid ? 'border-r border-slate-200' : ''}`}>
              Debit (Currency)
            </th>
            <th className={`py-1 px-2 text-right ${isGrid ? 'border-r border-slate-200' : ''}`}>
              Credit (Currency)
            </th>
            <th className={`py-1 px-2 text-right ${isGrid ? 'border-r border-slate-200' : ''}`}>
              Debit (BDT)
            </th>
            <th className="py-1 px-2 text-right">
              Credit (BDT)
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item, idx) => (
            <tr
              key={item.currency || idx}
              className={`${
                isGrid
                  ? 'border-b border-slate-200'
                  : 'border-b border-slate-100'
              }`}
            >
              <td className={`py-1 px-2 font-medium ${isGrid ? 'border-r border-slate-200' : ''}`}>
                {item.currency}
              </td>
              <td
                className={`py-1 px-2 text-right font-variant-numeric tabular-nums ${
                  isGrid ? 'border-r border-slate-200' : ''
                }`}
              >
                {item.debitCur ? formatCurrency(item.debitCur, item.currency) : '–'}
              </td>
              <td
                className={`py-1 px-2 text-right font-variant-numeric tabular-nums ${
                  isGrid ? 'border-r border-slate-200' : ''
                }`}
              >
                {item.creditCur ? formatCurrency(item.creditCur, item.currency) : '–'}
              </td>
              <td
                className={`py-1 px-2 text-right font-variant-numeric tabular-nums ${
                  isGrid ? 'border-r border-slate-200' : ''
                }`}
              >
                {item.debitBDT ? formatCurrency(item.debitBDT, 'BDT') : '–'}
              </td>
              <td className="py-1 px-2 text-right font-variant-numeric tabular-nums">
                {item.creditBDT ? formatCurrency(item.creditBDT, 'BDT') : '–'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr
            className={`font-semibold ${
              isGrid
                ? 'bg-slate-50 border-t border-slate-300'
                : isDoubleRule
                ? 'border-t-2 border-slate-400'
                : 'border-t border-slate-300'
            }`}
          >
            <td
              colSpan={3}
              className={`py-1 px-2 uppercase tracking-wide text-[9px] ${
                isGrid ? 'border-r border-slate-200' : ''
              }`}
            >
              GRAND TOTAL (BDT)
            </td>
            <td
              className={`py-1 px-2 text-right font-bold tabular-nums ${
                isGrid ? 'border-r border-slate-200' : ''
              }`}
            >
              {formatCurrency(totals.debitBDT, 'BDT')}
            </td>
            <td className="py-1 px-2 text-right font-bold tabular-nums">
              {formatCurrency(totals.creditBDT, 'BDT')}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

