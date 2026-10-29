import React from 'react';
import {
  TBLedgerRow,
  TBVisibleColumns,
  ValueShowIn,
  Currency,
  LEVEL_COLORS,
} from '../../types/trialBalance';
import { ValueCell } from './ValueCell';
import { SubLedgerCell } from './SubLedgerCell';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TrialBalanceRowProps {
  row: TBLedgerRow;
  colKeys: (keyof TBVisibleColumns)[];
  showSubLedger: boolean;
  valueShowIn: ValueShowIn;
  currency: Currency;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TrialBalanceRow: React.FC<TrialBalanceRowProps> = ({
  row,
  colKeys,
  showSubLedger,
  valueShowIn,
  currency,
  isExpanded,
  onToggle,
}) => {
  const accountName = row.accountPath[row.accountPath.length - 1];
  const isL1 = row.level === 1;
  const isL2 = row.level === 2;
  const isL3 = row.level === 3;

  const indentPx = (row.level - 1) * 16;

  // Background styling based on level
  const rowBg = isL1
    ? 'bg-slate-100/90 font-bold border-t-2 border-slate-300'
    : isL2
    ? 'bg-slate-50/70 font-semibold border-b border-slate-200'
    : isL3
    ? 'bg-white font-medium border-b border-slate-100 hover:bg-slate-50/60'
    : 'bg-white font-normal border-b border-slate-100 hover:bg-slate-50/60';

  const levelBadge = (
    <span
      className={`text-[9.5px] font-bold px-1 py-0.2 rounded font-sans uppercase shrink-0 ${
        isL1
          ? 'bg-indigo-100 text-indigo-800'
          : isL2
          ? 'bg-slate-200 text-slate-700'
          : isL3
          ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      L-{row.level}
    </span>
  );

  return (
    <tr className={`${rowBg} transition-colors font-sans text-xs`}>
      {/* Particulars Cell with Tree Indentation & Chevrons */}
      <td className="py-2 px-3 border-r border-slate-200 overflow-hidden">
        <div
          className="flex items-center gap-1.5 select-none"
          style={{ paddingLeft: `${indentPx}px` }}
        >
          {row.isParent ? (
            <button
              type="button"
              onClick={onToggle}
              className="p-0.5 rounded hover:bg-slate-200/70 text-slate-500 cursor-pointer transition shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="size-3.5 text-slate-700" />
              ) : (
                <ChevronRight className="size-3.5 text-slate-500" />
              )}
            </button>
          ) : (
            <span className="w-4 shrink-0 inline-block" />
          )}

          {levelBadge}

          <span
            onClick={() => row.isParent && onToggle()}
            className={`${LEVEL_COLORS[row.level]} ${
              row.isParent ? 'cursor-pointer hover:underline' : ''
            } truncate`}
            title={row.accountPath.join(' › ')}
          >
            {accountName}
          </span>
        </div>
      </td>

      {/* Sub-Ledger Column (if enabled) */}
      {showSubLedger && (
        <td className="py-2 px-3 border-r border-slate-200 overflow-hidden truncate">
          <SubLedgerCell subLedger={row.subLedger} />
        </td>
      )}

      {/* Dynamic Numeric Columns strictly matching colKeys */}
      {colKeys.map((k, idx) => {
        const isLast = idx === colKeys.length - 1;
        const val = row[k] as number;

        return (
          <td
            key={k}
            className={`py-2 px-1 text-right overflow-hidden ${
              !isLast ? 'border-r border-slate-200' : ''
            }`}
          >
            <ValueCell
              value={val}
              valueShowIn={valueShowIn}
              currency={currency}
              level={row.level}
            />
          </td>
        );
      })}
    </tr>
  );
};
