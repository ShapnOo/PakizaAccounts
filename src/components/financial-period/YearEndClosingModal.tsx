import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';
import { FiscalYear } from '../../types/financialPeriod';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiscalYear: FiscalYear;
  onConfirmClose: (fyCode: string, retainedAccount: string, closedBy: string) => void;
}

export const YearEndClosingModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  fiscalYear,
  onConfirmClose,
}) => {
  const [retainedAccount, setRetainedAccount] = useState<string>(
    fiscalYear.retainedEarningsAccount || '3101-001'
  );
  const [closedBy, setClosedBy] = useState<string>('Chief Financial Officer');
  const [agreed, setAgreed] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onConfirmClose(fiscalYear.code, retainedAccount, closedBy);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              <Lock className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                Year-End Closing & Balance Carry Forward
              </h2>
              <p className="text-xs text-muted-foreground">
                Formal accounting closing for FY {fiscalYear.code}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Validation Checklist */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pre-Closing Verification Checklist
          </span>
          <div className="space-y-1.5 rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5" />
                All 12 Periods Audited & Reconciled
              </span>
              <span className="font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5" />
                Trial Balance Debits Equal Credits (Balance Sheet In Balance)
              </span>
              <span className="font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Matched
              </span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5" />
                Bank & Cheque Reconciliations Completed
              </span>
              <span className="font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Cleared
              </span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5" />
                Depreciation & Accruals Journalized
              </span>
              <span className="font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Posted
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Retained Earnings Transfer Account
            </label>
            <input
              type="text"
              value={retainedAccount}
              onChange={(e) => setRetainedAccount(e.target.value)}
              className="w-full text-xs font-semibold bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Net income/loss for {fiscalYear.code} will be transferred to this equity account.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Closing Officer / Authorized By
            </label>
            <input
              type="text"
              value={closedBy}
              onChange={(e) => setClosedBy(e.target.value)}
              className="w-full text-xs font-semibold bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              Closing Fiscal Year <strong>{fiscalYear.code}</strong> will permanently lock all 12 monthly periods and roll forward ending asset, liability, and equity balances into next year's opening balances.
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="size-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
            />
            <span>I confirm that all financial reports and reconciliations have been completed.</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agreed}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-sm ${
                agreed
                  ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-rose-200'
                  : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
              }`}
            >
              <Lock className="size-3.5" />
              <span>Confirm & Close Fiscal Year</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
