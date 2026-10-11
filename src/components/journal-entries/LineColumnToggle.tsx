import React, { useState, useEffect, useRef } from 'react';
import { Columns3, Check } from 'lucide-react';

export interface LineColumnVisibility {
  costCenter: boolean;
  subsidiary: boolean;
  employee: boolean;
  vehicle: boolean;
  reference: boolean;
  description: boolean;
  currency: boolean;
}

export const DEFAULT_LINE_COLUMNS: LineColumnVisibility = {
  costCenter: true,
  subsidiary: true,
  employee: true,
  vehicle: true,
  reference: true,
  description: true,
  currency: true,
};

const STORAGE_KEY = 'voucher_line_columns_visibility_v1';

export function useLineColumnVisibility() {
  const [columns, setColumns] = useState<LineColumnVisibility>(() => {
    if (typeof window === 'undefined') return DEFAULT_LINE_COLUMNS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_LINE_COLUMNS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_LINE_COLUMNS;
  });

  const updateColumns = (newCols: LineColumnVisibility) => {
    setColumns(newCols);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCols));
      } catch {
        // ignore
      }
    }
  };

  return { columns, updateColumns };
}

interface LineColumnToggleProps {
  columns: LineColumnVisibility;
  onChange: (columns: LineColumnVisibility) => void;
}

export const LineColumnToggle: React.FC<LineColumnToggleProps> = ({
  columns,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const toggle = (key: keyof LineColumnVisibility) => {
    onChange({
      ...columns,
      [key]: !columns[key],
    });
  };

  const columnOptions: { key: keyof LineColumnVisibility; label: string }[] = [
    { key: 'costCenter', label: 'Cost Center' },
    { key: 'subsidiary', label: 'Subsidiary (Customer/Vendor)' },
    { key: 'employee', label: 'Employee' },
    { key: 'vehicle', label: 'Vehicles' },
    { key: 'reference', label: 'Reference' },
    { key: 'description', label: 'Description' },
    { key: 'currency', label: 'Currency & Exchange Rate' },
  ];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs select-none ${
          isOpen
            ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary/20'
            : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
        title="Column hide & show"
      >
        <Columns3 className="size-3.5 text-primary" />
        <span>Columns</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-xl bg-card border border-border shadow-xl py-1.5 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-foreground">
              Column Hide & Show
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">Persisted</span>
          </div>

          <div className="p-1 space-y-0.5">
            {columnOptions.map((opt) => {
              const isChecked = !!columns[opt.key];
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggle(opt.key)}
                  className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-medium text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <span className="truncate">{opt.label}</span>
                  <div
                    className={`size-4 rounded border flex items-center justify-center transition-colors shrink-0 ml-2 ${
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
