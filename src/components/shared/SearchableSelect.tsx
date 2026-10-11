import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  code?: string;
  group?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  value?: string | number | null;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  buttonClassName?: string;
  popoverWidth?: string; // e.g. 'w-full min-w-[260px]'
  allowClear?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
  error = false,
  className = '',
  buttonClassName = '',
  popoverWidth = 'w-full min-w-[240px] max-w-[360px]',
  allowClear = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 200,
  });

  const stringValue = value !== undefined && value !== null ? String(value) : '';
  const selectedOption = options.find((opt) => opt.value === stringValue);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtering
  const filteredOptions = options.filter((opt) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const labelMatch = opt.label.toLowerCase().includes(q);
    const subMatch = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false;
    const codeMatch = opt.code ? opt.code.toLowerCase().includes(q) : false;
    const valueMatch = opt.value.toLowerCase().includes(q);
    const groupMatch = opt.group ? opt.group.toLowerCase().includes(q) : false;
    return labelMatch || subMatch || codeMatch || valueMatch || groupMatch;
  });

  // Grouping if any options have group
  const hasGroups = options.some((opt) => !!opt.group);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-8.5 px-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between gap-1.5 transition-all outline-none cursor-pointer ${
          disabled
            ? 'opacity-60 bg-muted cursor-not-allowed border-border text-muted-foreground'
            : error
            ? 'border-rose-400 bg-rose-50/20 text-rose-800'
            : isOpen
            ? 'border-primary ring-1 ring-primary bg-background text-foreground'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40 shadow-2xs'
        } ${buttonClassName}`}
      >
        <span className="truncate flex-1">
          {selectedOption ? (
            <span className="truncate font-medium text-foreground">
              {selectedOption.label}
              {selectedOption.code && !selectedOption.label.includes(selectedOption.code) && (
                <span className="font-mono text-[10.5px] text-primary ml-1 font-semibold">
                  ({selectedOption.code})
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedOption && allowClear && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Clear selection"
              className="p-0.5 hover:text-foreground rounded cursor-pointer transition-colors"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown
            className={`size-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 ${popoverWidth} bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          {/* Search bar */}
          <div className="relative mb-1.5">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7.5 pl-8 pr-2.5 text-xs bg-muted/40 rounded-md border border-border/80 outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Items */}
          <div className="max-h-52 overflow-y-auto sidebar-scroll space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === stringValue;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-transparent'
                        : isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {opt.group && (
                          <span className="text-[9.5px] uppercase font-bold text-muted-foreground/70 bg-muted px-1 py-0.2 rounded shrink-0">
                            {opt.group}
                          </span>
                        )}
                        <span className="font-medium text-foreground truncate">{opt.label}</span>
                        {opt.code && !opt.label.includes(opt.code) && (
                          <span className="font-mono text-[10.5px] text-primary bg-primary/10 px-1 py-0.2 rounded font-semibold border border-primary/20 shrink-0">
                            ({opt.code})
                          </span>
                        )}
                      </div>
                      {opt.subLabel && (
                        <div className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                          {opt.subLabel}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
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
