import React from 'react';
import { AlertTriangle, Trash2, X, RotateCcw } from 'lucide-react';
import { ChequePrepare } from '../../types/chequePrepare';

interface VoidConfirmDialogProps {
  cheque: ChequePrepare | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isVoiding: boolean;
}

export const VoidConfirmDialog: React.FC<VoidConfirmDialogProps> = ({
  cheque,
  onClose,
  onConfirm,
  isVoiding,
}) => {
  if (!cheque) return null;

  const chequeNumbers = cheque.lines.map((l) => l.chequeNo).filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/70 bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5" />
            <h3 className="text-sm font-bold">Void Cheque Preparation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs leading-relaxed">
          <p className="text-foreground font-medium">
            Are you sure you want to void this cheque preparation?
          </p>
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 font-mono text-[11px]">
            <div>
              <span className="text-muted-foreground">Source:</span>{' '}
              <strong className="text-foreground uppercase">{cheque.sourceType}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Cheque Leaf:</span>{' '}
              <strong className="text-foreground">{chequeNumbers || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Bank & Book:</span>{' '}
              <span className="text-foreground">
                {cheque.bankName} — {cheque.bookName}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Voiding will remove this register entry and <strong>free up the cheque number(s)</strong> back
            to available status in their cheque book.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-border/70 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isVoiding}
            className="h-8.5 px-4 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isVoiding}
            className="inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm shadow-rose-600/20 cursor-pointer disabled:opacity-50"
          >
            {isVoiding ? (
              <span>Voiding...</span>
            ) : (
              <>
                <RotateCcw className="size-3.5" />
                <span>Confirm Void</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
