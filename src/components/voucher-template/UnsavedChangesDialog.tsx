import React from 'react';
import { VoucherType } from '../../types/voucherTemplate';
import { AlertCircle, X, Save, ArrowRight } from 'lucide-react';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  currentType: VoucherType;
  targetType: VoucherType | null;
  onClose: () => void;
  onDiscard: () => void;
  onSaveAndSwitch: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  currentType,
  targetType,
  onClose,
  onDiscard,
  onSaveAndSwitch,
}) => {
  if (!isOpen || !targetType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 grid place-items-center shrink-0 border border-amber-200/50">
              <AlertCircle className="size-5" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              Unsaved Changes in {currentType}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have modified template settings for{' '}
              <strong className="text-foreground">{currentType}</strong>. Would you like to save them before switching to{' '}
              <strong className="text-foreground">{targetType}</strong>?
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSaveAndSwitch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>Save & Switch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
