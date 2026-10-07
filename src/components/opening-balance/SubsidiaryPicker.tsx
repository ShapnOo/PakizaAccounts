import React, { useState, useEffect, useRef } from 'react';
import { SubsidiaryOption, SubsidiaryPartyType } from '../../types/openingBalance';
import { listSubsidiaries } from '../../services/subsidiariesService';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface SubsidiaryPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export const SubsidiaryPicker: React.FC<SubsidiaryPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryOption[]>([]);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 220,
  });

  useEffect(() => {
    let active = true;
    listSubsidiaries().then((data) => {
      if (active) setSubsidiaries(data);
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

  const selectedSubsidiary = subsidiaries.find((s) => s.id === value);

  const getPartyTagBadge = (partyType: SubsidiaryPartyType) => {
    switch (partyType) {
      case 'Vendor':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 shrink-0">
            Vendor
          </span>
        );
      case 'Customer':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 shrink-0">
            Customer
          </span>
        );
      case 'Other':
      default:
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 shrink-0">
            Other
          </span>
        );
    }
  };

  const filtered = subsidiaries.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.partyType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-8 px-2 rounded-md border text-left text-xs font-semibold flex items-center justify-between gap-1.5 transition-all outline-none cursor-pointer ${
          isOpen
            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-background'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40'
        }`}
      >
        <span className="truncate flex-1 flex items-center gap-1.5">
          {selectedSubsidiary ? (
            <>
              <span className="truncate">{selectedSubsidiary.name}</span>
              {getPartyTagBadge(selectedSubsidiary.partyType)}
            </>
          ) : (
            <span className="text-muted-foreground/60 font-normal">Select Subsidiary...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedSubsidiary && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:text-foreground rounded cursor-pointer"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown className="size-3" />
        </div>
      </button>

      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 w-full min-w-[240px] max-w-[320px] bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          <div className="relative mb-1.5">
            <Search className="size-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7 pl-7 pr-2 text-xs bg-muted/40 rounded-md border border-border/80 outline-none text-foreground"
            />
          </div>

          <div className="max-h-48 overflow-y-auto sidebar-scroll space-y-0.5">
            {filtered.length === 0 ? (
              <div className="py-2 text-center text-xs text-muted-foreground">No parties found</div>
            ) : (
              filtered.map((s) => {
                const isSelected = s.id === value;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onChange(s.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2 py-1.5 rounded-md text-left text-xs transition-colors flex items-center justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <span className="truncate flex-1">{s.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getPartyTagBadge(s.partyType)}
                      {isSelected && <Check className="size-3 text-indigo-600" />}
                    </div>
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
