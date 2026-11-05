import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Plus, BookOpen } from 'lucide-react';
import { useISCustomizationStore } from '../../stores/isCustomizationStore';
import type { MasterListItem } from '../../types/isCustomization';

interface GroupedMasterDropdownProps {
  value: string;
  onChange: (newLabel: string) => void;
  autoFocus?: boolean;
}

export const GroupedMasterDropdown: React.FC<GroupedMasterDropdownProps> = ({
  value,
  onChange,
  autoFocus = false,
}) => {
  const [isOpen, setIsOpen] = useState(autoFocus);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const masterList = useISCustomizationStore((s) => s.masterList);
  const createMasterItem = useISCustomizationStore((s) => s.createMasterItem);

  // Group master list items by section
  const groupedData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sectionsMap = new Map<string, MasterListItem[]>();

    masterList.forEach((item) => {
      if (item.isSectionHeader) return;
      if (q && !item.label.toLowerCase().includes(q) && !item.section.toLowerCase().includes(q)) {
        return;
      }
      const existing = sectionsMap.get(item.section) || [];
      existing.push(item);
      sectionsMap.set(item.section, existing);
    });

    return Array.from(sectionsMap.entries());
  }, [masterList, search]);

  const exactMatchExists = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return masterList.some(
      (m) => !m.isSectionHeader && m.label.toLowerCase() === q
    );
  }, [masterList, search]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (label: string) => {
    onChange(label);
    setIsOpen(false);
    setSearch('');
  };

  const handleCreateAndSelect = async () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    try {
      await createMasterItem('Income - Operating Income', trimmed);
      handleSelect(trimmed);
    } catch {
      handleSelect(trimmed);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button / Display */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`w-full min-h-[30px] px-2 py-1 rounded-md border text-[13px] flex items-center justify-between gap-1.5 transition cursor-pointer select-none ${
          isOpen
            ? 'border-indigo-500 bg-white ring-1 ring-indigo-500'
            : 'border-transparent hover:border-slate-300 hover:bg-slate-50/80 bg-transparent'
        }`}
      >
        <span
          className={`truncate font-normal ${
            value ? 'text-slate-800' : 'text-slate-400 italic'
          }`}
        >
          {value || 'Select account line...'}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[300px] max-w-[420px] bg-white rounded-lg border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 font-sans">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or type new account..."
                className="w-full h-7 pl-8 pr-7 rounded border border-slate-200 bg-white text-[12px] font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Custom / New Master item option if user typed something new */}
          {search.trim() && !exactMatchExists && (
            <div className="p-1.5 border-b border-slate-100 bg-indigo-50/50">
              <button
                type="button"
                onClick={handleCreateAndSelect}
                className="w-full px-2.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add &quot;{search.trim()}&quot; to Master List & Select</span>
              </button>
            </div>
          )}

          {/* Grouped Options List */}
          <div className="max-h-[260px] overflow-y-auto py-1 text-[13px]">
            {groupedData.length === 0 ? (
              <div className="py-5 px-3 text-center text-xs text-slate-400">
                No matching accounts found.
              </div>
            ) : (
              groupedData.map(([section, items]) => (
                <div key={section} className="mb-1 last:mb-0">
                  {/* Non-selectable Section Header */}
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/80 border-y border-slate-100/80 select-none">
                    ── {section} ──
                  </div>

                  {/* Selectable Leaf Items */}
                  {items.map((item) => {
                    const isSelected = item.label === value;
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelect(item.label)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelect(item.label);
                          }
                        }}
                        className={`px-3 py-1.5 flex items-center justify-between gap-2 hover:bg-indigo-50/80 hover:text-indigo-700 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-700 font-normal'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isSelected && <Check className="size-3.5 shrink-0 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
