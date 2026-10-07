import React, { useState, useRef, useEffect } from 'react';
import { Account, HierarchyLevel } from '../../types/coa';
import { formatAccountCode } from '../../lib/accountCode';
import { Search, ChevronDown, Check, FolderTree, AlertCircle, X } from 'lucide-react';

interface ParentAccountPickerProps {
  accounts: Account[];
  value: string | null;
  onChange: (id: string | null) => void;
  currentAccountId?: string; // exclude self and descendants when editing
  className?: string;
  error?: string;
}

export const ParentAccountPicker: React.FC<ParentAccountPickerProps> = ({
  accounts,
  value,
  onChange,
  currentAccountId,
  className = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter out current account and its descendants (to prevent cyclic parents)
  const isDescendant = (acc: Account, targetId?: string): boolean => {
    if (!targetId) return false;
    if (acc.id === targetId) return true;
    if (!acc.parentId) return false;
    const parent = accounts.find((a) => a.id === acc.parentId);
    return parent ? isDescendant(parent, targetId) : false;
  };

  const eligibleAccounts = accounts.filter((a) => {
    if (currentAccountId && (a.id === currentAccountId || isDescendant(a, currentAccountId))) {
      return false;
    }
    return true;
  });

  const filteredAccounts = eligibleAccounts.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.code.includes(term) ||
      a.path.some((p) => p.toLowerCase().includes(term))
    );
  });

  const selectedAccount = accounts.find((a) => a.id === value);

  const getLevelColor = (level: HierarchyLevel) => {
    switch (level) {
      case 1:
        return 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-600/20';
      case 2:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 3:
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 4:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 5:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 6:
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-9 px-3 rounded-lg border bg-card flex items-center justify-between text-xs transition-all cursor-pointer shadow-2xs hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          error ? 'border-rose-500/80 ring-2 ring-rose-500/10' : 'border-border/80'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <FolderTree className="size-3.5 text-muted-foreground shrink-0" />
          {selectedAccount ? (
            <div className="flex items-center gap-2 truncate">
              <span
                className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${getLevelColor(
                  selectedAccount.level
                )}`}
              >
                L{selectedAccount.level}
              </span>
              <span className="font-bold text-foreground truncate">{selectedAccount.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground/70 truncate hidden sm:inline">
                ({formatAccountCode(selectedAccount.code)})
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/70 font-normal">
              Select Parent Group / Subgroup / Control...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {selectedAccount && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Clear Parent Selection"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full min-w-[320px] max-w-[500px] bg-popover rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Bar */}
          <div className="p-2 border-b border-border/60 bg-muted/20">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search account name, code, path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-card border border-border/80 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Account Tree Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 sidebar-scroll">
            {filteredAccounts.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No matching accounts found
              </div>
            ) : (
              filteredAccounts.map((acc) => {
                const isSelected = acc.id === value;
                const isFixedLevel = acc.level === 1; // Level 1 is fixed (Group Name Level 2 cannot be created)
                const isMaxDepthReached = acc.level >= 6; // Level 6 cannot have child
                const isDisabled = isFixedLevel || isMaxDepthReached;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onChange(acc.id);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-muted/20'
                        : isSelected
                        ? 'bg-primary/10 text-primary font-bold cursor-pointer'
                        : 'hover:bg-muted/60 text-foreground cursor-pointer'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate pr-2">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${getLevelColor(
                            acc.level
                          )}`}
                        >
                          L{acc.level}
                        </span>
                        <span className="font-semibold truncate">{acc.name}</span>
                        {isMaxDepthReached && (
                          <span className="text-[9.5px] font-normal text-rose-500 italic shrink-0">
                            (Max depth L6 - cannot have child)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate pl-1">
                        {acc.path.join(' > ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] text-muted-foreground/80">
                        {formatAccountCode(acc.code)}
                      </span>
                      {isSelected && <Check className="size-3.5 text-primary stroke-[2.5]" />}
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
