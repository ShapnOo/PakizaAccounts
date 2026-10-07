import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, Search, X, Building2 } from 'lucide-react';
import { Company } from '../../types/subledger';
import { listCompanies } from '../../services/companyService';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface CompanyMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export const CompanyMultiSelect: React.FC<CompanyMultiSelectProps> = ({
  value = [],
  onChange,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 250,
  });

  useEffect(() => {
    let mounted = true;
    listCompanies()
      .then((data) => {
        if (mounted) {
          setCompanies(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load companies', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCompanies = companies.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCompany = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeCompany = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter((item) => item !== id));
  };

  const selectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(companies.map((c) => c.id));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Combobox Trigger Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={[
          'min-h-[42px] w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-200 flex items-center justify-between gap-2',
          disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
            : 'bg-white cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600',
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-300',
        ].join(' ')}
      >
        <div className="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
          {value.length === 0 ? (
            <span className="text-slate-400 text-sm select-none">
              Select effective company...
            </span>
          ) : (
            value.map((id) => {
              const comp = companies.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs group"
                >
                  <Building2 className="size-3 text-slate-500" />
                  <span className="font-bold text-indigo-700">{id}</span>
                  {comp && (
                    <span className="max-w-[120px] truncate text-slate-600 font-normal">
                      · {comp.name.replace(/Pakiza\s*/i, '')}
                    </span>
                  )}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeCompany(id, e)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full transition-colors"
                      title="Remove"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </span>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={clearAll}
              className="p-1 hover:text-slate-600 rounded-md transition-colors"
              title="Clear all"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 right-0 bg-card rounded-xl border border-border shadow-2xl overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-0 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-0 zoom-in-95'
          }`}
        >
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
            <Search className="size-3.5 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name or code..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Quick Select Actions */}
          <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {value.length} of {companies.length} selected
            </span>
            <div className="flex items-center gap-2 font-medium">
              <button
                type="button"
                onClick={selectAll}
                className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Company List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Loading companies...
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No company matches &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredCompanies.map((comp) => {
                const isSelected = value.includes(comp.id);
                return (
                  <div
                    key={comp.id}
                    onClick={(e) => toggleCompany(comp.id, e)}
                    className={[
                      'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors select-none',
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={[
                          'size-4 rounded border flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white',
                        ].join(' ')}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 mr-1.5">
                          {comp.id}
                        </span>
                        <span className="text-slate-600 font-normal">
                          — {comp.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/60 px-1.5 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
