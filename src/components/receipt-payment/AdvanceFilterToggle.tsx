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
      className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md border text-[11px] font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
        !collapsed
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
      }`}
    >
      <Filter className={`size-3 ${!collapsed ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span>Advance Filter</span>
      {activeCount > 0 && (
        <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
          {activeCount}
        </span>
      )}
      {collapsed ? (
        <ChevronRight className="size-3 text-slate-400" />
      ) : (
        <ChevronDown className="size-3 text-indigo-500" />
      )}
    </button>
  );
};

