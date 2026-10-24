import React, { useState } from 'react';
import { Copy, X, Check, ArrowRight } from 'lucide-react';
import { VoucherTemplate, VoucherType } from '../../types/voucherTemplate';

interface CopyFromModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: VoucherTemplate;
  templates: VoucherTemplate[];
  onApplyCopy: (source: VoucherTemplate) => void;
}

const TYPE_BADGES: Record<VoucherType, string> = {
  Journal: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Payment: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Receive: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Contra: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};

export const CopyFromModal: React.FC<CopyFromModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  templates,
  onApplyCopy,
}) => {
  const otherTemplates = templates.filter((t) => t.id !== currentTemplate.id);
  const [selectedId, setSelectedId] = useState<string>(otherTemplates[0]?.id || '');

  if (!isOpen) return null;

  const selectedTemplate = otherTemplates.find((t) => t.id === selectedId) || otherTemplates[0];

  const handleCopy = (target?: VoucherTemplate) => {
    const toCopy = target || selectedTemplate;
    if (!toCopy) return;
    onApplyCopy(toCopy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <Copy className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Copy From Template</h3>
              <p className="text-[11px] text-muted-foreground">
                Select a template to copy its style and layout
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Simple List of Templates */}
        <div className="p-4 overflow-y-auto sidebar-scroll space-y-2 flex-1">
          {otherTemplates.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No other templates available.
            </div>
          ) : (
            otherTemplates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              const badgeClass = TYPE_BADGES[tpl.voucherType] || 'bg-muted text-foreground';

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedId(tpl.id)}
                  onDoubleClick={() => handleCopy(tpl)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-600 shadow-2xs'
                      : 'border-border/80 bg-card hover:bg-muted/40 hover:border-border'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {tpl.voucherType}
                      </span>
                      {tpl.isDefault && (
                        <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40">
                          Default
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-foreground truncate">{tpl.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {tpl.paper.size} ({tpl.paper.orientation}) · Margins: {tpl.margin.left}" · Font: {tpl.font.family}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <div
                      className={`size-5 rounded-full border grid place-items-center transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-border group-hover:border-indigo-400'
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border/80 bg-muted/20 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleCopy()}
            disabled={!selectedTemplate}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Copy className="size-3.5" />
            <span>Copy Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
