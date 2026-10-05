import React from 'react';
import { ChequeEntry } from '../../types/cheque';
import { Trash2, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

interface GeneratedChequesTableProps {
  cheques: ChequeEntry[];
  enforceBySerial: boolean;
  onToggleInactive: (index: number) => void;
  onSignatoryChange: (index: number, val: string) => void;
  onRemoveRow: (index: number) => void;
}

export const GeneratedChequesTable: React.FC<GeneratedChequesTableProps> = ({
  cheques,
  enforceBySerial,
  onToggleInactive,
  onSignatoryChange,
  onRemoveRow,
}) => {
  const total = cheques.length;
  const usedCount = cheques.filter((c) => c.used).length;
  const inactiveCount = cheques.filter((c) => c.isInactive).length;
  const activeAvailable = total - usedCount - inactiveCount;

  return (
    <div className="space-y-3">
      {/* Table Statistics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/80">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Generated Cheque Leaves ({total})
          </h4>
          <p className="text-[11px] text-muted-foreground">
            {total} cheques generated ·{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {activeAvailable} available
            </strong>{' '}
            · {usedCount} used · {inactiveCount} inactive
          </p>
        </div>

        {enforceBySerial && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldAlert className="size-3.5" />
            <span>Serial Consumption Enforced</span>
          </div>
        )}
      </div>

      {/* Cheque Rows Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4 w-16 text-right">SL</th>
              <th className="py-2.5 px-4 w-44">Cheque No.</th>
              <th className="py-2.5 px-4 w-32 text-center">Status</th>
              <th className="py-2.5 px-4">Signatory (Signature Caption)</th>
              <th className="py-2.5 px-4 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {cheques.map((c, index) => (
              <tr
                key={c.id || c.chequeNo || index}
                className={`transition-colors ${
                  c.used
                    ? 'bg-muted/40 opacity-70'
                    : c.isInactive
                    ? 'bg-rose-50/20 dark:bg-rose-950/10'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/30'
                }`}
              >
                {/* SL */}
                <td className="py-2.5 px-4 text-right font-mono text-muted-foreground font-semibold">
                  {c.sl}
                </td>

                {/* Cheque No */}
                <td className="py-2.5 px-4 font-mono font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <span className={c.used ? 'line-through text-muted-foreground' : ''}>
                      {c.chequeNo}
                    </span>
                    {c.used && (
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        USED
                      </span>
                    )}
                  </div>
                </td>

                {/* Is Inactive Toggle Button */}
                <td className="py-2.5 px-4 text-center">
                  <button
                    type="button"
                    disabled={c.used}
                    onClick={() => onToggleInactive(index)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      c.isInactive
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {c.isInactive ? (
                      <>
                        <XCircle className="size-3" />
                        <span>Inactive</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3" />
                        <span>Active</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Signatory Caption */}
                <td className="py-2 px-4">
                  <input
                    type="text"
                    disabled={c.used}
                    placeholder="e.g. Managing Director, Director Finance"
                    value={c.signatory || ''}
                    onChange={(e) => onSignatoryChange(index, e.target.value)}
                    className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs disabled:bg-muted/40"
                  />
                </td>

                {/* Action: Remove */}
                <td className="py-2 px-4 text-center">
                  {!c.used && (
                    <button
                      type="button"
                      onClick={() => onRemoveRow(index)}
                      title="Remove this leaf"
                      className="p-1 text-muted-foreground hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
