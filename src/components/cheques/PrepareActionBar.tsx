import React from 'react';
import { Printer, Save, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrepareActionBarProps {
  lastSavedChequeId: string | null;
  isSaving: boolean;
  onSave: () => void;
  onSaveAndJournal: () => void;
  hasJournal: boolean;
}

export const PrepareActionBar: React.FC<PrepareActionBarProps> = ({
  lastSavedChequeId,
  isSaving,
  onSave,
  onSaveAndJournal,
  hasJournal,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border mt-6">
      {/* Left: Print Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!lastSavedChequeId}
          onClick={() => {
            if (lastSavedChequeId) {
              navigate(`/cheques/${lastSavedChequeId}/print`);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-xs font-semibold text-foreground bg-card hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
          title={lastSavedChequeId ? 'Print physical cheque layout' : 'Save cheque first to enable printing'}
        >
          <Printer className="size-3.5 text-indigo-500" />
          <span>Cheque Print</span>
        </button>

        <button
          type="button"
          disabled={!hasJournal || !lastSavedChequeId}
          onClick={() => {
            if (lastSavedChequeId) {
              window.print();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-xs font-semibold text-foreground bg-card hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
          title="Print financial voucher"
        >
          <Printer className="size-3.5 text-slate-500" />
          <span>Voucher Print</span>
        </button>
      </div>

      {/* Right: Save Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
        >
          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          <span>Save</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveAndJournal}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Layers className="size-3.5" />
          )}
          <span>Save & Journal</span>
        </button>
      </div>
    </div>
  );
};
