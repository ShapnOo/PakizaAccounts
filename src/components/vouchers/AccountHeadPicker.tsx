import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const { openUpward, maxHeight, coords } = useDropdownPosition({
    triggerRef: popoverRef,
    isOpen,
    minMenuHeight: 250,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
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
              <span className="font-mono text-[10px] text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-normal border border-slate-200/80 dark:border-slate-700 shrink-0">
                {selectedAccount.manualCode || formatAccountCode(selectedAccount.code)}
              </span>
              <span className="font-semibold text-foreground truncate">{selectedAccount.name}</span>
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

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: openUpward ? undefined : coords.bottom + 4,
              bottom: openUpward ? Math.max(8, window.innerHeight - coords.top + 4) : undefined,
              left: Math.max(8, Math.min(coords.left, window.innerWidth - Math.max(coords.width, 420) - 16)),
              width: Math.max(coords.width, 420),
              maxWidth: Math.min(680, window.innerWidth - 16),
              maxHeight,
              zIndex: 99999,
            }}
            className="bg-popover rounded-xl border border-border shadow-2xl p-1.5 overflow-hidden transition-all animate-in fade-in-50 zoom-in-95"
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
                      <div className="truncate pr-2 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-mono text-[10px] text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-normal border border-slate-200/80 dark:border-slate-700 shrink-0">
                            {acc.manualCode || formatAccountCode(acc.code)}
                          </span>
                          <span className="font-semibold text-foreground truncate">{acc.name}</span>
                        </div>
                        {acc.path && acc.path.length > 0 && (
                          <div className="text-[10px] text-muted-foreground/80 truncate mt-0.5 flex items-center gap-1">
                            <FolderTree className="size-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{acc.path.join(' › ')}</span>
                          </div>
                        )}
                      </div>
                      {isSelected && <Check className="size-3 text-primary stroke-[2.5] shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
