import React from 'react';
import { CustomField, CONTEXT_CONFIG } from '../../types/customField';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  field: CustomField | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  field,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !field) return null;

  const contextLabel = CONTEXT_CONFIG[field.context]?.label || field.context;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 grid place-items-center shrink-0 border border-rose-200/50 dark:border-rose-900/50">
              <AlertTriangle className="size-5" />
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
              Delete Custom Field?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-foreground font-bold">
                "{field.label}"
              </strong>{' '}
              ({field.dataType}) from{' '}
              <span className="font-semibold text-foreground">
                {contextLabel}
              </span>
              ?
            </p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
              Warning: This field column will no longer be visible on transaction entry forms.
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{loading ? 'Deleting...' : 'Delete Field'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
