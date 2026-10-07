import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, CheckSquare, Square, X } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface AuxMultiSelectPickerProps {
  label: string;
  samples: string[];
  value?: string | string[]; // can be comma-separated or string[]
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const AuxMultiSelectPicker: React.FC<AuxMultiSelectPickerProps> = ({
  label,
  samples,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 200,
  });

  // Parse value into array
  const selectedArray: string[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleItem = (item: string) => {
    let next: string[];
    if (selectedArray.includes(item)) {
      next = selectedArray.filter((c) => c !== item);
    } else {
      next = [...selectedArray, item];
    }
    onChange(next.join(', '));
  };

  const isAllSelected = samples.length > 0 && samples.every((c) => selectedArray.includes(c));

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange('');
    } else {
      onChange(samples.join(', '));
    }
  };

  return (
    <div className="relative w-full pt-1" ref={containerRef}>
      {/* Trigger Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[34px] py-1 px-2.5 rounded-lg bg-background border text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer shadow-2xs transition-all ${
          isOpen ? 'border-primary ring-1 ring-primary/20' : 'border-border/80 hover:border-border'
        } ${disabled ? 'bg-muted/40 cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
          {selectedArray.length === 0 ? (
            <span className="text-muted-foreground/60 italic text-[11.5px]">
              -- Select {label}(s) --
            </span>
          ) : selectedArray.length === samples.length ? (
            <span className="inline-flex items-center gap-1 font-bold text-primary text-[11px]">
              All {label}s Selected ({samples.length})
            </span>
          ) : (
            selectedArray.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold"
              >
                <span className="truncate max-w-[140px]">{item}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleItem(item);
                  }}
                  className="hover:text-rose-500 transition-colors shrink-0"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute left-0 right-0 z-50 bg-popover border border-border rounded-xl shadow-2xl p-1.5 space-y-1 text-xs overflow-y-auto sidebar-scroll transition-all ${
            openUpward
              ? 'bottom-full mb-1 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          {/* Select All */}
          <div
            onClick={handleSelectAll}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted/60 cursor-pointer font-bold text-foreground border-b border-border/40 pb-1.5"
          >
            <div className="flex items-center gap-2">
              {isAllSelected ? (
                <CheckSquare className="size-4 text-primary shrink-0" />
              ) : (
                <Square className="size-4 text-muted-foreground shrink-0" />
              )}
              <span>Select All {label}s</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-normal">
              ({selectedArray.length}/{samples.length})
            </span>
          </div>

          {/* Sample items list */}
          <div className="space-y-0.5 pt-0.5">
            {samples.map((item) => {
              const isSelected = selectedArray.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => handleToggleItem(item)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'hover:bg-muted/50 text-foreground font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`size-4 rounded border grid place-items-center shrink-0 ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/40 bg-background'
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
