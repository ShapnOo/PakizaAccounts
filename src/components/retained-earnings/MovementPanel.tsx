import React from 'react';
import { MovementRow as MovementRowType, DateRange } from '../../types/retainedEarnings';
import { MovementRow } from './MovementRow';
import { TrendingUp } from 'lucide-react';

interface MovementPanelProps {
  rows: MovementRowType[];
  dateRange: DateRange;
  customFrom?: string;
  customTo?: string;
  isHoveredLinked: boolean;
  onHoverLink: (hovered: boolean) => void;
}

export const MovementPanel: React.FC<MovementPanelProps> = ({
  rows,
  dateRange,
  customFrom,
  customTo,
  isHoveredLinked,
  onHoverLink,
}) => {
  const periodText =
    dateRange === 'Custom' && customFrom && customTo
      ? `${customFrom} to ${customTo}`
      : dateRange;

  return (
    <div className="flex-1 flex flex-col bg-white font-sans">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Retained Earnings Movement
            </h3>
            <p className="text-[11px] text-slate-500">
              Period: {periodText} • Currency: BDT (৳)
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Movement Log
        </span>
      </div>

      {/* Table Area */}
      <div className="table-scroll overflow-x-auto w-full">
        <table className="w-full border-collapse text-left font-sans min-w-[340px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-4 w-[62%] border-r border-slate-200">
                Particulars
              </th>
              <th className="py-2.5 px-4 w-[38%] text-right">
                Amount (BDT)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <MovementRow
                key={row.id}
                row={row}
                isHoveredLinked={isHoveredLinked}
                onHoverLink={onHoverLink}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

