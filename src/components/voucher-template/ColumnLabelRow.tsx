import React from 'react';
import { GripVertical, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { TableColumnConfig } from '../../types/voucherTemplate';

interface ColumnLabelRowProps {
  colKey: string;
  config: TableColumnConfig;
  index: number;
  totalCount: number;
  onToggleVisible: () => void;
  onLabelChange: (label: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const ColumnLabelRow: React.FC<ColumnLabelRowProps> = ({
  colKey,
  config,
  index,
  totalCount,
  onToggleVisible,
  onLabelChange,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors group ${
        config.visible
          ? 'bg-card border-border/80 shadow-2xs'
          : 'bg-muted/30 border-border/40 opacity-70'
      }`}
    >
      {/* Reorder Grip & Arrows */}
      <div className="flex items-center gap-0.5 text-muted-foreground/60 shrink-0">
        <GripVertical className="size-3.5" />
        <div className="hidden group-hover:flex flex-col -space-y-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-0.5 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
            title="Move Up"
          >
            <ChevronUp className="size-2.5" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={onMoveDown}
            className="p-0.5 hover:text-indigo-600 disabled:opacity-20 cursor-pointer"
            title="Move Down"
          >
            <ChevronDown className="size-2.5" />
          </button>
        </div>
      </div>

      {/* Visibility Checkbox */}
      <button
        type="button"
        onClick={onToggleVisible}
        className={`size-4.5 rounded border grid place-items-center cursor-pointer transition-colors shrink-0 ${
          config.visible
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'border-border bg-background'
        }`}
        title={config.visible ? 'Hide column from print' : 'Show column in print'}
      >
        {config.visible && <Check className="size-3 stroke-[2.5]" />}
      </button>

      {/* Column Name Input */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={config.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Column title..."
          className="w-full h-7 px-2 rounded border border-transparent hover:border-border/80 focus:border-indigo-500 bg-transparent text-xs font-semibold text-foreground outline-none transition-colors"
        />
      </div>

      {/* Custom Field Badge if applicable */}
      {config.isCustom && (
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
          Custom
        </span>
      )}
    </div>
  );
};
