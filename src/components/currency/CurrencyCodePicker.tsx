import React, { useState, useEffect, useRef } from 'react';
import { CurrencyMaster } from '../../types/currency';
import { listCurrencyMaster } from '../../services/currencyMasterService';
import { Search, ChevronDown, Check, Globe, X } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface CurrencyCodePickerProps {
  value: string;
  onChange: (master: CurrencyMaster) => void;
  disabled?: boolean;
}

export const CurrencyCodePicker: React.FC<CurrencyCodePickerProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [masterList, setMasterList] = useState<CurrencyMaster[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 280,
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    listCurrencyMaster().then((data) => {
      if (active) {
        setMasterList(data);
        setLoading(false);
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
    }
  }, [isOpen]);

  const selectedCurrency = masterList.find((c) => c.code === value);

  const filtered = masterList.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.currencyName.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 rounded-lg border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all outline-none ${
          disabled
            ? 'bg-muted/40 text-muted-foreground border-border/50 cursor-not-allowed select-none'
            : isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-background'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40 cursor-pointer'
        }`}
      >
        <span className="truncate flex-1">
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span className="font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-200/60">
                {selectedCurrency.code}
              </span>
              <span className="text-foreground font-semibold">{selectedCurrency.country}</span>
              <span className="text-muted-foreground font-normal">({selectedCurrency.currencyName})</span>
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">
              Select Currency Code (e.g. BDT, USD, EUR)...
            </span>
          )}
        </span>

        {!disabled && <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />}
      </button>

      {/* Searchable Combobox with 200+ currencies */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 w-full min-w-[320px] bg-popover rounded-xl border border-border shadow-xl p-2 ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95 duration-100'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95 duration-100'
          }`}
        >
          <div className="relative mb-2">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search code, country, or currency name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-muted/40 rounded-lg border border-border/80 outline-none focus:ring-1 focus:ring-indigo-500 text-foreground"
            />
          </div>

          <div
            className="overflow-y-auto sidebar-scroll space-y-0.5"
            style={{ maxHeight: `${Math.max(160, maxHeight - 60)}px` }}
          >
            {loading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">Loading master list…</div>
            ) : filtered.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">No matching currencies found</div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.code === value;
                return (
                  <button
                    key={`${item.code}-${item.country}`}
                    type="button"
                    onClick={() => {
                      onChange(item);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded text-[11px]">
                        {item.code}
                      </span>
                      <span className="font-semibold text-foreground truncate">{item.country}</span>
                      <span className="text-muted-foreground font-normal text-[11px] truncate">
                        ({item.currencyName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {item.symbol}
                      </span>
                      {isSelected && <Check className="size-3.5 text-indigo-600" />}
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
