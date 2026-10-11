import React from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Filter } from 'lucide-react';

interface AdvanceFilterHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  conditionCount: number;
  onReset: () => void;
  isDefaultState: boolean;
}

export const AdvanceFilterHeader: React.FC<AdvanceFilterHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  conditionCount,
  onReset,
  isDefaultState,
}) => {
  return (
    <div
      onClick={onToggleCollapse}
      className="flex items-center justify-between px-3 py-2 bg-slate-50/90 border-b border-slate-200 cursor-pointer select-none rounded-t-md hover:bg-slate-100/70 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-slate-500">
          {collapsed ? (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          )}
        </span>
        <Filter className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Advance Filter
        </span>
        {conditionCount > 0 && (
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-100/80 rounded-full">
            {conditionCount}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          disabled={isDefaultState}
          title="Reset advance filters to default"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all ${
            isDefaultState
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-white bg-transparent border border-transparent hover:border-slate-200 shadow-none hover:shadow-xs'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
