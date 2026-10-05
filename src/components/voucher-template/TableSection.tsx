import React, { useState } from 'react';
import { Align, TableColumnConfig } from '../../types/voucherTemplate';
import { ColumnLabelRow } from './ColumnLabelRow';
import { Table2, Check, ChevronDown } from 'lucide-react';

interface TableSectionProps {
  columns: Record<string, TableColumnConfig>;
  columnOrder: string[];
  showBorder: boolean;
  fontSize: number;
  showApprovalSignature: boolean;
  defaultCollapsed?: boolean;
  onToggleColumn: (colKey: string) => void;
  onUpdateColumnLabel: (colKey: string, label: string) => void;
  onUpdateColumnAlign?: (colKey: string, align: Align) => void;
  onReorderColumns: (newOrder: string[]) => void;
  onChangeLayout: (patch: {
    showBorder?: boolean;
    fontSize?: number;
    showApprovalSignature?: boolean;
  }) => void;
}

export const TableSection: React.FC<TableSectionProps> = ({
  columns,
  columnOrder,
  showBorder,
  fontSize,
  showApprovalSignature,
  defaultCollapsed = false,
  onToggleColumn,
  onUpdateColumnLabel,
  onUpdateColumnAlign,
  onReorderColumns,
  onChangeLayout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const visibleCount = Object.values(columns).filter((c) => c.visible).length;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= columnOrder.length) return;

    const copy = [...columnOrder];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onReorderColumns(copy);
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left cursor-pointer group"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <Table2 className="size-3.5 text-indigo-600 transition-transform group-hover:scale-110" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Table Configuration
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {visibleCount} visible
          </span>
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-3.5 pt-1 border-t border-border/40 space-y-4">

      {/* ── Sub-heading: Lebels (sic — Labels) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-indigo-600" />
            <span>Lebels</span>
            <span className="text-[10px] text-muted-foreground font-normal lowercase italic">
              (sic — labels)
            </span>
          </div>
          <span className="text-[10.5px] text-muted-foreground">
            Check to print · Edit to rename
          </span>
        </div>

        {/* Column items list */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 sidebar-scroll">
          {columnOrder.map((key, idx) => {
            const config = columns[key];
            if (!config) return null;

            return (
              <ColumnLabelRow
                key={key}
                colKey={key}
                config={config}
                index={idx}
                totalCount={columnOrder.length}
                onToggleVisible={() => onToggleColumn(key)}
                onLabelChange={(newLabel) => onUpdateColumnLabel(key, newLabel)}
                onAlignChange={(newAlign) => onUpdateColumnAlign?.(key, newAlign)}
                onMoveUp={() => handleMove(idx, 'up')}
                onMoveDown={() => handleMove(idx, 'down')}
              />
            );
          })}
        </div>
      </div>

      {/* ── Sub-heading: Layout ── */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          <span>Layout</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Table Border Toggle */}
          <div className="p-2.5 rounded-lg border border-border/80 bg-background flex items-center justify-between shadow-2xs">
            <span className="text-xs font-semibold text-foreground">
              Table Border
            </span>
            <button
              type="button"
              onClick={() => onChangeLayout({ showBorder: !showBorder })}
              className={`h-6 px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                showBorder
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {showBorder ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Approval Signature Toggle */}
          <div className="p-2.5 rounded-lg border border-border/80 bg-background flex items-center justify-between shadow-2xs">
            <span className="text-xs font-semibold text-foreground">
              Approval Signature
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeLayout({
                  showApprovalSignature: !showApprovalSignature,
                })
              }
              className={`h-6 px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                showApprovalSignature
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {showApprovalSignature ? 'Shown' : 'Hidden'}
            </button>
          </div>
        </div>

        {/* Table Font Size */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Table Font Size (Overrides Base Font)
          </label>
          <input
            type="number"
            min="6"
            max="18"
            value={fontSize}
            onChange={(e) =>
              onChangeLayout({
                fontSize: parseInt(e.target.value, 10) || 9,
              })
            }
            className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>
      </div>
    )}
  </div>
  );
};
