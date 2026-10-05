import React, { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

interface OptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
  disabled?: boolean;
}

export const OptionsEditor: React.FC<OptionsEditorProps> = ({
  options = [],
  onChange,
  disabled = false,
}) => {
  const [newOption, setNewOption] = useState('');

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    if (options.includes(trimmed)) return;
    onChange([...options, trimmed]);
    setNewOption('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-muted/20 border border-border/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground">
          Dropdown / Select Options <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-muted-foreground font-medium">
          {options.length} {options.length === 1 ? 'option' : 'options'}
        </span>
      </div>

      {/* Input to add a new option */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type option name and press Enter..."
          className="flex-1 h-8.5 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !newOption.trim()}
          className="h-8.5 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Options List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {options.length === 0 ? (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900/40">
            At least one option is required for Dropdown and MultiSelect fields.
          </p>
        ) : (
          options.map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-card p-1.5 rounded-lg border border-border/70 shadow-2xs group"
            >
              <GripVertical className="size-3.5 text-muted-foreground/50 shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleEdit(idx, e.target.value)}
                disabled={disabled}
                className="flex-1 h-7 px-2 rounded border border-transparent hover:border-border focus:border-indigo-500 bg-transparent text-xs text-foreground outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                disabled={disabled}
                className="size-7 rounded-md hover:bg-rose-50 hover:text-rose-600 text-muted-foreground/60 transition-colors grid place-items-center cursor-pointer"
                title="Remove option"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
