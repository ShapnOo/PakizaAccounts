import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { JournalPreset } from '../../types/presetJournal';

interface DeleteConfirmDialogProps {
  preset: JournalPreset | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  preset,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmDialogProps) {
  if (!preset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Delete Preset Template?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
          <p className="font-bold text-foreground">{preset.profileName}</p>
          <p className="text-muted-foreground">
            Type: {preset.voucherType} Voucher • Lines: {preset.lines.length} • Used: {preset.usageCount} times
          </p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Deleting this template will remove it from the preset library and the "Choose Form Preset" dropdown in Journal Entries.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-sm cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{loading ? 'Deleting...' : 'Delete Preset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
