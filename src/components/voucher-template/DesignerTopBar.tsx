import React from 'react';
import { VoucherType } from '../../types/voucherTemplate';
import {
  SlidersHorizontal,
  RotateCcw,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface DesignerTopBarProps {
  activeType: VoucherType;
  dirty: boolean;
  livePreviewEnabled: boolean;
  onToggleLivePreview: () => void;
  onSave: () => void;
  onReset: () => void;
}

export const DesignerTopBar: React.FC<DesignerTopBarProps> = ({
  activeType,
  dirty,
  livePreviewEnabled,
  onToggleLivePreview,
  onSave,
  onReset,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Description */}
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-xs">
          <SlidersHorizontal className="size-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-foreground">
              Voucher Print Template
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {activeType} Template
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            3-panel designer for paper size, margins, font themes, and print layout (T1–T13).
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Reset to factory default template"
        >
          <RotateCcw className="size-3.5 text-muted-foreground" />
          <span>Reset to default</span>
        </button>

        {/* Changes Preview Button (from sheet) */}
        <button
          type="button"
          onClick={onToggleLivePreview}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
            livePreviewEnabled
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
              : 'bg-card border-border text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle live changes preview"
        >
          <Eye className="size-3.5" />
          <span>Changes Preview</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 relative"
        >
          <Save className="size-3.5 stroke-[2.5]" />
          <span>Save Template</span>
          {dirty && (
            <span
              className="size-2 rounded-full bg-amber-300 absolute -top-0.5 -right-0.5 ring-2 ring-indigo-600 animate-pulse"
              title="Unsaved changes"
            />
          )}
        </button>
      </div>
    </div>
  );
};
