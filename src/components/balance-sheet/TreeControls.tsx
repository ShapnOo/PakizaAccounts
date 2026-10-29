import React from 'react';
import { ChevronsDown, ChevronsUp, Layers } from 'lucide-react';

interface TreeControlsProps {
  subLedger: boolean;
  onToggleSubLedger: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  subLedger,
  onToggleSubLedger,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Sub-Ledger Switch */}
      <button
        type="button"
        onClick={onToggleSubLedger}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
          subLedger
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Layers className={`size-3.5 ${subLedger ? 'text-indigo-600' : 'text-slate-400'}`} />
        <span>Sub-Ledger</span>
        <span
          className={`size-2 rounded-full ml-0.5 ${
            subLedger ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        />
      </button>

      {/* Expand All */}
      <button
        type="button"
        onClick={onExpandAll}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs transition-all cursor-pointer"
        title="Expand all branches in the hierarchy"
      >
        <ChevronsDown className="size-3.5 text-slate-500" />
        <span>Expand All</span>
      </button>

      {/* Collapse All */}
      <button
        type="button"
        onClick={onCollapseAll}
        data-raw-label="Collaps All"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs transition-all cursor-pointer"
        title="Collapse all child branches"
      >
        <ChevronsUp className="size-3.5 text-slate-500" />
        <span>Collapse All</span>
      </button>
    </div>
  );
};

