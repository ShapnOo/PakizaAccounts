import React from 'react';
import type {
  TemplateId,
  TemplateCustomization,
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

  if (isStandard) {
    const activeCount = STANDARD_TEMPLATE_COLUMNS.filter((c) => isColVisible(c.id)).length;

    return (
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
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

        <div className="grid grid-cols-1 gap-1.5">
          {STANDARD_TEMPLATE_COLUMNS.map((col) => {
            const isChecked = isColVisible(col.id);
            const isLocked = col.required;

            return (
              <label
                key={col.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-50/40 border-indigo-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => !isLocked && toggleColumn(col.id)}
                    className="text-indigo-600 disabled:opacity-50"
                  >
                    {isChecked ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <span className="text-[12px] font-medium text-slate-800">
                      {col.label}
                    </span>
                    {col.description && (
                      <span className="block text-[10.5px] text-slate-400">
                        {col.description}
                      </span>
                    )}
                  </div>
                </div>
                {isLocked && (
                  <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600">
                    Required
                  </span>
                )}
              </label>
            );
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
    <div className="space-y-4 font-sans">
      {/* 1. Primary Table Columns */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
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

        <div className="grid grid-cols-1 gap-1.5">
          {DUAL_ROW_TEMPLATE_COLUMNS.map((col) => {
            const isChecked = isColVisible(col.id);
            const isLocked = col.required;

            return (
              <label
                key={col.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-50/40 border-indigo-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => !isLocked && toggleColumn(col.id)}
                    className="text-indigo-600 disabled:opacity-50"
                  >
                    {isChecked ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <span className="text-[12px] font-medium text-slate-800">
                      {col.label}
                    </span>
                    {col.description && (
                      <span className="block text-[10.5px] text-slate-400">
                        {col.description}
                      </span>
                    )}
                  </div>
                </div>
                {isLocked && (
                  <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600">
                    Required
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Auxiliary Dimension Fields */}
      <div>
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
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

        <div className="grid grid-cols-1 gap-1.5">
          {AUX_DIMENSION_COLUMNS.map((col) => {
            const isChecked = isColVisible(col.id);

            return (
              <label
                key={col.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-50/40 border-indigo-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleColumn(col.id)}
                    className="text-indigo-600"
                  >
                    {isChecked ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <span className="text-[12px] font-medium text-slate-800">
                      {col.label}
                    </span>
                    {col.description && (
                      <span className="block text-[10.5px] text-slate-400">
                        {col.description}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Quick Reset All */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => handleReset(allCols)}
          className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
        >
          <RotateCcw className="size-3" /> Reset All Columns
        </button>
      </div>
    </div>
  );
};

