import React from 'react';
import { formatBDT } from '../../lib/retainedEarningsMath';

interface TotalEquityRowProps {
  total: number;
}

export const TotalEquityRow: React.FC<TotalEquityRowProps> = ({ total }) => {
  return (
    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 font-sans">
      <td className="py-2.5 px-4 text-xs text-slate-900 uppercase tracking-wide">
        Total Equity
      </td>
      <td className="py-2.5 px-4 text-right text-xs font-bold text-slate-950 tabular-nums font-sans">
        {formatBDT(total)}
      </td>
    </tr>
  );
};

