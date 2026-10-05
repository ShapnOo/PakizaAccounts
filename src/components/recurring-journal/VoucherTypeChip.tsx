import React from 'react';
import { VoucherType, VOUCHER_TYPE_COLORS } from '../../types/recurringJournal';

interface VoucherTypeChipProps {
  type: VoucherType;
  size?: 'sm' | 'md';
}

const TYPE_SHORT: Record<VoucherType, string> = {
  Journal: 'JV',
  Receive: 'RV',
  Payment: 'PV',
  Contra: 'CV',
};

export const VoucherTypeChip: React.FC<VoucherTypeChipProps> = ({ type, size = 'sm' }) => {
  const color = VOUCHER_TYPE_COLORS[type] || VOUCHER_TYPE_COLORS.Journal;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-lg border whitespace-nowrap select-none ${color.badge} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="font-mono text-[9px] font-black opacity-80">[{TYPE_SHORT[type]}]</span>
      <span>{type}</span>
    </span>
  );
};
