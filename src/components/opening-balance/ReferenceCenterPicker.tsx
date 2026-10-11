import React, { useState, useEffect, useRef } from 'react';
import { SubledgerEntry } from '../../types/subledger';
import { listSubledger } from '../../services/subledgerService';
import { ChevronDown, Check, X, Search, FileText } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface ReferenceCenterPickerProps {
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const ReferenceCenterPicker: React.FC<ReferenceCenterPickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SubledgerEntry[]>([]);
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
    listSubledger('reference-center').then((data) => {
      if (active) {
        setItems(data.filter((d) => d.activeStatus === 'Active'));
      }
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

  const selectedItem = items.find((it) => it.name === value || it.id === value);
  const displayLabel = selectedItem ? selectedItem.name : value || '';

  const filtered = items.filter((it) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      it.name.toLowerCase().includes(q) ||
      (it.code ? it.code.toLowerCase().includes(q) : false) ||
      it.id.toLowerCase().includes(q)
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
          {displayLabel ? (
            <span className="truncate font-medium text-foreground">{displayLabel}</span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">Select Reference Center...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {displayLabel && !disabled && (
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
          className={`absolute z-50 left-0 w-full min-w-[260px] max-w-[360px] bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
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
              placeholder="Search reference center..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7 pl-8 pr-2.5 text-xs bg-muted/40 rounded-md border border-border/80 outline-none focus:ring-1 focus:ring-indigo-500 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="max-h-48 overflow-y-auto sidebar-scroll space-y-0.5">
            {filtered.length === 0 ? (
              <div className="py-2.5 text-center text-xs text-muted-foreground">
                No reference centers found
              </div>
            ) : (
              filtered.map((it) => {
                const isSelected = it.name === value || it.id === value;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => {
                      onChange(it.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2 py-1.5 rounded-md text-left text-xs transition-colors flex items-center justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1 truncate flex items-center gap-1.5">
                      <FileText className="size-3 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground truncate">{it.name}</span>
                      {it.code && (
                        <span className="font-mono text-[10.5px] text-muted-foreground shrink-0">
                          ({it.code})
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
