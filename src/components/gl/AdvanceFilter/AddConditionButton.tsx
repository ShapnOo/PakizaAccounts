import React from 'react';
import { Plus } from 'lucide-react';

interface AddConditionButtonProps {
  onAdd: () => void;
  disabled?: boolean;
}

export const AddConditionButton: React.FC<AddConditionButtonProps> = ({ onAdd, disabled }) => {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className={`w-full py-1.5 px-3 rounded-md border-2 border-dashed flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
        disabled
          ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50'
          : 'border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-300 cursor-pointer'
      }`}
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Add Condition</span>
    </button>
  );
};
