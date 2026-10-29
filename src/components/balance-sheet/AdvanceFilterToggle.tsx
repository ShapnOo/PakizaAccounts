import React from 'react';
import { Filter, ChevronDown, ChevronRight } from 'lucide-react';

interface AdvanceFilterToggleProps {
  collapsed: boolean;
  onToggle: () => void;
  activeCount?: number;
}

export const AdvanceFilterToggle: React.FC<AdvanceFilterToggleProps> = ({
  collapsed,
  onToggle,
  activeCount = 0,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-raw-label="Advancd Filter"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
    >
      <Filter className="size-3.5 text-indigo-600" />
      <span>Advance Filter</span>
      {activeCount > 0 && (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
          {activeCount}
        </span>
      )}
      {collapsed ? (
        <ChevronRight className="size-3.5 text-slate-400" />
      ) : (
        <ChevronDown className="size-3.5 text-slate-400" />
      )}
    </button>
  );
};

