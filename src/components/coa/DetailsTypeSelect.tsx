import React, { useState } from 'react';
import { Plus, Check, ChevronDown, Sparkles, X } from 'lucide-react';
import { DEFAULT_DETAILS_TYPE_OPTIONS } from '../../constants/accountsTypeTree';

interface DetailsTypeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  availableOptions?: string[];
  extraOptions?: string[];
  onAddOption?: (newOption: string) => void;
  isMandatory?: boolean;
  error?: string;
  className?: string;
}

export const DetailsTypeSelect: React.FC<DetailsTypeSelectProps> = ({
  value,
  onChange,
  availableOptions,
  extraOptions = [],
  onAddOption,
  isMandatory = false,
  error,
  className = '',
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Combine base options + contextual options + user added options
  const baseList = availableOptions && availableOptions.length > 0
    ? availableOptions
    : DEFAULT_DETAILS_TYPE_OPTIONS;

  const allOptions = Array.from(new Set([...baseList, ...extraOptions]));

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOptionInput.trim();
    if (!trimmed) return;
    if (onAddOption) {
      onAddOption(trimmed);
    }
    onChange(trimmed);
    setNewOptionInput('');
    setShowAddDialog(false);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-9 px-3 pr-8 rounded-lg bg-card border text-xs font-medium text-foreground appearance-none transition-all cursor-pointer shadow-2xs hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              error ? 'border-rose-500/80 ring-2 ring-rose-500/10' : 'border-border/80'
            }`}
          >
            <option value="">
              {isMandatory ? '-- Select Details Type (Mandatory) --' : '-- Select Details Type (Optional) --'}
            </option>
            {allOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Add+ Button */}
        {onAddOption && (
          <button
            type="button"
            onClick={() => setShowAddDialog(true)}
            className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
            title="Add a new Details Type option"
          >
            <Plus className="size-3 stroke-[2.5]" />
            <span>Add+</span>
          </button>
        )}
      </div>

      {isMandatory && (
        <p className="text-[10.5px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <span>* Details Field Mandatory for this accounts.</span>
        </p>
      )}

      {error && <p className="text-[10.5px] font-medium text-rose-500">{error}</p>}

      {/* Modal / Dialog for Add+ */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Add New Details Type</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80">
                  Details Type Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Letter of Credit / Margin"
                  value={newOptionInput}
                  onChange={(e) => setNewOptionInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-card border border-border text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Check className="size-3.5" />
                  <span>Append to Taxonomy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
