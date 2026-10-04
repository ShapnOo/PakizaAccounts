import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, FolderTree, Building } from 'lucide-react';
import { mockAccountTree, findAccountById } from '../../data/mockAccountTree';
import { AccountNode } from '../../types/config';

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

  const selectedNode = useMemo(() => findAccountById(value), [value]);

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

  // Flattened selectable accounts matching search query
  const filteredAccounts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: { group: string; node: AccountNode }[] = [];

    function traverse(nodes: AccountNode[], groupName: string) {
      for (const node of nodes) {
        const currentGroup = node.children ? node.name : groupName;
        if (node.isSelectable) {
          if (!q || node.name.toLowerCase().includes(q) || node.code.includes(q)) {
            result.push({ group: groupName, node });
          }
        }
        if (node.children) {
          traverse(node.children, currentGroup);
        }
      }
    }

    traverse(mockAccountTree, 'General Accounts');
    return result;
  }, [searchQuery]);

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
            selectedNode
              ? 'bg-card border-border/90 text-foreground shadow-2xs hover:border-border'
              : 'bg-muted/20 border-border/60 text-muted-foreground hover:border-border'
          } ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
        >
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            {selectedNode ? (
              <>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0 border border-primary/20">
                  {selectedNode.code}
                </span>
                <span className="truncate font-semibold text-foreground text-[12px]">
                  {selectedNode.name.replace(/^[0-9]+\s*-\s*/, '')}
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
            {selectedNode && (
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
          <div className="absolute left-0 right-0 top-10 z-50 bg-card border border-border/80 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-2 border-b border-border/40 flex items-center gap-2 bg-muted/30">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search account code or name..."
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

            {/* List of Accounts */}
            <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 sidebar-scroll">
              {filteredAccounts.map(({ group, node }) => {
                const isSelected = node.id === value;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      onChange(node.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'hover:bg-muted/60 text-foreground/85'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground/80 shrink-0">
                        {node.code}
                      </span>
                      <span className="truncate">{node.name.replace(/^[0-9]+\s*-\s*/, '')}</span>
                    </div>
                    {isSelected && <Check className="size-3.5 text-primary shrink-0 ml-2" />}
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
