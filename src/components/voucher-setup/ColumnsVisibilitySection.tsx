import React from 'react';
import type {
  TemplateId,
  TemplateCustomization,
  ColumnDefinition,
} from '../../types/voucherTemplate';
import {
  STANDARD_TEMPLATE_COLUMNS,
  DUAL_ROW_TEMPLATE_COLUMNS,
  AUX_DIMENSION_COLUMNS,
} from '../../types/voucherTemplate';
import { CheckSquare, Square, RotateCcw } from 'lucide-react';

interface ColumnsVisibilitySectionProps {
  templateId: TemplateId;
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const ColumnsVisibilitySection: React.FC<ColumnsVisibilitySectionProps> = ({
  templateId,
  customization,
  onChange,
}) => {
  const isStandard = templateId === 'standard';
  const visibleMap = customization.visibleColumns || {};

  const isColVisible = (colId: string): boolean => {
    if (visibleMap[colId] !== undefined) {
      return visibleMap[colId];
    }
    // Default to true for all columns
    return true;
  };

  const toggleColumn = (colId: string) => {
    const current = isColVisible(colId);
    const updated = {
      ...visibleMap,
      [colId]: !current,
    };
    onChange({ visibleColumns: updated });
  };

  const handleSelectAll = (columns: { id: string }[]) => {
    const updated = { ...visibleMap };
    columns.forEach((c) => {
      updated[c.id] = true;
    });
    onChange({ visibleColumns: updated });
  };

  const handleReset = (columns: { id: string }[]) => {
    const updated = { ...visibleMap };
    columns.forEach((c) => {
      delete updated[c.id];
    });
    onChange({ visibleColumns: updated });
  };

  const renderColumnItem = (col: ColumnDefinition, isFullWidth = false) => {
    const isChecked = isColVisible(col.id);
    const isLocked = Boolean(col.required);

    return (
      <div
        key={col.id}
        title={col.description}
        onClick={() => !isLocked && toggleColumn(col.id)}
        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11.5px] transition-all cursor-pointer select-none ${
          isFullWidth ? 'col-span-2' : 'col-span-1'
        } ${
          isChecked
            ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-medium'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        } ${isLocked ? 'cursor-not-allowed opacity-90' : ''}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isChecked ? (
            <CheckSquare className="size-3.5 text-indigo-600 shrink-0" />
          ) : (
            <Square className="size-3.5 text-slate-400 shrink-0" />
          )}
          <span className="truncate">{col.label}</span>
        </div>
        {isLocked && (
          <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-slate-200/90 text-slate-600 shrink-0 ml-1">
            Req
          </span>
        )}
      </div>
    );
  };

  if (isStandard) {
    const activeCount = STANDARD_TEMPLATE_COLUMNS.filter((c) => isColVisible(c.id)).length;

    return (
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-800">
              Columns Visibility
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full">
              {activeCount}/{STANDARD_TEMPLATE_COLUMNS.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectAll(STANDARD_TEMPLATE_COLUMNS)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Select All
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => handleReset(STANDARD_TEMPLATE_COLUMNS)}
              className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-0.5"
            >
              <RotateCcw className="size-2.5" /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {STANDARD_TEMPLATE_COLUMNS.map((col) => {
            const isFull = col.id === 'accountsHead' || col.id === 'lineDescription';
            return renderColumnItem(col, isFull);
          })}
        </div>
      </div>
    );
  }

  // Dual Row Templates (Minimal, Clean Grid, Framed Ledger)
  const allCols = [...DUAL_ROW_TEMPLATE_COLUMNS, ...AUX_DIMENSION_COLUMNS];
  const activeMainCount = DUAL_ROW_TEMPLATE_COLUMNS.filter((c) => isColVisible(c.id)).length;
  const activeAuxCount = AUX_DIMENSION_COLUMNS.filter((c) => isColVisible(c.id)).length;

  return (
    <div className="space-y-3.5 font-sans">
      {/* 1. Primary Table Columns */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-800">
              Primary Table Columns
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full">
              {activeMainCount}/{DUAL_ROW_TEMPLATE_COLUMNS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectAll(DUAL_ROW_TEMPLATE_COLUMNS)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {DUAL_ROW_TEMPLATE_COLUMNS.map((col) => {
            const isFull = col.id === 'accountsHead' || col.id === 'lineDescription';
            return renderColumnItem(col, isFull);
          })}
        </div>
      </div>

      {/* 2. Auxiliary Dimension Fields */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-800">
              Auxiliary Dimension Fields (Row 2)
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full">
              {activeAuxCount}/{AUX_DIMENSION_COLUMNS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectAll(AUX_DIMENSION_COLUMNS)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {AUX_DIMENSION_COLUMNS.map((col) => {
            const isFull = col.id === 'reference';
            return renderColumnItem(col, isFull);
          })}
        </div>
      </div>

      {/* Quick Reset All */}
      <div className="pt-1 flex justify-end">
        <button
          type="button"
          onClick={() => handleReset(allCols)}
          className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="size-2.5" /> Reset All Columns
        </button>
      </div>
    </div>
  );
};

