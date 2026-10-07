import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface MultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  /** Label shown when every option is selected */
  allLabel?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  allLabel = 'All',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = Array.isArray(value) ? value : [];

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: ref,
    isOpen: open,
    minMenuHeight: 200,
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    );
  };

  const allSelected = options.length > 0 && options.every((o) => selected.includes(o));

  const hasCustomMaxW = className.includes('max-w-');

  return (
    <div ref={ref} className={`relative w-full ${hasCustomMaxW ? '' : 'max-w-[340px]'} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full min-h-8.5 pl-1.5 pr-8 py-1 rounded-lg bg-card border text-left text-xs font-semibold text-foreground outline-none transition-all cursor-pointer shadow-2xs flex flex-wrap items-center gap-1 ${
          open ? 'border-primary ring-2 ring-primary/20' : 'border-border/80'
        }`}
      >
        {selected.length === 0 ? (
          <span className="px-1.5 text-muted-foreground font-medium">{placeholder}</span>
        ) : allSelected ? (
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
            {allLabel} ({options.length})
          </span>
        ) : (
          selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold"
            >
              {s}
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(s);
                }}
                className="rounded hover:bg-primary/20 p-0.5"
              >
                <X className="size-2.5" />
              </span>
            </span>
          ))
        )}
        <ChevronDown
          className={`size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 w-full bg-card border border-border rounded-xl shadow-xl py-1 overflow-y-auto sidebar-scroll transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          <button
            type="button"
            onClick={() => onChange(allSelected ? [] : [...options])}
            className="w-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-foreground hover:bg-muted/60 border-b border-border/60 cursor-pointer"
          >
            <span
              className={`size-3.5 rounded border grid place-items-center ${
                allSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
              }`}
            >
              {allSelected && <Check className="size-2.5 stroke-[3]" />}
            </span>
            Select all
          </button>
          {options.map((opt) => {
            const isOn = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-foreground hover:bg-muted/60 cursor-pointer"
              >
                <span
                  className={`size-3.5 rounded border grid place-items-center ${
                    isOn ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  {isOn && <Check className="size-2.5 stroke-[3]" />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
