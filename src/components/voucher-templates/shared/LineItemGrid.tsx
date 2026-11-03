import React from 'react';
import type { PreviewLine } from '../../../types/voucherTemplate';
import { formatCurrency } from '../../../lib/format';
import { AuxDimensionsRow } from './AuxDimensionsRow';

interface LineItemGridProps {
  lines: PreviewLine[];
  showLineDescription?: boolean;
  showAuxRow?: boolean;
  zebraStripes?: boolean;
  borderStyle?: 'hairline' | 'grid' | 'double-rule';
}

export const LineItemGrid: React.FC<LineItemGridProps> = ({
  lines,
  showLineDescription = true,
  showAuxRow = true,
  zebraStripes = false,
  borderStyle = 'grid',
}) => {
  const isGrid = borderStyle === 'grid';
  const isDoubleRule = borderStyle === 'double-rule';

  return (
    <div className="w-full overflow-x-auto font-sans">
      <table
        className={`w-full text-[9.5px] border-collapse ${
          isGrid
            ? 'border border-slate-200'
            : isDoubleRule
            ? 'border-t-2 border-b-2 border-slate-700'
            : 'border-b border-slate-200'
        }`}
      >
        <thead>
          <tr
            className={`${
              isGrid
                ? 'bg-slate-100 text-slate-800 font-bold border-b border-slate-300'
                : isDoubleRule
                ? 'border-b-2 border-slate-700 font-serif font-bold text-slate-800 bg-slate-50'
                : 'border-b border-slate-300 text-slate-600 font-semibold'
            }`}
          >
            <th className={`py-1.5 px-2 text-left ${isGrid ? 'border border-slate-200' : ''}`}>
              Accounts Head
            </th>
            {showLineDescription && (
              <th className={`py-1.5 px-2 text-left ${isGrid ? 'border border-slate-200' : ''}`}>
                Line Description
              </th>
            )}
            <th className={`py-1.5 px-2 text-center ${isGrid ? 'border border-slate-200' : ''}`}>
              Cur.
            </th>
            <th className={`py-1.5 px-2 text-right ${isGrid ? 'border border-slate-200' : ''}`}>
              Rate
            </th>
            <th className={`py-1.5 px-2 text-right ${isGrid ? 'border border-slate-200' : ''}`}>
              Debit (Currency)
            </th>
            <th className={`py-1.5 px-2 text-right ${isGrid ? 'border border-slate-200' : ''}`}>
              Credit (Currency)
            </th>
            <th className={`py-1.5 px-2 text-right ${isGrid ? 'border border-slate-200' : ''}`}>
              Debit (BDT)
            </th>
            <th className={`py-1.5 px-2 text-right ${isGrid ? 'border border-slate-200' : ''}`}>
              Credit (BDT)
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, index) => {
            const isStriped = zebraStripes && index % 2 === 1;
            return (
              <React.Fragment key={l.id}>
                <tr
                  className={`${
                    isGrid ? 'border-b border-slate-200' : 'border-b border-slate-100'
                  } ${isStriped ? 'bg-slate-50/70' : 'bg-white'}`}
                >
                  <td className={`py-1.5 px-2 font-medium text-slate-900 ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.accountsHead || '–'}
                  </td>
                  {showLineDescription && (
                    <td className={`py-1.5 px-2 text-slate-600 ${isGrid ? 'border border-slate-200' : ''}`}>
                      {l.lineDescription || '–'}
                    </td>
                  )}
                  <td className={`py-1.5 px-2 text-center text-slate-600 ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.currency || '–'}
                  </td>
                  <td className={`py-1.5 px-2 text-right tabular-nums text-slate-600 ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.exchangeRate || '–'}
                  </td>
                  <td className={`py-1.5 px-2 text-right tabular-nums ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.debit ? formatCurrency(l.debit, l.currency) : '–'}
                  </td>
                  <td className={`py-1.5 px-2 text-right tabular-nums ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.credit ? formatCurrency(l.credit, l.currency) : '–'}
                  </td>
                  <td className={`py-1.5 px-2 text-right font-medium tabular-nums ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : '–'}
                  </td>
                  <td className={`py-1.5 px-2 text-right font-medium tabular-nums ${isGrid ? 'border border-slate-200' : ''}`}>
                    {l.creditBDT ? formatCurrency(l.creditBDT, 'BDT') : '–'}
                  </td>
                </tr>

                {showAuxRow && (
                  <AuxDimensionsRow
                    line={l}
                    colSpan={showLineDescription ? 8 : 7}
                    isGrid={isGrid}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

