import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { ISCustomRow } from '../../types/isCustomization';

interface CascadeDeleteDialogProps {
  isOpen: boolean;
  row: ISCustomRow | null;
  childrenCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CascadeDeleteDialog: React.FC<CascadeDeleteDialogProps> = ({
  isOpen,
  row,
  childrenCount,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
        <div className="p-4 flex items-start gap-3">
          <div className="size-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-900 leading-tight">
              Delete Parent Section &ldquo;{row.code} — {row.particulars}&rdquo;?
            </h3>
            <p className="text-[13px] text-slate-500 mt-1">
              Deleting this parent section will also remove{' '}
              <strong className="text-slate-800">
                {childrenCount} child {childrenCount === 1 ? 'row' : 'rows'}
              </strong>{' '}
              belonging to it, and will auto-clean references from other formulas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white text-[13px] font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-medium shadow-xs transition cursor-pointer"
          >
            Delete Parent & {childrenCount} Children
          </button>
        </div>
      </div>
    </div>
  );
};

