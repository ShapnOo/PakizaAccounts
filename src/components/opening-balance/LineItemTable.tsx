import React from 'react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { LineItemRow } from './LineItemRow';
import { TotalsFooter } from './TotalsFooter';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';
import { Plus, Info } from 'lucide-react';

interface LineItemTableProps {
  lines: OpeningBalanceLine[];
  loading: boolean;
  onAddLine: () => void;
  onUpdateLine: (id: string, patch: Partial<OpeningBalanceLine>) => void;
  onDuplicateLine: (id: string) => void;
  onRemoveLine: (id: string) => void;
  fieldErrors: Record<string, string>;
  totalDebitBDT: number;
  totalCreditBDT: number;
  difference: number;
  balanced: boolean;
  shake?: boolean;
}

export const LineItemTable: React.FC<LineItemTableProps> = ({
  lines,
  loading,
  onAddLine,
  onUpdateLine,
  onDuplicateLine,
  onRemoveLine,
  fieldErrors,
  totalDebitBDT,
  totalCreditBDT,
  difference,
  balanced,
  shake,
}) => {
  return (
    <div className="space-y-2.5">
      {/* ── 6. Action Row: [+ Add Line] ABOVE Table ── */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAddLine}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-dashed border-indigo-400/80 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
        >
          <Plus className="size-3.5 transition-transform group-hover:scale-110" />
          <span>+ Add Line</span>
        </button>

        <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
          <span>{lines.length} Line items</span>
          <span className="text-border">•</span>
          <span className="italic font-normal">All account heads permitted</span>
        </div>
      </div>

      {/* ── 7. Main Table Container (100% full width, edge-to-edge) ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 border-b border-border/80 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-2 font-black min-w-[220px]">
                  Accounts Head <span className="text-rose-500">*</span>
                </th>
                <th className="py-2.5 px-1.5 font-bold min-w-[150px]">Cost Center</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[170px]">Subsidiary</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[150px]">Employee</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[150px]">Vehicles</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[110px]">Reference</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[160px]">Description</th>
                <th className="py-2.5 px-1.5 font-bold min-w-[150px]">Currency / Rate</th>
                <th className="py-2.5 px-1.5 font-bold w-24 text-right">Debit</th>
                <th className="py-2.5 px-1.5 font-bold w-24 text-right">Credit</th>
                <th className="py-2.5 px-1.5 font-black w-28 text-right bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                  Debit (BDT)
                </th>
                <th className="py-2.5 px-1.5 font-black w-28 text-right bg-rose-500/10 text-rose-800 dark:text-rose-300">
                  Credit (BDT)
                </th>
                <th className="py-2.5 px-2 w-14 text-center">⋮</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="p-0">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : lines.length === 0 ? (
                <tr>
                  <td colSpan={13}>
                    <EmptyState onAddLine={onAddLine} />
                  </td>
                </tr>
              ) : (
                lines.map((line, idx) => (
                  <LineItemRow
                    key={line.id}
                    line={line}
                    index={idx}
                    onUpdate={onUpdateLine}
                    onDuplicate={onDuplicateLine}
                    onRemove={onRemoveLine}
                    error={fieldErrors[`lines.${idx}`]}
                    autoFocus={idx === 0 && line.accountHeadId === ''}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 9. Totals & Difference Footer (Sticky directly under the last line) ── */}
        {!loading && lines.length > 0 && (
          <TotalsFooter
            totalDebitBDT={totalDebitBDT}
            totalCreditBDT={totalCreditBDT}
            difference={difference}
            balanced={balanced}
            shake={shake}
          />
        )}
      </div>
    </div>
  );
};
