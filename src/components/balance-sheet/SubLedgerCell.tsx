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
  // If parent or undefined / no subledger assigned, display clean dash
  if (
    isParent ||
    !subLedger ||
    subLedger.tag === 'Undefined' ||
    subLedger.name === 'Undefined' ||
    !subLedger.name
  ) {
    return <span className="text-slate-300 font-sans text-xs select-none">—</span>;
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs font-medium text-slate-700 tracking-tight font-sans">
        {subLedger.name}
      </span>
      {subLedger.tag && <SubLedgerTagChip tag={subLedger.tag} />}
    </div>
  );
};
