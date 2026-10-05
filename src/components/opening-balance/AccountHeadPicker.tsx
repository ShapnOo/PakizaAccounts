import React, { useState, useEffect, useRef } from 'react';
import { AccountOption } from '../../types/openingBalance';
import { listAccounts } from '../../services/accountsService';
import { Search, ChevronDown, Check, FolderTree, X } from 'lucide-react';

interface AccountHeadPickerProps {
  value: string;
  onChange: (id: string, name?: string) => void;
  error?: boolean;
  autoFocus?: boolean;
}

export const AccountHeadPicker: React.FC<AccountHeadPickerProps> = ({
  value,
  onChange,
  error,
  autoFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listAccounts().then((data) => {
      if (active) {
        setAccounts(data);
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

  const selectedAccount = accounts.find((a) => a.id === value);

  const filteredAccounts = accounts.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = a.name.toLowerCase().includes(q);
    const codeMatch = a.code?.toLowerCase().includes(q);
    const pathMatch = a.path?.some((p) => p.toLowerCase().includes(q));
    return nameMatch || codeMatch || pathMatch;
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        autoFocus={autoFocus}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-8 px-2.5 rounded-md border text-left text-xs font-semibold flex items-center justify-between gap-1.5 transition-all outline-none cursor-pointer ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-800'
            : isOpen
            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-background'
            : 'border-border/80 bg-background text-foreground hover:border-foreground/40'
        }`}
      >
        <span className="truncate flex-1">
          {selectedAccount ? (
            <span className="flex items-center gap-1.5">
              {selectedAccount.code && (
                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1 py-0.2 rounded font-normal">
                  {selectedAccount.code}
                </span>
              )}
              <span className="font-medium text-foreground">{selectedAccount.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-normal">Select Account Head...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedAccount && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('', '');
              }}
              className="p-0.5 hover:text-foreground rounded cursor-pointer"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown className="size-3" />
        </div>
      </button>

      {/* Dropdown Menu with Search and Breadcrumb Paths */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full min-w-[280px] max-w-[420px] bg-popover rounded-xl border border-border shadow-xl p-1.5 animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="relative mb-1.5">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search account name, code, or hierarchy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-muted/40 rounded-lg border border-border/80 outline-none focus:ring-1 focus:ring-indigo-500 text-foreground"
            />
          </div>

          <div className="max-h-56 overflow-y-auto sidebar-scroll space-y-0.5">
            {loading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">Loading accounts...</div>
            ) : filteredAccounts.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">No accounts match search</div>
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
                      setSearch('');
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {acc.code && (
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1 rounded font-normal">
                            {acc.code}
                          </span>
                        )}
                        <span className="font-medium text-foreground truncate">{acc.name}</span>
                      </div>
                      {acc.path && acc.path.length > 0 && (
                        <div className="text-[10px] text-muted-foreground/75 truncate mt-0.5 flex items-center gap-1">
                          <FolderTree className="size-2.5 shrink-0 opacity-60" />
                          <span>{acc.path.join(' › ')}</span>
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="size-3.5 text-indigo-600 shrink-0 mt-0.5" />}
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
