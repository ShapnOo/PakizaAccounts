import React from 'react';
import { Save, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormFooterProps {
  isEdit: boolean;
  isSaving: boolean;
  onDelete?: () => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  isEdit,
  isSaving,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
      <div className="flex items-center gap-2">
        <Link
          to="/banks"
          className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </Link>

        {isEdit && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Branch</span>
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
      >
        {isSaving ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="size-3.5" />
            <span>Save Branch</span>
          </>
        )}
      </button>
    </div>
  );
};
