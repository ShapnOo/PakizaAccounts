import React, { useState, useRef, useEffect } from 'react';
import { useCoa } from '../../context/CoaContext';
import { INITIAL_ACCOUNTS } from '../../mock/accounts';
import { filterForReceivable } from '../../lib/coa/filterForReceivable';
import { Landmark, ChevronDown, Check, Search, X } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface AccountsReceivablePickerProps {
  value: string | null;
  onChange: (accountId: string | null) => void;
  error?: string;
}

export const AccountsReceivablePicker: React.FC<AccountsReceivablePickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen: open,
    minMenuHeight: 220,
  });

  // Safely access COA context or fallback
  let allAccounts = INITIAL_ACCOUNTS;
  try {
    const coa = useCoa();
    if (coa && coa.accounts) allAccounts = coa.accounts;
  } catch (e) {
    // outside provider fallback
  }

  const receivableAccounts = filterForReceivable(allAccounts);
  const selectedAccount = allAccounts.find((a) => a.id === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = receivableAccounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.includes(search)
  );

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Landmark className="size-3 text-indigo-600" />
          <span>Accounts Receivable</span>
        </label>
        <span className="text-[10px] text-muted-foreground font-mono">
          [COA: Trade & Others Receivable]
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground flex items-center justify-between outline-none transition-all cursor-pointer shadow-2xs ${
            error
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        >
          <span className="truncate">
            {selectedAccount
              ? `${selectedAccount.code} — ${selectedAccount.name}`
              : '-- Select Receivable Account (Optional) --'}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear selection"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
          </div>
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}

      {open && (
        <div
          style={{ maxHeight }}
          className={`absolute left-0 right-0 z-50 bg-card rounded-xl border border-border shadow-2xl p-2 space-y-2 overflow-hidden flex flex-col transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in zoom-in-95'
          }`}
        >
          <div className="relative">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder="Search by code or account name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto sidebar-scroll space-y-0.5 max-h-48 pr-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No matching receivable accounts found
              </div>
            ) : (
              filtered.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    onChange(acc.id);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                    value === acc.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-muted-foreground mr-1.5">
                      {acc.code}
                    </span>
                    <span>{acc.name}</span>
                  </div>
                  {value === acc.id && (
                    <Check className="size-3.5 text-indigo-600 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
