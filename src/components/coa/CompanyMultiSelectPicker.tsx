import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, CheckSquare, Square, X } from 'lucide-react';

export const COMPANY_OPTIONS = [
  'Pakiza Software Ltd.',
  'Pakiza Knit Composite Ltd.',
  'Pakiza Cotton Spinning Mills Ltd.',
  'Pakiza Dyeing & Printing Industries Ltd.',
  'Pakiza Apparels Ltd.',
];

interface CompanyMultiSelectPickerProps {
  value?: string; // e.g. "Pakiza Software Ltd., Pakiza Knit Composite Ltd."
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export const CompanyMultiSelectPicker: React.FC<CompanyMultiSelectPickerProps> = ({
  value = 'Pakiza Software Ltd.',
  onChange,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse string value into array of selected company names
  const selectedArray = value
    ? value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleCompany = (compName: string) => {
    let next: string[];
    if (selectedArray.includes(compName)) {
      next = selectedArray.filter((c) => c !== compName);
    } else {
      next = [...selectedArray, compName];
    }
    onChange(next.join(', '));
  };

  const isAllSelected = COMPANY_OPTIONS.every((c) => selectedArray.includes(c));

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Keep at least the first default if user unchecks all
      onChange(COMPANY_OPTIONS[0]);
    } else {
      onChange(COMPANY_OPTIONS.join(', '));
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button / Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[36px] p-1.5 px-3 rounded-lg bg-card border text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer shadow-2xs transition-all ${
          error ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-border/80 hover:border-border'
        } ${disabled ? 'bg-muted/40 cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          <Building2 className="size-3.5 text-primary shrink-0" />

          {selectedArray.length === 0 ? (
            <span className="text-muted-foreground/60 italic">-- Select Company --</span>
          ) : selectedArray.length === COMPANY_OPTIONS.length ? (
            <span className="inline-flex items-center gap-1 font-bold text-primary">
              All Companies Selected ({COMPANY_OPTIONS.length})
            </span>
          ) : (
            selectedArray.map((comp) => (
              <span
                key={comp}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold"
              >
                <span>{comp.replace(/Pakiza\s*/i, '')}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCompany(comp);
                  }}
                  className="hover:text-rose-500 transition-colors"
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

      {error && <p className="text-[10.5px] font-medium text-rose-500 mt-1">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-xl p-1.5 space-y-1 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Select All Row */}
          <div
            onClick={handleSelectAll}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted font-bold text-foreground cursor-pointer transition-colors border-b border-border/50 pb-1.5 mb-1"
          >
            <div className="flex items-center gap-2">
              {isAllSelected ? (
                <CheckSquare className="size-3.5 text-primary" />
              ) : (
                <Square className="size-3.5 text-muted-foreground" />
              )}
              <span>Select All Companies</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {selectedArray.length} / {COMPANY_OPTIONS.length}
            </span>
          </div>

          {/* Individual Companies */}
          {COMPANY_OPTIONS.map((comp) => {
            const isSelected = selectedArray.includes(comp);
            return (
              <div
                key={comp}
                onClick={() => handleToggleCompany(comp)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'hover:bg-muted text-foreground/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-3.5 rounded border grid place-items-center transition-colors ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border bg-card'
                    }`}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                  <span>{comp}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyMultiSelectPicker;
