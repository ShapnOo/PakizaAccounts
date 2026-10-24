import React from 'react';
import { VoucherType } from '../../types/voucherTemplate';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  RotateCcw,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Pencil,
  Copy,
} from 'lucide-react';

interface DesignerTopBarProps {
  activeType: VoucherType;
  templateName?: string;
  onUpdateName?: (name: string) => void;
  dirty: boolean;
  livePreviewEnabled: boolean;
  onToggleLivePreview: () => void;
  onSave: () => void;
  onReset: () => void;
  onCopyFrom?: () => void;
  onBack?: () => void;
}

export const DesignerTopBar: React.FC<DesignerTopBarProps> = ({
  activeType,
  templateName,
  onUpdateName,
  dirty,
  livePreviewEnabled,
  onToggleLivePreview,
  onSave,
  onReset,
  onCopyFrom,
  onBack,
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameValue, setNameValue] = React.useState(templateName || '');

  React.useEffect(() => {
    setNameValue(templateName || '');
  }, [templateName]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameValue.trim() && nameValue !== templateName && onUpdateName) {
      onUpdateName(nameValue.trim());
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Navigation */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="size-9 rounded-xl border border-border bg-background hover:bg-muted text-foreground grid place-items-center transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
            title="Back to Templates List"
          >
            <ArrowLeft className="size-4" />
          </button>
        ) : (
          <Link
            to="/voucher-template"
            className="size-9 rounded-xl border border-border bg-background hover:bg-muted text-foreground grid place-items-center transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
            title="Back to Templates List"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {isEditingName ? (
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="text-base font-bold text-foreground px-2 py-0.5 border border-indigo-500 rounded-md bg-background focus:outline-hidden"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="text-lg font-black tracking-tight text-foreground hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer text-left group"
                title="Click to rename template"
              >
                <span>{templateName || `${activeType} Template`}</span>
                <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {activeType} Voucher
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            3-panel designer for paper size, margins, font themes, and print layout (T1–T13).
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {/* Copy From Button */}
        {onCopyFrom && (
          <button
            type="button"
            onClick={onCopyFrom}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Copy settings from another voucher template"
          >
            <Copy className="size-3.5 text-indigo-600" />
            <span>Copy from...</span>
          </button>
        )}

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
