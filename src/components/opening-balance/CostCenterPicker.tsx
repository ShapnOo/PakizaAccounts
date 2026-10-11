import React, { useState, useEffect, useRef } from 'react';
import { SimpleMasterOption } from '../../types/openingBalance';
import { listCostCenters } from '../../services/costCentersService';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface CostCenterPickerProps {
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export const CostCenterPicker: React.FC<CostCenterPickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SimpleMasterOption[]>([]);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 220,
  });

  useEffect(() => {
    let active = true;
    listCostCenters().then((data) => {
      if (active) setItems(data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const selectedItem = items.find((c) => c.id === value);

  const filtered = items.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.code ? c.code.toLowerCase().includes(q) : false) ||
      c.id.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-8 px-2.5 rounded-md border text-left text-xs font-semibold flex items-center justify-between gap-1.5 transition-all outline-none cursor-pointer ${
          disabled
            ? 'opacity-60 bg-muted cursor-not-allowed border-border'
            : isOpen
            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-background'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40'
        }`}
      >
        <span className="truncate flex-1">
          {selectedItem ? (
            <span className="truncate font-medium text-foreground">
              {selectedItem.name}{' '}
              {selectedItem.code && (
                <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  ({selectedItem.code})
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">Select Cost Center...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedItem && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Clear"
              className="p-0.5 hover:text-foreground rounded cursor-pointer"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 w-full min-w-[240px] max-w-[340px] bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          <div className="relative mb-1.5">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search cost center name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7 pl-8 pr-2.5 text-xs bg-muted/40 rounded-md border border-border/80 outline-none focus:ring-1 focus:ring-indigo-500 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="max-h-48 overflow-y-auto sidebar-scroll space-y-0.5">
            {filtered.length === 0 ? (
              <div className="py-2.5 text-center text-xs text-muted-foreground">
                No cost centers found
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.id === value;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2 py-1.5 rounded-md text-left text-xs transition-colors flex items-center justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1 truncate">
                      <span className="font-medium text-foreground">{c.name}</span>{' '}
                      {c.code && (
                        <span className="font-mono text-[10.5px] text-muted-foreground">
                          ({c.code})
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="size-3.5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
