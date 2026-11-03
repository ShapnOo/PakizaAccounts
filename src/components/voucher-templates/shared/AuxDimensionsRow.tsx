import React from 'react';
import type { PreviewLine } from '../../../types/voucherTemplate';

interface AuxDimensionsRowProps {
  line: PreviewLine;
  colSpan?: number;
  isGrid?: boolean;
  visibleColumns?: Record<string, boolean>;
}

export const AuxDimensionsRow: React.FC<AuxDimensionsRowProps> = ({
  line,
  colSpan = 8,
  isGrid = false,
  visibleColumns,
}) => {
  const isFieldVisible = (id: string) => {
    if (!visibleColumns) return true;
    return visibleColumns[id] !== undefined ? visibleColumns[id] : true;
  };

  const rawItems = [
    { id: 'costCenter', label: 'Cost Center', val: line.costCenter },
    { id: 'subsidiary', label: 'Subsidiary', val: line.subsidiary },
    { id: 'employee', label: 'Employee', val: line.employee },
    { id: 'vehicle', label: 'Vehicle', val: line.vehicle },
    { id: 'reference', label: 'Reference', val: line.reference },
  ];

  const items = rawItems.filter((it) => isFieldVisible(it.id));

  // If no aux dimensions are visible, do not render this row
  if (items.length === 0) {
    return null;
  }

  return (
    <tr
      className={`text-[8.5px] ${
        isGrid
          ? 'bg-slate-50/60 border-b border-slate-300'
          : 'border-b border-slate-200 text-slate-500'
      }`}
    >
      <td
        colSpan={colSpan}
        className={`py-1 px-3 ${isGrid ? 'border-l border-r border-b border-slate-300' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-0.5">
          {items.map((it) => (
            <span key={it.id} className="inline-flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">{it.label}:</span>
              <span className="text-slate-800">{it.val ? it.val : '–'}</span>
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
};
