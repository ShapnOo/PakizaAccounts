import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, FolderTree } from 'lucide-react';
import { useCoa } from '../../context/CoaContext';
import { INITIAL_ACCOUNTS } from '../../mock/accounts';
import { mockAccountTree, findAccountById } from '../../data/mockAccountTree';
import { AccountNode } from '../../types/config';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

export interface PickerAccountItem {
  id: string;
  code: string;
  name: string;
  pathText: string;
}

interface AccountPickerProps {
  label?: string;
  required?: boolean;
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  badge?: string;
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  label,
  required,
  value,
  onChange,
  placeholder = 'Select Account Head...',
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openUpward, maxHeight } = useDropdownPosition({
    triggerRef: containerRef,
    isOpen,
    minMenuHeight: 250,
  });

  // Get rich accounts from CoaContext
  let coaAccounts = INITIAL_ACCOUNTS;
  try {
    const coa = useCoa();
    if (coa?.accounts && coa.accounts.length > 0) {
      coaAccounts = coa.accounts;
    }
  } catch {
    // fallback to INITIAL_ACCOUNTS
  }

  // Build unified list of accounts with full hierarchy paths
  const allAccounts = useMemo<PickerAccountItem[]>(() => {
    const list: PickerAccountItem[] = [];
    const seenIds = new Set<string>();

    // 1. Add COA accounts (with real paths e.g. Assets > Current Assets > ...)
    for (const acc of coaAccounts) {
      if (!seenIds.has(acc.id)) {
        seenIds.add(acc.id);
        const rawCode = acc.manualCode || acc.code.replace(/^0+/, '') || acc.code;
        const dedupedPath = (acc.path || []).filter(
          (seg, idx, arr) => idx === 0 || seg !== arr[idx - 1]
        );
        list.push({
          id: acc.id,
          code: rawCode,
          name: acc.name,
          pathText: dedupedPath.join(' › '),
        });
      }
    }

    // 2. Add mockAccountTree items if not already present
    function traverseTree(nodes: AccountNode[], path: string[]) {
      for (const node of nodes) {
        const cleanName = node.name.replace(/^[0-9]+\s*-\s*/, '');
        const currentPath = [...path, cleanName];
        if (node.isSelectable && !seenIds.has(node.id)) {
          seenIds.add(node.id);
          list.push({
            id: node.id,
            code: node.code,
            name: cleanName,
            pathText: path.join(' › '),
          });
        }
        if (node.children) {
          traverseTree(node.children, currentPath);
        }
      }
    }

    traverseTree(mockAccountTree, ['Chart of Accounts']);
    return list;
  }, [coaAccounts]);

  // Find currently selected account
  const selectedItem = useMemo(() => {
    if (!value) return null;
    return (
      allAccounts.find(
        (a) =>
          a.id === value ||
          a.code === value ||
          a.code.replace(/^0+/, '') === value ||
          a.id.endsWith(value)
      ) || null
    );
  }, [allAccounts, value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered accounts based on search query
  const filteredAccounts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allAccounts;

    return allAccounts.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.pathText.toLowerCase().includes(q)
    );
  }, [allAccounts, searchQuery]);

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-bold text-foreground/85">
              {label}
            </span>
            {required && <span className="text-rose-500 font-black text-xs leading-none">*</span>}
          </div>
          {badge && (
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-1.5 py-0.2 rounded bg-muted/60">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-8.5 px-3 flex items-center justify-between gap-2 rounded-lg border text-left text-xs transition-all duration-150 cursor-pointer ${
            selectedItem
              ? 'bg-card border-border/90 text-foreground shadow-2xs hover:border-border'
              : 'bg-muted/20 border-border/60 text-muted-foreground hover:border-border'
          } ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
        >
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            {selectedItem ? (
              <>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0 border border-primary/20">
                  {selectedItem.code}
                </span>
                <span className="truncate font-semibold text-foreground text-[12px]">
                  {selectedItem.name}
                </span>
              </>
            ) : (
              <>
                <FolderTree className="size-3.5 shrink-0 text-muted-foreground/50" />
                <span className="text-muted-foreground/60 font-medium text-xs">
                  {placeholder}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedItem && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors"
                title="Clear selection"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronDown className={`size-3.5 text-muted-foreground/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div
            style={{ maxHeight }}
            className={`absolute left-0 right-0 z-50 min-w-[320px] bg-card border border-border/80 rounded-xl shadow-2xl overflow-hidden transition-all ${
              openUpward
                ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
                : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
            }`}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-border/40 flex items-center gap-2 bg-muted/30">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search account code, name, or path..."
                className="w-full bg-transparent text-xs outline-none text-foreground font-semibold placeholder:text-muted-foreground/60 placeholder:font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* List of Accounts with path and code badge */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 sidebar-scroll">
              {filteredAccounts.map((item) => {
                const isSelected = item.id === value || item.code === value;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'hover:bg-muted/60 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      {/* Line 1: Code Badge + Account Name */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-muted/80 text-foreground/85 shrink-0 border border-border/70 shadow-2xs">
                          {item.code}
                        </span>
                        <span className="font-bold text-xs text-foreground truncate">
                          {item.name}
                        </span>
                      </div>

                      {/* Line 2: FolderTree Icon + Breadcrumb Path */}
                      {item.pathText && (
                        <div className="text-[10.5px] text-muted-foreground truncate mt-1 flex items-center gap-1.5">
                          <FolderTree className="size-3 text-muted-foreground/60 shrink-0" />
                          <span className="truncate">{item.pathText}</span>
                        </div>
                      )}
                    </div>

                    {isSelected && <Check className="size-4 text-primary shrink-0 mt-1" />}
                  </button>
                );
              })}

              {filteredAccounts.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No accounts found matching query.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
