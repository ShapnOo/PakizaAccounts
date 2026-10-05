import React, { useState, useRef, useEffect } from 'react';
import { CURRENCY_MASTER } from '../../mock/currencyMaster';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

interface CountryPickerProps {
  value: string;
  onChange: (country: string) => void;
  error?: string;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const countries = Array.from(new Set(CURRENCY_MASTER.map((c) => c.country))).sort();

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <label className="text-[12px] font-bold text-foreground flex items-center justify-between">
        <span>Region / Country <span className="text-rose-500">*</span></span>
        <span className="text-[10px] text-muted-foreground font-normal italic">
          (RegionCountry/Region)
        </span>
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground flex items-center justify-between outline-none transition-all cursor-pointer shadow-2xs ${
          error
            ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
            : 'border-border focus:ring-1 focus:ring-indigo-500'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="size-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">{value || '-- Select Country/Region --'}</span>
        </div>
        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
      </button>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}

      {open && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-card rounded-xl border border-border shadow-xl p-2 space-y-2 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto sidebar-scroll space-y-0.5 max-h-48 pr-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No country found
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                    value === country
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{country}</span>
                  {value === country && <Check className="size-3.5 text-indigo-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
