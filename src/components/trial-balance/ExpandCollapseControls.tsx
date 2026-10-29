import React from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface ExpandCollapseControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  disabled?: boolean;
}

export const ExpandCollapseControls: React.FC<ExpandCollapseControlsProps> = ({
  onExpandAll,
  onCollapseAll,
  disabled = false,
}) => {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs font-sans">
      <button
        type="button"
        disabled={disabled}
        onClick={onExpandAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        title="Expand all tree levels"
      >
        <ChevronsDown className="size-3.5 text-slate-500" />
        <span>Expand</span>
      </button>

      <div className="w-[1px] bg-slate-200 my-1"></div>

      <button
        type="button"
        disabled={disabled}
        onClick={onCollapseAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        title="Collapse to Level 1 Nature"
      >
        <ChevronsUp className="size-3.5 text-slate-500" />
        <span>Collapse</span>
      </button>
    </div>
  );
};
