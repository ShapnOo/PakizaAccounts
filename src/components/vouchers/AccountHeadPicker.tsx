import React, { useState, useRef, useEffect } from 'react';
import { useCoa } from '../../context/CoaContext';
import { formatAccountCode } from '../../lib/accountCode';
import { Search, ChevronDown, Check, X, Landmark, Wallet, FolderTree } from 'lucide-react';
import { Account } from '../../types/coa';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface AccountHeadPickerProps {
  value?: string;
  onChange: (accountId: string, accountName: string) => void;
  onlyCashAndBank?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const AccountHeadPicker: React.FC<AccountHeadPickerProps> = ({
  value,
  onChange,
  onlyCashAndBank = false,
  placeholder = 'Select Account...',
  className = '',
  error,
}) => {
  const { accounts } = useCoa();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: popoverRef,
    isOpen,
    minMenuHeight: 250,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    // If onlyCashAndBank, restrict to Cash & Bank
    if (onlyCashAndBank) {
      const isCashBankType =
        acc.accountsType === 'Cash & Cash Equivalent' ||
        acc.detailsType === 'Bank' ||
        acc.detailsType === 'Cash' ||
        acc.path.some((p) => p.toLowerCase().includes('cash') || p.toLowerCase().includes('bank'));
      if (!isCashBankType) return false;
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      const matchName = acc.name.toLowerCase().includes(term);
      const matchCode = acc.code.includes(term);
      const matchManual = acc.manualCode && acc.manualCode.includes(term);
      const matchPath = acc.path.some((p) => p.toLowerCase().includes(term));
      return matchName || matchCode || matchManual || matchPath;
    }

    return true;
  });

  const selectedAccount = accounts.find((a) => a.id === value);

  return (
    <div className={`relative w-full ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-8.5 px-2.5 rounded-lg border bg-card flex items-center justify-between text-xs transition-all cursor-pointer shadow-2xs hover:border-primary/50 outline-none focus:ring-1 focus:ring-primary ${
          error ? 'border-rose-500/80 ring-1 ring-rose-500/20' : 'border-border/80'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {onlyCashAndBank ? (
            <Wallet className="size-3.5 text-primary shrink-0" />
          ) : (
            <FolderTree className="size-3.5 text-muted-foreground shrink-0" />
          )}
          {selectedAccount ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-mono text-[10.5px] font-bold text-muted-foreground/80">
                {selectedAccount.manualCode || formatAccountCode(selectedAccount.code)}
              </span>
              <span className="text-muted-foreground/50">::</span>
              <span className="font-bold text-foreground truncate">{selectedAccount.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground/60">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`size-3 text-muted-foreground transition-transform duration-150 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          style={{ maxHeight }}
          className={`absolute z-50 left-0 w-full min-w-[300px] max-w-[420px] bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
              : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
          }`}
        >
          <div className="relative mb-1.5">
            <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder={
                onlyCashAndBank ? 'Search Cash & Bank accounts...' : 'Search accounts head...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-7.5 pl-7 pr-2.5 rounded-md bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60"
            />
          </div>

          {onlyCashAndBank && (
            <div className="px-2 py-1 mb-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded flex items-center gap-1">
              <span>Restricted: Cash & Bank accounts only</span>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5 sidebar-scroll">
            {filteredAccounts.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No matching accounts found
              </div>
            ) : (
              filteredAccounts.map((acc) => {
                const isSelected = acc.id === value;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      onChange(acc.id, acc.name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                          {acc.manualCode || formatAccountCode(acc.code)}
                        </span>
                        <span className="font-medium truncate">{acc.name}</span>
                      </div>
                      <div className="text-[9.5px] text-muted-foreground truncate pl-1">
                        {acc.path.slice(0, -1).join(' > ')}
                      </div>
                    </div>
                    {isSelected && <Check className="size-3 text-primary stroke-[2.5] shrink-0" />}
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
