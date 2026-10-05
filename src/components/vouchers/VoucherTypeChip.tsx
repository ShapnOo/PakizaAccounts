import React from 'react';
import { VoucherType } from '../../types/voucher';

interface VoucherTypeChipProps {
  type: VoucherType;
  className?: string;
  size?: 'sm' | 'md';
}

export const VoucherTypeChip: React.FC<VoucherTypeChipProps> = ({
  type,
  className = '',
  size = 'md',
}) => {
  let styleClasses = '';

  switch (type) {
    case 'Journal Voucher':
      styleClasses = 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25';
      break;
    case 'Payment Voucher':
      styleClasses = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25';
      break;
    case 'Receive Voucher':
      styleClasses = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25';
      break;
    case 'Contra Voucher':
      styleClasses = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25';
      break;
    default:
      styleClasses = 'bg-muted text-muted-foreground border-border';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border shadow-2xs whitespace-nowrap select-none ${sizeClasses} ${styleClasses} ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          type === 'Journal Voucher'
            ? 'bg-indigo-500'
            : type === 'Payment Voucher'
            ? 'bg-rose-500'
            : type === 'Receive Voucher'
            ? 'bg-emerald-500'
            : 'bg-amber-500'
        }`}
      />
      <span>{type}</span>
    </span>
  );
};
