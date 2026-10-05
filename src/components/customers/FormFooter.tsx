import React from 'react';
import { Save, Trash2, RotateCcw } from 'lucide-react';

interface FormFooterProps {
  isSubmitting: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
  onDelete?: () => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  isSubmitting,
  isEditMode = false,
  onCancel,
  onDelete,
}) => {
  return (
    <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-6 p-4 bg-card/95 backdrop-blur-md border-t border-border/80 flex items-center justify-between rounded-b-2xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        {isEditMode && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Customer</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="size-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Customer'}</span>
        </button>
      </div>
    </div>
  );
};
