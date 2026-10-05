import React from 'react';
import { Printer, Save, CheckCircle2, FileText, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrepareActionBarProps {
  lastSavedChequeId: string | null;
  lastVoucherId?: string | null;
  isSaving: boolean;
  onSave: () => void;
  onSaveAndJournal: () => void;
  hasJournal?: boolean;
  onReset?: () => void;
}

export const PrepareActionBar: React.FC<PrepareActionBarProps> = ({
  lastSavedChequeId,
  lastVoucherId,
  isSaving,
  onSave,
  onSaveAndJournal,
  hasJournal = true,
  onReset,
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left status indicator */}
      <div className="flex items-center gap-2">
        {lastSavedChequeId ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <CheckCircle2 className="size-3.5" />
            <span>Cheque Prepared & Saved</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground font-medium">
            Complete the form details and select an action below
          </span>
        )}
      </div>

      {/* Right actions: Cheque Print | Voucher Print | Save | Save & Journal */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        {/* Reset button if available */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* 1. Cheque Print (disabled until Saved) */}
        <button
          type="button"
          disabled={!lastSavedChequeId || isSaving}
          onClick={() => {
            if (lastSavedChequeId) {
              navigate(`/cheques/${lastSavedChequeId}/print`);
            }
          }}
          className={`inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border text-xs font-bold transition-all ${
            lastSavedChequeId && !isSaving
              ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/70 shadow-2xs cursor-pointer active:scale-95'
              : 'border-border/60 bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
          }`}
        >
          <Printer className="size-3.5" />
          <span>Cheque Print</span>
        </button>

        {/* 2. Voucher Print (disabled until Journal built/saved) */}
        <button
          type="button"
          disabled={!lastSavedChequeId || !hasJournal || isSaving}
          onClick={() => {
            if (lastSavedChequeId) {
              navigate('/accounts-report/journal');
            }
          }}
          className={`inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border text-xs font-bold transition-all ${
            lastSavedChequeId && hasJournal && !isSaving
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 shadow-2xs cursor-pointer active:scale-95'
              : 'border-border/60 bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
          }`}
        >
          <FileText className="size-3.5" />
          <span>Voucher Print</span>
        </button>

        {/* 3. Save */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          <span>Save</span>
        </button>

        {/* 4. Save & Journal */}
        <button
          type="button"
          onClick={onSaveAndJournal}
          disabled={isSaving}
          className="inline-flex items-center gap-2 h-8.5 px-4.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="size-3.5" />
          )}
          <span>Save & Journal</span>
        </button>
      </div>
    </div>
  );
};
