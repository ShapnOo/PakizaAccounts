import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { formatNumber } from '../../lib/format';

interface DeleteLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  line: OpeningBalanceLine | null;
  accountName?: string;
  accountCode?: string;
}

export const DeleteLineDialog: React.FC<DeleteLineDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  line,
  accountName,
  accountCode,
}) => {
  if (!isOpen || !line) return null;

  const debit = line.debitBDT || line.debit || 0;
  const credit = line.creditBDT || line.credit || 0;
  const isDebit = debit > 0;
  const amountVal = isDebit ? debit : credit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border overflow-hidden transform animate-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="size-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="size-6" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-foreground">
              Delete Opening Balance Line?
            </h3>
            <p className="text-xs text-slate-500 dark:text-muted-foreground leading-relaxed">
              Are you sure you want to remove this opening balance entry? This will update the trial balance reconciliation totals.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-muted/40 rounded-xl border border-slate-200/80 dark:border-border text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-muted-foreground">Account:</span>
              <span className="font-bold text-slate-800 dark:text-foreground text-right truncate max-w-[220px]">
                {accountCode ? `[${accountCode}] ` : ''}{accountName || line.accountHeadId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-muted-foreground">Balance Amount:</span>
              <span
                className={`font-mono font-bold ${
                  isDebit ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                ৳ {formatNumber(amountVal)} ({isDebit ? 'Debit' : 'Credit'})
              </span>
            </div>
            {line.reference && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-muted-foreground">Reference:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{line.reference}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-muted/40 border-t border-slate-100 dark:border-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-muted-foreground hover:bg-slate-200/70 dark:hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Line</span>
          </button>
        </div>
      </div>
    </div>
  );
};
