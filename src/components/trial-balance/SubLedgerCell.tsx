import React from 'react';
import { SubLedgerTag } from '../../types/trialBalance';
import { SubLedgerTagChip } from './SubLedgerTagChip';

interface SubLedgerCellProps {
  subLedger?: { name: string; tag: SubLedgerTag };
}

export const SubLedgerCell: React.FC<SubLedgerCellProps> = ({ subLedger }) => {
  if (!subLedger || !subLedger.name) {
    return <span className="text-slate-300 font-sans">—</span>;
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap font-sans text-xs">
      <span className="font-medium text-slate-700 truncate max-w-[150px]">
        {subLedger.name}
      </span>
      {subLedger.tag && <SubLedgerTagChip tag={subLedger.tag} />}
    </div>
  );
};

