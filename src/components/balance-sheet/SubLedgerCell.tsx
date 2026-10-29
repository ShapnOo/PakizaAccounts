import React from 'react';
import { SubLedgerTagChip } from './SubLedgerTagChip';
import { SubLedgerTag } from '../../types/balanceSheet';

interface SubLedgerCellProps {
  subLedger?: {
    name: string;
    tag: SubLedgerTag;
  };
  isParent: boolean;
}

export const SubLedgerCell: React.FC<SubLedgerCellProps> = ({ subLedger, isParent }) => {
  if (isParent) {
    return <span className="text-slate-300 font-mono text-xs select-none">—</span>;
  }

  if (!subLedger || subLedger.tag === 'Undefined' || subLedger.name === 'Undefined') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 italic font-normal">Undefined</span>
        <SubLedgerTagChip tag="Undefined" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs font-medium text-slate-700 tracking-tight">
        {subLedger.name}
      </span>
      {subLedger.tag && <SubLedgerTagChip tag={subLedger.tag} />}
    </div>
  );
};

