import React from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface HeaderExpandCollapseControlsProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const HeaderExpandCollapseControls: React.FC<HeaderExpandCollapseControlsProps> = ({
  expanded,
  onExpand,
  onCollapse,
}) => {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onExpand}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
          expanded
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title="Expand fiscal year sub-periods"
      >
        <ChevronsDown className="size-3.5 text-slate-500" />
        <span>Expand</span>
      </button>

      <button
        type="button"
        onClick={onCollapse}
        data-raw-label="Collaps"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
          !expanded
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title="Collapse fiscal year sub-periods"
      >
        <ChevronsUp className="size-3.5 text-slate-500" />
        <span>Collapse</span>
      </button>
    </div>
  );
};

