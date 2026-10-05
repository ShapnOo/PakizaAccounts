import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { SubledgerEntry, SUBLEDGER_CONFIG } from '../../types/subledger';

interface DeleteConfirmDialogProps {
  entry: SubledgerEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  entry,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !entry) return null;

  const singular = SUBLEDGER_CONFIG[entry.type]?.singular || 'Subledger Record';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="size-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="size-6" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              Delete {singular}?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-800 font-semibold">&ldquo;{entry.name}&rdquo;</strong>?
              This action cannot be undone. Records referenced in active vouchers cannot be deleted.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span>Record Type:</span>
              <span className="font-semibold text-slate-700">{singular}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Status:</span>
              <span className="font-semibold text-slate-700">{entry.activeStatus}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="inline-block size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            <span>{isDeleting ? 'Deleting...' : `Delete ${singular}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
