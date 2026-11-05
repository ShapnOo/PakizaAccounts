import React from 'react';
import { Plus, Layers, CornerDownRight, List, BookOpen, Hash } from 'lucide-react';

interface ActionButtonsProps {
  rowCount: number;
  parentCount: number;
  childCount: number;
  onAddHead: () => void;
  onAddSubHead: () => void;
  onOpenAddList: () => void;
  onOpenManageMaster: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rowCount,
  parentCount,
  childCount,
  onAddHead,
  onAddSubHead,
  onOpenAddList,
  onOpenManageMaster,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Add Head (Section) */}
        <button
          type="button"
          onClick={onAddHead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-[13px] font-semibold shadow-2xs transition cursor-pointer"
          title="Create a new parent Head section (A-Z with formula)"
        >
          <Plus className="size-3.5 text-indigo-600" />
          <Layers className="size-3.5 text-indigo-600" />
          <span>Add Head (Section)</span>
        </button>

        {/* Add Sub Head (Line Item) */}
        <button
          type="button"
          onClick={onAddSubHead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-[13px] font-medium shadow-2xs transition cursor-pointer"
          title="Add an inline Sub Head line item (numeric code)"
        >
          <Plus className="size-3.5 text-indigo-600" />
          <CornerDownRight className="size-3.5 text-slate-400" />
          <span>Add Sub Head</span>
        </button>

        {/* Add from Master List */}
        <button
          type="button"
          onClick={onOpenAddList}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-[13px] font-medium shadow-2xs transition cursor-pointer"
          title="Pick one or multiple lines from Master Accounts List"
        >
          <Plus className="size-3.5 text-indigo-600" />
          <List className="size-3.5 text-slate-400" />
          <span>Add from Master (List)</span>
        </button>

        {/* Manage Master List */}
        <button
          type="button"
          onClick={onOpenManageMaster}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-[13px] font-medium shadow-2xs transition cursor-pointer"
          title="Create new accounts and manage Master List items"
        >
          <BookOpen className="size-3.5 text-indigo-600" />
          <span>Manage Master List</span>
        </button>
      </div>

      {/* Row Count Chip */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/80 text-[12px] font-medium text-slate-600">
        <Hash className="size-3 text-slate-400" />
        <span className="font-semibold text-slate-800">{rowCount}</span>
        <span>rows</span>
        <span className="text-slate-300">•</span>
        <span className="font-semibold text-slate-800">{parentCount}</span>
        <span>heads</span>
        <span className="text-slate-300">•</span>
        <span className="font-semibold text-slate-800">{childCount}</span>
        <span>sub heads</span>
      </div>
    </div>
  );
};
