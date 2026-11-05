import React from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { ParticularsCell } from './ParticularsCell';
import { CodeCell } from './CodeCell';
import { FormulaCell } from './FormulaCell';
import { RowActionsMenu } from './RowActionsMenu';
import type { ISCustomRow } from '../../types/isCustomization';

interface RowItemProps {
  row: ISCustomRow;
  allRows: ISCustomRow[];
  index: number;
  isNewlyAdded: boolean;
  onUpdateRow: (id: string, patch: Partial<ISCustomRow>) => void;
  onRemoveRow: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddSubHead: (row: ISCustomRow) => void;
  onAddHeadBelow: (row: ISCustomRow) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const RowItem: React.FC<RowItemProps> = ({
  row,
  allRows,
  index,
  isNewlyAdded,
  onUpdateRow,
  onRemoveRow,
  onMoveUp,
  onMoveDown,
  onAddSubHead,
  onAddHeadBelow,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const isParent = row.kind === 'parent';

  return (
    <tr
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group transition-colors duration-300 border-b border-slate-100 ${
        isNewlyAdded
          ? 'bg-indigo-50/80 animate-pulse'
          : isParent
          ? 'bg-slate-50/70 border-t border-slate-200 font-semibold'
          : index % 2 === 0
          ? 'bg-white hover:bg-slate-50/50'
          : 'bg-slate-50/30 hover:bg-slate-50/60'
      }`}
    >
      {/* Particulars (50%) with Drag Handle & Indentation */}
      <td className="py-2 pl-2 pr-3 align-middle w-1/2">
        <div className="flex items-center gap-1.5">
          {/* Drag Handle */}
          <span
            className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-0.5 rounded transition shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="size-3.5" />
          </span>

          {/* Child Row Indentation & Parent Selector */}
          {!isParent && (
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-4 shrink-0 text-slate-300 font-mono text-xs">↳</div>
              <select
                value={row.parentCode || ''}
                onChange={(e) => onUpdateRow(row.id, { parentCode: e.target.value })}
                className="text-[11px] font-semibold text-slate-600 bg-slate-100/90 hover:bg-slate-200/90 px-1.5 py-0.5 rounded border border-slate-200 outline-none cursor-pointer transition select-none"
                title={`Assigned to Head Section ${row.parentCode} (click to reassign)`}
              >
                {allRows
                  .filter((r) => r.kind === 'parent')
                  .map((p) => (
                    <option key={p.id} value={p.code}>
                      In Head {p.code}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Particulars Cell */}
          <div className="flex-1 min-w-0">
            <ParticularsCell
              row={row}
              autoFocus={isNewlyAdded}
              onChange={(particulars) => onUpdateRow(row.id, { particulars })}
            />
          </div>

          {/* Instant "+ Sub Head" button for Head rows */}
          {isParent && (
            <button
              type="button"
              onClick={() => onAddSubHead(row)}
              className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md border border-indigo-200/80 shrink-0 shadow-2xs cursor-pointer"
              title={`Add a new Sub Head under "${row.particulars || row.code}"`}
            >
              <Plus className="size-3 text-indigo-600" />
              <span>Sub Head</span>
            </button>
          )}
        </div>
      </td>

      {/* Code (15%) */}
      <td className="py-2 px-3 align-middle w-[15%]">
        <CodeCell
          row={row}
          allRows={allRows}
          onChange={(code) => onUpdateRow(row.id, { code })}
        />
      </td>

      {/* Formula (30%) */}
      <td className="py-2 px-3 align-middle w-[30%]">
        <FormulaCell
          row={row}
          allRows={allRows}
          onChange={(formula) => onUpdateRow(row.id, { formula })}
        />
      </td>

      {/* Actions (5%) */}
      <td className="py-2 pr-3 pl-1 align-middle text-right w-[5%]">
        <RowActionsMenu
          isParent={isParent}
          canMoveUp={index > 0}
          canMoveDown={index < allRows.length - 1}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={() => onRemoveRow(row.id)}
          onAddSubHead={() => onAddSubHead(row)}
          onAddHeadBelow={() => onAddHeadBelow(row)}
        />
      </td>
    </tr>
  );
};
