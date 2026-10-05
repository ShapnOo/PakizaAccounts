import React, { useState } from 'react';
import { X, BookmarkPlus, Save, Loader2 } from 'lucide-react';
import { VoucherType } from '../../types/journalEntry';

interface SaveAsPresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  voucherType: VoucherType;
  lineCount: number;
  onSavePreset: (presetName: string) => Promise<void>;
}

export const SaveAsPresetDialog: React.FC<SaveAsPresetDialogProps> = ({
  isOpen,
  onClose,
  voucherType,
  lineCount,
  onSavePreset,
}) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Preset name is required');
      return;
    }
    setSaving(true);
    try {
      await onSavePreset(name.trim());
      setName('');
      setError('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save preset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookmarkPlus className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Save as Form Preset</h3>
              <p className="text-[11px] text-muted-foreground">
                Save current {lineCount} line item(s) as a reusable template for {voucherType} vouchers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Preset Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Monthly Machinery Depreciation, Utility Bill Template"
              className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            {error && <p className="text-[11px] text-rose-500 font-bold">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Save Preset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
