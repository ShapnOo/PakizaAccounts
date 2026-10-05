import React from 'react';
import { RotateCcw, Check, Paperclip, Ban } from 'lucide-react';
import { VoucherType, VOUCHER_TYPES, VOUCHER_TYPE_CONFIG } from '../../types/journalEntry';
import { AdvancedFilterState } from '../../stores/journalEntryStore';

interface AdvancedFilterPanelProps {
  filters: AdvancedFilterState;
  onChange: (patch: Partial<AdvancedFilterState>) => void;
  onReset: () => void;
}

const AVAILABLE_SOURCES = [
  'Manual',
  'Cheque Prepare',
  'Opening Balance',
  'Bank Reconciliation',
  'Purchase Integration',
];

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const toggleType = (t: VoucherType) => {
    const current = filters.types;
    if (current.includes(t)) {
      onChange({ types: current.filter((x) => x !== t) });
    } else {
      onChange({ types: [...current, t] });
    }
  };

  const toggleSource = (s: string) => {
    const current = filters.sources;
    if (current.includes(s)) {
      onChange({ sources: current.filter((x) => x !== s) });
    } else {
      onChange({ sources: [...current, s] });
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-border/90 bg-card shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Voucher Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Voucher Type</label>
          <div className="flex flex-wrap gap-1.5">
            {VOUCHER_TYPES.map((type) => {
              const cfg = VOUCHER_TYPE_CONFIG[type];
              const isSelected = filters.types.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
                    isSelected
                      ? `${cfg.color.badge} font-bold shadow-2xs`
                      : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isSelected && <Check className="size-3 stroke-[2.5]" />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Source Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Transaction Source</label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_SOURCES.map((src) => {
              const isSelected = filters.sources.includes(src);
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => toggleSource(src)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-primary/15 border-primary text-primary font-bold shadow-2xs'
                      : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isSelected && <Check className="size-3 stroke-[2.5]" />}
                  <span>{src}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Amount Range (Min / Max BDT) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Amount Range (৳ BDT)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min BDT"
              value={filters.minAmount}
              onChange={(e) => onChange({ minAmount: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <input
              type="number"
              placeholder="Max BDT"
              value={filters.maxAmount}
              onChange={(e) => onChange({ maxAmount: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>
        </div>

        {/* 4. Flags & Status */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Status & Criteria</label>
          <div className="flex flex-col gap-2">
            {/* Attachment Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.hasAttachmentsOnly}
                onChange={(e) => onChange({ hasAttachmentsOnly: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary size-3.5"
              />
              <span className="flex items-center gap-1">
                <Paperclip className="size-3 text-muted-foreground" />
                <span>With attachments only</span>
              </span>
            </label>

            {/* Void Status Radio Group */}
            <div className="inline-flex p-0.5 rounded-lg bg-muted/50 border border-border/80 w-fit">
              {(['all', 'active', 'voided'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ voidFilter: v })}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    filters.voidFilter === v
                      ? 'bg-card text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="flex items-center justify-end pt-3 border-t border-border/60">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
