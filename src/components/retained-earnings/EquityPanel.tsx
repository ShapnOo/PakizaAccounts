import React from 'react';
import { EquityRow as EquityRowType } from '../../types/retainedEarnings';
import { EquityRow } from './EquityRow';
import { TotalEquityRow } from './TotalEquityRow';
import { Landmark } from 'lucide-react';

interface EquityPanelProps {
  rows: EquityRowType[];
  totalEquity: number;
  showEquityTotal?: boolean;
  isHoveredLinked: boolean;
  onHoverLink: (hovered: boolean) => void;
}

export const EquityPanel: React.FC<EquityPanelProps> = ({
  rows,
  totalEquity,
  showEquityTotal = true,
  isHoveredLinked,
  onHoverLink,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white font-sans">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Equity Snapshot
            </h3>
            <p className="text-[11px] text-slate-500">
              Balance Sheet Equity Components
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Snapshot
        </span>
      </div>

      {/* Table Area */}
      <div className="table-scroll overflow-x-auto w-full">
        <table className="w-full border-collapse text-left font-sans min-w-[280px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-4 w-[60%] border-r border-slate-200">
                Particulars
              </th>
              <th className="py-2.5 px-4 w-[40%] text-right">
                Amount (BDT)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <EquityRow
                key={row.id}
                row={row}
                isHoveredLinked={isHoveredLinked}
                onHoverLink={onHoverLink}
              />
            ))}
            {showEquityTotal && <TotalEquityRow total={totalEquity} />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

