import React, { useState, useEffect, useRef } from 'react';
import { Columns3, Check } from 'lucide-react';
import { SourceType } from '../../types/chequePrepare';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

export interface ColumnVisibilityState {
  chequeType: boolean;
  chequeNo: boolean; // locked true
  chequeDate: boolean;
  payTo: boolean;
  chequeFor: boolean; // direct only
  name: boolean; // direct only
  glAccountId: boolean;
  amount: boolean; // locked true
}

const DEFAULT_DIRECT_COLUMNS: ColumnVisibilityState = {
  chequeType: true,
  chequeNo: true,
  chequeDate: true,
  payTo: true,
  chequeFor: true,
  name: true,
  glAccountId: true,
  amount: true,
};

const DEFAULT_SINGLE_COLUMNS: ColumnVisibilityState = {
  chequeType: true,
  chequeNo: true,
  chequeDate: true,
  payTo: true,
  chequeFor: false,
  name: false,
  glAccountId: true,
  amount: true,
};

interface ColumnTogglePopoverProps {
  sourceType: SourceType;
  columns: ColumnVisibilityState;
  onChange: (cols: ColumnVisibilityState) => void;
}

export function useColumnVisibility(sourceType: SourceType) {
  const key = `cheque-cols-${sourceType}`;
  const [columns, setColumns] = useState<ColumnVisibilityState>(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return {
          ...(sourceType === 'direct' ? DEFAULT_DIRECT_COLUMNS : DEFAULT_SINGLE_COLUMNS),
          ...JSON.parse(raw),
          chequeNo: true,
          amount: true,
        };
      } catch (e) {
        // fallback
      }
    }
    return sourceType === 'direct' ? DEFAULT_DIRECT_COLUMNS : DEFAULT_SINGLE_COLUMNS;
  });

  const updateColumns = (cols: ColumnVisibilityState) => {
    const locked = { ...cols, chequeNo: true, amount: true };
    setColumns(locked);
    localStorage.setItem(key, JSON.stringify(locked));
  };

  return { columns, updateColumns };
}

export const ColumnTogglePopover: React.FC<ColumnTogglePopoverProps> = ({
  sourceType,
  columns,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openUpward } = useDropdownPosition({
    triggerRef: ref,
    isOpen: open,
    minMenuHeight: 240,
  });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggle = (field: keyof ColumnVisibilityState) => {
    if (field === 'chequeNo' || field === 'amount') return; // locked
    onChange({
      ...columns,
      [field]: !columns[field],
    });
  };

  const isDirect = sourceType === 'direct';

  const options: { id: keyof ColumnVisibilityState; label: string; locked?: boolean; directOnly?: boolean }[] = [
    { id: 'chequeType', label: 'Cheque Type' },
    { id: 'chequeNo', label: 'Cheque No (Required)', locked: true },
    { id: 'chequeDate', label: 'Cheque Date' },
    { id: 'chequeFor', label: 'Cheque for', directOnly: true },
    { id: 'name', label: 'Name', directOnly: true },
    { id: 'payTo', label: 'Pay to' },
    { id: 'glAccountId', label: 'GL Account' },
    { id: 'amount', label: 'DR. Amount (Required)', locked: true },
  ];

  const visibleOptions = options.filter((o) => !o.directOnly || isDirect);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Column hide & show"
        className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
          open
            ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary/20'
            : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
      >
        <Columns3 className="size-3.5" />
        <span className="hidden sm:inline">Columns</span>
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-52 rounded-xl bg-card border border-border shadow-xl py-1.5 ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Toggle Columns
            </span>
            <span className="text-[10px] text-muted-foreground/70">Persisted</span>
          </div>

          <div className="p-1 space-y-0.5">
            {visibleOptions.map((opt) => {
              const isChecked = !!columns[opt.id];
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={opt.locked}
                  onClick={() => toggle(opt.id)}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-medium transition-colors ${
                    opt.locked
                      ? 'text-muted-foreground/60 cursor-not-allowed bg-muted/20'
                      : 'text-foreground hover:bg-muted/60 cursor-pointer'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <div
                    className={`size-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border bg-card'
                    }`}
                  >
                    {isChecked && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
