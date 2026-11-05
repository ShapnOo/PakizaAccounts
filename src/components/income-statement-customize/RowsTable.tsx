import React, { useRef } from 'react';
import { RowItem } from './RowItem';
import { EmptyState } from './EmptyState';
import type { ISCustomRow } from '../../types/isCustomization';

interface RowsTableProps {
  rows: ISCustomRow[];
  newlyAddedRowId: string | null;
  onUpdateRow: (id: string, patch: Partial<ISCustomRow>) => void;
  onRemoveRow: (id: string) => void;
  onReorderRows: (fromIndex: number, toIndex: number) => void;
  onAddSubHead: (row?: ISCustomRow) => void;
  onAddHeadBelow: (row?: ISCustomRow) => void;
  onReset: () => void;
}

export const RowsTable: React.FC<RowsTableProps> = ({
  rows,
  newlyAddedRowId,
  onUpdateRow,
  onRemoveRow,
  onReorderRows,
  onAddSubHead,
  onAddHeadBelow,
  onReset,
}) => {
  const dragItemIndex = useRef<number | null>(null);

  const handleDragStart = (_e: React.DragEvent, index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault();
  };

  const handleDrop = (_e: React.DragEvent, targetIndex: number) => {
    if (dragItemIndex.current === null) return;
    if (dragItemIndex.current !== targetIndex) {
      onReorderRows(dragItemIndex.current, targetIndex);
    }
    dragItemIndex.current = null;
  };

  if (rows.length === 0) {
    return (
      <EmptyState
        onAddLine={() => onAddSubHead()}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <th className="py-2.5 pl-4 pr-3 w-1/2">Particulars</th>
              <th className="py-2.5 px-3 w-[15%]">Code</th>
              <th className="py-2.5 px-3 w-[30%]">Formula</th>
              <th className="py-2.5 pr-4 pl-1 text-right w-[5%]">⋮</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {rows.map((row, idx) => (
              <RowItem
                key={row.id}
                row={row}
                allRows={rows}
                index={idx}
                isNewlyAdded={row.id === newlyAddedRowId}
                onUpdateRow={onUpdateRow}
                onRemoveRow={onRemoveRow}
                onMoveUp={() => idx > 0 && onReorderRows(idx, idx - 1)}
                onMoveDown={() => idx < rows.length - 1 && onReorderRows(idx, idx + 1)}
                onAddSubHead={() => onAddSubHead(row)}
                onAddHeadBelow={() => onAddHeadBelow(row)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
